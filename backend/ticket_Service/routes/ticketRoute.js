const express = require('express');
const router = express.Router();
const BusinessController = require('../controllers/businessController');
const UserController = require('../controllers/userController');

router.route('/crt/new/hall/ticket').post(BusinessController.Ticketing_Business_New_Hall_Tickets_Upload);

router.route('/all/hall/ticket').get(BusinessController.Ticketing_Business_All_Hall_Tickets_List);

router.route('/single/hall/ticket').get(BusinessController.Ticketing_Business_Single_Hall_Tickets_List);

router.route('/crt/new/event/pass').post(BusinessController.Ticketing_Business_New_Event_Passes_Upload);

router.route('/all/event/pass').get(BusinessController.Ticketing_Business_All_Events_Passes_Lists);

router.route('/single/event/pass').get(BusinessController.Ticketing_Business_Single_Event_Passes_Tickets);

router.route('/select/hall/ticket').put(UserController.Ticketing_Users_Select_Hall_Ticket);

router.route('/buy/hall/ticket').put(UserController.Ticketing_Users_Buy_Hall_Ticket);

router.route('/select/event/pass').put(UserController.Ticketing_Users_Select_Event_Pass);

router.route('/buy/event/pass').put(UserController.Ticketing_Users_Buy_Event_Pass);



module.exports = router;