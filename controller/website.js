const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SK);
const fs = require("fs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const sgMail = require("@sendgrid/mail");

const db = require("../models");

const createTransporter = async () => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Create Nodemailer transporter using SendGrid
    const transporter = nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });
    return transporter;
  } catch (err) {
    console.log(`error in create transporter ${err}`);
    return err;
  }
};

exports.getCourseMaterial = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.userDecodeId;
    let monthCount = 3;
    if (courseId == 2) {
      monthCount = 4;
    }
    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - monthCount);

    console.log(`userid ${userId} course id ${courseId}`);
    console.log(monthsAgo);

    const registeredCourse = await db.registeredCourse.findOne({
      where: {
        courseId: courseId,
        userId: userId,
        createdAt: {
          [db.Op.gte]: monthsAgo,
        },
      },
    });

    if (registeredCourse) {
      console.log("Course found:", registeredCourse.courseId);
      const courseDB = await db.course.findByPk(registeredCourse.courseId, {
        include: {
          model: db.subcourse,
          attributes: ["id", "name"],
          include: {
            model: db.video,
            attributes: ["id", "name", "day"],
          },
        },
      });

      const watchedVideo = await db.watchedVideo.findAll({
        where: {
          userId: userId,
        },
      });

      const watched_videos_id = watchedVideo.map((item) => item.videoId);
      const final_course = {};
      final_course.id = courseDB.id;
      final_course.name = courseDB.name;
      final_course.subCourses = [];

      const week1 = [1, 2, 3, 4, 5];
      const week2 = [6, 7, 8, 9, 10];
      const week3 = [11, 12, 13, 14, 15];
      const week4 = [16, 17, 18, 19, 20];

      const subCoursesDB = courseDB.sub_courses;
      const subCourseLength = subCoursesDB.length;
      for (let index = 0; index < subCourseLength; index++) {
        const subCourse = subCoursesDB[index];

        const finished_days = [];

        for (let day = 1; day < 20; day++) {
          let course_videos = subCourse.videos;

          let videos_day_id = course_videos.filter((video) => video.day === day).map((item) => item.id);

          if (videos_day_id.every((item) => watched_videos_id.includes(item)) && videos_day_id.length > 0) finished_days.push(day);
        }

        const finished_weeks = [];

        if (week1.every((item) => finished_days.includes(item))) finished_weeks.push(1);
        if (week2.every((item) => finished_days.includes(item))) finished_weeks.push(2);
        if (week3.every((item) => finished_days.includes(item))) finished_weeks.push(3);
        if (week4.every((item) => finished_days.includes(item))) finished_weeks.push(4);

        final_course.subCourses.push({
          id: subCourse.id,
          name: subCourse.name,
          finished_days: finished_days,
          finished_weeks: finished_weeks,
        });
      }

      res.status(200).send(final_course);
    } else {
      console.log("The subscription is not valid -----> registeredCourse");
      res.status(500).send({ message: "The subscription is not valid" });
    }
  } catch (error) {
    res.status(500).send({ message: error.toString() });
  }
};

exports.getSubCourseMaterial = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const subCourseId = req.params.subCourseId;
    const userId = req.userDecodeId;
    let monthCount = 3;
    if (courseId == 2) {
      monthCount = 4;
    }
    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - monthCount);

    console.log(`userid ${userId} course id ${courseId}`);
    console.log(monthsAgo);

    const registeredCourse = await db.registeredCourse.findOne({
      where: {
        courseId: courseId,
        userId: userId,
        createdAt: {
          [db.Op.gte]: monthsAgo,
        },
      },
    });

    if (registeredCourse) {
      console.log("Course found:", registeredCourse.courseId);
      const subCourseDB = await db.subcourse.findByPk(subCourseId, {
        attributes: ["id", "name"],
        include: {
          model: db.video,
          attributes: ["id", "name", "day"],
        },
      });

      const watchedVideo = await db.watchedVideo.findAll({
        where: {
          userId: userId,
        },
      });

      const watched_videos_id = watchedVideo.map((item) => item.videoId);

      const final_sub_course = {};

      const week1 = [1, 2, 3, 4, 5];
      const week2 = [6, 7, 8, 9, 10];
      const week3 = [11, 12, 13, 14, 15];
      const week4 = [16, 17, 18, 19, 20];

      const finished_days = [];

      for (let day = 1; day < 20; day++) {
        let course_videos = subCourseDB.videos;

        let videos_day_id = course_videos.filter((video) => video.day === day).map((item) => item.id);

        if (videos_day_id.every((item) => watched_videos_id.includes(item)) && videos_day_id.length > 0) finished_days.push(day);
      }

      const finished_weeks = [];

      if (week1.every((item) => finished_days.includes(item))) finished_weeks.push(1);
      if (week2.every((item) => finished_days.includes(item))) finished_weeks.push(2);
      if (week3.every((item) => finished_days.includes(item))) finished_weeks.push(3);
      if (week4.every((item) => finished_days.includes(item))) finished_weeks.push(4);

      final_sub_course.id = subCourseDB.id;
      (final_sub_course.name = subCourseDB.name), (final_sub_course.finished_days = finished_days), (final_sub_course.finished_weeks = finished_weeks);

      res.status(200).send(final_sub_course);
    } else {
      console.log("The subscription is not valid");
      res.status(500).send({ message: "The subscription is not valid" });
    }
  } catch (error) {
    res.status(500).send({ message: error.toString() });
  }
};

