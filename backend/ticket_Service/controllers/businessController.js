const CatchAsync = require('../errors/catchAsync');
const { HttpStatusCode } = require('../enums/httpHeaders');

const HallTickets = require('../models/HallTickets');
const EventPass = require('../models/EventPass');

const ErrorHandler = require('../utils/errorHandler');

// Hall Tickets
// Event Passes

function convertStringToDateTime(timeString) {
    try {
        // Extract hour, minute, and meridian (AM or PM)
        const [hour, minute, meridian] = timeString.split(':');
        const parsedHour = parseInt(hour, 10);
        const parsedMinute = parseInt(minute, 10);

        if (isNaN(parsedHour) || isNaN(parsedMinute)) {
            throw new Error("Invalid time format. Please use HH:MM[AM|PM].");
        }

        // Adjust hour for 12-hour format
        let adjustedHour = parsedHour;
        if (meridian === 'PM' && adjustedHour !== 12) {
            adjustedHour += 12;
        } else if (meridian === 'AM' && adjustedHour === 12) {
            adjustedHour = 0;
        }
        let currentTime = new Date();
        let currentYear = currentTime.getFullYear();
        let currentMonth = currentTime.getMonth();
        let currentDate = currentTime.getDate();

        // Create a JavaScript Date object
        return new Date(currentYear, currentMonth, currentDate, adjustedHour, parsedMinute); // Replace with actual date if needed
    } catch (error) {
        throw error; // Re-throw the error for handling in the calling code
    }
}

exports.Ticketing_Business_New_Hall_Tickets_Upload = CatchAsync(async (req, res, next) => {

    if(!req.user || req.user && req.user.role !== 'business'){
        return next(new ErrorHandler(`Unauthorized access`, HttpStatusCode.UNAUTHORIZED))
    } 

    // Destructuring request body and checking if it has the right content type
    const { hallName, showName, description, startDate, startTime, endDate, endTime, tickets, address, city, state, country, zipCode, coordinates } = req.body;
    if (!hallName || !showName || !description || !startDate || !startTime || !endDate || !endTime || !tickets || !address || !city || !state || !country || !zipCode || !coordinates || !coordinates[0] || !coordinates[1]) {
        return next(new ErrorHandler(`Please provide all required fields`, HttpStatusCode.BAD_REQUEST));
    }

    // Verifying details of ticket and restructuring
    if(!Array.isArray(tickets)) return next(new ErrorHandler(`Please provide all required fields`, HttpStatusCode.BAD_REQUEST));
    let verifiedTicket = []
    for (let i = 0; i < tickets.length; i++) {
        if (!tickets[i].ticketType || !tickets[i].price || !tickets[i].quantityAvailable) {
            return next(new ErrorHandler(`Please provide ticket details in correct format!`, HttpStatusCode.BAD_REQUEST))
        }
        else {
            let temp = {
                ticketType: tickets[i].ticketType,
                price: tickets[i].price,
                currency: tickets[i].currency ? tickets[i].currency : 'INR',
                quantityAvailable: tickets[i].quantityAvailable
            }
            verifiedTicket.push(temp)
        }
    }

    let formatStartTime = convertStringToDateTime(req.body.startTime);
    let formatEndTime = convertStringToDateTime(req.body.endTime);

    // Saving Ticket Information
    await HallTickets.create({
        business: req.user.id,
        showName: req.body.showName.toLowerCase(),
        hallName: req.body.hallName.toLowerCase(),
        description: req.body.description,
        startDate: req.body.startDate,
        startTime: formatStartTime,
        endDate: req.body.endDate,
        endTime: formatEndTime,
        tickets: verifiedTicket,
        address: req.body.address.toLowerCase(),
        city: req.body.city.toLowerCase(),
        state: req.body.state,
        country: req.body.country.toLowerCase(),
        zipCode: parseInt(req.body.zipCode),
        location: {
            type: 'Point',
            coordinates: [parseInt(req.body.coordinates[0]), parseInt(req.body.coordinates[1])]
        }
    }).catch((err)=>console.log(err))

    // Resetting Request Header
    req.user = undefined;

    // Sending Response
    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: 'Hall Tickets Uploaded Successfully!'
    })
})

exports.Ticketing_Business_All_Hall_Tickets_List = CatchAsync(async (req, res, next) => {

    // Sending Response
    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: 'Hall Tickets Uploaded Successfully!'
    })
})

exports.Ticketing_Business_Single_Hall_Tickets_List = CatchAsync(async (req, res, next) => {

    // Sending Response
    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: 'Hall Tickets Uploaded Successfully!'
    })
})

exports.Ticketing_Business_New_Event_Passes_Upload = CatchAsync(async (req, res, next) => {

    // Destructuring request body and checking if it has the right content type
    const { organizer, venue, showName, description, startDate, startTime, endDate, endTime, eventPass, address, city, state, country, zipCode, coordinates } = req.body;
    if (!organizer || !venue || !showName || !description || !startDate || !startTime || !endDate || !endTime || !eventPass || !address || !city || !state || !country || !zipCode || !coordinates || !coordinates[0] || !coordinates[1]) {
        return next(new ErrorHandler(`Please provide all required fields`, HttpStatusCode.BAD_GATEWAY))
    }

    // Verifying details of ticket and restructuring
    let verifiedEventPass = []
    for (let i = 0; i < eventPass.length; i++) {
        if (!eventPass[i].ticketType || !eventPass[i].price || !eventPass[i].quantityAvailable) {
            return next(new ErrorHandler(`Please provide all required fields`, HttpStatusCode.BAD_GATEWAY))
        }
        else {
            let temp = {
                passType: eventPass[i].ticketType,
                price: eventPass[i].price,
                currency: eventPass[i].currency ? tickets[i].currency : 'INR',
                quantityAvailable: eventPass[i].quantityAvailable
            }
            verifiedEventPass.push(temp)
        }
    }

    let formatStartTime = convertStringToDateTime(req.body.startTime);
    let formatEndTime = convertStringToDateTime(req.body.endTime);

    // Saving Ticket Information
    await EventPass.create({
        business: req.user.id,
        organizer: req.body.organizer.toLowerCase(),
        venue: req.body.venue.toLowerCase(),
        showName: req.body.showName.toLowerCase(),
        description: req.body.description,
        startDate: req.body.startDate,
        startTime: formatStartTime,
        endDate: req.body.endDate,
        endTime: formatEndTime,
        eventPass: verifiedEventPass,
        address: req.body.address.toLowerCase(),
        city: req.body.city.toLowerCase(),
        country: req.body.country.toLowerCase(),
        zipCode: parseInt(req.body.zipCode),
        location: {
            type: 'Point',
            coordinates: [parseInt(req.body.coordinates[0]), parseInt(req.body.coordinates[1])]
        }
    })

    // Resetting Request Header
    req.user = undefined;


    // Sending Response
    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: 'Hall Tickets Uploaded Successfully!'
    })
})

exports.Ticketing_Business_All_Events_Passes_Lists = CatchAsync(async (req, res, next) => {

    // Sending Response
    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: 'Hall Tickets Uploaded Successfully!'
    })
})

exports.Ticketing_Business_Single_Event_Passes_Tickets = CatchAsync(async (req, res, next) => {

    // Sending Response
    res.status(HttpStatusCode.CREATED).json({
        success: true,
        message: 'Hall Tickets Uploaded Successfully!'
    })
})