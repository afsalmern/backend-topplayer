const { TamaraClientFactory } = require("tamara-sdk");
const { v4: uuidv4 } = require("uuid"); // Import the UUID package
const db = require("../models");

const config = {
  baseUrl: "https://api-sandbox.tamara.co",
  apiToken:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhY2NvdW50SWQiOiI0ZmUxNDU1MC1jZTUzLTRhNmYtYWIyMi05MDkxOThkNmUxNmEiLCJ0eXBlIjoibWVyY2hhbnQiLCJzYWx0IjoiODcxZjY3OGM0MjAwYzg4YWQxZTM0YTIxMTExN2IyYjYiLCJyb2xlcyI6WyJST0xFX01FUkNIQU5UIl0sImlhdCI6MTcxNzY1OTc3NCwiaXNzIjoiVGFtYXJhIn0.xDxkOqZsPt65OGuy0rDfrrjKL6hWLP2EL4ynnxQynK5lr6kMQn2dUlvLACIZc1Bx4wo5vlCcqn5L4h1zQWkFTZXDkVjaiuRh6lyLZmVkGi6KfCdZLjMmve6n3tQhuJT6c4BYcS_7Y1BS4HMCOPpwPu5ZiaYNlGYVmrhM2rdtIq9gd3yWD_8oAFO9qoF0CmdA48LNHVoAXutxR-kNlVk62MQfOD4rf2yxNuzvSj9xywiaXGrleoayEJxF9uw3ANYNVE1fGBjR_uL_dR5EJI6p16oa5NBdZtX29Tn05bx4dsjH_13xSq58hGVpEHIRjZF8NLcwSxvdBeK1zuu7DDU1CA",
  notificationPrivateKey: "55c8a029-b4fc-4bc0-9033-696e4aecc7b6",
};

exports.createTamaraPayment = async (req, res) => {
  const { shippingAddress, courseId } = req.body;

  try {
    const tamara = TamaraClientFactory.createApiClient(config);

    console.log("req.userDecodeId====>", req.userDecodeId);
    const userDB = await db.user.findByPk(req.userDecodeId);
    console.log("userDB=========>", userDB);

    const course_id = courseId || 8;

    const customerData = {
      email: "customer@email.com",
      first_name: "Mona",
      last_name: "Lisa",
      phone_number: "566027755",
    };

    const items = [
      {
        name: "Summer camp",
        type: "camp",
        reference_id: "123",
        sku: "1",
        quantity: 1,
        total_amount: {
          amount: 100,
          currency: "AED",
        },
      },
    ];

    const shipping_amount = {
      amount: 0,
      currency: "AED",
    };

    const total_amount = {
      amount: 300,
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
      cancel: "http://awesome-qa-tools.s3-website.me-south-1.amazonaws.com/#/cancel",
      failure: "http://awesome-qa-tools.s3-website.me-south-1.amazonaws.com/#/fail",
      success: `http://localhost:4000/en/user/payment/confirm/${course_id}`,
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
      description: "lorem ipsum dolor",
      paymentType: "PAY_BY_INSTALMENTS",
      instalments: 4,
      shippingAddress: shipping_address,
      merchantUrl: merchant_url,
    });

    await db.tamaraPayment.create({
      amount: total_amount.amount,
      courseId: course_id,
      referenceOrderId: referenceOrderId,
      referenceId: referenceId,
      userId: userDB?.id,
    });

    console.log("checkout===============>", checkout);

    res.status(200).send({ status: true, data: checkout.data });
  } catch (err) {
    console.error("error:", err.message);
    res.status(400).send(`Error: ${err.message}`);
  }
};

exports.tamaraWebHook = async (req, res) => {
  try {
    console.log("req body=============>:", req.body); // Log only the request body

    const referenceOrderId = req.body.order_id;
    console.log("referenceOrderId ==>", referenceOrderId);
    const orderDetails = await db.tamaraPayment.findAll();

    console.log("orderDetails=====>", orderDetails);

    const notificationService = TamaraClientFactory.createNotificationService(config);

    // Assuming processWebhook returns a Promise (check documentation)
    const payload = notificationService.processWebhook(req);

    payload.then((res) => {
      console.log("payload:==================>", res); // Log the processed payload
    });

    const notificationType = payload.notificationType; // Use notificationType (assuming it's the correct property)
    const order = payload.order;

    console.log(`Received webhook notification: ${notificationType}`);

    // Process notification data based on notification type
    switch (req.body.event_type) {
      case "order_approved":
        // Handle order creation notification
        console.log("Order created:", order.referenceOrderId);
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
