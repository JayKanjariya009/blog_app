const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
require("dotenv").config();

// Set default environment variables if not provided
process.env.JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-for-jwt";

const app = express();

// Database Connection
const connectdb = require("./db/connectDb");
connectdb(); // Connect to MongoDB

// Middleware
app.use(
  cors({
    origin: "https://blog-app-frontend-qu9h.onrender.com",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yoursecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Should be true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Set up GridFS storage for images
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `${Date.now()}_${file.originalname}`;
      const fileInfo = {
        filename: filename,
        bucketName: "uploads", // This bucket will store your images.
      };
      resolve(fileInfo);
    });
  },
});

// Multer middleware for handling file uploads via GridFS
const upload = multer({ storage });

// Routes
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");
const { getImage } = require("./controllers/imageController");

app.use("/api/auth", authRoutes);
// Pass the upload middleware to blogRoutes as needed. For example, in your route file use: router.post('/', upload.single('image'), createBlog);
app.use("/api/blogs", blogRoutes);
app.use("/api", commentRoutes);

// New route to serve images stored in GridFS
app.get("/image/:filename", getImage);

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to my Blogs");
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// Export upload to use in your blog routes if needed
module.exports = { app, upload };
