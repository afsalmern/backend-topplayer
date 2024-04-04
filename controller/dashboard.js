const db = require("../models");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.addCategory = (req, res, next) => {
  db.category
    .create({
      name: req.body.name,
    })
    .then((result) => {
      console.log(`a category added successfully`);
      res.status(200).send({ message: "category added successfully" });
    })
    .catch((err) => {
      console.error(`error in adding category ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

exports.addCourse = (req, res, next) => {
  db.course
    .create({
      name: req.body.name,
      categoryId: req.body.categoryId,
      amount: req.body.amount,
    })
    .then((result) => {
      console.log(`a course added successfully`);
      res.status(200).send({ message: "course added successfully" });
    })
    .catch((err) => {
      console.error(`error in adding course ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

exports.addSubCourse = (req, res, next) => {
  db.subcourse
    .create({
      name: req.body.name,
      courseId: req.body.courseId,
    })
    .then((result) => {
      console.log(`a sub_course added successfully`);
      res.status(200).send({ message: "a sub_course added successfully" });
    })
    .catch((err) => {
      console.error(`error in adding sub course ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

exports.addVideo = (req, res, next) => {
  //const videospath =  path.join(__dirname, 'assets','trojanTTt','videos')

  db.video
    .create({
      name: req.body.name,
      day: req.body.day,
      url: req.body.url,
      subCourseId: req.body.subcourseId,
    })
    .then((result) => {
      console.log(`a video added successfully`);
      res.status(200).send({ message: "a video added successfully" });
    })
    .catch((err) => {
      console.error(`error in adding video ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

exports.uploadVideo = (req, res, next) => {
  //const videospath =  path.join(__dirname, 'assets','trojanTTt','videos')

  db.video
    .create({
      name: req.body.name,
      day: req.body.day,
      url: req.body.url,
      subCourseId: req.body.subcourseId,
    })
    .then((result) => {
      console.log(`a video added successfully`);
      res.status(200).send({ message: "a video added successfully" });
    })
    .catch((err) => {
      console.error(`error in adding video ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const secret = process.env.SECRET;
    const { email, password } = req.body;

    const user = await db.adminUser.findOne({ where: { email } });

    if (!user) {
      const error = new Error("User not found.");
      error.code = 404; // Not Found
      throw error;
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      console.error(`User ${user.username} login failed: Invalid password`);
      const error = new Error("Invalid password!");
      error.code = 401; // Unauthorized
      throw error;
    }

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "1d" });

    console.log(`User ${user.username} logged in successfully.`);
    res.status(200).send({
      email: user.email,
      username: user.username,
      userId: user.id,
      token: token,
      message: "Login successful",
    });
  } catch (error) {
    console.error(`Error in login: ${error.toString()}`);
    const statusCode = error.code || 500;
    res.status(statusCode).send({ message: error.message });
  }
};

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await db.adminUser.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error("Email already exists.");
      error.code = 409; // Conflict
      throw error;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new admin user
    const newAdminUser = await db.adminUser.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin user created successfully.",
      user: newAdminUser,
    });
  } catch (error) {
    console.error(`Error in admin user signup: ${error.toString()}`);
    const statusCode = error.code || 500;
    res
      .status(statusCode)
      .json({ message: "Failed to create admin user.", error: error.message });
  }
};
