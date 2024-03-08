const CatchAsync = require('../errors/catchAsync');
const { HttpStatusCode } = require('../enums/httpHeaders');
const axios = require('axios');
const ErrorHandler = require('../../ticket_Service/utils/errorHandler');

exports.ticketing_Business_New_Hall_Ticket = CatchAsync(async (req, res, next) => {

  // Variable declaration
  let responseData = {
    statusCode: undefined,
    msgData: undefined,
    err: undefined
  };

  const cookies = req.cookies

  // Convert the cookies object to a string
  const cookieString = Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');

  // Create a configuration object with the headers containing the cookie
  const config = {
    headers: {
      'Cookie': cookieString, // Set the Cookie header with the concatenated string
      'Access-Control-Allow-Credentials': true // Optionally, allow credentials
    }
  };

  // Your POST data
  const postData = {
    hallName: "jfevbje",
    showName: "jfevbje",
    description: "jfevbje",
    startDate: "jfevbje",
    startTime: "jfevbje",
    endDate: "jfevbje",
    endTime: "jfevbje",
    tickets: "jfevbje",
    address: "jfevbje",
    city: "jfevbje",
    state: "jfevbje",
    country: "jfevbje",
    zipCode: "jfevbje",
    coordinates: "jfevbje"
  };
  // Make a POST request with the configured headers
  await axios.post('http://localhost:5000/ticket/crt/new/hall/ticket', req.body, config)
  .then((data)=>{
    responseData.statusCode = data.status; responseData.msgData = data.data;
  })
  .catch((err)=>{
    responseData.statusCode = err.response.status; 
    responseData.msgData = err.response.data;
  })

  // Sending Response
  res.status(responseData.statusCode).json(responseData.msgData)
});
