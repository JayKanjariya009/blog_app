const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getCommentsByBlogId,
  createComment,
  deleteComment
} = require('../Controllers/commentController');

// Get all comments for a blog
router.get('/blogs/:blogId/comments', getCommentsByBlogId);

// Create a new comment (requires authentication)
router.post('/blogs/:blogId/comments', verifyToken, createComment);

// Delete a comment (requires authentication)
router.delete('/comments/:commentId', verifyToken, deleteComment);

module.exports = router;