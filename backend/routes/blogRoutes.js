const express = require("express");
const router = express.Router();
const { createBlog, updateBlog, getAllBlogs, getBlogbyId, deleteBlog } = require("../controllers/blogController");
const { upload } = require("../server"); // Import upload from server.js or wherever you exported it
const authenticate = require("../middleware/authenticate"); // Your authentication middleware

// Create a blog with image upload
router.post("/", authenticate, upload.single("image"), createBlog);
// Update blog route with optional image update
router.put("/:id", authenticate, upload.single("image"), updateBlog);
// Other routes
router.get("/", getAllBlogs);
router.get("/:id", getBlogbyId);
router.delete("/:id", authenticate, deleteBlog);

module.exports = router;
