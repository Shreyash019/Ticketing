const CatchAsync = require('../errors/catchAsync');
const { HttpStatusCode } = require('../enums/httpHeaders');

// Hall Tickets
// Event Passes

exports.Ticketing_Business_New_Hall_Tickets_Upload = CatchAsync(async(req, res, next)=>{

    // Sending Response
    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: 'Hall Tickets Uploaded Successfully!'
    })
})

exports.Ticketing_Business_All_Hall_Tickets_List = CatchAsync(async(req, res, next)=>{

    // Sending Response
    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: 'Hall Tickets Uploaded Successfully!'
    })
})

exports.Ticketing_Business_Single_Hall_Tickets_List = CatchAsync(async(req, res, next)=>{

    // Sending Response
    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: 'Hall Tickets Uploaded Successfully!'
    })
})

exports.Ticketing_Business_New_Event_Passes_Upload = CatchAsync(async(req, res, next)=>{

    // Sending Response
    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: 'Hall Tickets Uploaded Successfully!'
    })
})

exports.Ticketing_Business_All_Events_Passes_Lists = CatchAsync(async(req, res, next)=>{

    // Sending Response
    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: 'Hall Tickets Uploaded Successfully!'
    })
})

exports.Ticketing_Business_Single_Event_Passes_Tickets = CatchAsync(async(req, res, next)=>{

    // Sending Response
    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: 'Hall Tickets Uploaded Successfully!'
    })
})