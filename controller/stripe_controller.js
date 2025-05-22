const { paymentSuccessMail } = require("../utils/mail_content");
const sendMail = require("../utils/mailer");
const getCountryFromPhone = require("../utils/phone_to_country");
const { getCommisionAmount } = require("../utils/Revenue_helpers");
const stripe = require("stripe")(process.env.STRIPE_SK);

exports.handleStripeWebhook = async (req, res) => {
  console.log("Stripe webhook received");
  const endpointSecret = process.env.STRIPE_ENDPOINT_SEC;
  const transaction = await db.sequelize.transaction();

  try {
    // Verify Stripe signature if endpoint secret is available
    let event = req.body;
    if (endpointSecret) {
      const signature = req.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
      } catch (err) {
        console.log(`⚠️ Webhook signature verification failed: ${err.message}`);
        return res.sendStatus(400);
      }
    }

    // Handle different webhook event types
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case "charge.updated":
        await handleChargeUpdated(event.data.object, transaction);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    await transaction.commit();
    res.status(200).end();
  } catch (err) {
    console.error("Webhook error:", err.message);
    await transaction.rollback();
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

async function handlePaymentIntentSucceeded(paymentIntent) {
  const { id, customer, metadata } = paymentIntent;
  console.log(`PaymentIntent was successful for customer ${customer}: ${id}`);
  console.log("Payment metadata:", metadata);
  // Additional logic for successful payment can be added here if needed
}

async function handleChargeUpdated(charge, transaction) {
  const { balance_transaction, payment_intent } = charge;

  if (!balance_transaction || !payment_intent) {
    console.log("Missing balance transaction or payment intent information.");
    return;
  }

  // Retrieve payment intent and balance transaction details
  const paymentIntentData = await stripe.paymentIntents.retrieve(payment_intent);
  const balanceTransaction = await stripe.balanceTransactions.retrieve(balance_transaction);

  // Extract payment details
  const netAmount = balanceTransaction.net / 100;
  const fee = balanceTransaction.fee / 100;
  const exchangeRate = balanceTransaction.exchange_rate || 1;
  const amountInBaseCurrency = (charge.amount / 100) * exchangeRate;
  const amount = Number(amountInBaseCurrency.toFixed(2));


  // Extract metadata
  const customerId = paymentIntentData.customer;
  const courseId = paymentIntentData.metadata?.courseId;
  const userId = paymentIntentData.metadata?.userId;
  const coupon_code = paymentIntentData.metadata?.coupon;
  const amountPassed = paymentIntentData.metadata?.amount;

  console.log("Payment metadata:", paymentIntentData.metadata);

  const user = await db.user.findByPk(userId, {
    attributes: ["id", "username", "email", "mobile"],
  });
  if (!user) {
    console.log("User not found");
    return;
  }

  // Update or create course registration
  await updateOrCreateCourseRegistration(userId, courseId, transaction);

  // Create payment record
  const paymentData = await createPaymentRecord(userId, courseId, amountPassed, netAmount, fee, paymentIntentData.id, user.mobile, transaction);

  // Process coupon if available
  if (coupon_code) {
    await processCoupon(coupon_code, paymentData.id, netAmount, amount, user.mobile, transaction);
  }

  // Check if course is a camp and update enrollment status
  await updateCampEnrollmentStatus(courseId, transaction);

  // Send payment confirmation email
  await sendPaymentConfirmationEmail(user, amount, paymentIntentData.id);
}

async function handlePaymentIntentFailed(paymentIntent) {
  const customerId = paymentIntent.customer;
  console.log(`PaymentIntent failed for customer ${customerId}: ${paymentIntent.id}`);
}

async function updateOrCreateCourseRegistration(userId, courseId, transaction) {
  const existingData = await db.registeredCourse.findOne({
    where: { userId, courseId },
  });

  if (existingData) {
    console.log("Updating existing course registration");
    await db.registeredCourse.update({ createdAt: new Date() }, { where: { userId, courseId } });
  } else {
    console.log("Creating new course registration");
    await db.registeredCourse.create({ userId, courseId }, { transaction });
  }
}

async function updateOrCreateCourseRegistration(userId, courseId, transaction) {
  const existingData = await db.registeredCourse.findOne({
    where: { userId, courseId },
  });

  if (existingData) {
    console.log("Updating existing course registration");
    await db.registeredCourse.update({ createdAt: new Date() }, { where: { userId, courseId } });
  } else {
    console.log("Creating new course registration");
    await db.registeredCourse.create({ userId, courseId }, { transaction });
  }
}

/**
 * Create a payment record in the database
 */
async function createPaymentRecord(userId, courseId, amount, netAmount, fee, stripeId, mobile, transaction) {
  const country_name = getCountryFromPhone(mobile);
  return await db.payment.create(
    {
      userId,
      courseId,
      amount,
      net_amount: netAmount,
      stripe_fee: fee,
      stripeId,
      country_name,
    },
    { transaction }
  );
}

/**
 * Process coupon and create commission record
 */
async function processCoupon(couponCode, paymentId, netAmount, totalAmount, mobile, transaction) {
  console.log("Processing coupon:", couponCode);

  const coupon = await db.influencer.findOne({
    attributes: ["id", "coupon_code", "coupon_percentage", "commision_percentage"],
    where: { coupon_code: couponCode },
    include: [
      {
        model: db.influencerPersons,
        attributes: ["id", "name", "status"],
        through: {
          model: db.InfluencerCoupons,
          attributes: [],
        },
      },
    ],
  });

  if (coupon) {
    console.log("Valid coupon found:", couponCode);

    // Create payment with coupon record
    await db.paymentWithCoupon.create(
      {
        paymentId,
        influencerId: coupon.id,
      },
      { transaction }
    );

    const country_name = getCountryFromPhone(mobile);

    // Calculate and create commission record
    const commission = getCommisionAmount(netAmount, coupon.commision_percentage);
    const commissionRecord = await db.InfluencerCommisions.create(
      {
        payment_id: paymentId,
        coupon_id: coupon.id,
        influencer_id: coupon?.influencer_persons?.[0]?.id,
        net_amount: netAmount,
        commision_amount: commission,
        commision_percentage: coupon.commision_percentage,
        total_amount: totalAmount,
        country_name,
      },
      { transaction }
    );
    await db.Payouts.create(
      {
        influencer_id: coupon?.influencer_persons?.[0]?.id,
        commision_history_id: commissionRecord.id,
        amount: commission,
        type: "Settlement pending",
      },
      {
        transaction,
      }
    );
  }
}

/**
 * Update course enrollment status if it's a camp
 */
async function updateCampEnrollmentStatus(courseId, transaction) {
  const courseCamp = await db.course.findOne({
    where: { id: courseId },
    include: [
      {
        model: db.category,
        attributes: ["name", "isCamp"],
      },
    ],
  });

  if (courseCamp?.category?.isCamp) {
    const userCount = await db.payment.count({
      where: { courseId },
      distinct: true,
      col: "userId",
    });

    if (userCount >= courseCamp.enr_count) {
      courseCamp.isfull = true;
      await courseCamp.save({ transaction });
    }
  }
}

/**
 * Send payment confirmation email to the user
 */
async function sendPaymentConfirmationEmail(user, amount, paymentId) {
  try {
    const subject = "TheTopPlayer Payment";
    const text = "Payment successful";
    const html = paymentSuccessMail(user.username, amount, paymentId);

    const isMailSent = await sendMail(user.email, subject, text, html);

    if (isMailSent) {
      console.log("Payment confirmation email sent successfully");
    } else {
      console.error("Error sending payment confirmation email");
    }
  } catch (error) {
    console.error("Error in sending payment email:", error);
  }
}
