const { parentPort } = require("worker_threads");
const db = require("../models");
const { TrendingNewsMail } = require("../utils/mail_content");
const sendMail = require("../utils/mailer");

parentPort.on("message", async (data) => {
  try {
    // Fetch only verified users' emails
    const users = await db.user.findAll({
      where: { verified: true },
      attributes: ["email"],
    });

    const { title_en, description_en, coverimage } = data;

    const subject = "TheTopPlayer Not purchase";
    const text = "trending news"; // plain text body
    const html = TrendingNewsMail(title_en, description_en, coverimage);

    // Prepare all email sending promises
    const emailPromises = users.map((user) => sendMail(user.email, subject, text, html));

    // Send all emails concurrently
    await Promise.all(emailPromises);

    parentPort.postMessage("Not Purchase Emails sent successfully!");
  } catch (error) {
    parentPort.postMessage(`Error: ${error.message}`);
  }
});
