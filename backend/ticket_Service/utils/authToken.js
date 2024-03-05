// Builtin Modules Import
const jwt = require('jsonwebtoken');

// Database Import
const catchAsync = require('../errors/catchAsync.js');
const { HttpStatusCode } = require('../enums/httpHeaders.js');
const ErrorHandler = require('../utils/errorHandler.js');

const authToken = {

    // 01) <<<<<<<<|| AUTHENTICATION CHECK ||>>>>>>>>
    isAuthenticated: catchAsync(async function (req, res, next) {

        // a) Fetching token 
        let token = undefined;

        if (req.cookies.ticketingBusiness) {
            token = req.cookies.ticketingBusiness
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
            return next(new ErrorHandler(`Bad Request! Please login again`, HttpStatusCode.UNAUTHORIZED));
        }

        req.user = {
            id: jwtReturnData.decoded.id,
            role: jwtReturnData.decoded.role,
        }

        // e) Calling next function
        next();
    })
}

module.exports = authToken;