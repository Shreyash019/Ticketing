// Builtin Modules Import
const jwt = require('jsonwebtoken');

// Database Import
const Users = require('../models/Users.js');
const catchAsync = require('../errors/catchAsync.js');
const { HttpStatusCode } = require('../enums/httpHeaders.js');
const ErrorHandler = require('../utils/errorHandler.js');

const authToken = {

    // 01) <<<<<<<<|| TOKEN GENERATION ||>>>>>>>>
    userSignToken: function (id) {
        return jwt.sign({ id: id, role: 'user' }, process.env.JWT_SECRET, {
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

        if (req.cookies.ticketingUser) {
            token = req.cookies.ticketingUser
        }
        // else if (req.headers.authorization && req.headers.authorization.startsWith('bearer')) {
        else if (req.headers.authorization && req.headers.authorization.startsWith('bearer')) {
            if (req.headers.authorization.split(' ')[1].toString().toLowerCase() !== 'null') {
                token = req.headers.authorization.split(' ')[1];
            }
        }

        // b) Returning if no token
        if (!token) return next(new ErrorHandler(`Please login`, HttpStatusCode.UNAUTHORIZED));

        // c) Decoding user using token
        function verifyToken(token) {
            return new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                    if (err && err.name === 'JsonWebTokenError' && err.message === 'jwt malformed') {
                        reject(new Error('Invalid token'));
                    } else if (err) {
                        reject(new Error('Invalid token'));
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
            return next(new ErrorHandler(`Bad Request! Please login again`, HttpStatusCode.UNAUTHORIZED));
        }
        // const decoded = jwt.verify(token, process.env.JWT_SECRET)
        let user = await Users.findById(jwtReturnData.decoded.id)
            .select('+isActive +isProfileCompleted')

        // d) Setting Authenticated User
        if (!user) {
            return next(new ErrorHandler(`Bad Request! Please login again`, HttpStatusCode.UNAUTHORIZED));
        }
        req.user = {
            id: user._id,
            isActive: user.isActive,
            isProfileCompleted: user.isProfileCompleted
        }

        // e) Calling next function
        next();
    }),

    // 04) <<<<<<<<|| PROFILE VERIFICATION CHECK||>>>>>>>>
    isProfileVerified: async function (req, res, next) {
        let user = req.user;
            
        // d) Setting Authenticated User
        if (!user) {
            return next(new ErrorHandler(`Either user not exist or not logged in!`, 401))
        } else {
            if (!user.isProfileCompleted) {
                return next(new ErrorHandler(`Your profile in not updated, Please update it first!`, 401))
            }
        }
        next();
    },

    // 05) <<<<<<<<|| CLEARING SENSITIVE DATA ||>>>>>>>>
    userDataClear: async function (req, res, next) {
        req.user.isActive = undefined,
        req.user.isBusinessProfile = undefined
        next();
    },

}

module.exports = authToken;