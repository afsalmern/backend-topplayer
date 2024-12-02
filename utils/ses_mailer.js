const AWS = require("aws-sdk");
const { ReminderMail, TrendingNewsMail } = require("./mail_content");

AWS.config.update({ region: process.env.AWS_REGION });
const ses = new AWS.SES({ apiVersion: "2010-12-01" });

// Utility function to introduce a delay (in milliseconds)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sendBulkEmail = async (type, emailList, data) => {
  const senderEmail = "noreply@thetopplayer.com"; // Must be verified in SES
  const maxRetries = 5; // Maximum retries for throttling errors
  const retryDelayBase = 1000; // Base delay for exponential backoff (in ms)
  const maxSendRate = 14; // Emails per second

  // Split email list into batches of 14
  for (let i = 0; i < emailList.length; i += maxSendRate) {
    const batch = emailList.slice(i, i + maxSendRate);

    const promises = batch.map(async (recipientEmail) => {
      let htmlBody;
      let subject;

      if (type === "reminder") {
        htmlBody = ReminderMail();
        subject = "TheTopPlayer Reminder Mail";
      } else if (type === "trending") {
        const { newsId, title_en, title_ar, description_en, description_ar, coverimage } = data;
        htmlBody = TrendingNewsMail(newsId, title_en, title_ar, description_en, description_ar, coverimage);
        subject = "TheTopPlayer Trending Now";
      }

      const params = {
        Source: senderEmail,
        Destination: { ToAddresses: [recipientEmail.email] },
        Message: {
          Subject: { Data: subject, Charset: "UTF-8" },
          Body: { Html: { Data: htmlBody, Charset: "UTF-8" } },
        },
      };

      let attempt = 0;
      while (attempt < maxRetries) {
        try {
          await ses.sendEmail(params).promise();
          console.log("Email sent successfully to " + recipientEmail.email);
          return;
        } catch (error) {
          if (error.code === "Throttling") {
            attempt++;
            console.error(
              `Throttling error: Retrying attempt ${attempt}/${maxRetries} for ${recipientEmail.email}`
            );
            await delay(retryDelayBase * Math.pow(2, attempt - 1)); // Exponential backoff
          } else {
            console.error("Error sending email to " + recipientEmail.email, error);
            return; // Exit loop on non-throttling errors
          }
        }
      }
    });

    // Wait for all emails in the batch to complete before moving to the next batch
    await Promise.all(promises);
    if (i + maxSendRate < emailList.length) {
      await delay(1000); // Ensure a 1-second delay between batches
    }
  }
};

module.exports = { sendBulkEmail, ses };
