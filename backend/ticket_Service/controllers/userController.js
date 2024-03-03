const CatchAsync = require('../errors/catchAsync');
const { HttpStatusCode } = require('../enums/httpHeaders');

// Hall Tickets
// Event Passes

exports.Ticketing_Users_All_Hall_Tickets_List = CatchAsync(async(req, res, next)=>{

    // Sending Response
    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: 'Hall Tickets Uploaded Successfully!'
    })
})

exports.Ticketing_Users_Single_Hall_Tickets_List = CatchAsync(async(req, res, next)=>{

    // Sending Response
    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: 'Hall Tickets Uploaded Successfully!'
    })
})

exports.Ticketing_Users_All_Events_Passes_Lists = CatchAsync(async(req, res, next)=>{

    // Sending Response
    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: 'Hall Tickets Uploaded Successfully!'
    })
})

exports.Ticketing_Users_Single_Event_Passes_Tickets = CatchAsync(async(req, res, next)=>{

    // Sending Response
    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: 'Hall Tickets Uploaded Successfully!'
    })
})