const db = require("../models");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { SendNotPurchaseMails, sendEmails } = require("../services/emailService");
const { ReminderMail } = require("../utils/mail_content");
const { sendEmail, sendBulkEmail, ses } = require("../utils/ses_mailer");
const { GetSendQuotaCommand } = require("@aws-sdk/client-ses");
const { getCommisionAmount } = require("../utils/Revenue_helpers");

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

    const dbTofind = db.adminUser;

    const user = await dbTofind.findOne({ where: { email } });

    if (!user) {
      const error = new Error("User not found.");
      error.code = 401; // Not Found
      throw error;
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    console.log(passwordIsValid);

    if (!passwordIsValid) {
      console.error(`User ${user.username} login failed: Invalid password`);
      const error = new Error("Invalid password!");
      error.code = 401; // Unauthorized
      throw error;
    }

    const token = jwt.sign({ id: user.id, role: user?.role }, secret, { expiresIn: "1d" });

    return res.status(200).send({
      email: user.email,
      username: user.username,
      userId: user.id,
      role: user?.role,
      token: token,
      message: "Login successful",
    });
  } catch (error) {
    console.error(`Error in login: ${error.toString()}`);
    const statusCode = error.code || 500;
    res.status(statusCode).send({ message: error.message, status_code: error.code, status: false });
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
    res.status(statusCode).json({ message: "Failed to create admin user.", error: error.message });
  }
};

exports.checkUsersWhoDontHavePurchase = async (req, res) => {
  try {
    const today = new Date();
    const previous7Days = new Date(today.setDate(today.getDate() - 7)); // 7 days ago from today

    const startDate = previous7Days.toISOString().split("T")[0]; // Start date in ISO format (YYYY-MM-DD)
    const endDate = today.toISOString().split("T")[0]; // End date in ISO format (YYYY-MM-DD)

    const users = await db.user.findAll({
      include: [
        {
          model: db.payment,
          required: false,
          where: { userId: null, createdAt: { [db.Op.between]: [startDate, endDate] } },
        },
      ],
    });

    SendNotPurchaseMails("Not Purchase", "Not Purchase", "Not Purchase");

    res.status(200).json({
      message: "Users who don't have a purchase in the last 7 days:",
      users: users,
    });
  } catch (err) {
    console.error(`Error in fetching users: ${err.toString()}`);
    res.status(500).json({ message: "Failed to fetch users." });
  }
};

exports.sendMail = async (req, res) => {
  const { coupon } = req.body;

  try {
    const amount = 239.57;

    const couponItem = await db.influencer.findOne({
      attributes: ["id", "commision_percentage"],
      where: {
        id: coupon,
      },
    });

    if (!couponItem) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    const commison = getCommisionAmount(amount, couponItem?.commision_percentage);
    res.json(commison);
  } catch (err) {
    console.error(`Error in sending email: ${err.toString()}`);
    res.status(500).json({ message: "Failed to send email." });
  }
};
