const mongoose = require('mongoose');
const Blog = require('../models/Blog');
require('dotenv').config();

const addViewsField = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update all blogs that don't have a views field
    const result = await Blog.updateMany(
      { views: { $exists: false } },
      { $set: { views: 0 } }
    );

    console.log(`Updated ${result.modifiedCount} blogs with views field`);
    
    // Also ensure all blogs have proper default values for other fields
    await Blog.updateMany(
      { overallRating: { $exists: false } },
      { $set: { overallRating: 0 } }
    );
    
    await Blog.updateMany(
      { totalRatings: { $exists: false } },
      { $set: { totalRatings: 0 } }
    );

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

addViewsField();