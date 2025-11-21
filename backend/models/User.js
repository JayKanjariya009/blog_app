const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailOTP: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema);