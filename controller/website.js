const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SK);
const fs = require("fs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const sgMail = require("@sendgrid/mail");

const db = require("../models");
const {
  passwordResetMail,
  EnquiryMail,
  paymentSuccessMail,
} = require("../utils/mail_content");
const { count } = require("console");
const { where } = require("sequelize");
const sendMail = require("../utils/mailer");
const isCouponExpired = require("../utils/coupon_helper");

const messages_en = {
  news_added_successfully: "News added successfully",
  news_not_found: "News not found",
  server_error: "Server error",
  news_updated_successfully: "News updated successfully",
  news_deleted_successfully: "News deleted successfully",
};

const errorMessages = {
  notActive: {
    error_en: "Promo Code is not valid anymore",
    error_ar: "رمز العرض لم يعد صالحًا",
  },
  expired: {
    error_en: "Promo Code has expired",
    error_ar: "رمز العرض منتهي الصلاحية",
  },
  notFound: {
    error_en: "Promo code not found",
    error_ar: "رمز العرض غير موجود",
  },
};

const FAQ = db.faq;
const Testimonial = db.testimonial;

// Retrieve all banners
exports.getAllBanners = async (req, res, next) => {
  try {
    const banners = await db.banner.findAll({
      include: [
        {
          model: db.bannerImages,
        },
      ],
    });
    console.log(`Retrieved all banners successfully`);
    const transformedBanners = banners.map((banner) => ({
      heading: banner.heading,
      heading_ar: banner.heading_ar,
      non_animate_text: banner.non_animate_text,
      non_animate_text_ar: banner.non_animate_text_ar,
      animate_text: banner.animate_text.split(","), // Convert to array
      animate_text_ar: banner.animate_text_ar.split(","), // Convert to array
      para: banner.para,
      para_ar: banner.para_ar,
      images: banner.bannerImages, // Convert to array
    }));
    res.status(200).json({ banners: transformedBanners });
  } catch (err) {
    console.error(`Error in retrieving banners: ${err.toString()}`);
    res.status(500).send({ message: err.toString() });
  }
};

exports.getAllCourses = (req, res, next) => {
  db.course
    .findAll({
      where: { isDeleted: false },
      include: [
        {
          model: db.category,
          attributes: ["name", "isCamp", "isDeleted"],
          where: { active: true },
        },
      ],
    })
    .then((courses) => {
      const groupedCourses = {};

      // Iterate through courses and group them by categoryName
      courses.forEach((course) => {
        if (!course.category.isDeleted) {
          const categoryName = course.category.name;
          const isCamp = course.category.isCamp;

          // Splitting the description into checklist items
          const checklistItems = course?.description?.split("\n");
          const checklistItemsAr = course?.description_ar?.split("\n");
          // Generating HTML markup for the checklist
          const checklistHTML = checklistItems
            ?.map((item) => `<li><p>${item}</p></li>`)
            .join("");
          const checklistHTMLAr = checklistItemsAr
            ?.map((item) => `<li><p>${item}</p></li>`)
            .join("");

          const difference = course?.amount - course?.offerAmount;
          const offerPercentage = Math.round(
            (difference / course?.amount) * 100
          );

          const modifiedCourse = {
            ...course.toJSON(),
            category_name: course.category ? course.category.name : null,
            descriptionHTML: checklistHTML ? `${checklistHTML}` : null, // Wrap checklist items in <ul> element
            descriptionHTMLAr: checklistHTMLAr ? `${checklistHTMLAr}` : null, // Wrap checklist items in <ul> element
            description: course.description || null,
            description_ar: course.description_ar || null,
            offerPercentage: offerPercentage || null,
            enroll_text_ar: course.description_ar || null,
          };

          // If the category doesn't exist in groupedCourses, create a new array for it
          if (!groupedCourses[categoryName]) {
            groupedCourses[categoryName] = {
              categoryName,
              isCamp,
              courses: [],
            };
          }

          // Push the modifiedCourse to the array corresponding to its categoryName
          groupedCourses[categoryName].courses.push(modifiedCourse);
        }
      });

      // Convert the groupedCourses object to an array of objects
      const groupedCoursesArray = Object.values(groupedCourses);

      console.log(`Retrieved all courses successfully`);
      res.status(200).json({ courses: groupedCoursesArray });
    })
    .catch((err) => {
      console.error(`Error in retrieving courses: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

exports.getCourseById = async (req, res, next) => {
  const courseId = req.params.id;

  db.course
    .findByPk(courseId, {
      include: [
        {
          model: db.category,
          attributes: ["name", "isCamp"],
        },
      ],
    })
    .then((course) => {
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const categoryName = course.category ? course.category.name : null;

      // Splitting the description into checklist items
      const checklistItems = course.description
        ? course.description.split("\n")
        : [];
      const checklistItemsAr = course.description_ar
        ? course.description_ar.split("\n")
        : [];

      // Generating HTML markup for the checklist
      const checklistHTML = checklistItems
        .map((item) => `<li><p>${item}</p></li>`)
        .join("");
      const checklistHTMLAr = checklistItemsAr
        .map((item) => `<li><p>${item}</p></li>`)
        .join("");

      const difference = course.amount - course.offerAmount;
      const offerPercentage = Math.round((difference / course.amount) * 100);

      const modifiedCourse = {
        ...course.toJSON(),
        category_name: categoryName,
        descriptionHTML: checklistHTML ? `${checklistHTML}` : null, // Wrap checklist items in <ul> element
        descriptionHTMLAr: checklistHTMLAr ? `${checklistHTMLAr}` : null, // Wrap checklist items in <ul> element
        description: course.description || null,
        description_ar: course.description_ar || null,
        offerPercentage: offerPercentage || null,
        enroll_text_ar: course.enroll_text_ar || null,
      };

      console.log(`Retrieved course ${courseId} successfully`);
      res.status(200).json({ course: modifiedCourse });
    })
    .catch((err) => {
      console.error(
        `Error in retrieving course ${courseId}: ${err.toString()}`
      );
      res.status(500).send({ message: err.toString() });
    });
};

// Retrieve all news
exports.getNewsBanner = async (req, res, next) => {
  try {
    const newsBanner = await db.newsBannerImages.findAll();
    return res
      .status(200)
      .send({ message: "Data retrieved successfully", data: newsBanner });
  } catch (err) {
    console.error(`Error in retrieving news: ${err.toString()}`);
    res.status(500).send({ message: messages_en.server_error });
  }
};
exports.getAllNews = async (req, res, next) => {
  const dataCount = req.params.dataCount;

  db.news
    .findAll({
      limit: dataCount * 9,
      include: [
        {
          model: db.newsImage,
          as: "images",
        },
      ],
    })
    .then((news) => {
      console.log(`Retrieved all news successfully`);
      res.status(200).json({ news });
    })
    .catch((err) => {
      console.error(`Error in retrieving news: ${err.toString()}`);
      res.status(500).send({ message: messages_en.server_error });
    });
};

// Retrieve news count
exports.getAllNewsCount = async (req, res, next) => {
  try {
    const count = await db.news.count();
    console.log(`Retrieved all news successfully`);
    res.status(200).json({ count });
  } catch (err) {
    console.error(`Error in retrieving news: ${err.toString()}`);
    res.status(500).send({ message: messages_en.server_error });
  }
};

//get single news
exports.getNewsById = (req, res, next) => {
  console.log(req.params, "ID");
  const newsId = req.params.id;
  db.news
    .findByPk(newsId, {
      include: [
        {
          model: db.newsImage,
          as: "images", // Alias defined in the association
        },
        {
          model: db.newsMobileImage,
          as: "mobile", // Alias defined in the association
        },
      ],
    })
    .then((news) => {
      if (!news) {
        return res.status(404).send({ message: messages_en.news_not_found });
      }
      console.log(`Retrieved news with ID ${newsId} successfulllllly`);
      res.status(200).json({ news });
    })
    .catch((err) => {
      console.error(`Error in retrieving news: ${err.toString()}`);
      res.status(500).send({ message: messages_en.server_error });
    });
};

// Retrieve all FAQs
exports.getAllFAQs = (req, res, next) => {
  FAQ.findAll()
    .then((faqs) => {
      console.log(`Retrieved all FAQs successfully`);
      res.status(200).json({ faqs });
    })
    .catch((err) => {
      console.error(`Error in retrieving FAQs: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// Retrieve all Testimonials
exports.getAllTestimonials = (req, res, next) => {
  Testimonial.findAll()
    .then((testimonials) => {
      console.log(`Retrieved all testimonials successfully`);
      res.status(200).json({ testimonials });
    })
    .catch((err) => {
      console.error(`Error in retrieving testimonials: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

exports.getAllTestimonialsById = async (req, res, next) => {
  const { courseId } = req.params;

  try {
    const testimonials = await Testimonial.findAll({
      where: { courseId },
      include: [{ model: db.course }], // Include the Course model to fetch course details along with testimonials
    });

    if (!testimonials || testimonials.length === 0) {
      return res
        .status(404)
        .json({ message: `No testimonials found for course ${courseId}` });
    }

    // Manipulate the course name for each testimonial and set the role in the JSON response
    const testimonialsWithRole = testimonials.map((testimonial) => {
      const courseName = testimonial.course.name.toLowerCase();
      // const roleName = capitalizeFirstLetter(courseName.replace("program", "") + "Player");
      // Include all other fields from the testimonial table along with the role
      return {
        ...testimonial.toJSON(), // Include all fields from the testimonial table
        role: courseName,
      };
    });

    console.log(
      `Retrieved all testimonials for course ${courseId} successfully`
    );
    res.status(200).json({ testimonials: testimonialsWithRole });
  } catch (err) {
    console.error(
      `Error in retrieving testimonials for course ${courseId}: ${err}`
    );
    const statusCode = err.status || 500;
    res.status(statusCode).json({
      error: `Error in retrieving testimonials for course ${courseId}`,
    });
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
        // createdAt: {
        //   [db.Op.gte]: monthsAgo,
        // },
      },
    });

    console.log("registeredCourse=======>", registeredCourse);

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

      const startDate = new Date(registeredCourse.createdAt);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + courseDB.duration);

      console.log("START", startDate);
      console.log("END", endDate);

      const watched_videos_id = watchedVideo.map((item) => item.videoId);
      const final_course = {};
      final_course.id = courseDB.id;
      final_course.name = courseDB.name;
      final_course.endDate = endDate;
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

        for (let day = 1; day <= 20; day++) {
          let course_videos = subCourse.videos;

          let videos_day_id = course_videos
            .filter((video) => video.day === day)
            .map((item) => item.id);

          if (
            videos_day_id.every((item) => watched_videos_id.includes(item)) &&
            videos_day_id.length > 0
          )
            finished_days.push(day);
        }

        const finished_weeks = [];

        if (week1.every((item) => finished_days.includes(item)))
          finished_weeks.push(1);
        if (week2.every((item) => finished_days.includes(item)))
          finished_weeks.push(2);
        if (week3.every((item) => finished_days.includes(item)))
          finished_weeks.push(3);
        if (week4.every((item) => finished_days.includes(item)))
          finished_weeks.push(4);

        final_course.subCourses.push({
          id: subCourse.id,
          name: subCourse.name,
          finished_days: finished_days,
          finished_weeks: finished_weeks,
        });
      }

      console.log("FINAL", final_course);

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

      for (let day = 1; day <= 20; day++) {
        let course_videos = subCourseDB.videos;

        let videos_day_id = course_videos
          .filter((video) => video.day === day)
          .map((item) => item.id);

        if (
          videos_day_id.every((item) => watched_videos_id.includes(item)) &&
          videos_day_id.length > 0
        )
          finished_days.push(day);
      }

      const finished_weeks = [];

      if (week1.every((item) => finished_days.includes(item)))
        finished_weeks.push(1);
      if (week2.every((item) => finished_days.includes(item)))
        finished_weeks.push(2);
      if (week3.every((item) => finished_days.includes(item)))
        finished_weeks.push(3);
      if (week4.every((item) => finished_days.includes(item)))
        finished_weeks.push(4);

      final_sub_course.id = subCourseDB.id;
      (final_sub_course.name = subCourseDB.name),
        (final_sub_course.finished_days = finished_days),
        (final_sub_course.finished_weeks = finished_weeks);

      console.log("final_sub_course====>", final_sub_course);

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

    console.log("params===========>", req.params);

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

      console.log("final_videos====>", final_videos);
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
        const videoPath = path.join(
          __dirname,
          "..",
          "assets",
          "trojanTTt",
          "videos",
          "new",
          video.url
        );

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
  db.user
    .findOne({
      where: {
        id: req.userDecodeId,
      },
      include: [
        {
          model: db.course,
          through: {
            model: db.registeredCourse,
            where: {
              [db.Sequelize.Op.or]: [
                {
                  // courseId: 2,
                  createdAt: {
                    [db.Sequelize.Op.gt]: db.Sequelize.literal(
                      "DATE_SUB(NOW(), INTERVAL (courses.duration) MONTH)"
                    ),
                  },
                },
              ],
            },
          },
        },
      ],
    })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      console.log("USER", user);

      const subscribedCourses = user.courses.map((course) => ({
        courseId: course.id,
        courseName: course.name,
        startDate: course.createdAt,
        duration: course.duration, // Assuming this is the column name for the course name
        // Include other course details as needed
      }));

      res.status(200).send(subscribedCourses);
    })
    .catch((error) => {
      console.log(`Error in getting subscribed courses: ${error.toString()}`);
      res.status(500).send({ message: "Internal server error" });
    });
};

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
    const { courseId, currency_code, currency_rate, coupon_code } = req.body;

    let convertedAmount;

    const courseDB = await db.course.findByPk(courseId);
    const coupon = await db.influencer.findOne({
      where: { coupon_code: coupon_code },
    });

    console.log("COUPON", coupon);
    console.log("COUPON CODE", coupon_code);

    if (coupon_code) {
      const discountpercentage = coupon.coupon_percentage;

      const discountAmount = (courseDB?.offerAmount * discountpercentage) / 100;

      const finalisedDiscountAmount = Math.trunc(
        discountAmount * currency_rate
      );

      convertedAmount =
        Math.ceil(courseDB?.offerAmount * currency_rate) -
        finalisedDiscountAmount;
    } else {
      convertedAmount = Math.ceil(
        (courseDB.offerAmount * currency_rate).toFixed(2)
      );
    }

    const amount = convertedAmount * 100;

    console.log("AMOUNT", amount);

    const userDB = await db.user.findByPk(req.userDecodeId);
    const customerId = userDB.stripe_customer_id;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency_code.toLowerCase(),
      customer: customerId,
      metadata: {
        courseId: courseId,
        amount: amount,
        userId: userDB.id,
        coupon: coupon_code || null,
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
  console.log("strip hook called >>>>>>>>>>>>>>>>>>>>>>>>>>>");
  console.log("strip hook called >>>>>>>>>>>>>>>>>>>>>>>>>>>");
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
      console.log(signature, "SIGNATURE");
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
      }
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;

        const { id, customer, metadata } = paymentIntent;

        // Log the successful payment intent
        console.log(
          `PaymentIntent was successful for customer ${customer}:`,
          paymentIntent.id
        );

        // Additional logic for successful payment can be added here if needed

        break;

      case "charge.updated":
        const charge = event.data.object;

        const { balance_transaction, payment_intent } = charge;

        if (!balance_transaction || !payment_intent) {
          console.log(
            "Missing balance transaction or payment intent information."
          );
          break;
        }

        const paymentIntentData = await stripe.paymentIntents.retrieve(
          payment_intent
        );

        const balanceTransaction = await stripe.balanceTransactions.retrieve(
          balance_transaction
        );
        const netAmount = balanceTransaction.net / 100;
        const fee = balanceTransaction.fee / 100;

        const exchangeRate = balanceTransaction.exchange_rate || 1;
        const amountInBaseCurrency = (charge.amount / 100) * exchangeRate;

        const customerId = paymentIntentData.customer;
        const courseId = paymentIntentData.metadata?.courseId;
        const amount = Number(amountInBaseCurrency.toFixed(2));
        const userId = paymentIntentData.metadata?.userId;

        const coupon_code = paymentIntentData.metadata?.coupon;

        console.log("META DATA", paymentIntentData.metadata);

        // Your logic to handle successful payment for a specific customer
        const existingData = await db.registeredCourse.findOne({
          where: {
            userId,
            courseId,
          },
        });

        if (existingData) {
          console.log("EXISTING DATA");
          await db.registeredCourse.update(
            {
              createdAt: new Date(), // Set the createdAt field to the current time
            },
            {
              where: {
                userId, // Match the userId from the request
                courseId, // Match the provided courseId
              },
            }
          );
        } else {
          console.log("NEW DATA");
          await db.registeredCourse.create({
            userId,
            courseId,
          });
        }

        const paymentData = await db.payment.create({
          userId: userId,
          courseId: courseId,
          amount: amount,
          net_amount: netAmount,
          stripe_fee: fee,
          stripeId: paymentIntentData.id,
        });

        if (coupon_code) {
          console.log("COUPON FOUND", coupon_code);
          const coupon = await db.influencer.findOne({
            where: { coupon_code: coupon_code },
          });

          if (coupon) {
            console.log("COUPON FOUND AND SAVED", coupon_code);
            await db.paymentWithCoupon.create({
              paymentId: paymentData.id,
              influencerId: coupon.id,
            });
          }
        }

        const courseCamp = await db.course.findOne({
          where: {
            id: courseId,
          },
          include: [
            {
              model: db.category,
              attributes: ["name", "isCamp"],
            },
          ],
        });

        if (courseCamp && courseCamp.category && courseCamp.category.isCamp) {
          const getUserCountInCamp = await db.payment.count({
            where: {
              courseId: courseId,
            },
            distinct: true,
            col: "userId",
          });

          if (getUserCountInCamp >= courseCamp.enr_count) {
            courseCamp.isfull = true; // Set `isfull` to true
            await courseCamp.save();
          }
        }

        const userDB = await db.user.findByPk(userId);

        const subject = "TheTopPlayer Payment";
        const text = "payment successful"; // plain text body
        const html = paymentSuccessMail(
          userDB.username,
          amount,
          paymentIntentData.id
        );

        const isMailsend = await sendMail(userDB.email, subject, text, html);

        if (isMailsend) {
          console.log("Email sent:");
        } else {
          console.error("Error sending email in payment:", error);
        }

        break;

      case "payment_intent.payment_failed":
        const failedPaymentIntent = event.data.object;
        const failedCustomerId = failedPaymentIntent.customer;
        console.log(
          `PaymentIntent failed for customer ${failedCustomerId}:`,
          failedPaymentIntent.id
        );
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
      res
        .status(500)
        .send({ message: `error in adding subscriber ${error.toString()}` });
    });
};

exports.contactUS = async (req, res, next) => {
  const { name, email, message } = req.body;

  try {
    const subject = "Top Player - New enquiry";
    const text = "A new enquiry from top player"; // plain text body
    const html = EnquiryMail(name, message, email); // HTML body

    const isMailsend = await sendMail(process.env.EMAILID, subject, text, html);
    const result = await db.contact.create({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    });
    if (isMailsend) {
      console.log("Contact us message saved successfully and mail send");
      res
        .status(200)
        .send({ message: "Message submitted successfully and mail is sent" });
    } else {
      console.log("Contact us message saved successfully and mail not send");
      res.status(200).send({
        message: "Message submitted successfully and mail is not sent",
      });
    }
  } catch (error) {
    console.error(`Error in saving contact us message: ${error.toString()}`);
    res.status(500).send({ message: error.toString() });
  }
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

exports.getAllWhoAreWeData = async (req, res, next) => {
  try {
    const data = await db.whoAreWe.findAll();

    let { counts, units } = splitCount(data[0]?.users);

    console.log(`Retrieved all who are we data successfully`);
    res.status(200).send({ data, counts, units });
  } catch (err) {
    console.error(`Error in retrieving who are we data: ${err.toString()}`);
    res.status(500).send({ message: messages_en.server_error });
  }
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function splitCount(str) {
  const regex = /[a-zA-Z]/;

  if (regex.test(str)) {
    const match = str.match(/(\d+)([a-zA-Z]+)/);
    if (match) {
      return {
        counts: match[1] || "", // Number part
        units: match[2] || "", // Unit part
      };
    }
  }
  return {
    counts: str,
    units: "",
  };
}

exports.getTermsAndConditions = async (req, res, next) => {
  try {
    const termsAndConditions = await db.termsAndConditions.findAll();
    res.status(200).json(termsAndConditions);
  } catch (error) {
    console.error("Error listing terms and conditions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getVisitors = async (req, res, next) => {
  console.log("IP  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>", req.ip);
  try {
    if (req.ip) {
      // const existing = await db.visitors.findOne({ ip: req.ip });
      // if (existing) {
      //   return res.status(200).json({ message: "IP found" });
      // }
      await db.visitors.create({
        ip: req.ip,
      });
      res.status(200).json({ message: "Ip saved" });
    }
  } catch (error) {
    console.error("Error saving ip:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCurrencies = async (req, res, next) => {
  try {
    const currencies = await db.currency.findAll({
      where: { isDeleted: false, isActive: true },
    });
    res.status(200).json({ data: currencies });
  } catch (error) {
    console.error("Error saving ip:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.applyCoupon = async (req, res) => {
  const { coupon_code, courseAmount, currentCurrency } = req.body;

  try {
    const couponExist = await db.influencer.findOne({
      where: db.Sequelize.where(
        db.Sequelize.fn("BINARY", db.Sequelize.col("coupon_code")),
        coupon_code
      ),
    });

    if (!couponExist) {
      return res.status(400).send({ error: errorMessages.notFound });
    }

    const expiry_date = couponExist.expire_in;

    const couponExpired = isCouponExpired(expiry_date);

    if (couponExpired) {
      return res.status(400).send({ error: errorMessages.expired });
    }

    const isCouponActive = couponExist.is_active;

    if (!isCouponActive) {
      return res.status(400).send({ error: errorMessages.notActive });
    }

    const discountpercentage = couponExist.coupon_percentage;

    const discountAmount = (courseAmount * discountpercentage) / 100;
    const finalisedDiscountAmount = Math.trunc(
      discountAmount * currentCurrency.currency_rate
    );

    res.status(200).send({
      discountAmount: finalisedDiscountAmount,
      couponExist: couponExist.coupon_code,
    });
  } catch (error) {
    console.error("Error applying coupon", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
