const express = require("express");
const router = express.Router();
const { createBlog, updateBlog, getAllBlogs, getBlogbyId, deleteBlog } = require("../controllers/blogController");
const upload = require("../utils/gridFsUpload"); // Use upload from the new module
const { verifyToken } = require("../middleware/authMiddleware"); // Use token verification

// Create a blog with image upload
router.post("/", verifyToken, upload.single("image"), createBlog);
// Update blog route with optional image update
router.put("/:id", verifyToken, upload.single("image"), updateBlog);
// Other routes
router.get("/", getAllBlogs);
router.get("/:id", getBlogbyId);
router.delete("/:id", verifyToken, deleteBlog);

module.exports = router;
