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

// Routes
const authRoutes = require("./routes/authRoutes"); // Fixed the typo in the filename
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");

// Middleware
// app.use(cors({
//   origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow both Vite and React development servers
//   credentials: true,
// }));






// filepath: c:\Users\jayka\Desktop\Project\blog_app\backend\server.js
const express = require("express");
const cors = require("cors");
// const app = express();

// Configure CORS to allow your frontend origin and credentials
app.use(
  cors({
    origin: "https://blog-app-frontend-qu9h.onrender.com",
    credentials: true,
  })
);

// ...existing code...





app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

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

// Static Folder for Uploaded Images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api", commentRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to my Blogs");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
