const { TamaraClientFactory } = require("tamara-sdk");
const { v4: uuidv4 } = require("uuid"); // Import the UUID package
const db = require("../models");
const sendMail = require("../utils/mailer");
const { paymentSuccessMail } = require("../utils/mail_content");

const config = {
  baseUrl: "https://api.tamara.co",
  apiToken:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhY2NvdW50SWQiOiIwYmY3MDNiZi04ZTFhLTRhYzEtOWRkNi1hNDE4ODFjOTRkMGEiLCJ0eXBlIjoibWVyY2hhbnQiLCJzYWx0IjoiNjQ5YzcyMzY4OTFmYzZjNDVjYTczZDAzNTBlMjM5ZjYiLCJyb2xlcyI6WyJST0xFX01FUkNIQU5UIl0sImlhdCI6MTcxNzY1MzgwMCwiaXNzIjoiVGFtYXJhIFBQIn0.a9tojPzHIzqvWU1qfntezLkkpRaDuQnXIDGSuhwRZp9_pbIBBqmfqzDRw5VjwbLG1L1LuKLjFjXcVn3b2_idYyQ2bR-ZgKo-J0XI7YenzporatYyEkJY6kMW9dR2d_58mMBebMWv87Mq3IHSrmqpFFlGk0UZMFMRRXr77mzoDowsVq8x4ODasbTlEw23S1uMeB7WuA5c-qJlBcEsHZ4Jdaz8q_dscjBzKu-abbdLrnF-Q39s24wHTevPcFm4fsdk5xzPXXf-LVizaibObUXn0RPCFQDMH2QIiQYhlrTR5CxfqjVd_gFldMOSTq6zutAR5UE1rPjS1AcxesCdEB7fIQ",
  notificationPrivateKey: "280fd426-2efc-4a21-948d-37ea3690d56d",
};

exports.createTamaraPayment = async (req, res) => {
  const { shippingAddress, courseId, lang, amount } = req.body;

  try {
    const tamara = TamaraClientFactory.createApiClient(config);

    console.log("req.userDecodeId====>", req.userDecodeId);
    const userDB = await db.user.findByPk(req.userDecodeId);
    const courseDB = await db.course.findByPk(courseId);

    const customerData = {
      email: userDB?.email,
      first_name: userDB?.username.split(" ")[0],
      last_name: userDB?.username.split(" ")[1],
      phone_number: userDB?.mobile,
    };

    const items = [
      {
        name: courseDB?.name,
        type: "camp",
        reference_id: courseDB?.id,
        sku: "1",
        quantity: 1,
        total_amount: {
          amount: amount,
          currency: "AED",
        },
      },
    ];

    const shipping_amount = {
      amount: 0,
      currency: "AED",
    };

    const total_amount = {
      amount: amount,
      currency: "AED",
    };

    const shipping_address = {
      city: "Riyadh",
      country_code: "AE",
      first_name: "Mona",
      last_name: "Lisa",
      line1: "3764 Al Urubah Rd",
      line2: "string",
      phone_number: "532298658",
    };

    const referenceOrderId = uuidv4();
    const referenceId = uuidv4();

    const merchant_url = {
      cancel: `${process.env.CLIENT_HOST}/${lang}/user/camps/details/${courseId}`,
      failure: `${process.env.CLIENT_HOST}/${lang}/user/camps/details/${courseId}`,
      success: `${process.env.CLIENT_HOST}/${lang}/user/camps/details/${courseId}`,
      notification: "https://store-demo.com/payments/tamarapay",
    };

    const checkout = await tamara.createCheckout({
      totalAmount: total_amount,
      shippingAmount: shipping_amount,
      taxAmount: shipping_amount,
      referenceOrderId: referenceOrderId,
      referenceId: referenceId,
      items: items,
      consumer: customerData,
      countryCode: "AE",
      description: courseDB?.description,
      paymentType: "PAY_BY_INSTALMENTS",
      instalments: 4,
      shippingAddress: shipping_address,
      merchantUrl: merchant_url,
    });

    await db.tamaraPayment.create({
      amount: total_amount.amount,
      courseId: courseId,
      referenceOrderId: referenceOrderId,
      referenceId: referenceId,
      userId: userDB?.id,
    });

    res.status(200).send({ status: true, data: checkout.data });
  } catch (err) {
    console.error("error:", err.message);
    res.status(400).send(`Error: ${err.message}`);
  }
};

exports.tamaraWebHook = async (req, res) => {
  try {
    console.log("req body=============>:", req.body); // Log only the request body

    const referenceOrderId = req.body.order_reference_id;
    console.log("referenceOrderId ==>", referenceOrderId);
    const orderDetails = await db.tamaraPayment.findOne({
      where: {
        referenceId: referenceOrderId,
      },
    });

    console.log("orderDetails=====>", orderDetails);
    console.log("orderDetails referenceId=====>", orderDetails.referenceId);

    const courseId = orderDetails.courseId;
    const userId = orderDetails.userId;
    // Process notification data based on notification type
    switch (req.body.event_type) {
      case "order_approved":
        // Handle order creation notification
        const [regCourseDB, created] = await db.registeredCourse.findOrCreate({
          where: {
            courseId: courseId,
            userId: userId,
          },
          defaults: {
            courseId: courseId,
            userId: userId,
          },
        });

        if (!created) {
          await regCourseDB.update({ createdDate: new Date() });
        }

        const userDB = await db.user.findByPk(userId);

        console.log("userDB===>", userDB);

        const subject = "TheTopPlayer Payment";
        const text = "payment successful"; // plain text body
        const html = paymentSuccessMail(userDB.username, amount, orderDetails.referenceId);

        const isMailsend = await sendMail(userDB.email, subject, text, html);

        if (isMailsend) {
          console.log("Email sent:");
        } else {
          console.error("Error sending email in payment:", error);
        }

        console.log("Order created: ==>", referenceOrderId);
        // Update your application data (e.g., mark order as created)
        break;
      case "ORDER_CONFIRMED":
        // Handle order confirmation notification
        console.log("Order confirmed:", order.referenceOrderId);
        // Update your application data (e.g., mark order as confirmed)
        break;
      case "ORDER_PAYMENT_CAPTURED":
        // Handle successful payment notification
        console.log("Payment captured:", order.referenceOrderId);
        // Update your application data (e.g., mark order as paid)
        // You can access payment details from the order object
        break;
      case "ORDER_CANCELLED":
        // Handle order cancellation notification
        console.log("Order cancelled:", order.referenceOrderId);
        // Update your application data (e.g., mark order as cancelled)
        break;
      // Handle other notification types as needed
    }

    res.sendStatus(200); // Acknowledge receipt of the webhook
  } catch (err) {
    console.error("error:", err.message);
    res.status(400).send(`Error processing webhook: ${err.message}`);
  }
};
