// Builtin Modules Import
const jwt = require('jsonwebtoken');

// Database Import
const Users = require('../models/Users.js');
const catchAsync = require('../errors/catchAsync.js');
const { HttpStatusCode } = require('../enums/httpHeaders.js');

const authToken = {

    // 01) <<<<<<<<|| TOKEN GENERATION ||>>>>>>>>
    userSignToken: function (id) {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })
    },

    // 02) <<<<<<<<|| TOKEN SETUP FOR USER ||>>>>>>>>
    sendToken: function (res, user) {

        // a) Token Generation
        const token = this.userSignToken(user._id);

        // b) Cookie validation days setup
        const options = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true,
        }

        // c) Token setting in header
        res.cookie('ticketingUser', token, options);

        // Sending response 
        return res
    },

    // 03) <<<<<<<<|| AUTHENTICATION CHECK ||>>>>>>>>
    isAuthenticated: catchAsync(async function (req, res, next) {

        // a) Fetching token 
        let token = undefined;

        if (req.cookies.usertoken) {
            token = req.cookies.usertoken
        }
        // else if (req.headers.authorization && req.headers.authorization.startsWith('bearer')) {
        else if (req.headers.authorization && req.headers.authorization.startsWith('bearer')) {
            if (req.headers.authorization.split(' ')[1].toString().toLowerCase() !== 'null') {
                token = req.headers.authorization.split(' ')[1];
            }
        }

        // b) Returning if no token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: `Please login.`
            })
        }

        // c) Decoding user using token
        function verifyToken(token) {
            return new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                    if (err && err.name === 'JsonWebTokenError' && err.message === 'jwt malformed') {
                        reject(new Error('Invalid token'));
                    } else if (err) {
                        reject(err);
                    } else {
                        resolve(decoded);
                    }
                });
            });
        }

        let jwtReturnData = {
            decoded: undefined,
            err: undefined
        };
        await verifyToken(token)
            .then(data => {
                jwtReturnData.decoded = data
            })
            .catch(err => {
                jwtReturnData.err = err.message
            });

        if (jwtReturnData.err) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({
                success: false,
                message: `Bad Request! Please login again.`
            })
        }
        // const decoded = jwt.verify(token, process.env.JWT_SECRET)
        let user = await Users.findById(jwtReturnData.decoded.id)
            .select('+role +isBusinessProfile')

        // d) Setting Authenticated User
        if (!user) {
            return next(new ErrorHandler(`Please login again`, 401))
        }
        req.user = user

        // e) Calling next function
        next();
    }),

    // 04) <<<<<<<<|| PROFILE VERIFICATION CHECK||>>>>>>>>
    isProfileVerified: async function (req, res, next) {
        let user = await Users.findById(req.user.id)
            .select("+isAccountVerified +isProfileCompleted")

        // d) Setting Authenticated User
        if (!user) {
            return next(new ErrorHandler(`Either user not exist or not logged in!`, 401))
        } else {
            if (!user.isAccountVerified) {
                return next(new ErrorHandler(`Your account is not verified, Please verify it first!`, 401))
            }
            if (!user || !user.isProfileCompleted) {
                return next(new ErrorHandler(`Your profile is not updated yet, Please update it first!`, 401))
            }
        }

        next();
    },

    // 05) <<<<<<<<|| CLEARING SENSITIVE DATA ||>>>>>>>>
    userDataClear: async function (req, res, next) {
        req.user.role = undefined,
        req.user.isBusinessProfile = undefined
        next();
    },

}

module.exports = authToken;