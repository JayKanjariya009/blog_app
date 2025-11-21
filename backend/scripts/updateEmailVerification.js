const mongoose = require('mongoose');
const User = require('../models/User');
const connectdb = require('../db/connectDb');

const updateEmailVerification = async () => {
    try {
        await connectdb();
        
        const result = await User.updateOne(
            { email: 'shadow@gmail.com' },
            { $set: { isEmailVerified: true } }
        );
        
        if (result.matchedCount === 0) {
            console.log('❌ User with email shadow@gmail.com not found');
        } else if (result.modifiedCount === 0) {
            console.log('ℹ️ User found but no changes made (already verified or no update needed)');
        } else {
            console.log('✅ Successfully updated shadow@gmail.com - isEmailVerified set to true');
        }
        
        // Verify the update
        const user = await User.findOne({ email: 'shadow@gmail.com' });
        if (user) {
            console.log('📋 Current user status:');
            console.log(`   Email: ${user.email}`);
            console.log(`   Username: ${user.username}`);
            console.log(`   isEmailVerified: ${user.isEmailVerified}`);
        }
        
    } catch (error) {
        console.error('❌ Error updating user:', error.message);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

updateEmailVerification();