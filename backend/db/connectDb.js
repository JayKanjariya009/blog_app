const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectdb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is required');
    }
    
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("Error connecting to DB", error);
    process.exit(1);
  }
};

module.exports = connectdb;
