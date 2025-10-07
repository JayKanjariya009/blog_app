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
  rateBlog,
  getTopBlogs,
  updateEpisodesChapters,
  getHomeSections,
} = require('../controllers/blogController');

// 📌 Public Route – Get all blogs
router.get('/', getAllBlogs);

// 📌 Public Route – Get top blogs (must be before /:id)
router.get('/top', getTopBlogs);

// 📌 Public Route – Get home page sections
router.get('/home/sections', getHomeSections);

// 🛡️ Protected Route – Get blog by ID (requires login)
router.get('/:id', verifyToken, getBlogbyId);

// 🛡️ Admin Only – Create a new blog with image upload
router.post('/', verifyToken, isAdmin, upload.single('image'), createBlog);

// 🛡️ Admin Only – Update blog with optional new image
router.put('/:id', verifyToken, isAdmin, upload.single('image'), updateBlog);

// 🛡️ Admin Only – Delete blog by ID
router.delete('/:id', verifyToken, isAdmin, deleteBlog);

// 🛡️ User – Rate a blog
router.post('/:id/rate', verifyToken, rateBlog);

// 🛡️ Admin Only – Update episodes/chapters
router.patch('/:id/episodes-chapters', verifyToken, isAdmin, updateEpisodesChapters);

module.exports = router;
