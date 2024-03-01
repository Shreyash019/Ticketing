const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchemaModel = new mongoose.Schema(
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
        username: {
            type: String,
            required: true,
            unique: true
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
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
UserSchemaModel.index({ location: '2dsphere' });

UserSchemaModel.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
});

UserSchemaModel.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
};

UserSchemaModel.methods.getResetPasswordToken = async function () {
    // 1) generate token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // 2) generate hash token and add to db
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 960000;
    return resetToken;
}

const Users = mongoose.model('Users', UserSchemaModel);
module.exports = Users;