const express = require('express');
const multer = require('multer');
// test
const authMiddleware = require('../middleware/auth')
const dashController = require('../controller/dashboard')
const categoryController = require('../controller/dashboard/category_controller')
const courseController = require('../controller/dashboard/course_controller')
const subCourseController = require('../controller/dashboard/subcourse_controller')
const videoUploadController = require('../controller/dashboard/video_upload_controller')

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

router.post('/category',[authMiddleware.checkAuthDasboard],  categoryController.addCategory);
router.get('/category',[authMiddleware.checkAuthDasboard],  categoryController.getAllCategories);
router.put('/category/:id',[authMiddleware.checkAuthDasboard],  categoryController.updateCategory);
router.delete('/category/:id',[authMiddleware.checkAuthDasboard],  categoryController.deleteCategory);

router.post('/course',[authMiddleware.checkAuthDasboard],  courseController.addCourse);
router.get('/course',[authMiddleware.checkAuthDasboard],  courseController.getAllCourses);
router.put('/course/:id',[authMiddleware.checkAuthDasboard],  courseController.updateCourse);
router.delete('/course/:id',[authMiddleware.checkAuthDasboard],  courseController.deleteCourse);

router.post('/subcourse',[authMiddleware.checkAuthDasboard],  subCourseController.addSubCourse);
router.get('/subcourse',[authMiddleware.checkAuthDasboard],  subCourseController.getAllSubCourses);
router.put('/subcourse/:id',[authMiddleware.checkAuthDasboard],  subCourseController.updateSubCourse);
router.delete('/subcourse/:id',[authMiddleware.checkAuthDasboard],  subCourseController.deleteSubCourse);


router.post('/video',[authMiddleware.checkAuthDasboard], uploadStt.single("video"),  videoUploadController.addVideo);
router.get('/video',[authMiddleware.checkAuthDasboard], uploadStt.single("video"),  videoUploadController.getAllVideos);
router.put('/video/:id',[authMiddleware.checkAuthDasboard], uploadStt.single("video"),  videoUploadController.updateVideo);
router.delete('/video/:id',[authMiddleware.checkAuthDasboard], uploadStt.single("video"),  videoUploadController.deleteVideo);

router.post('/uploadVideo',[authMiddleware.checkAuthDasboard], uploadStt.single("video") ,(req, res) =>{
  res.status(200).send({message:'saved successfully'})
})

router.post('/login',  dashController.login);
router.post('/signup',[authMiddleware.checkAuthDasboard],  dashController.signup);

module.exports = router;