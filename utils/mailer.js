const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: process.env.EMAILID,
    pass: process.env.EMAILPASS,
  },
});
async function sendMail(to, subject, text, html) {
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.EMAILID, // sender address
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
