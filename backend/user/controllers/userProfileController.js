const CatchAsync = require('../errors/catchAsync');
const {HttpStatusCode} = require('../enums/httpHeaders');
const ErrorHandler = require('../utils/errorHandler');
const Users = require('../models/Users');


// Profile Information
exports.ticketing_User_Profile_Information = CatchAsync( async(req, res, next)=>{

    const isUser = await Users.findById({_id: req.user.id})
        .catch((err)=>console.log(err))
    if(!isUser){
        return next(new ErrorHandler('Please login again', HttpStatusCode.UNAUTHORIZED))
    }

    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Profile Information',
        data: isUser
    })
})

// Profile Information Update
exports.ticketing_User_Profile_Information_Update = CatchAsync( async(req, res, next)=>{
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Profile Updated Successfully!'
    })
})

// Address Information
exports.ticketing_User_Address_Information = CatchAsync( async(req, res, next)=>{
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Address Updated Successfully!'
    })
})

// Address Information Update
exports.ticketing_User_Address_Update = CatchAsync( async(req, res, next)=>{
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Address Updated Successfully!'
    })
})


// Location Information Update
exports.ticketing_User_Location_Update = CatchAsync( async(req, res, next)=>{
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Location Updated Successfully!'
    })
})

// Profile Image Update
exports.ticketing_User_Profile_Image_Update = CatchAsync( async(req, res, next)=>{
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Profile Image Updated Successfully!'
    })
})

// Account Disable
exports.ticketing_User_Account_Disable = CatchAsync( async(req, res, next)=>{
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Profile Disabled Successfully'
    })
})

// Account Delete
exports.ticketing_User_Account_Delete = CatchAsync( async(req, res, next)=>{
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Account Deleted Successfully!'
    })
})
