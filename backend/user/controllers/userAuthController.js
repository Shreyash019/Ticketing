const CatchAsync = require('../errors/catchAsync');
const {HttpStatusCode} = require('../enums/httpHeaders');


// Sign Up
exports.ticketing_User_Sign_Up = CatchAsync( async(req, res, next)=>{
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Registration Successful'
    })
})

// Account Verification
exports.ticketing_User_Registration_Verification = CatchAsync( async(req, res, next)=>{
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Verification Successful'
    })
})

// Resend OTP
exports.ticketing_User_Resend_Registration_OTP = CatchAsync( async(req, res, next)=>{
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'OTP Sent Successfully!'
    })
})


//  Log In 
exports.ticketing_User_Sign_In = CatchAsync( async(req, res, next)=>{
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Login Successful!'
    })
})

// Sign Out
exports.ticketing_User_Sign_Out = CatchAsync( async(req, res, next)=>{
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Logout Successful!'
    })
})

// Password Change
exports.ticketing_User_Password_Update = CatchAsync( async(req, res, next)=>{
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Password Updated Successfully'
    })
})

// Forgot Password
exports.ticketing_User_Forgot_Password = CatchAsync( async(req, res, next)=>{
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Reset Email Sent Successfully!'
    })
})

// Reset Password
exports.ticketing_User_Reset_Password = CatchAsync( async(req, res, next)=>{
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Account Recovery Successfully!'
    })
})
