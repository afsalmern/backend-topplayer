const path = require("path");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

const db = require("../models");
const { error } = require("console");
const {
  WelcomeMail,
  resendMail,
  passwordResetMail,
} = require("../utils/mail_content");
const sendMail = require("../utils/mailer");
const { where } = require("sequelize");

const stripe = require("stripe")(process.env.STRIPE_SK);
const OAuth2 = google.auth.OAuth2;

//const smtpTransport = require("../config/email.config");
// const createTransporter = async () => {
//   try {
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//     console.log(process.env.SENDGRID_API_KEY);
//     // Create Nodemailer transporter using SendGrid
//     const transporter = nodemailer.createTransport({
//       service: "SendGrid",
//       auth: {
//         user: "apikey",
//         pass: process.env.SENDGRID_API_KEY,
//       },
//     });
//     return transporter;
//   } catch (err) {
//     console.log(`error in create transporter ${err}`);
//     return err;
//   }
// };

exports.signup = async (req, res, next) => {
  try {
    //  var vc = bcrypt.hashSync(process.env.SECRET + req.body.email + new Date().toString());

    const userEmail = req.body.email;
    const username = req.body.username;
    //const langsymbol = req.body.symbol;
    const mobile = req.body.mobile;
    const deviceId = req.body.deviceId;
    const password = bcrypt.hashSync(req.body.password + process.env.SECRET);

    const characters = "0123456789";
    let code = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * 9);
      code += characters[randomIndex];
    }

    const [user, created] = await db.user.findOrCreate({
      where: { email: userEmail },
      defaults: {
        username: username,
        email: userEmail,
        verification_code: code,
        verified: false,
        password: password,
        mobile: mobile,
      },
    });

    if (created) {
      console.log("User created:", user.username);
      // const link = process.env.HOST + "/admin/auth/verify?id=" + vc + "&userId=" + user.id + "&lansymbol=" + langsymbol;

      const customer = await stripe.customers.create({
        email: user.email,
        name: user.username,
        phone: user.mobile,
        // You can add more customer details here
      });

      user.stripe_customer_id = customer.id;
      await user.save();

      await db.device.create({
        deviceID: deviceId,
        userId: user.id,
      });

      // const mailOptions = {
      //   from: process.env.EMAILID,
      //   to: userEmail,
      //   subject: "TheTopPlayer verification",
      //   text: "Please confirm your TheTopPlayer account", // plain text body
      //   html:
      //     "Hello " +
      //     username +
      //     " ,<br> <p>Please use the following 6-digit verification code to verify your account:<br> <strong>" +
      //     code +
      //     "</strong><br>Thank you!</p>", // html body
      // };

      const subject = "Welcome to Top Player - Verify Your Account";
      const text = "Please confirm your TheTopPlayer account"; // plain text body
      const html = WelcomeMail(username, code);

      // const mailOptions = {
      //   from: process.env.EMAILID,
      //   to: userEmail,
      //   subject: "Welcome to Top Player - Verify Your Account",
      //   text: "Please confirm your TheTopPlayer account", // plain text body
      //   html: WelcomeMail(username, code),
      // };

      const isMailsend = await sendMail(userEmail, subject, text, html);
      if (isMailsend) {
        console.log("Email sent:");
        res.status(200).send({
          message: "Please check your email to verify your account",
        });
      } else {
        res.status(500).send({
          message:
            "Your email address couldn't be found or is unable to receive email. please check your email and try again.",
          // accessToken: token
        });
      }

      // let emailTransporter = await createTransporter();

      //  const gmail = google.gmail({ version: 'v1', emailAuth });

      // await emailTransporter.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     console.error("Error sending email:", error);
      //     res.status(500).send({
      //       message:
      //         "Your email address couldn't be found or is unable to receive email. please check your email and try again.",
      //       // accessToken: token
      //     });
      //   } else {
      //     console.log("Email sent:", info.response);
      //     res.status(200).send({
      //       message: "Please check your email to verify your account",
      //     });
      //   }
      // });
    } else {
      console.log("User found:", user.username);
      res.status(409).send({
        message: "user already exist",
      });
    }
  } catch (error) {
    console.error(`error in adding new user ${error.toString()}`);
    res.status(500).send({ message: error.toString() });
  }
};
exports.resendVerification = async (req, res, next) => {
  try {
    //  var vc = bcrypt.hashSync(process.env.SECRET + req.body.email + new Date().toString());

    const userEmail = req.body.email;

    const characters = "0123456789";
    let code = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * 9);
      code += characters[randomIndex];
    }

    const user = await db.user.findOne({
      where: { email: userEmail },
    });

    if (!user) {
      let err = new Error("User Not found. ");
      err.code = 500;
      throw err;
    }

    if (user.verified) {
      let err = new Error("User already verified. ");
      err.code = 500;
      throw err;
    }

    user.verification_code = code;
    await user.save();

    // const mailOptions = {
    //   from: process.env.EMAILID,
    //   to: userEmail,
    //   subject: "TheTopPlayer verification",
    //   text: "Please confirm your TheTopPlayer account", // plain text body
    //   html:
    //     "Hello " +
    //     user.username +
    //     " ,<br> <p>Please use the following 6-digit verification code to verify your account:<br> <strong>" +
    //     code +
    //     "</strong><br>Thank you!</p>", // html body
    // };

    const subject = "TheTopPlayer verification";
    const text = "Please confirm your TheTopPlayer account";
    const html = resendMail(user.username, code);

    const isMailsend = await sendMail(userEmail, subject, text, html);
    if (isMailsend) {
      console.log("Email sent:");
      res.status(200).send({
        message: "Please check your email to verify your account",
      });
    } else {
      console.error("Error sending email:", error);
      res.status(500).send({
        message:
          "Your email address couldn't be found or is unable to receive email. please check your email and try again.",
        // accessToken: token
      });
    }

    // const mailOptions = {
    //   from: process.env.EMAILID,
    //   to: userEmail,
    //   subject: "TheTopPlayer verification",
    //   text: "Please confirm your TheTopPlayer account", // plain text body
    //   html: resendMail(user.username, code),
    // };

    // let emailTransporter = await createTransporter();

    // //  const gmail = google.gmail({ version: 'v1', emailAuth });

    // await emailTransporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.error("Error sending email:", error);
    //     res.status(500).send({
    //       message:
    //         "Your email address couldn't be found or is unable to receive email. please check your email and try again.",
    //       // accessToken: token
    //     });
    //   } else {
    //     console.log("Email sent:", info.response);
    //     res.status(200).send({
    //       message: "Please check your email to verify your account",
    //     });
    //   }
    // });
  } catch (error) {
    console.error(`error in adding new user ${error.toString()}`);
    res.status(500).send({ message: error.toString() });
  }
};

