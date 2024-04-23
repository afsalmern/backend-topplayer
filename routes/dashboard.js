const express = require("express");
const multer = require("multer");
// test
const authMiddleware = require('../middleware/auth')
const dashController = require('../controller/dashboard')
const categoryController = require('../controller/dashboard/category_controller')
const courseController = require('../controller/dashboard/course_controller')
const subCourseController = require('../controller/dashboard/subcourse_controller')
const videoUploadController = require('../controller/dashboard/video_upload_controller')
const newsController = require('../controller/dashboard/news_controller')
const whoAreWeDataController = require('../controller/dashboard/who_are_we_controller')
const faqController = require('../controller/dashboard/faq_controller')
const testimonialController = require('../controller/dashboard/testimonial_controller')

const router = express.Router();

const multerStorageStt = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/trojanTTt/videos/new");
  },
  filename: (req, file, cb) => {
    // const ext = file.mimetype.split("/")[1];
    cb(null, `${file.originalname}`);
  },
});
const uploadStt = multer({
  storage: multerStorageStt,
});

router.post(
  "/category",
  [authMiddleware.checkUserAuth],
  categoryController.addCategory
);
router.get(
  "/category",
  [authMiddleware.checkUserAuth],
  categoryController.getAllCategories
);
router.put(
  "/category/:id",
  [authMiddleware.checkUserAuth],
  categoryController.updateCategory
);
router.delete(
  "/category/:id",
  [authMiddleware.checkUserAuth],
  categoryController.deleteCategory
);

router.post(
  "/course",
  [authMiddleware.checkUserAuth],
  courseController.addCourse
);

router.get(
  "/course",
  [authMiddleware.checkUserAuth],
  courseController.getAllCourses
);

router.put(
  "/course/:id",
  [authMiddleware.checkUserAuth],
  courseController.updateCourse
);
router.delete(
  "/course/:id",
  [authMiddleware.checkUserAuth],
  courseController.deleteCourse
);

router.post(
  "/subcourse",
  [authMiddleware.checkUserAuth],
  subCourseController.addSubCourse
);
router.get(
  "/subcourse",
  [authMiddleware.checkUserAuth],
  subCourseController.getAllSubCourses
);
router.put(
  "/subcourse/:id",
  [authMiddleware.checkUserAuth],
  subCourseController.updateSubCourse
);
router.delete(
  "/subcourse/:id",
  [authMiddleware.checkUserAuth],
  subCourseController.deleteSubCourse
);

router.post("/news", [authMiddleware.checkUserAuth], newsController.addNews);
router.get("/news", [authMiddleware.checkUserAuth], newsController.getAllNews);
router.put(
  "/news/:id",
  [authMiddleware.checkUserAuth],
  newsController.updateNews
);
router.delete(
  "/news/:id",
  [authMiddleware.checkUserAuth],
  newsController.deleteNews
);
router.get(
  "/news/:id",
  [authMiddleware.checkUserAuth],
  newsController.getNewsById
);

router.post('/who_are_we_data',[authMiddleware.checkUserAuth],  whoAreWeDataController.addWhoAreWeData);
router.get('/who_are_we_data',[authMiddleware.checkUserAuth],  whoAreWeDataController.getAllWhoAreWeData);
router.put('/who_are_we_data/:id',[authMiddleware.checkUserAuth],  whoAreWeDataController.updateWhoAreWeData);
router.delete('/who_are_we_data/:id',[authMiddleware.checkUserAuth],  whoAreWeDataController.deleteWhoAreWeData);
router.get('/who_are_we_data/:id',[authMiddleware.checkUserAuth],  whoAreWeDataController.getAllWhoAreWeData);

router.post('/faq',[authMiddleware.checkUserAuth],  faqController.addFAQ);
router.get('/faq',[authMiddleware.checkUserAuth],  faqController.getAllFAQs);
router.put('/faq/:id',[authMiddleware.checkUserAuth],  faqController.updateFAQ);
router.delete('/faq/:id',[authMiddleware.checkUserAuth],  faqController.deleteFAQ);

router.post('/testimonial',[authMiddleware.checkUserAuth],  testimonialController.addTestimonial);
router.get('/testimonial',[authMiddleware.checkUserAuth],  testimonialController.getAllTestimonials);
router.put('/testimonial/:id',[authMiddleware.checkUserAuth],  testimonialController.updateTestimonial);
router.delete('/testimonial/:id',[authMiddleware.checkUserAuth],  testimonialController.deleteTestimonial);

router.post(
  "/video",
  [authMiddleware.checkUserAuth],
  uploadStt.single("video"),
  videoUploadController.addVideo
);
router.get(
  "/video",
  [authMiddleware.checkUserAuth],
  uploadStt.single("video"),
  videoUploadController.getAllVideos
);
router.put(
  "/video/:id",
  [authMiddleware.checkUserAuth],
  uploadStt.single("video"),
  videoUploadController.updateVideo
);
router.delete(
  "/video/:id",
  [authMiddleware.checkUserAuth],
  uploadStt.single("video"),
  videoUploadController.deleteVideo
);

router.post(
  "/uploadVideo",
  [authMiddleware.checkUserAuth],
  uploadStt.single("video"),
  (req, res) => {
    res.status(200).send({ message: "saved successfully" });
  }
);

router.post("/login", dashController.login);
router.post(
  "/signup",
  [authMiddleware.checkAuthDasboard],
  dashController.signup
);

module.exports = router;
