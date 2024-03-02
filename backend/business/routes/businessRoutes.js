const express = require("express");
const router = express.Router();
const authToken = require('../utils/authToken');
const authenticationController = require('../controllers/businessAuthController');
const profileController = require('../controllers/businessProfileController');

router.route('/sign/up').post(authenticationController.ticketing_Business_Sign_Up);
router.route('/sign/in').post(authenticationController.ticketing_Business_Sign_In);
router.route('/sign/out').get(authenticationController.ticketing_Business_Sign_Out);
router.route('/password/update').put(authToken.isAuthenticated, authToken.userDataClear, authenticationController.ticketing_Business_Password_Update);
router.route('/forgot/password').post(authenticationController.ticketing_Business_Forgot_Password);
router.route('/reset/password').put(authenticationController.ticketing_Business_Reset_Password);

router.route('/profile')
    .get(authToken.isAuthenticated, authToken.isProfileVerified, authToken.userDataClear, profileController.ticketing_Business_Profile_Information)
    .put(authToken.isAuthenticated, authToken.userDataClear, profileController.ticketing_Business_Profile_Information_Update);

router.route('/address')
    .get(authToken.isAuthenticated, authToken.isProfileVerified, authToken.userDataClear, profileController.ticketing_Business_Address_Information)
    .put(authToken.isAuthenticated, authToken.isProfileVerified, authToken.userDataClear, profileController.ticketing_Business_Address_Update);

router.route('/location').post(authToken.isAuthenticated, authToken.isProfileVerified, authToken.userDataClear, authToken.isProfileVerified, profileController.ticketing_Business_Location_Update);
router.route('/profile/image').put(authToken.isAuthenticated, authToken.isProfileVerified, authToken.userDataClear, profileController.ticketing_Business_Profile_Image_Update);
router.route('/account/disable').put(authToken.isAuthenticated, authToken.isProfileVerified, authToken.userDataClear, profileController.ticketing_Business_Account_Disable);
router.route('/account/delete').post(authToken.isAuthenticated, authToken.isProfileVerified, authToken.userDataClear, profileController.ticketing_Business_Account_Delete);

module.exports = router;
