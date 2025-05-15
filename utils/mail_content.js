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

function TrendingNewsMail(newsId, newsTitle, newsTitleAr, newsContent, newsContentAr, newsImageUrl) {
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
        align="center"
        cellpadding="0"
        cellspacing="0"
        style="
          width: 700px;
          background-color: #f8f2ed;
          background-image: url(https://ux.intersmarthosting.in/Mailers/TopPlayer/images/dElmt-countBg-1.png);
          background-position: top center;
          background-size: 440px 360px;
          background-repeat: no-repeat;
          padding: 0;
          display: table;
        "
      >
        <tbody>
          <tr>
            <td style="padding: 40px 20px 30px 20px" colspan="2">
              <p style="text-align: center">
                <a href=${process.env.CLIENT_HOST} style="display: block; width: 200px; margin: auto">
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
            <td width="50%" style="width: 50%;padding: 0 10px 0 40px" >
              <p style="margin: 0">
                <a href=${process.env.CLIENT_HOST} style="width: 300px; height: auto;display: block;" target="_blank" rel="noopener noreferrer">
                  <img
                    src=${process.env.HOST}/newsCoverImages/${newsImageUrl}
                    width="300"
                    style="width: 300px;height: auto; display: block;"
                    loading="lazy"
                    alt="news"
                  />
                </a>
              </p>
            </td>
            <td  width="50%" style="width: 50%;padding: 0 40px 0 10px">
              <h1
                style="
                  font-size: 26px;
                  line-height: normal;
                  font-weight: 700;
                  text-align: right;
                  font-family: Arial, Helvetica, sans-serif;
                  color: #000;
                  margin: 0 0 15px 0;
                "
              >
              ${newsTitleAr}
              </h1>
              <p
                style="
                  font-size: 16px;
                  line-height: 1.4;
                  font-weight: 400;
                  font-family: Arial, Helvetica, sans-serif;
                  color: #000;
                  text-align: right;
                  margin: 0 0 15px 0;
                "
              >
              ${newsContentAr}
             </p>
             <p style="margin: 10px 0;text-align:right;">
                <a href=${process.env.CLIENT_HOST}en/news/${newsId} target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/n-btn.png"
                    width="160"
                    height="45"
                    loading="lazy"
                    alt="enquiry"
                  />
                </a>
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 40px 40px 0;">
              <h1
                  style="
                    font-size: 26px;
                    line-height: normal;
                    font-weight: 700;
                    text-align: center;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #000;
                    margin: 0 0 15px 0;
                  "
                >
               ${newsTitle}
                </h1>
                <p
                  style="
                    font-size: 16px;
                    line-height: 1.4;
                    font-weight: 400;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #000;
                    text-align: center;
                    margin: 0 0 15px 0;
                  "
                >
                ${newsContent}
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 40px 40px;">
              <p style="margin: 0">
                <img
                  src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/n-ft-img-tle.png"
                  loading="lazy"
                  alt="tle"
                  width="100%"
                  style="width: 100%;height: auto;display: block;"
                />
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 0;">
              <table border="0" width="100%" cellpadding="0" cellspacing="0" style="width: 100%;padding: 0 ;display: table;">
                <tr>
                  <td style="padding: 0 10px 60px 40px;">
                    <p style="margin: 0">
                      <a
                        href=${process.env.CLIENT_HOST}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/nn-ft-img-1.png"
                          loading="lazy"
                          alt="ft-img"
                          width="184"
                          style="width: 100%;height: auto;display: block;"
                        />
                      </a>
                    </p>
                  </td>
                  <td style="padding: 0 10px 60px;">
                    <p style="margin: 0">
                      <a
                        href=${process.env.CLIENT_HOST}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/nn-ft-img-2.png"
                          loading="lazy"
                          alt="ft-img"
                          width="184"
                          style="width: 100%;height: auto;display: block;"
                        />
                      </a>
                    </p>
                  </td>
                  <td style="padding: 0 40px 60px 10px;">
                    <p style="margin: 0">
                      <a
                        href=${process.env.CLIENT_HOST}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/nn-ft-img-3.png"
                          loading="lazy"
                          alt="ft-img"
                          width="184"
                          style="width: 100%;height: auto;display: block;"
                        />
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <table border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="width: 100%;display: table;background-color: #262626;">
                <tr>
                  <td width="20%" style="width: 20%; padding: 20px 15px 20px 40px;">
                    <p style="margin: 0">
                      <a
                        href="#!"
                        style="display: block; margin: auto"
                      >
                        <img
                          src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/n-logo-w.png"
                          alt="logo"
                          style="width: 160px;height: auto;display: block;"
                        />
                      </a>
                    </p>
                  </td>
                  <td width="50%" style="width: 50%;padding: 20px 15px;">
                    <p
                      style="
                        font-size: 12px;
                        line-height: normal;
                        font-weight: 600;
                        font-family: Arial, Helvetica, sans-serif;
                        color: #fff;
                        text-align: left;
                        margin: 0 0 5px 0;
                      "
                    >
                      Payment
                    </p>
                    <p>
                      <a
                        href="http://"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/n-ft-pay.png"
                          style="width: 100%;height: auto;display: block;"
                          loading="lazy"
                          alt="social"
                        />
                      </a>
                    </p>
                  </td>
                  <td  width="30%" style="width: 30%;padding: 20px 40px 20px 15px;">
                    <p
                      style="
                        font-size: 12px;
                        line-height: normal;
                        font-weight: 600;
                        font-family: Arial, Helvetica, sans-serif;
                        color: #fff;
                        text-align: left;
                        margin: 0 0 5px 0;
                      "
                    >
                      Social Media
                    </p>
                    <p>
                      <a
                        href="https://www.snapchat.com/add/thetop.player"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="width:13px;margin-right: 10px;display: inline-block;text-decoration: none;"
                      >
                        <img
                          src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/n-ft-social-1.png"
                          width="13"
                          height="13"
                          loading="lazy"
                          alt="social"
                          style="display: inline-block;"
                        />
                      </a>
                      <a
                        href="https://www.tiktok.com/@thetop.player?_t=8i0wA2PQnHc&_r=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="width:13px;margin-right: 10px;display: inline-block;text-decoration: none;"
                      >
                        <img
                          src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/n-ft-social-2.png"
                          width="13"
                          height="13"
                          loading="lazy"
                          alt="social"
                          style="display: inline-block;"
                        />
                      </a>
                      <a
                        href="https://api.whatsapp.com/send/?phone=971501225632&text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%2C+%D8%B9%D9%86%D8%AF%D9%8A+%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1+%D8%A8%D8%AE%D8%B5%D9%88%D8%B5&type=phone_number&app_absent=0"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="width:13px;margin-right: 10px;display: inline-block;text-decoration: none;"
                      >
                        <img
                          src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/n-ft-social-3.png"
                          width="13"
                          height="13"
                          loading="lazy"
                          alt="social"
                          style="display: inline-block;"
                        />
                      </a>
                      <a
                        href="https://www.instagram.com/thetop.player/?igshid=OGQ5ZDc2ODk2ZA%3D%3D"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="width:13px;margin-right: 10px;display: inline-block;text-decoration: none;"
                      >
                        <img
                          src="https://ux.intersmarthosting.in/Mailers/TopPlayer/images/n-ft-social-4.png"
                          width="13"
                          height="13"
                          loading="lazy"
                          alt="social"
                          style="display: inline-block;"
                        />
                      </a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 10px 0; border-top: 1px solid #646464;">
                    <p
                      style="
                        font-size: 12px;
                        line-height: normal;
                        font-weight: 400;
                        font-family: Arial, Helvetica, sans-serif;
                        color: #f0f0f0;
                        text-align: center;
                        margin: 0;
                      "
                    >
                    Copyright © 2024 - The Top Player.   All rights reserved
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>

  `;
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

function passwordResetMailInfluencer(username, password) {
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
                                height="60">
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
                            Password Reset</h1>
                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            Dear ${username},</p>
                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            We recently received a request to reset the password for your The Top Player account for influencers.Please use the following as the new password:
                        </p>
                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            <b>Password: ${password}</b>
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

function welcomeMailInfluencer(username, email, password) {
  return `
<!DOCTYPE html>
<html>

<head>
    <title>Welcome to The Top Player</title>
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
                            Welcome to The Top Player!</h1>
                        <h1
                            style="font-size: 20px; line-height: 1.2; font-weight: 600; font-family: Arial, Helvetica, sans-serif; color: #9E6439; margin: 1px 0;">
                            Influencer Account Created</h1>
                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            Dear ${username},</p>
                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            We're excited to welcome you onboard as an influencer with <strong>The Top Player</strong>!
                            Your account has been successfully created and you're now part of our exclusive network of collaborators.
                        </p>
                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            You can log in to your account using the following credentials:
                        </p>
                          <table style="font-size: 15px; font-family: Arial, Helvetica, sans-serif; color: #000; border-collapse: collapse; margin-bottom: 25px;">
            <tr>
                <td style="padding: 8px 12px; font-weight: bold;">Email:</td>
                <td style="padding: 8px 12px;">${email}</td>
            </tr>
            <tr>
                <td style="padding: 8px 12px; font-weight: bold;">Password:</td>
                <td style="padding: 8px 12px;">${password}</td>
            </tr>
        </table>
                       <p
    style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
    Please login at <a href="https://thetopplayer-a2551.web.app/" target="_blank">https://thetopplayer-a2551.web.app/</a>. 
    If you have any questions or need assistance, feel free to reach out to us at 
    <a href="mailto:${process.env.SUPPORT_EMAILID}">${process.env.SUPPORT_EMAILID}</a> or contact us on WhatsApp at ${process.env.SUPPORT_CONTACT}.
</p>

                        <p
                            style="font-size: 15px; line-height: 1.4; font-weight: 400; font-family: Arial, Helvetica, sans-serif; color: #000; margin: 25px 0;">
                            We're looking forward to a great journey together. Let's make something amazing!
                        </p>
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

module.exports = {
  WelcomeMail,
  resendMail,
  passwordResetMail,
  EnquiryMail,
  paymentSuccessMail,
  TrendingNewsMail,
  ReminderMail,
  passwordResetMailInfluencer,
  welcomeMailInfluencer,
};