exports.verifyAccFun = async (req, res) => {
  try {
    const email = req.body.email;
    const VC = req.body.verify_code;
    const secret = process.env.SECRET;

    const user = await db.user.findOne({ where: { email: email } });

    if (!user) throw new Error("user not found");

    if (VC == "verified") throw new Error("user already verified");

    if (user.verification_code == VC) {
      user.verification_code = "verified";
      user.verified = true;
      const token = jwt.sign({ id: user.id }, secret, { expiresIn: "90d" });
      await user.save();

      res.status(200).send({
        accessToken: token,
        message: "login successfully",
      });
    } else {
      res.status(500).send({ message: "verification code not valid" });
    }
  } catch (error) {
    if (error.code == undefined) error.code = 500;
    console.error(`error in verification of user ${error.toString()}`);
    res.status(error.code).send({ message: error.toString() });
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const secret = process.env.SECRET;
    const deviceID = req.body.deviceId;

    const userDB = await db.user.findOne({
      where: {
        email: email,
      },
    });

    if (!userDB) {
      let err = new Error("User Not found. ");
      err.code = 500;
      throw err;
    }

    console.log(secret);
    const passwordIsValid = await bcrypt.compareSync(
      password + secret,
      userDB.password
    );

    const timestamp = Date.now();
    const date = new Date(timestamp);

    if (!passwordIsValid) {
      console.error(`user ${userDB.username} loged in faild at ${date}`);
      let err = new Error("Invalid Password!");
      err.code = 401;
      throw err;
    }

    if (!userDB.verified) {
      console.error(
        `user ${userDB.username} loged in faild at ${date} because not verified`
      );
      let err = new Error("Email not verified, please verify your email");
      err.code = 402;
      throw err;
    }

    if (!userDB.status) {
      console.error(
        `User ${userDB.username} logged in failed at ${date} because the account is suspended.`
      );
      let err = new Error(
        "Your account is suspended. Please contact the administrator."
      );
      err.code = 401; // Updated error code to 402
      throw err;
    }

    const maxDeviceCount = userDB.deviceCount;

    console.log(maxDeviceCount, "MAX COUNT");

    const devices = await db.device.findAll({
      where: {
        userId: userDB.id,
      },
    });

    const isDevicePresent = devices.some(
      (device) => device.deviceID === deviceID
    );
    console.log(`${isDevicePresent} ${userDB.id} ${deviceID}`);
    if (!isDevicePresent) {
      if (devices.length >= maxDeviceCount) {
        let err = new Error(
          "Maximum allowed logins reached. Please log out from your other devices to proceed"
        );
        err.code = 401;
        throw err;
      } else {
        await db.device.create({
          userId: userDB.id,
          deviceID: deviceID,
        });
      }
    }

    const token = jwt.sign({ id: userDB.id, deviceID }, secret, {
      expiresIn: "90d",
    });

    console.log(`user ${userDB.username} loged in successfully at ${date}`);
    res.status(200).send({
      accessToken: token,
      status: userDB.status,
      verified: userDB.verified,
      message: "login successfully",
    });
  } catch (error) {
    if (error.code == undefined) error.code = 500;
    if (error.code == 402) {
      res
        .status(error.code)
        .send({ message: error.toString(), verified: false });
    } else {
      console.error(`error in login ${error.toString()}`);
      res.status(error.code).send({ message: error.toString() });
    }
  }
};

