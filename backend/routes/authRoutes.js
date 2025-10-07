const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { sendOTPEmail, sendPasswordResetEmail, sendNewPasswordEmail } = require('../utils/emailService');
const { verifyToken } = require('../middleware/authMiddleware');

// ✅ Register Route with OTP
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ 
            username, 
            email, 
            password: hash, 
            role,
            emailOTP: otp,
            otpExpires,
            isEmailVerified: false
        });

        try {
            await sendOTPEmail(email, otp);
        } catch (emailError) {
            console.log('❌ Email sending failed:', emailError);
            // Continue with registration even if email fails
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful. Please check your email for OTP verification.',
            userId: user._id
        });
    } catch (error) {
        console.log('❌ Error occurred while registering user:', error);
        res.status(500).json({ success: false, message: 'Server error while registering user.' });
    }
});

// ✅ Verify OTP Route
router.post('/verify-otp', async (req, res) => {
    const { userId, otp } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found.' });
        }

        if (user.emailOTP !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
        }

        user.isEmailVerified = true;
        user.emailOTP = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Email verified successfully. You can now login.'
        });
    } catch (error) {
        console.log('❌ Error occurred while verifying OTP:', error);
        res.status(500).json({ success: false, message: 'Server error while verifying OTP.' });
    }
});

// ✅ Resend OTP Route
router.post('/resend-otp', async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found.' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ success: false, message: 'Email already verified.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        
        user.emailOTP = otp;
        user.otpExpires = otpExpires;
        await user.save();

        try {
            await sendOTPEmail(user.email, otp);
        } catch (emailError) {
            console.log('❌ Email sending failed:', emailError);
        }

        res.json({
            success: true,
            message: 'OTP resent successfully.'
        });
    } catch (error) {
        console.log('❌ Error occurred while resending OTP:', error);
        res.status(500).json({ success: false, message: 'Server error while resending OTP.' });
    }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'User not found. Please register first.'
            });
        }

        if (!user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                error: 'Please verify your email before logging in.',
                requiresVerification: true,
                userId: user._id
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: 'Invalid credentials.'
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        req.session.user = { id: user._id, role: user.role };

        res.json({
            success: true,
            message: 'Login successful.',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log('❌ Error occurred during login:', error);
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
});

// ✅ Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found.' });
        }

        // Generate new random password
        const newPassword = crypto.randomBytes(8).toString('hex');
        const hash = await bcrypt.hash(newPassword, 10);
        
        user.password = hash;
        await user.save();

        try {
            await sendNewPasswordEmail(email, newPassword);
        } catch (emailError) {
            console.log('❌ Email sending failed:', emailError);
        }

        res.json({
            success: true,
            message: 'New password generated and sent to your email.'
        });
    } catch (error) {
        console.log('❌ Error occurred during forgot password:', error);
        res.status(500).json({ success: false, message: 'Server error during password reset.' });
    }
});

// ✅ Reset Password Route
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        user.password = hash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successfully.'
        });
    } catch (error) {
        console.log('❌ Error occurred during password reset:', error);
        res.status(500).json({ success: false, message: 'Server error during password reset.' });
    }
});

// ✅ Change Password Route
router.post('/change-password', verifyToken, async (req, res) => {
    const { currentPassword, newPassword, generateNew } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found.' });
        }

        if (generateNew) {
            // Generate new random password
            const randomPassword = crypto.randomBytes(8).toString('hex');
            const hash = await bcrypt.hash(randomPassword, 10);
            
            user.password = hash;
            await user.save();

            try {
                await sendNewPasswordEmail(user.email, randomPassword);
            } catch (emailError) {
                console.log('❌ Email sending failed:', emailError);
            }

            res.json({
                success: true,
                message: 'New password generated and sent to your email.'
            });
        } else {
            // Manual password change
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
            }

            const hash = await bcrypt.hash(newPassword, 10);
            user.password = hash;
            await user.save();

            res.json({
                success: true,
                message: 'Password changed successfully.'
            });
        }
    } catch (error) {
        console.log('❌ Error occurred during password change:', error);
        res.status(500).json({ success: false, message: 'Server error during password change.' });
    }
});

module.exports = router;