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

module.exports = { WelcomeMail, resendMail, passwordResetMail, EnquiryMail, paymentSuccessMail };
