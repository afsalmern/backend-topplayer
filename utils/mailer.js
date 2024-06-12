const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAILID,
    pass: process.env.EMAILPASS,
  },
});
async function sendMail(to, subject, text, html) {
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: "noreply@thetopplayer.com", // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });
    console.log("Message sent: %s", info.messageId);
    return true; // Email sent successfully
  } catch (error) {
    console.error("Error sending email:", error);
    return false; // Email sending failed
  }
}

module.exports = sendMail;