const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Blog = require('../models/Blog');
const connectdb = require('../db/connectDb');

const fixImageUrls = async () => {
  try {
    await connectdb();
    
    // Get all existing files in uploads directory
    const uploadsPath = path.join(__dirname, '../uploads');
    const existingFiles = fs.readdirSync(uploadsPath).filter(file => file !== '.gitkeep');
    
    if (existingFiles.length === 0) {
      console.log('No image files found in uploads directory');
      return;
    }
    
    // Get all blogs with imageUrl
    const blogs = await Blog.find({ imageUrl: { $exists: true, $ne: '' } });
    
    console.log(`Found ${blogs.length} blogs with images`);
    console.log(`Available files: ${existingFiles.join(', ')}`);
    
    for (const blog of blogs) {
      if (blog.imageUrl) {
        // Extract filename from imageUrl
        const filename = blog.imageUrl.replace('/uploads/', '');
        
        // Check if file exists
        if (!existingFiles.includes(filename)) {
          // Use the first available image as replacement
          const newImageUrl = `/uploads/${existingFiles[0]}`;
          
          console.log(`Updating blog "${blog.title}": ${blog.imageUrl} -> ${newImageUrl}`);
          
          await Blog.findByIdAndUpdate(blog._id, { imageUrl: newImageUrl });
        } else {
          console.log(`Blog "${blog.title}" image exists: ${blog.imageUrl}`);
        }
      }
    }
    
    console.log('Image URLs fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing image URLs:', error);
    process.exit(1);
  }
};

fixImageUrls();