exports.getVideos = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.userDecodeId;
    const subcourseId = req.params.subCourseId;
    const day = req.params.day;

    let monthCount = 3;
    if (courseId == 2) {
      monthCount = 4;
    }
    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - monthCount);

    console.log(`userid ${userId} course id ${courseId}`);
    console.log(monthsAgo);

    const registeredCourse = await db.registeredCourse.findOne({
      where: {
        courseId: courseId,
        userId: userId,
        createdAt: {
          [db.Op.gte]: monthsAgo,
        },
      },
    });

    if (registeredCourse) {
      console.log("Course found:", registeredCourse.courseId);
      const courseDB = await db.course.findByPk(registeredCourse.courseId, {
        include: {
          model: db.subcourse,
          where: {
            id: subcourseId,
          },
          attributes: ["id", "name"],
          include: {
            model: db.video,
            attributes: ["id", "name", "day", "frameURL"],
            where: {
              day: day,
            },
          },
        },
      });

      const watchedVideo = await db.watchedVideo.findAll({
        where: {
          userId: userId,
        },
      });

      const watched_videos_id = watchedVideo.map((item) => item.videoId);

      const final_videos = [];

      let course_videos = courseDB.sub_courses[0].videos;

      course_videos.forEach((video) => {
        final_videos.push({
          id: video.id,
          name: video.name,
          watched: watched_videos_id.includes(video.id),
          videoURL: process.env.HOST + "/images/" + video.frameURL,
        });
      });

      res.status(200).send(final_videos);
    } else {
      console.log("The subscription is not valid");
      res.status(500).send({ message: "The subscription is not valid" });
    }
  } catch (error) {
    res.status(500).send({ message: error.toString() });
  }
};

exports.getVideo = async (req, res, next) => {
  try {
    let token = req.params.token;
    const secret = process.env.SECRET;

    if (!token) {
      return res.status(401).send({
        authentication: false,
        message: "No token provided!",
      });
    }

    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        console.error(`error in verifying ${err.toString()}`);
        return res.status(401).send({
          authentication: false,
          message: err.toString(),
        });
      }

      if (!decoded) {
        return res.status(401).send({
          authentication: false,
          message: "Unauthorized!",
        });
      }

      const courseId = req.params.courseId;
      const userId = decoded.id;
      const videoId = req.params.videoId;

      let monthCount = 3;
      if (courseId == 2) {
        monthCount = 4;
      }
      const monthsAgo = new Date();
      monthsAgo.setMonth(monthsAgo.getMonth() - monthCount);

      console.log(`userid ${userId} course id ${courseId}`);
      console.log(monthsAgo);

      const registeredCourse = await db.registeredCourse.findOne({
        where: {
          courseId: courseId,
          userId: userId,
          createdAt: {
            [db.Op.gte]: monthsAgo,
          },
        },
      });

      if (registeredCourse) {
        let video = await db.video.findByPk(videoId);
        const videoPath = path.join(__dirname, "..", "assets", "trojanTTt", "videos", "new", video.url);

        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
          const parts = range.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

          const chunkSize = end - start + 1;
          const file = fs.createReadStream(videoPath, { start, end });
          const headers = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4",
          };

          res.writeHead(206, headers);
          file.pipe(res);
        } else {
          const headers = {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",
          };

          res.writeHead(200, headers);
          fs.createReadStream(videoPath).pipe(res);
        }
      } else {
        console.log("The subscription is not valid");
        res.status(500).send({ message: "The subscription is not valid" });
      }
    });
  } catch (error) {
    console.log(`error in getting a Video ${error.toString()}`);
    res.status(500).send({ message: error.toString() });
  }
};

exports.getSubscribedCourse = (req, res, next) => {
  const monthsAgo = new Date();
  monthsAgo.setMonth(monthsAgo.getMonth() - 3);

  const monthsAgo2 = new Date();
  monthsAgo2.setMonth(monthsAgo2.getMonth() - 4);

  db.registeredCourse
    .findAll({
      where: {
        [db.Sequelize.Op.and]: [
          {
            userId: req.userDecodeId,
          },
          {
            [db.Sequelize.Op.or]: [{ createdAt: { [db.Sequelize.Op.gt]: monthsAgo } }, { courseId: 2, createdAt: { [db.Sequelize.Op.gt]: monthsAgo2 } }],
          },
        ],
      },
      attributes: ["courseId"],
    })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      console.log(`error in getting subscribed course ${error.toString()}`);
      res.status(500).send({ message: error.toString() });
    });
};