exports.logout = async (req, res, next) => {
  try {
    let device = null;
    const userId = req.userDecodeId;
    const deviceId = req.deviceId;

    if (deviceId !== undefined) {
      device = await db.device.findOne({
        where: { deviceID: deviceId, userId: userId },
      });
    }
    if (!device) {
      // If device not found, user is already logged out
      console.log("Logged out successfully,no devices found!");
      return res.status(200).send({
        message: "Logged out successfully,no devices found!",
      });
    }
    if (device) {
      await device.destroy();
    }

    console.log("Logged out successfully");
    res.status(200).send({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(`error in logout ${error.toString()}`);
    res.status(error.code).send({ message: error.toString() });
  }
};

// exports.login = async (req, res, next) => {
//   try {
//     const email = req.body.email;
//     const password = req.body.password;
//     const secret = process.env.SECRET;
//     const deviceID = req.body.deviceId;

//     const userDB = await db.user.findOne({
//       where: {
//         email: email,
//       },
//     });

//     if (!userDB) {
//       let err = new Error("User Not found.");
//       err.code = 500;
//       throw err;
//     }

//     const passwordIsValid = await bcrypt.compareSync(password + secret, userDB.password);

//     const timestamp = Date.now();
//     const date = new Date(timestamp);

//     if (!passwordIsValid) {
//       console.error(`User ${userDB.username} login failed at ${date}`);
//       let err = new Error("Invalid Password!");
//       err.code = 401;
//       throw err;
//     }

//     if (!userDB.verified) {
//       console.error(`User ${userDB.username} login failed at ${date} because not verified`);
//       let err = new Error("Email not verified, please verify your email");
//       err.code = 402;
//       throw err;
//     }

//     let deviceLimit = 3; // Default device limit
//     if (email === "azsx4736@gmail.com") {
//       deviceLimit = 10; // Increase the device limit for specified user
//     }

//     const devices = await db.device.findAll({
//       where: {
//         userId: userDB.id,
//       },
//     });

//     // Check if the user has reached the device limit
//     if (devices.length >= deviceLimit) {
//       let err = new Error("Maximum device limit exceeded.");
//       err.code = 403;
//       throw err;
//     }

//     const isDevicePresent = devices.some((device) => device.deviceID === deviceID);
//     console.log(`${isDevicePresent} ${userDB.id} ${deviceID}`);
//     if (!isDevicePresent) {
//       await db.device.create({
//         userId: userDB.id,
//         deviceID: deviceID,
//       });
//     }

//     const token = jwt.sign({ id: userDB.id }, secret, { expiresIn: "90d" });

//     console.log(`User ${userDB.username} logged in successfully at ${date}`);
//     res.status(200).send({
//       accessToken: token,
//       message: "Login successful",
//     });
//   } catch (error) {
//     if (error.code === undefined) error.code = 500;
//     if (error.code === 402) {
//       res.status(error.code).send({ message: error.toString(), verified: false });
//     } else {
//       console.error(`Error in login ${error.toString()}`);
//       res.status(error.code).send({ message: error.toString() });
//     }
//   }
// };

exports.getUserDetails = (req, res, next) => {
  db.user
    .findByPk(req.userDecodeId, {
      attributes: ["id", "username", "email", "mobile", "bio"],
    })
    .then((userDB) => {
      if (userDB == null) throw new Error("user not found");
      res.status(200).send(userDB);
    })
    .catch((error) => {
      console.log(`error in getting user ${error.toString()}`);
      res.status(200).send({ message: error.toString() });
    });
};

exports.updateUserDetails = async (req, res, next) => {
  const mobile = req.body.mobile;
  const bio = req.body.bio;
  const username = req.body.username;

  const userDB = await db.user.findByPk(req.userDecodeId, {
    attributes: ["id", "username", "email", "mobile", "bio"],
  });

  if (userDB !== null) {
    userDB.username = username;
    userDB.bio = bio;
    userDB.mobile = mobile;
    await userDB.save();
    res.status(200).send({ message: "user updated successfully" });
  } else {
    console.log(`error in getting user ${error.toString()}`);
    res.status(200).send({ message: error.toString() });
  }
};

exports.resetPassWebsite = async (req, res, next) => {
  try {
    const oldPassword = req.body.oldpassword;
    const newPasswordReq = req.body.newpassword;
    const secret = process.env.SECRET;
    const userId = req.userDecodeId;

    const userDB = await db.user.findByPk(userId);

    if (!userDB) {
      let err = new Error("User Not found. ");
      err.code = 404;
      throw err;
    }

    const passwordIsValid = await bcrypt.compareSync(
      oldPassword + secret,
      userDB.password
    );

    const timestamp = Date.now();
    const date = new Date(timestamp);

    if (!passwordIsValid) {
      console.error(`user ${userDB.username} update password faild at ${date}`);
      let err = new Error("Invalid Password!");
      err.code = 401;
      throw err;
    }

    const new_password = bcrypt.hashSync(newPasswordReq + secret);
    userDB.password = new_password;
    await userDB.save();
    res.status(200).send({ message: "password updated successfully" });
  } catch (error) {
    if (error.code == undefined) error.code = 500;
    console.error(`error in login ${error.toString()}`);
    res.status(error.code).send({ message: error.toString() });
  }
};

exports.forgotPass = async (req, res, next) => {
  try {
    const userEmail = req.body.email;
    const secret = process.env.SECRET;

    const userDB = await db.user.findOne({
      where: {
        email: userEmail,
      },
    });

    if (!userDB) {
      let err = new Error("no user with this email");
      err.code = 404;
      throw err;
    }

    const characters = "0123456789";
    let code = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * 9);
      code += characters[randomIndex];
    }

    const [forgotPAss, created] = await db.forgetPAss.findOrCreate({
      where: {
        userId: userDB.id,
      },
      defaults: {
        userId: userDB.id,
        VC: code,
      },
    });

    if (!created) {
      forgotPAss.VC = code;
      forgotPAss.save();
    }

    // const mailOptions = {
    //   from: process.env.EMAILID,
    //   to: userDB.email,
    //   subject: "TheTopPlayer Password Reset",
    //   text: "Password Reset",
    //   html: ` <h2>Password Reset</h2>
    //         <p>Dear ${userDB.username},</p>

    //         <p>We received a request to reset the password associated with your account at TheTopPlayer. To initiate the password reset process, please follow the instructions below:</p>

    //         <ul>
    //             <li>Please use the following 6-digit verification code to change your password:<br><strong>${code}</strong></li>

    //         </ul>

    //         <p>Please ensure that you complete the password reset process as soon as possible. If you didn't initiate this request or if you have any concerns about the security of your account, please contact our support team immediately on WhatsApp +971501225632.</p>

    //         <p>Thank you for choosing TheTopPlayer.</p>

    //         <p>Best Regards,<br>`,
    // };

    const subject = "TheTopPlayer Password Reset";
    const text = "Password Reset"; // plain text body
    const html = passwordResetMail(userDB.username, code);

    const isMailsend = await sendMail(userDB.email, subject, text, html);
    if (isMailsend) {
      console.log("Email sent:");
      res.status(200).send({
        message: "Please check your email to Reset your pass",
      });
    } else {
      console.error("Error sending email:", error);
      res.status(500).send({
        message:
          "Your email address couldn't be found or is unable to receive email. please check your email and try again.",
        // accessToken: token
      });
    }

    // const mailOptions = {
    //   from: process.env.EMAILID,
    //   to: userDB.email,
    //   subject: "TheTopPlayer Password Reset",
    //   text: "Password Reset",
    //   html: passwordResetMail(userDB.username, code),
    // };

    // let emailTransporter = await createTransporter();
    // await emailTransporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.error("Error sending email:", error);
    //     res.status(500).send({
    //       message:
    //         "Your email address couldn't be found or is unable to receive email. please check your email and try again.",
    //       // accessToken: token
    //     });
    //   } else {
    //     console.log("Email sent:", info.response);
    //     res.status(200).send({
    //       message: "Please check your email to Reset your pass",
    //     });
    //   }
    // });
  } catch (error) {
    if (error.code == undefined) error.code = 500;
    console.error(`error in login ${error.toString()}`);
    res.status(error.code).send({ message: error.toString() });
  }
};

