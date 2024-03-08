const CatchAsync = require('../errors/catchAsync');
const { HttpStatusCode } = require('../enums/httpHeaders');
// const ErrorHandler = require('../utils/errorHandler');
// const Business = require('../models/Business');
const axios = require('axios');
const ErrorHandler = require('../../ticket_Service/utils/errorHandler');


// Profile Information
exports.ticketing_Business_New_Hall_Ticket = CatchAsync(async (req, res, next) => {

    // Variable declaration
    let responseData = {
        data: undefined,
        err: undefined
    };
 const config = {
    withCredentials: true,
    headers: {
      'Access-Control-Allow-Credentials': true,
    },
  };
    //   3/api/v1
      console.log(req.cookies)
    const ticket_Service_Response = await axios.post('http://localhost:5000/ticket/crt/new/hall/ticket', req.body, config)
        .catch((err) => responseData.err = err.response)

    if (responseData.err) {
        return next(new ErrorHandler(responseData.err.data.message, responseData.err.status));
    }

    // Sending response
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Hall tickets',
    })
})