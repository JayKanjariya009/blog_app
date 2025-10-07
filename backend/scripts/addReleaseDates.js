const mongoose = require('mongoose');
const Blog = require('../models/Blog');
require('dotenv').config();

const addReleaseDates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const blogs = await Blog.find({ releaseDate: { $exists: false } });
    
    for (const blog of blogs) {
      // Set release date to creation date for existing blogs
      blog.releaseDate = blog.createdAt;
      await blog.save();
      console.log(`Updated ${blog.title} with release date: ${blog.releaseDate.toDateString()}`);
    }

    console.log(`Updated ${blogs.length} blogs with release dates`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

addReleaseDates();