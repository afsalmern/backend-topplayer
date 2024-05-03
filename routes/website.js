const express = require("express");

const authMiddleware = require("../middleware/auth");
const websiteController = require("../controller/website");
const courseController = require("../controller/dashboard/course_controller");
const {
  getAllMainBanner,
} = require("../controller/dashboard/main_banner_controller");

const router = express.Router();

router.get("/courses", websiteController.getAllCourses);
router.get("/courseById/:id", websiteController.getCourseById);
router.get("/news/:dataCount", websiteController.getAllNews);
router.get("/news_count", websiteController.getAllNewsCount);
router.get("/news_by_id/:id", websiteController.getNewsById);
router.get("/faq", websiteController.getAllFAQs);
router.get("/testimonial", websiteController.getAllTestimonials);
router.get("/testimonial/:courseId", websiteController.getAllTestimonialsById);
router.get("/who_are_we_data", websiteController.getAllWhoAreWeData);
router.get("/banner", websiteController.getAllBanners);
router.get("/main_banner", getAllMainBanner);
router.get("/terms", websiteController.getTermsAndConditions);

router.get(
  "/subscribedCourse",
  [authMiddleware.checkUserAuth],
  websiteController.getSubscribedCourse
);
router.get(
  "/course/:courseId",
  [authMiddleware.checkUserAuth],
  websiteController.getCourseMaterial
);
router.get(
  "/getCourseById/:id",
  [authMiddleware.checkUserAuth],
  courseController.getCourseById
);
router.get(
  "/subcourse/:courseId/:subCourseId",
  [authMiddleware.checkUserAuth],
  websiteController.getSubCourseMaterial
);
//router.post('/course',[authMiddleware.checkUserAuth],  websiteController.registerCourse);

router.post(
  "/video",
  [authMiddleware.checkUserAuth],
  websiteController.watchVideo
);
router.get("/video/:videoId/:courseId/:token", websiteController.getVideo);
router.get(
  "/videos/:courseId/:subCourseId/:day",
  [authMiddleware.checkUserAuth],
  websiteController.getVideos
);

router.post(
  "/create-payment-intent",
  [authMiddleware.checkUserAuth],
  websiteController.postStripePayment
);
//router.post('/webhook',express.raw({type: 'application/json'}), websiteController.stripeWebhook);

router.post("/subscribe", websiteController.subscribe);
router.post("/contact", websiteController.contactUS);

router.get(
  "/payments",
  [authMiddleware.checkUserAuth],
  websiteController.payments
);

module.exports = router;
