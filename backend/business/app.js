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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("combined"));
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));

// Allow CORS from any origin
app.use(cors());

const businessRoutes = require('./routes/businessRoutes');

// Health Check Endpoint
app.get('/health', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: `Service is up and running!`
    })
})

app.use('/buzz', businessRoutes);

app.use(errorMiddleware);

module.exports = app;
