const Comment = require('../models/Comment');
const User = require('../models/User');

// Get all comments for a blog
const getCommentsByBlogId = async (req, res) => {
  try {
    const { blogId } = req.params;
    
    const comments = await Comment.find({ blogId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: 'username'
      });
    
    res.status(200).json(comments);
  } catch (error) {
    console.log('Error getting comments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch comments'
    });
  }
};

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    
    const comment = await Comment.create({
      blogId,
      user: userId,
      content
    });
    
    // Populate user info before sending response
    const populatedComment = await Comment.findById(comment._id).populate({
      path: 'user',
      select: 'username'
    });
    
    res.status(201).json(populatedComment);
  } catch (error) {
    console.log('Error creating comment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create comment'
    });
  }
};

// Delete a comment (only owner or admin)
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    // Check if user is comment owner or admin
    if (comment.user.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this comment'
      });
    }
    
    await Comment.findByIdAndDelete(commentId);
    
    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.log('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete comment'
    });
  }
};

module.exports = {
  getCommentsByBlogId,
  createComment,
  deleteComment
};