const CatchAsync = require('../errors/catchAsync');
const ErrorHandler = require('../utils/errorHandler');
const { HttpStatusCode } = require('../enums/httpHeaders');
const authToken = require('../utils/authToken');
const Users = require('../models/Users');


// Sign Up
exports.ticketing_User_Sign_Up = CatchAsync(async (req, res, next) => {

    // Checking for All Details
    if (!req.body.firstName || !req.body.lastName || !req.body.username || !req.body.email || !req.body.password) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
            success: false,
            message: `Please provide all details!`
        })
    }

    // Checking if user exist
    const isUser = await Users.findOne({ $or: [{ email: req.body.email }, { userName: req.body.username }] })
    if (isUser) {
        return res.status(HttpStatusCode.CONFLICT).json({
            success: false,
            message: `User already exist either by user name or email!`
        })
    }

    // Saving Details
    const user = await Users.create({
        firstName: req.body.firstName.toLowerCase(),
        lastName: req.body.lastName.toLowerCase(),
        username: req.body.username.trim(' ').split(" ").join("").toLowerCase(),
        email: req.body.email.toLowerCase(),
        password: req.body.password,
        isActive: true
    });

    // Setting Token
    await authToken.sendToken(res, user);

    // Sending Response
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'User Registration Successful!'
    })
})

//  Log In 
exports.ticketing_User_Sign_In = CatchAsync(async (req, res, next) => {
    // Destructuring request body
    const { password } = req.body;
    if (!password || typeof password !== "string" || (!req.body.username && !req.body.email)) {
        return next(new ErrorHandler(`Please provide credentials!`, HttpStatusCode.NOT_ACCEPTABLE));
    }
    if ((!req.body.username && typeof req.body.email !== "string") || (typeof req.body.username !== "string" && !req.body.email)) {
        return next(new ErrorHandler(`Please provide appropriate credentials!`, HttpStatusCode.NOT_ACCEPTABLE));
    }

    let user;
    if (req.body.username) {
        // Checking if user exist
        user = await Users.findOne({ username: req.body.username }).select("+password")
        // Checking password are same or not
        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new ErrorHandler("Invalid email or password", HttpStatusCode.UNAUTHORIZED));
        }
    } else if (req.body.email) {
        // Checking if user exist
        user = await Users.findOne({ email: req.body.email }).select("+password")

        // Checking password are same or not
        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new ErrorHandler("Invalid email or password", HttpStatusCode.UNAUTHORIZED));
        }
    }

    // Setting cookie and sending response
    await authToken.sendToken(res, user);

    // Sending response
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Login Successful!'
    })
})

// Sign Out
exports.ticketing_User_Sign_Out = CatchAsync(async (req, res, next) => {
    //  Setting null value for header authorization and cookie
    res.removeHeader("Authorization");
    res.cookie("ticketingUser", null, {
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
exports.ticketing_User_Password_Update = CatchAsync(async (req, res, next) => {
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Password Updated Successfully'
    })
})

// Forgot Password
exports.ticketing_User_Forgot_Password = CatchAsync(async (req, res, next) => {
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Reset Email Sent Successfully!'
    })
})

// Reset Password
exports.ticketing_User_Reset_Password = CatchAsync(async (req, res, next) => {
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Account Recovery Successfully!'
    })
})
