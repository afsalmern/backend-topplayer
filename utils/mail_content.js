function WelcomeMail(username, code) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style>
      a[href] {
        color: #9E6439;
      }
    </style>
  </head>
  <body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
    <div style="width:700px; margin: auto; background: #fff;">
      <table id="Table_01" width="700" border="0" cellpadding="0" cellspacing="0" align="center" style="background-color: #F8F2ED;background-image: url(https://ux.intersmarthosting.in/Mailers/TopPlayer/images/dElmt-countBg-1.png);background-position: center;background-size: 440px 360px;background-repeat: no-repeat; padding: 60px 20px;">
        <tbody>
          <tr>
            <td style="padding: 30px 60px;">
              <a href="#!" style="display: block; width: 200px;">
                <img src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/logo.png" width="200" height="60" alt="logo">
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 60px;">
              <h1 style="font-size: 24px; line-height: 1; font-weight: 600; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 10px 0;">
                The Top Player</h1>
              <h1 style="font-size: 20px; line-height: 1.2; font-weight: 600; font-family: Arial, Helvetica, sans-serif; color: #9E6439; margin: 1px 0;">
                Welcome to The Top Player - Verify Your Account</h1>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                Dear ${username},</p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                Welcome to The Top Player! We're thrilled to have you on board. To ensure the security of your account and complete the signup process, please verify your email address by using the One-Time Password (OTP) provided below:
              </p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                <b>OTP: ${code}</b>
              </p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                Please enter this OTP on the verification page to activate your The Top Player account. If you haven't signed up for The Top Player or have any concerns, please reach out to our support team immediately at ${process.env.SUPPORT_EMAILID} or connect us through Whatsapp at ${process.env.SUPPORT_CONTACT}.
              </p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                We're excited to see you become a part of our community and explore all the exciting features The Top Player has to offer.
              </p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                Best regards,<br>
                The Top Player Team
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
  </html>`;
}

function resendMail(username, code) {
  return `
    <!DOCTYPE html>
<html>

<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style>
        a[href] {
            color: #9E6439;
        }
    </style>
</head>

<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
<div style="width:700px; margin: auto; background: #fff;">
<table id="Table_01" width="700" border="0" cellpadding="0" cellspacing="0" align="center" style="background-color: #F8F2ED;background-image: url(https://ux.intersmarthosting.in/Mailers/TopPlayer/images/dElmt-countBg-1.png);background-position: center;background-size: 440px 360px;background-repeat: no-repeat; padding: 60px 20px;">
  <tbody>
    <tr>
      <td style="padding: 30px 60px;">
        <a href="#!" style="display: block; width: 200px;">
          <img src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/logo.png" width="200" height="60" alt="logo">
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px 60px;">
        <h1 style="font-size: 24px; line-height: 1; font-weight: 600; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 10px 0;">The Top Player</h1>
        <h1 style="font-size: 20px; line-height: 1.2; font-weight: 600; font-family: Arial, Helvetica, sans-serif; color: #9E6439; margin: 1px 0;">Password Reset OTP</h1>
        <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">Dear ${username},</p>
        <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">We recently received a request to reset the password for your The Top Player account. To complete this process, please use the following One-Time Password (OTP):</p>
        <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;"><b>OTP: ${code}</b>}</p>
        <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">Please enter this OTP on the password reset page to create a new password for your account. If you didn't initiate this request or have any concerns about the security of your account, please contact our support team immediately at ${process.env.SUPPORT_EMAILID} or connect us through Whatsapp at ${process.env.SUPPORT_CONTACT}.</p>
        <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">Thank you for helping us maintain the security of your The Top Player account.</p>
        <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">Best regards, <br> The Top Player Team</p>
      </td>
    </tr>
  </tbody>
</table>
</div>
</body>
</html>
    `;
}

function passwordResetMail(username, code) {
  return `
<!DOCTYPE html>
<html>

<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style>
        a[href] {
            color: #9E6439;
        }
    </style>
</head>

<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
    <div style="width:700px; margin: auto; background: #fff;">
        <table id="Table_01" width="700" border="0" cellpadding="0" cellspacing="0" align="center"
            style="background-color: #F8F2ED;background-image: url(https://ux.intersmarthosting.in/Mailers/TopPlayer/images/dElmt-countBg-1.png);background-position: center;background-size: 440px 360px;background-repeat: no-repeat; padding: 60px 20px;">
            <tbody>
                <tr>
                    <td style="padding: 30px 60px;">
                        <a href="#!" style="display: block; width: 200px;">
                            <img src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/logo.png" width="200"
                                height="60" alt="logo">
                        </a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 30px 60px;">
                        <h1
                            style="font-size: 24px; line-height: 1; font-weight: 600; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 10px 0;">
                            The Top Player</h1>
                        <h1
                            style="font-size: 20px; line-height: 1.2; font-weight: 600; font-family: Arial, Helvetica, sans-serif; color: #9E6439; margin: 1px 0;">
                            Password Reset OTP</h1>
                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            Dear ${username},</p>
                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            We recently received a request to reset the password for your The Top Player account. To
                            complete this process, please use the following One-Time Password (OTP):
                        </p>
                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            <b>OTP: ${code}</b>
                        </p>
                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            Please enter this OTP on the password reset page to create a new password for your account.
                            If you didn't initiate this request or have any concerns about the security of your account,
                            please contact our support team immediately at ${process.env.SUPPORT_EMAILID} or connect us through Whatsapp at ${process.env.SUPPORT_CONTACT}.
                        </p>
                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            Thank you for helping us maintain the security of your The Top Player account.</p>
                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            Best regards, <br>
                            The Top Player Team</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>
