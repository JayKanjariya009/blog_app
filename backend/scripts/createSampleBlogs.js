const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Blog = require('../models/Blog');
const { v4: uuidv4 } = require('uuid');

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

const createSampleBlogs = async () => {
    try {
        // Find admin user
        const admin = await User.findOne({ email: 'admin@blogapp.com' });
        
        if (!admin) {
            console.log('Admin user not found. Please run createAdmin.js first.');
            process.exit(1);
        }
        
        // Check if blogs already exist
        const blogsCount = await Blog.countDocuments();
        
        if (blogsCount > 0) {
            console.log(`${blogsCount} blogs already exist. Skipping sample blog creation.`);
            process.exit(0);
        }
        
        // Sample blog data
        const sampleBlogs = [
            {
                blogId: uuidv4(),
                title: 'Getting Started with React',
                content: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently update the DOM when data changes. In this blog post, we\'ll explore the basics of React and how to get started with your first React application.',
                author: admin._id,
            },
            {
                blogId: uuidv4(),
                title: 'Introduction to MongoDB',
                content: 'MongoDB is a popular NoSQL database that stores data in flexible, JSON-like documents. It offers high performance, high availability, and easy scalability. In this post, we\'ll cover the basics of MongoDB and how to use it in your applications.',
                author: admin._id,
            },
            {
                blogId: uuidv4(),
                title: 'Building RESTful APIs with Express',
                content: 'Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. In this tutorial, we\'ll learn how to build RESTful APIs using Express and integrate them with a MongoDB database.',
                author: admin._id,
            }
        ];
        
        // Insert sample blogs
        await Blog.insertMany(sampleBlogs);
        
        console.log(`${sampleBlogs.length} sample blogs created successfully`);
        process.exit(0);
    } catch (error) {
        console.error('Error creating sample blogs:', error);
        process.exit(1);
    }
};

createSampleBlogs();