/*
exports.registerCourse = (req, res, next) => {
    const courseId = req.body.courseId
    const userId = req.userDecodeId
    console.log(`userid ${userId} is registering a  course id ${courseId} `)


    db.registeredCourse.create({
        courseId: courseId,
        userId: userId

    }).then((result) => {
        console.log('user registered course successfully')
        res.status(200).send({ message: 'user registered course successfully' });
    }).catch(error => {
        console.log(`error in registering the course ${error.toString()}`)
        res.status(500).send({ message: error.toString() });
    });



}*/

exports.watchVideo = (req, res, next) => {
  const videoId = req.body.videoId;
  const userId = req.userDecodeId;
  console.log(`userid ${userId} is registering a video id ${videoId} `);

  db.watchedVideo
    .findOrCreate({
      where: {
        videoId: videoId,
        userId: userId,
      },
      defaults: {
        videoId: videoId,
        userId: userId,
      },
    })
    .then((result) => {
      console.log("user watched video successfully");
      res.status(200).send({ message: "user watched video successfully" });
    })
    .catch((error) => {
      console.log(`error in saving watched video ${error.toString()}`);
      res.status(500).send({ message: error.toString() });
    });
};

exports.postStripePayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const courseDB = await db.course.findByPk(courseId);
    const amount = courseDB.amount * 100;

    const userDB = await db.user.findByPk(req.userDecodeId);
    const customerId = userDB.stripe_customer_id;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      customer: customerId,
      metadata: {
        courseId: courseId,
        amount: amount,
        userId: userDB.id,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log(`error in pay ${error.toString()}`);
    res.status(500).send({ message: error.toString() });
  }
};

exports.stripeWebhook = async (req, res) => {
  console.log("strip hook called >>>>>>>>>>>>>>>>>>>>>>>>>>>");
  const endpointSecret = process.env.STRIPE_ENDPOINT_SEC;

  console.log(endpointSecret);

  try {
    let event = req.body;
    console.log(event);
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe

      const signature = req.headers["stripe-signature"];
      console.log(signature);
      try {
        event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
      }
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;

        const customerId = paymentIntent.customer;
        const courseId = paymentIntent.metadata.courseId;
        const amount = paymentIntent.metadata.amount / 100.0;
        const userId = paymentIntent.metadata.userId;

        // Your logic to handle successful payment for a specific customer
        console.log(`PaymentIntent was successful for customer ${customerId}:`, paymentIntent.id);
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
        await db.payment.create({
          userId: userId,
          courseId: courseId,
          amount: amount,
          stripeId: paymentIntent.id,
        });

        const userDB = await db.user.findByPk(userId);
        const mailOptions = {
          from: process.env.EMAILID,
          to: userDB.email,
          subject: "TheTopPlayer Payment",
          text: "payment successful",
          html: `
                    <h2 style="color: green;">Payment Success - Reference ${paymentIntent.id}</h2>
                    <p>Dear ${userDB.username},</p>
                
                    <p>We are thrilled to inform you that your recent payment was successful! Thank you for choosing our services.</p>
                
                    <p><strong>Payment Details:</strong></p>
  <ul>
    <li>Amount: ${amount}$</li>
    <li>Reference Number: ${paymentIntent.id}</li>
  </ul>
                
  <p>Your support is invaluable to us, and we appreciate your trust in our platform. If you have any questions or concerns, feel free to reach out to our customer support team .</p>
                
                 
                    <p>Thank you for choosing TheTopPlayer.</p>
                
                    <p>Best Regards,<br>`,
        };

        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            console.error("Error sending email in payment:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
        break;
      case "payment_intent.payment_failed":
        const failedPaymentIntent = event.data.object;
        const failedCustomerId = failedPaymentIntent.customer;
        console.log(`PaymentIntent failed for customer ${failedCustomerId}:`, failedPaymentIntent.id);
        break;
      // Add more cases for other events as needed
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).end();
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

exports.subscribe = async (req, res, next) => {
  db.subscriber
    .create({
      email: req.body.email,
    })
    .then((result) => {
      console.log("subscriber added successfully");
      res.status(200).send({ message: "subscriber added successfully" });
    })
    .catch((error) => {
      console.log(`error in adding subscriber ${error.toString()}`);
      res.status(500).send({ message: `error in adding subscriber ${error.toString()}` });
    });
};

exports.contactUS = async (req, res, next) => {
  db.contact
    .create({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    })
    .then((result) => {
      console.log("contact us message saved successfully");
      res.status(200).send({ message: "contact us message saved successfully" });
    })
    .catch((error) => {
      console.log(`error in saving contact us ${error.toString()}`);
      res.status(500).send({ message: error.toString() });
    });
};

exports.payments = async (req, res, next) => {
  const userId = req.userDecodeId;

  db.payment
    .findAll({
      where: {
        userId: userId,
      },
    })
    .then((payments) => {
      console.log("user payments get successfully");
      res.status(200).send(payments);
    })
    .catch((error) => {
      console.log(`error in getting payments${error.toString()}`);
      res.status(500).send({ message: error.toString() });
    });
};
