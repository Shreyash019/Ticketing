const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

const app = express();
app.use(morgan('combined'));


// Proxy middleware configuration for each microservice
const userProxy = createProxyMiddleware({
    target: 'http://localhost:5001/api/v1/', // Example target URL for posts service
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
    console.log(req.url)
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