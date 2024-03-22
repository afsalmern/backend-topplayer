const db = require('../models');
const path = require('path');

exports.addCategory = (req, res, next) => {
    db.category.create({
        name: req.body.name,
    }).then((result) => {
        console.log(`a category added successfully`);
        res.status(200).send({ message: 'category added successfully' })
    }).catch((err) => {
        console.error(`error in adding category ${err.toString()}`)
        res.status(500).send({ message: err.toString() })
    });

}

exports.addCourse = (req, res, next) => {
    db.course.create({
        name: req.body.name,
        categoryId: req.body.categoryId, 
        amount: req.body.amount
    }).then((result) => {
        console.log(`a course added successfully`);
        res.status(200).send({ message: 'course added successfully' })
    }).catch((err) => {
        console.error(`error in adding course ${err.toString()}`)
        res.status(500).send({ message: err.toString() })
    });

}
exports.addSubCourse = (req, res, next) => {
    db.subcourse.create({
        name: req.body.name,
        courseId: req.body.courseId
    }).then((result) => {
        console.log(`a sub_course added successfully`);
        res.status(200).send({ message: 'a sub_course added successfully' })
    }).catch((err) => {
        console.error(`error in adding sub course ${err.toString()}`)
        res.status(500).send({ message: err.toString() })
    });

}

exports.addVideo = (req, res, next) =>{
    //const videospath =  path.join(__dirname, 'assets','trojanTTt','videos')

    db.video.create({
        name:req.body.name,
        day: req.body.day, 
        url:req.body.url, 
        subCourseId:req.body.subcourseId
    }).then((result) => {
        console.log(`a video added successfully`);
        res.status(200).send({ message: 'a video added successfully' })
    }).catch((err) => {
        console.error(`error in adding video ${err.toString()}`)
        res.status(500).send({ message: err.toString() })
    });
}

exports.uploadVideo = (req, res, next) =>{
    //const videospath =  path.join(__dirname, 'assets','trojanTTt','videos')

    db.video.create({
        name:req.body.name,
        day: req.body.day, 
        url:req.body.url, 
        subCourseId:req.body.subcourseId
    }).then((result) => {
        console.log(`a video added successfully`);
        res.status(200).send({ message: 'a video added successfully' })
    }).catch((err) => {
        console.error(`error in adding video ${err.toString()}`)
        res.status(500).send({ message: err.toString() })
    });
}