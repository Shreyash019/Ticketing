const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const BusinessSchemaModel = new mongoose.Schema(
    {
        isAccountVerified: {
            type: Boolean,
            default: false,
            select: false
        },
        isProfileCompleted: {
            type: Boolean,
            default: false,
            select: false
        },
        isActive: {
            type: Boolean,
            default: false,
            select: false
        },
        role: {
            type: String,
            default: 'business',
            select: false
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        businessName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        registrationID:  {
            type: String,
            unique: true
        },
        registrationDate:  {
            type: Date,
            default: Date.now()
        },
        phone: {
            type: Number
        },

        // Passwords
        password: {
            type: String,
            minLength: 8,
            select: false
        },
        plot: {
            type: String,
        },
        address: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        country: {
            type: String,
        },
        zipCode: {
            type: Number,
        },
        location: {
            type: { type: String },
            coordinates: [Number]
        },
    },
    { timestamps: true }
);

// Add a 2dSphere index on the location field
BusinessSchemaModel.index({ location: '2dsphere' });

BusinessSchemaModel.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
});

BusinessSchemaModel.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
};

BusinessSchemaModel.methods.getResetPasswordToken = async function () {
    // 1) generate token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // 2) generate hash token and add to db
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 960000;
    return resetToken;
}

const Business = mongoose.model('Users', BusinessSchemaModel);
module.exports = Business;