exports.verifyresetPass = async (req, res) => {
  try {
    const secret = process.env.SECRET;
    const symbol = req.query.symbol;

    console.log(`user trying to verify his email ${req.query.id}`);
    if (req.query.id == undefined || req.query.id == null)
      res.send("unverified code");
    else {
      const token = req.query.id;
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          console.error(`error in verifying ${err.toString()}`);
          throw new Error(err.toString());
        }

        if (!decoded) {
          throw new Error(err.toString());
        }

        const userId = decoded.id;

        db.user
          .findByPk(userId)
          .then((user) => {
            // Check if record exists in db
            if (user) {
              console.log("user can reset his password");
              //  res.send(token)

              res.redirect(
                `${process.env.CLIENT_HOST}/${symbol}/admin/change/${token}`
              );
            } else {
              res
                .status(401)
                .send({ message: "Sorry but the user does not found" });
            }
          })
          .catch((error) => {
            res.status(500).send({ message: "error in finding user" });
          });
      });
    }
  } catch (error) {
    res.status(500).send({
      message: `error in verifying reset password ${error.toString()}`,
    });
  }
};

exports.resetPassEmail = async (req, res, next) => {
  try {
    const secret = process.env.SECRET;
    const newPasswordReq = req.body.newpassword;
    const email = req.body.email;
    const VC = req.body.verification_code;
    const deviceID = req.body.deviceId;

    const userDB = await db.user.findOne({
      where: {
        email: email,
      },
    });

    if (!userDB) {
      let err = new Error("User Not found. ");
      err.code = 404;
      throw err;
    }

    const vcDB = await db.forgetPAss.findOne({
      where: {
        userId: userDB.id,
      },
    });

    if (VC !== vcDB.VC && VC !== "verified") {
      throw new Error("verification code not valid");
    }

    const devices = await db.device.findAll({
      where: {
        userId: userDB.id,
      },
    });

    const isDevicePresent = devices.some(
      (device) => device.deviceID === deviceID
    );
    console.log(`${isDevicePresent} ${userDB.id} ${deviceID}`);
    if (!isDevicePresent) {
      if (devices.length >= 2) {
        let err = new Error(
          "Maximum allowed logins reached. Please log out from your other devices to proceed"
        );
        err.code = 401;
        throw err;
      } else {
        await db.device.create({
          userId: userDB.id,
          deviceID: deviceID,
        });
      }
    }

    const new_password = bcrypt.hashSync(newPasswordReq + secret);
    userDB.password = new_password;
    await userDB.save();

    const token = jwt.sign({ id: userDB.id, deviceID }, secret, {
      expiresIn: "90d",
    });

    res
      .status(200)
      .send({ accessToken: token, message: "password updated successfully" });
  } catch (error) {
    if (error.code == undefined) error.code = 500;
    console.error(`error in updating user password ${error.toString()}`);
    res.status(error.code).send({ message: error.toString() });
  }
};
