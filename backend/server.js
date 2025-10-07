const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

// Set default environment variables if not provided
process.env.JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-for-jwt";

const app = express();

// Database Connection
const connectdb = require("./db/connectDb");
connectdb(); // Connect to MongoDB

// CORS Configuration
const allowedOrigins = [
  "https://blog-app-frontend-qu9h.onrender.com",
  "http://localhost:3000",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder for Uploaded Images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log(`Static files served from ${path.join(__dirname, 'uploads')}`);

// Session Setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yoursecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // True in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    },
  })
);

// Routes
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");

app.use("/api/auth",  authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api", commentRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to my Blogs");
});

// Test route to check uploads directory
app.get("/test-uploads", (req, res) => {
  const fs = require('fs');
  const uploadsPath = path.join(__dirname, 'uploads');
  try {
    const files = fs.readdirSync(uploadsPath);
    res.json({ 
      uploadsPath, 
      files,
      staticRoute: '/uploads',
      sampleUrl: files.length > 0 ? `/uploads/${files[0]}` : 'No files found'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
