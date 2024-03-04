const mongoose = require('mongoose');

const EventPassSchema = new mongoose.Schema(
    {
        organizer: {
            type: String,
            required: true
        },
        venue: {
            type: String,
            required: true
        },
        showName: {
            type: String,
            required: true
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
        eventPass: [
            {
                passType: {
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
EventPassSchema.index({ location: '2dsphere' });

const EventPass = mongoose.model('EventPass', EventPassSchema);
module.exports = EventPass;