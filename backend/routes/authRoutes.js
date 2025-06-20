const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ✅ Register Route
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered.' });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hash, role });

        res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            user: { id: user._id, email: user.email, role: user.role }
        });
    } catch (error) {
        console.log('❌ Error occurred while registering user:', error);
        res.status(500).json({ success: false, message: 'Server error while registering user.' });
    }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }); // Fixed: email was undefined before
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'User not found. Please register first.'
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

        // Create session
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

module.exports = router;