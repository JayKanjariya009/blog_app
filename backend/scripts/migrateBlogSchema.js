const mongoose = require('mongoose');
require('dotenv').config();

const connectdb = require('../db/connectDb');
const Blog = require('../models/Blog');

const migrateBlogSchema = async () => {
  try {
    await connectdb();
    
    console.log('Starting blog schema migration...');
    
    // Get all existing blogs
    const blogs = await Blog.find({});
    console.log(`Found ${blogs.length} blogs to migrate`);
    
    for (const blog of blogs) {
      const updates = {};
      
      // Add default values for new fields
      if (!blog.category) updates.category = 'Manga';
      if (!blog.genres) updates.genres = [];
      if (!blog.status) updates.status = 'Ongoing';
      if (blog.adminRating === undefined) updates.adminRating = 0;
      if (!blog.userRatings) updates.userRatings = [];
      if (blog.overallRating === undefined) updates.overallRating = 0;
      if (blog.totalRatings === undefined) updates.totalRatings = 0;
      if (blog.episodes === undefined) updates.episodes = 0;
      if (blog.chapters === undefined) updates.chapters = 0;
      if (!blog.alternativeNames) updates.alternativeNames = [];
      if (!blog.readingReview) updates.readingReview = '';
      if (blog.isPinned === undefined) updates.isPinned = false;
      if (blog.showUserRatings === undefined) updates.showUserRatings = true;
      
      if (Object.keys(updates).length > 0) {
        await Blog.findByIdAndUpdate(blog._id, updates);
        console.log(`Updated blog: ${blog.title}`);
      }
    }
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateBlogSchema();