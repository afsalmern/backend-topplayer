const AWS = require("aws-sdk");
const { ReminderMail, TrendingNewsMail } = require("./mail_content");

// Configure AWS SES
AWS.config.update({ region: process.env.AWS_REGION }); // Replace with your region

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

// Function to send an email using SES
const sendBulkEmail = async (type, emailList, data) => {
  const senderEmail = "noreply@thetopplayer.com"; // Must be verified in SES

  // Loop through each email in the list and send the email
  const promises = emailList.map(async (recipientEmail) => {
    let htmlBody;
    let subject;

    if (type === "reminder") {
      htmlBody = ReminderMail();
      subject = "TheTopPlayer Reminder Mail";
    } else if (type === "trending") {
      htmlBody = TrendingNewsMail(data.title_en, data.description_en, data.coverimage);
      subject = "TheTopPlayer Trending Now";
    }

    // Setup email parameters
    const params = {
      Source: senderEmail, // Sender email (must be verified in SES)
      Destination: {
        ToAddresses: [recipientEmail.email], // Recipient's email
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: htmlBody, // Generated HTML template
            Charset: "UTF-8",
          },
        },
      },
    };

    // Send the email
    try {
      const data = await ses.sendEmail(params).promise();
      console.log("Email sent successfully to " + recipientEmail.email, data);
    } catch (error) {
      console.error("Error sending email to " + recipientEmail.email, error);
    }
  });

  // Wait for all emails to be sent
  await Promise.all(promises);
};

module.exports = {
  sendBulkEmail,
  ses,
};