`;
}

function paymentSuccessMail(username, amount, paymentIntentId) {
  return `
    <!DOCTYPE html>
<html>

<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style>
        a[href] {
            color: #9E6439;
        }
    </style>
</head>

<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
    <div style="width:700px; margin: auto; background: #fff;">
        <table id="Table_01" width="700" border="0" cellpadding="0" cellspacing="0" align="center"
            style="background-color: #F8F2ED;background-image: url(https://ux.intersmarthosting.in/Mailers/TopPlayer/images/dElmt-countBg-1.png);background-position: center;background-size: 440px 360px;background-repeat: no-repeat; padding: 60px 20px;">
            <tbody>
                <tr>
                    <td style="padding: 30px 60px;">
                        <a href="#!" style="display: block; width: 200px;">
                            <img src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/logo.png" width="200"
                                height="60" alt="logo">
                        </a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 30px 60px;">
                        <h1
                            style="font-size: 24px; line-height: 1; font-weight: 600; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 10px 0;">
                            The Top Player</h1>
                        <h1
                            style="font-size: 20px; line-height: 1.2; font-weight: 600; font-family: Arial, Helvetica, sans-serif; color: #9E6439; margin: 1px 0;">
                            Payment Success</h1>
                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            Dear ${username},</p>
                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            We are thrilled to inform you that your recent payment was successful! Thank you for choosing our services.</p>
                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            <strong>Payment Details:</strong></p>
                        <ul style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 10px 0; padding-left: 20px;">
                            <li>Amount: ${amount}AED</li>
                            <li>Reference Number: ${paymentIntentId}</li>
                        </ul>
                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            Your support is invaluable to us, and we appreciate your trust in our platform. If you have any questions or concerns, feel free to reach out to our customer support team at at ${process.env.SUPPORT_EMAILID} or connect us through Whatsapp at ${process.env.SUPPORT_CONTACT}</p>
                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            Thank you for choosing TheTopPlayer.</p>
                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            Best regards,<br>
                            The Top Player Team</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>
    `;
}

function EnquiryMail(user, message, mail) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style>
      a[href] {
        color: #9E6439;
      }
    </style>
  </head>
  <body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
    <div style="width:700px; margin: auto; background: #fff;">
      <table id="Table_01" width="700" border="0" cellpadding="0" cellspacing="0" align="center" style="background-color: #F8F2ED;background-image: url(https://ux.intersmarthosting.in/Mailers/TopPlayer/images/dElmt-countBg-1.png);background-position: center;background-size: 440px 360px;background-repeat: no-repeat; padding: 60px 20px;">
        <tbody>
          <tr>
            <td style="padding: 30px 60px;">
              <a href="#!" style="display: block; width: 200px;">
                <img src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/logo.png" width="200" height="60" alt="logo">
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 60px;">
              <h1 style="font-size: 24px; line-height: 1; font-weight: 600; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 10px 0;">
                The Top Player</h1>
              <h1 style="font-size: 20px; line-height: 1.2; font-weight: 600; font-family: Arial, Helvetica, sans-serif; color: #9E6439; margin: 1px 0;">
                Enquiry details from - ${user}</h1>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                <b>User</b>: ${user}
              </p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
              <b>Mail</b>: ${mail}
              </p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
              <b>Message</b>: ${message}
              </p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                Best regards,<br>
                The Top Player Team
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
  </html>`;
}

