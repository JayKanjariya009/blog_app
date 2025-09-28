const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

const {
  getAllBlogs,
  getBlogbyId,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

// 📌 Public Route – Get all blogs
router.get('/', getAllBlogs);

// 📌 Public Route – Get blog by ID
router.get('/:id', getBlogbyId);

// 🛡️ Admin Only – Create a new blog with image upload
router.post('/', verifyToken, isAdmin, upload.single('image'), createBlog);

// 🛡️ Admin Only – Update blog with optional new image
router.put('/:id', verifyToken, isAdmin, upload.single('image'), updateBlog);

// 🛡️ Admin Only – Delete blog by ID
router.delete('/:id', verifyToken, isAdmin, deleteBlog);

module.exports = router;
