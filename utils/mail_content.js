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
    <title>Top Player</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style>
      a[href] {
        color: #9e6439;
      }
    </style>
  </head>

  <body
    bgcolor="#FFFFFF"
    leftmargin="0"
    topmargin="0"
    marginwidth="0"
    marginheight="0"
  >
    <div style="width: 700px; margin: auto; background: #fff">
      <table
        id="Table_01"
        width="700"
        border="0"
        cellpadding="0"
        cellspacing="0"
        align="center"
        style="
          background-color: #f8f2ed;
          background-image: url(https://ux.intersmarthosting.in/Mailers/TopPlayer/images/dElmt-countBg-1.png);
          background-position: top center;
          background-size: 440px 360px;
          background-repeat: no-repeat;
          padding: 60px 20px;
        "
      >
        <tbody>
          <tr>
            <td style="padding: 30px 60px" align="center">
                <p style="text-align: center">
              <a href="#!" style="display: block; width: 200px; margin: auto;">
                <img
                  src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/logo.png"
                  width="200"
                  height="60"
                  alt="logo"
                />
              </a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 60px">
              <h1
                style="
                  font-size: 24px;
                  line-height: 1.4;
                  font-weight: 500;
                  text-align: center;
                  font-family: Arial, Helvetica, sans-serif;
                  color: #060606;
                  margin: 10px 0 30px 0;
                "
              >
                ${newsTitle}
              </h1>
              <p style="text-align: center">
                <img
                  src=${process.env.HOST}/newsMobileImages/a-1717088301150-674578850.jpg
                  width="416"
                  height="360"
                  loading="lazy"
                  alt="expiry"
                />
              </p>
              <p
                style="
                  font-size: 15px;
                  line-height: 1.5;
                  font-weight: 400;
                  font-family: Arial, Helvetica, sans-serif;
                  color: #060606;
                  text-align: center;
                  margin: 30px 0;
                "
              >
                ${newsContent}
              </p>
              <p style="text-align: center;margin: 0 0 30px 0;">
                <a href="https://thetopplayer.com" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/expiry-btn.png"
                    width="214"
                    height="73"
                    loading="lazy"
                    alt="expiry"
                  />
                </a>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>`;
}

function ReminderMail() {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ready to play like a pro?</title>
    <style>
     a[href] {
        color: #9e6439;
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
      <table id="Table_01"
        width="700"
        border="0"
        cellpadding="0"
        cellspacing="0"
        align="center"
        style="
          background-color: #f8f2ed;
          background-image: url(https://ux.intersmarthosting.in/Mailers/TopPlayer/images/dElmt-countBg-1.png);
          background-position: top center;
          background-size: 440px 360px;
          background-repeat: no-repeat;
          padding: 60px 20px;
        ">
        <tbody>
          <tr>
            <td style="padding: 30px 60px;">
              <a href="#!" style="display: block; width: 200px;">
                <img src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/logo.png" width="200" height="60" alt="logo">
              </a>
            </td>
          </tr>
           <!-- Arabic Version -->
          <tr>
            <td style="padding: 30px 60px;" class="rtl">
            <h1 style="font-size: 24px; line-height: 1; font-weight: 600; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 10px 0;">The Top Player</h1>
<h1 style="font-size: 20px; line-height: 1.2; font-weight: 600; font-family: Arial, Helvetica, sans-serif; color: #9E6439; margin: 1px 0;">هل أنت مستعد للعب مثل المحترفين؟</h1>

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
                <a href="https://thetopplayer.com" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/expiry-btn.png"
                    width="214"
                    height="73"
                    loading="lazy"
                    alt="expiry"
                  />
              </p>
              <p style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                مع أطيب التحيات،<br>
                فريق "The Top Player"
              </p>
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
                <a href="https://thetopplayer.com" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/expiry-btn.png"
                    width="214"
                    height="73"
                    loading="lazy"
                    alt="expiry"
                  />
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
  </html>
  `;
}

module.exports = { WelcomeMail, resendMail, passwordResetMail, EnquiryMail, paymentSuccessMail, TrendingNewsMail, ReminderMail };