function TrendingNewsMail(newsTitle, newsContent, newsImageUrl) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>New Trending News on The Top Player</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 700px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
      }
      .header {
        background-color: #3a3f44;
        color: #ffffff;
        text-align: center;
        padding: 20px 0;
      }
      .header img {
        width: 150px;
      }
      .content {
        padding: 20px 40px;
      }
      .content h1 {
        font-size: 24px;
        color: #333333;
        margin-bottom: 10px;
      }
      .content h2 {
        font-size: 20px;
        color: #9E6439;
        margin-bottom: 20px;
      }
      .content p {
        font-size: 15px;
        color: #555555;
        line-height: 1.6;
        margin-bottom: 20px;
      }
      .news-image {
        text-align: center;
        margin: 20px 0;
      }
      .news-image img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
      }
      .button {
        display: inline-block;
        background-color: #9E6439;
        color: #ffffff;
        padding: 12px 25px;
        font-size: 16px;
        font-weight: bold;
        text-decoration: none;
        border-radius: 4px;
        margin: 20px 0;
        text-align: center;
      }
      .footer {
        text-align: center;
        font-size: 13px;
        color: #777777;
        padding: 20px;
        background-color: #f4f4f4;
        border-top: 1px solid #eeeeee;
      }
      .footer a {
        color: #9E6439;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <a href="#!">
          <img src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/logo.png" alt="The Top Player Logo">
        </a>
      </div>
      <div class="content">
        <h1>Trending News Alert!</h1>
        <h2>${newsTitle}</h2>
        <p>A new trending article has just been added to The Top Player! Check out the latest updates below.</p>
        <div class="news-image">
          <img src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/logo.png" alt="Trending News Image">
        </div>
        <p>${newsContent}</p>
        <a href="#!" class="button" target="_blank">Read More on Our Site</a>
      </div>
      <div class="footer">
        <p>Best regards,<br>The Top Player Team</p>
        <p>If you have any questions, feel free to <a href="mailto:${process.env.SUPPORT_EMAILID}">contact us</a>.</p>
      </div>
    </div>
  </body>
  </html>`;
}

function ReminderMail(username) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ready to play like a pro?</title>
    <style>
      a[href] {
        color: white !important;
        text-decoration: none;
      }
      /* Button Style */
      .button {
        background-color: #c7a27d;
        color: white;
        padding: 12px 25px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: 600;
        display: inline-block;
      }
      /* RTL for Arabic */
      .rtl {
        direction: rtl;
        text-align: right;
      }
      /* Responsive Design */
      @media screen and (max-width: 600px) {
        .container {
          width: 100% !important;
        }
        .button {
          width: 100% !important;
          text-align: center;
        }
      }
    </style>
  </head>
  <body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
    <div style="width:700px; margin: auto; background: #fff;">
      <table id="Table_01" width="700" border="0" cellpadding="0" cellspacing="0" align="center" style="background-color: #F8F2ED; background-image: url("https://ux.intersmarthosting.in/Mailers/TopPlayer/images/logo.png"); background-position: center; background-size: 440px 360px; background-repeat: no-repeat; padding: 60px 20px;">
        <tbody>
          <tr>
            <td style="padding: 30px 60px;">
              <a href="#!" style="display: block; width: 200px;">
                <img src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/logo.png" width="200" height="60" alt="logo">
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 60px;">
              <h1 style="font-size: 24px; line-height: 1; font-weight: 600; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 10px 0;">The Top Player</h1>
              <h1 style="font-size: 20px; line-height: 1.2; font-weight: 600; font-family: Arial, Helvetica, sans-serif; color: #9E6439; margin: 1px 0;">Ready to play like a pro?</h1>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                Hey Champion!</p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                We noticed you’re part of The Top Player community – that’s an incredible start! Now it’s time to take things up a notch and unlock your full potential.
              </p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                Whether you’re aiming to master your skills, elevate your fitness, or just play with unstoppable confidence, we have the perfect program to help you reach your goals.
              </p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                Don’t wait – your journey to greatness starts now. Got questions? We’re here to support you every step of the way!
              </p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                Let’s kick things off!
              </p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                <a href=${process.env.HOST_CLIENT} rel="noopener noreferrer" target="_blank" class="button">Let’s Get Started!</a>
              </p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                Best regards,<br>
                The Top Player Team
              </p>
            </td>
          </tr>

          <!-- Arabic Version -->
          <tr>
            <td style="padding: 30px 60px;" class="rtl">
              <h1 style="font-size: 20px; line-height: 1.2; font-weight: 600; font-family: Arial, Helvetica, sans-serif; color: #9E6439; margin: 1px 0;">هلا بالبطل!</h1>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                شفنا إنك صرت جزء من عائلة The Top Player – هذي البداية القوية! الحين جاء وقت الجدّ وترفع مستواك وتوصل لأقصى طاقاتك.
              </p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                إذا حاب تتقن مهاراتك، تزيد لياقتك، أو تلعب بثقة ما تهتز، عندنا البرنامج اللي يناسبك ويوصلك لهدفك.
              </p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                لا تفوّت الفرصة – رحلتك للنجاح تبدأ الحين. عندك أي سؤال؟ إحنا معك في كل خطوة!
              </p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                وش تنتظر ؟ يلا نبدأ المشوار!
              </p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                <a href=${process.env.HOST_CLIENT} rel="noopener noreferrer" target="_blank" class="button">يلا نبدأ!</a>
              </p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                مع أطيب التحيات،<br>
                فريق "The Top Player"
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
  </html>`;
}


module.exports = { WelcomeMail, resendMail, passwordResetMail, EnquiryMail, paymentSuccessMail, TrendingNewsMail,ReminderMail };
