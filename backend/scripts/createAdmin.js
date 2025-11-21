const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://jaykanjariya009:Jay%402004@cluster0.2wwtnns.mongodb.net/blogapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
});

const createAdmin = async () => {
    try {
        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@blogapp.com' });
        
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }
        
        // Hash password
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        if (!process.env.ADMIN_PASSWORD) {
            console.warn('WARNING: Using default admin password. Set ADMIN_PASSWORD environment variable for production.');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);
        
        // Create admin user
        const admin = new User({
            username: 'Admin',
            email: 'admin@blogapp.com',
            password: hashedPassword,
            role: 'admin'
        });
        
        await admin.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdmin();