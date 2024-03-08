// Module Imports
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./errors/error");
const app = express();
const businessRoute = require('./routes/ticketRoute');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("combined"));
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));

const allowedOrigins = [
    'http://localhost:5000', // Ticket service origin (replace with your actual domain/port)
    'http://localhost:5005', // Ticket service origin (replace with your actual domain/port)
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Origin not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 200 // Send a 200 response for preflight requests
};


// Health Check Endpoint
app.get('/health', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: `Service is up and running!`
    })
})

app.use('/api/v1/ticket', businessRoute)

app.use(errorMiddleware);

module.exports = app;
