const CatchAsync = require('../errors/catchAsync');
const {HttpStatusCode} = require('../enums/httpHeaders');
const ErrorHandler = require('../utils/errorHandler');
const Business = require('../models/Business');


// Profile Information
exports.ticketing_Business_Profile_Information = CatchAsync( async(req, res, next)=>{

    const isBusiness = await Business.findById({_id: req.user.id})
        .catch((err)=>console.log(err))
    if(!isBusiness){
        return next(new ErrorHandler('Please login again', HttpStatusCode.UNAUTHORIZED))
    }

    // Response Object
    let responseObject = {
        _id: isBusiness._id,
        username: isBusiness.username,
        email: isBusiness.email,
        name: isBusiness.businessName,
        registrationID: isBusiness.registrationID,
        phone: isBusiness.phone || undefined,
        plot: isBusiness.plot || undefined,
        address: isBusiness.address || undefined,
        city: isBusiness.city || undefined,
        state: isBusiness.state || undefined, 
        country: isBusiness.country || undefined,
        zipCode: isBusiness.zipCode || undefined
    }

    // Sending response
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Profile Information',
        data: responseObject,
    })
})

// Profile Information Update
exports.ticketing_Business_Profile_Information_Update = CatchAsync( async(req, res, next)=>{

    // Fetching user
    const isBusiness = await Business.findOne({_id: req.user.id})
        .select("+isProfileCompleted")
        .catch(err=>console.log(err))
    if(!isBusiness) return next(new ErrorHandler(`Please login again!`, HttpStatusCode.UNAUTHORIZED));

    // Saving Business Profile Completed if all required details provided
    if(req.body.businessName && req.body.phone && isBusiness.registrationDate && isBusiness.registrationID){
        if(isBusiness.isProfileCompleted == false)  isBusiness.isProfileCompleted= true;
    }

    // Saving Profile Information
    isBusiness.businessName = req.body.businessName ? req.body.businessName.toLowerCase() : isBusiness.businessName;
    isBusiness.phone = req.body.phone && parseInt(req.body.phone) !== NaN ? parseInt(req.body.phone) : isBusiness.phone ? isBusiness.phone : undefined;
    await isBusiness.save()

    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Profile Updated Successfully!'
    })
})

// Address Information
exports.ticketing_Business_Address_Information = CatchAsync( async(req, res, next)=>{
    // Fetching user
    const isUser = await Business.findById({_id: req.user.id})
        .select('plot address city state country zipCode')
        .catch((err)=>console.log(err))
    if(!isUser){
        return next(new ErrorHandler('Please login again', HttpStatusCode.UNAUTHORIZED))
    }

    // Response Object
    let responseObject = {
        plot: isUser.plot || undefined,
        address: isUser.address || undefined,
        city: isUser.city || undefined,
        state: isUser.state || undefined, 
        country: isUser.country || undefined,
        zipCode: isUser.zipCode || undefined
    }

    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'User Address Information',
        data: responseObject,
    })
})

// Address Information Update
exports.ticketing_Business_Address_Update = CatchAsync( async(req, res, next)=>{

    // Fetching user
    const isUser = await Business.findOne({_id: req.user.id})
        .catch(err=>console.log(err))
    if(!isUser) return next(new ErrorHandler(`Please login again!`, HttpStatusCode.UNAUTHORIZED));

    // Updating address
    isUser.plot = req.body.plot ? req.body.plot.toLowerCase() : isUser.plot ? isUser.plot : undefined; 
    isUser.address = req.body.address ? req.body.address.toLowerCase() : isUser.address ? isUser.address : undefined; 
    isUser.city = req.body.city ? req.body.city.toLowerCase() : isUser.city ? isUser.city : undefined; 
    isUser.state = req.body.state ? req.body.state.toLowerCase() : isUser.state ? isUser.state : undefined; 
    isUser.country = req.body.country ? req.body.country.toLowerCase() : isUser.country ? isUser.country : undefined; 
    isUser.zipCode = req.body.zipCode && parseInt(req.body.zipCode) !== NaN ? parseInt(req.body.zipCode) : isUser.zipCode ? isUser.zipCode : undefined; 
    await isUser.save();

    // Sending response
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Address Updated Successfully!'
    })
})


// Location Information Update
exports.ticketing_Business_Location_Update = CatchAsync( async(req, res, next)=>{

    // Sending response
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Location Updated Successfully!'
    })
})

// Profile Image Update
exports.ticketing_Business_Profile_Image_Update = CatchAsync( async(req, res, next)=>{
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Profile Image Updated Successfully!'
    })
})

// Account Disable
exports.ticketing_Business_Account_Disable = CatchAsync( async(req, res, next)=>{
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Profile Disabled Successfully'
    })
})

// Account Delete
exports.ticketing_Business_Account_Delete = CatchAsync( async(req, res, next)=>{
    res.status(HttpStatusCode.SUCCESS).json({
        success: true,
        message: 'Account Deleted Successfully!'
    })
})
