const mongoose = require('mongoose');

const HallTicketsSchema = new mongoose.Schema(
    {
        business: {
            type: String,
            required: true
        },
        showName: {
            type: String,
            required: true
        },
        description:{
            type: String
        },
        startDate: {
            type: Date,
            required: true
        },
        startTime: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        },
        tickets: [
            {
                ticketType: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                currency: {
                    type: String,
                    required: true,
                    default: "INR"
                },
                quantityAvailable: {
                    type: Number,
                    required: true
                }
            }
        ],
        address: {
            type: String,
            required: true,
        }, city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        zipCode: {
            type: Number,
            required: true
        },
        location: {
            type: { type: String },
            coordinates: [Number]
        },
    }, 
    {
        timestamps: true
    }
)

// Add a 2dsphere index on the location field
HallTicketsSchema.index({ location: '2dsphere' });

const HallTickets = mongoose.model('HallTickets', HallTicketsSchema);
module.exports = HallTickets;