const { parentPort } = require("worker_threads");
const db = require("../models");
const { TrendingNewsMail } = require("../utils/mail_content");
const sendMail = require("../utils/mailer");
const { sendBulkEmail } = require("../utils/ses_mailer");
const { raw } = require("mysql2");

parentPort.on("message", async (data) => {
  try {
    // Fetch only verified users' emails
    const users = await db.user.findAll({
      where: { verified: true },
      attributes: ["email", "username"],
      raw: true,
    });

    await sendBulkEmail("trending", users, data);

    parentPort.postMessage("News Emails sent successfully!");
  } catch (error) {
    parentPort.postMessage(`Error: ${error.message}`);
  }
});
