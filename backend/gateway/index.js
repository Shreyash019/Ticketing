// import express from 'express';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import fetch from 'node-fetch';
// import morgan from 'morgan';

// const app = express();

// app.use(cookieParser());
// app.use(cors({ credentials: true }));
// app.use(morgan('combined'));

// // Health check function for a specific service
// const checkServiceHealth = async (serviceUrl) => {
//     try {
//         const response = await fetch(`${serviceUrl}/health`);
//         return response.ok;
//     } catch (error) {
//         return false;
//     }
// };

// // Route handler for user service
// app.all('/user/*', async (req, res, next) => {
//     const serviceUrl = 'http://localhost:5001';
//     const isAvailable = await checkServiceHealth(serviceUrl);
//     if (isAvailable) {
//         return fetch(`${serviceUrl}${req.url}`, {
//             method: req.method,
//             headers: {
//                 ...req.headers,
//                 host: serviceUrl.split('//')[1],
//                 origin: 'http://localhost:5000' // Update with your actual origin
//             },
//             credentials: 'include',
//             body: req.method === 'GET' ? undefined : JSON.stringify(req.body)
//         })
//         .then(response => response.json())
//         .then(data => res.json(data))
//         .catch(error => next(error));
//     } else {
//         res.status(503).json({ success: false, message: 'User Service Unavailable!' });
//     }
// });

// // Route handler for business service
// app.all('/buzz/*', async (req, res, next) => {
//     const serviceUrl = 'http://localhost:5005';
//     const isAvailable = await checkServiceHealth(serviceUrl);
//     if (isAvailable) {
//         return fetch(`${serviceUrl}${req.url}`, {
//             method: req.method,
//             headers: {
//                 ...req.headers,
//                 host: serviceUrl.split('//')[1],
//                 origin: 'http://localhost:5000' // Update with your actual origin
//             },
//             credentials: 'include',
//             body: req.method === 'GET' ? undefined : JSON.stringify(req.body)
//         })
//         .then(response => response.json())
//         .then(data => res.json(data))
//         .catch(error => next(error));
//     } else {
//         res.status(503).json({ success: false, message: 'Business Service Unavailable!' });
//     }
// });

// // Route handler for ticket service
// app.all('/ticket/*', async (req, res, next) => {
//     const serviceUrl = 'http://localhost:5003';
//     const isAvailable = await checkServiceHealth(serviceUrl);
//     if (isAvailable) {
//         return fetch(`${serviceUrl}${req.url}`, {
//             method: req.method,
//             headers: {
//                 ...req.headers,
//                 host: serviceUrl.split('//')[1],
//                 origin: 'http://localhost:5000' // Update with your actual origin
//             },
//             credentials: 'include',
//             body: req.method === 'GET' ? undefined : JSON.stringify(req.body)
//         })
//         .then(response => response.json())
//         .then(data => res.json(data))
//         .catch(error => next(error));
//     } else {
//         res.status(503).json({ success: false, message: 'Ticket Service Unavailable!' });
//     }
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(err.statusCode || 500).send({ error: err.message });
// });

// const port = 5000;
// app.listen(port, () => {
//     console.log(`API Gateway listening on port ${port}`);
// });



import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import morgan from 'morgan';
import fetch from 'node-fetch';

dotenv.config({ path: './config/config.env' });

const app = express();

app.use(cookieParser());
app.use(morgan('combined'));
app.use(cors({ credentials: true, origin: true }));

// Proxy middleware configuration for each microservice
const userProxy = createProxyMiddleware({
    target: 'http://localhost:5001', // Target URL for user service
    changeOrigin: true,
});

const businessProxy = createProxyMiddleware({
    target: 'http://localhost:5005', // Target URL for business service
    changeOrigin: true,
});

const ticketProxy = createProxyMiddleware({
    target: 'http://localhost:5003', // Target URL for ticket service
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
            userProxy(req, res, next);
        } else {
            res.status(503).json({
                success: false,
                message: 'User Service Unavailable!',
            });
        }
    } else if (targetURL === 'buzz') {
        const isAvailable = await checkServiceHealth('http://localhost:5005');
        if (isAvailable) {
            businessProxy(req, res, next);
        } else {
            res.status(503).json({
                success: false,
                message: 'Business Service Unavailable!',
            });
        }
    } else if (targetURL === 'ticket') {
        const isAvailable = await checkServiceHealth('http://localhost:5003');
        if (isAvailable) {
            ticketProxy(req, res, next);
        } else {
            res.status(503).json({
                success: false,
                message: 'Ticket Service Unavailable!',
            });
        }
    } else {
        // Handle invalid routes
        res.status(404).json({
            success: false,
            message: 'Invalid Route!',
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).send({ error: err.message });
});

const port = 5000;
app.listen(port, () => {
    console.log(`API Gateway listening on port ${port}`);
});
