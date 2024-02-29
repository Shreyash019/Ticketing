// Module Imports
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./errors/error");
const app = express();
dotenv.config({ path: "./config/config.env" });
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));

const userRoutes = require('./routes/userRoutes');

app.use('/user', userRoutes);
app.use(errorMiddleware);

module.exports = app;
