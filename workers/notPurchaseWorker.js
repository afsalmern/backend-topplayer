const { parentPort } = require("worker_threads");
const db = require("../models");
const { TrendingNewsMail } = require("../utils/mail_content");
const sendMail = require("../utils/mailer");
const { sendBulkEmail } = require("../utils/ses_mailer");

parentPort.on("message", async (data) => {
  try {
    await sendBulkEmail("reminder", data.users, data.users);
    parentPort.postMessage("Not Purchase Emails sent successfully!");
  } catch (error) {
    parentPort.postMessage(`Error: ${error.message}`);
  }
});
