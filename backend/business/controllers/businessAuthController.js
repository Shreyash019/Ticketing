const CatchAsync = require('../errors/catchAsync');
const ErrorHandler = require('../utils/errorHandler');
const { HttpStatusCode } = require('../enums/httpHeaders');
const authToken = require('../utils/authToken');
const Business = require('../models/Business');


// Sign Up
exports.ticketing_Business_Sign_Up = CatchAsync(async (req, res, next) => {

    // Checking for All Details
    if (!req.body.registrationID || !req.body.username || !req.body.email || !req.body.password) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
            success: false,
            message: `Please provide all details!`
        })
    }

    // Checking if Business exist
    const isBusiness = await Business.findOne({ $or: [{ email: req.body.email }, { userName: req.body.username }] })
    if (isBusiness) {
        return res.status(HttpStatusCode.CONFLICT).json({
            success: false,
            message: `User already exist either by user name or email!`
        })
    }

    // Saving Details
    const business = await Business.create({
        registrationID: req.body.registrationID.toUpperCase(),
        username: req.body.username.trim(' ').split(" ").join("").toLowerCase(),
        email: req.body.email.toLowerCase(),
        password: req.body.password,
        isActive: true
    });

    // Setting Token
    await authToken.sendToken(res, business);

    // Sending Response
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Business Registration Successful!'
    })
})

//  Log In 
exports.ticketing_Business_Sign_In = CatchAsync(async (req, res, next) => {
    // Destructuring request body
    const { password } = req.body;
    if (!password || typeof password !== "string" || (!req.body.username && !req.body.email)) {
        return next(new ErrorHandler(`Please provide credentials!`, HttpStatusCode.NOT_ACCEPTABLE));
    }
    if ((!req.body.username && typeof req.body.email !== "string") || (typeof req.body.username !== "string" && !req.body.email)) {
        return next(new ErrorHandler(`Please provide appropriate credentials!`, HttpStatusCode.NOT_ACCEPTABLE));
    }

    let business;
    if (req.body.username) {
        // Checking if user exist
        business = await Business.findOne({ username: req.body.username }).select("+password")
        // Checking password are same or not
        if (!business || !(await user.correctPassword(password, business.password))) {
            return next(new ErrorHandler("Invalid email or password", HttpStatusCode.UNAUTHORIZED));
        }
    } else if (req.body.email) {
        // Checking if user exist
        business = await Business.findOne({ email: req.body.email }).select("+password")

        // Checking password are same or not
        if (!business || !(await business.correctPassword(password, business.password))) {
            return next(new ErrorHandler("Invalid email or password", HttpStatusCode.UNAUTHORIZED));
        }
    }

    // Setting cookie and sending response
    await authToken.sendToken(res, business);

    // Sending response
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Login Successful!'
    })
})

// Sign Out
exports.ticketing_Business_Sign_Out = CatchAsync(async (req, res, next) => {
    //  Setting null value for header authorization and cookie
    res.removeHeader("Authorization");
    res.cookie("ticketingBusiness", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    // Sending response
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: "You are logged out.",
    });
})

// Password Change
exports.ticketing_Business_Password_Update = CatchAsync(async (req, res, next) => {

    // Sending response
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Password Updated Successfully'
    })
})

// Forgot Password
exports.ticketing_Business_Forgot_Password = CatchAsync(async (req, res, next) => {
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Reset Email Sent Successfully!'
    })
})

// Reset Password
exports.ticketing_Business_Reset_Password = CatchAsync(async (req, res, next) => {
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Account Recovery Successfully!'
    })
})
