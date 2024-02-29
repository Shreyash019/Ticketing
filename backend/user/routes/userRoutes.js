const express = require("express");
const router = express.Router();
const authenticationController = require('../controllers/userAuthController');
const profileController = require('../controllers/userProfileController');

router.route('/sign/up').get(authenticationController.ticketing_User_Sign_Up);
router.route('/verification').put(authenticationController.ticketing_User_Registration_Verification);
router.route('/resend/otp').put(authenticationController.ticketing_User_Resend_Registration_OTP);
router.route('/sign/in').post(authenticationController.ticketing_User_Sign_In);
router.route('/sign/out').put(authenticationController.ticketing_User_Sign_Out);
router.route('/password/update').put(authenticationController.ticketing_User_Password_Update);
router.route('/forgot/password').post(authenticationController.ticketing_User_Forgot_Password);
router.route('/reset/password').put(authenticationController.ticketing_User_Reset_Password);

router.route('/profile')
    .get(profileController.ticketing_User_Profile_Information)
    .put(profileController.ticketing_User_Profile_Information_Update);

router.route('/address')
    .get(profileController.ticketing_User_Address_Information)
    .put(profileController.ticketing_User_Address_Update);

router.route('/location').post(profileController.ticketing_User_Location_Update);
router.route('/profile/image').put(profileController.ticketing_User_Profile_Image_Update);
router.route('/account/disable').put(profileController.ticketing_User_Account_Disable);
router.route('/account/delete').post(profileController.ticketing_User_Account_Delete);

module.exports = router;
