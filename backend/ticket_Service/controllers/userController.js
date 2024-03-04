const CatchAsync = require('../errors/catchAsync');
const { HttpStatusCode } = require('../enums/httpHeaders');

const HallTickets = require('../models/HallTickets');
const EventPass = require('../models/EventPass');

// Hall Tickets
// Event Passes

exports.Ticketing_Users_Select_Hall_Ticket = CatchAsync(async(req, res, next)=>{

    // Sending Response
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Tickets are selected!'
    })
})

exports.Ticketing_Users_Buy_Hall_Ticket = CatchAsync(async(req, res, next)=>{

    // Sending Response
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Hall Ticket Booked Successfully!'
    })
})

exports.Ticketing_Users_Select_Event_Pass = CatchAsync(async(req, res, next)=>{

    // Sending Response
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Event Pass are selected!'
    })
})

exports.Ticketing_Users_Buy_Event_Pass = CatchAsync(async(req, res, next)=>{

    // Sending Response
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Event Pass booked successfully!'
    })
})