const express = require('express');

const admnController = require('../controller/admin');
const authMiddleware = require('../middleware/auth')

const router = express.Router();

//rttSnd99&y
router.post('/signup',admnController.signup);
router.post("/auth/verify", admnController.verifyAccFun);
router.post('/login', admnController.login);
router.get('/logout',[authMiddleware.checkUserAuth], admnController.logout);
router.post('/auth/resendverify', admnController.resendVerification )

router.get('/user' ,[authMiddleware.checkUserAuth], admnController.getUserDetails);
router.post('/user' ,[authMiddleware.checkUserAuth], admnController.updateUserDetails);
router.post('/update_password' ,[authMiddleware.checkUserAuth], admnController.resetPassWebsite);

router.post('/forgot_password' , admnController.forgotPass);
router.post('/reset_password_email' , admnController.resetPassEmail);

module.exports = router;