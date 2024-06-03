const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   secure: true,
//   auth: {
//     user: process.env.EMAILID,
//     pass: process.env.EMAILPASS,
//   },
// });
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAILID,
    pass: process.env.EMAILPASS,
  },
  // tls: {
  //   // Do not fail on invalid certs
  //   rejectUnauthorized: false,
  //   minVersion: "TLSv1.2", // Ensure a minimum TLS version
  // },
});

async function sendMail(to, subject, text, html) {
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: "info.thetopplayer@gmail.com", // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
      // cc: ["afsal@intersmart.in,salwa@intersmart.ae"],
    });
    console.log("Message sent: %s", info.messageId);
    return true; // Email sent successfully
  } catch (error) {
    console.error("Error sending email:", error);
    return false; // Email sending failed
  }
}

module.exports = sendMail;
