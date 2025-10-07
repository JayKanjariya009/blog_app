const mongoose = require('mongoose');
const Blog = require('../models/Blog');
require('dotenv').config();

const addSampleViews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const blogs = await Blog.find({});
    
    for (const blog of blogs) {
      // Add random views between 10 and 1000
      const randomViews = Math.floor(Math.random() * 990) + 10;
      blog.views = randomViews;
      await blog.save();
      console.log(`Updated ${blog.title} with ${randomViews} views`);
    }

    console.log('Sample views added successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to add sample views:', error);
    process.exit(1);
  }
};

addSampleViews();