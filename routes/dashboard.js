const express = require('express');
const multer = require('multer');
// test
const authMiddleware = require('../middleware/auth')
const dashController = require('../controller/dashboard')

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

router.post('/category',[authMiddleware.checkAuthDasboard],  dashController.addCategory);
router.post('/course',[authMiddleware.checkAuthDasboard],  dashController.addCourse);
router.post('/subcourse',[authMiddleware.checkAuthDasboard],  dashController.addSubCourse);
router.post('/video',[authMiddleware.checkAuthDasboard],  dashController.addVideo);
router.post('/uploadVideo',[authMiddleware.checkAuthDasboard], uploadStt.single("video") ,(req, res) =>{
    res.status(200).send({message:'saved successfully'})
})

module.exports = router;