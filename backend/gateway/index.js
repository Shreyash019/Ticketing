const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

const app = express();
app.use(morgan('combined'));

// // Connection information for each database (replace with actual details)
// const adminDbConfig = {
//     uri: process.env.MONGO_URL_ADMIN,
//     schema: require('./models/Admin.js'), // Path to admin schema
//     model: 'Admin', // Name of admin model
// };

// const businessDbConfig = {
//     uri: process.env.MONGO_URL_BUSINESS,
//     schema: require('./models/Business.js'), // Path to business schema
//     model: 'Business', // Name of business model
// };

// const userDbConfig = {
//     uri: process.env.MONGO_URL_USER,
//     schema: require('./models/Users.js'), // Path to customer schema
//     model: 'User', // Name of customer model
// };

// // Connect to each database
// const adminConnection = mongoose.createConnection(adminDbConfig.uri);
// const businessConnection = mongoose.createConnection(businessDbConfig.uri);
// const userConnection = mongoose.createConnection(userDbConfig.uri);

// const Admins = adminConnection.model(adminDbConfig.model, adminDbConfig.schema)
// const Business = businessConnection.model(businessDbConfig.model, businessDbConfig.schema)
// const Users = userConnection.model(userDbConfig.model, userDbConfig.schema)

// Proxy middleware configuration for each microservice
const userProxy = createProxyMiddleware({
    target: 'http://localhost:5001/api/v1/', // Example target URL for posts service
    changeOrigin: true,
});
const businessProxy = createProxyMiddleware({
    target: 'http://localhost:5005/api/v1/', // Example target URL for posts service
    changeOrigin: true,
});


// Health check function for a specific service
const checkServiceHealth = async (serviceUrl) => {
    try {
        const response = await fetch(serviceUrl + '/health');
        return response.ok;
    } catch (error) {
        return false;
    }
};

app.use(async (req, res, next) => {

    let targetURL = req.url.split('/')[1];
    if (targetURL === 'user') {
        const isAvailable = await checkServiceHealth('http://localhost:5001');
        if (isAvailable) {
            userProxy(req, res, next)
        } else {
            res.status(503).json({
                success: false,
                message: 'User Service Unavailable!'
            });
        }
    } else if (targetURL === 'buzz') {
        const isAvailable = await checkServiceHealth('http://localhost:5005');
        if (isAvailable) {
            businessProxy(req, res, next)
        } else {
            res.status(503).json({
                success: false,
                message: 'User Service Unavailable!'
            });
        }
    }
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).send({ error: err.message });
});

const port = 5000;
app.listen(port, () => {
    console.log(`API Gateway listening on port ${port}`);
});