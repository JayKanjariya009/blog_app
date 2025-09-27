const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectdb = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
        "mongodb+srv://jaykanjariya009_db_user:nS6t5pkMJltnDRQw@cluster0.2c5h49r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("Error connecting to DB", error);
    process.exit(1);
  }
};

module.exports = connectdb;
