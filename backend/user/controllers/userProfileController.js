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

    // Response Object
    let responseObject = {
        _id: isUser._id,
        username: isUser.username,
        email: isUser.email,
        firstName: isUser.firstName,
        lastName: isUser.lastName,
        dateOfBirth: isUser.dateOfBirth || undefined,
        gender: isUser.gender || undefined,
        phone: isUser.phone || undefined,
        plot: isUser.plot || undefined,
        address: isUser.address || undefined,
        city: isUser.city || undefined,
        state: isUser.state || undefined, 
        country: isUser.country || undefined,
        zipCode: isUser.zipCode || undefined
    }

    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Profile Information',
        data: responseObject,
    })
})

// Profile Information Update
exports.ticketing_User_Profile_Information_Update = CatchAsync( async(req, res, next)=>{

    // Fetching user
    const isUser = await Users.findOne({_id: req.user.id})
        .select("+isProfileCompleted")
        .catch(err=>console.log(err))
    if(!isUser) return next(new ErrorHandler(`Please login again!`, HttpStatusCode.UNAUTHORIZED));

    if(req.body.firstName && req.body.lastName && req.body.dateOfBirth && req.body.gender && req.body.phone){
        if(isUser.isProfileCompleted == false)  isUser.isProfileCompleted= true;
    }
    // Saving Profile Information
    isUser.firstName = req.body.firstName ? req.body.firstName.toLowerCase() : isUser.firstName;
    isUser.lastName = req.body.lastName ? req.body.lastName.toLowerCase() : isUser.lastName ;
    isUser.dateOfBirth = req.body.dateOfBirth ? req.body.dateOfBirth : isUser.dateOfBirth ? isUser.dateOfBirth : undefined;
    isUser.gender = req.body.gender ? req.body.gender.toLowerCase() : isUser.gender ? isUser.gender : undefined;
    isUser.phone = req.body.phone && parseInt(req.body.phone) !== NaN ? parseInt(req.body.phone) : isUser.phone ? isUser.phone : undefined;
    await isUser.save()

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
