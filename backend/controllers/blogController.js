const Blog = require('../models/Blog');
const { uploadToImgBB } = require('../utils/imgbbUpload');
const fs = require('fs');
const path = require('path');

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({})
            .sort({ createdAt: -1 })
            .populate({
                path: 'author',
                select: 'username'
            });
            
        res.status(200).json(blogs);
    } catch (error) {
        console.log("Error getting all blogs", error);
        res.status(500).json({
            success: false,
            error: "An unexpected error occurred on the server.",
            message: "Internal Server Error. Please try again later."
        });
    }
}

const getBlogbyId = async (req, res) => {
  try {
    const blog = await Blog.findOne({ blogId: req.params.id })
      .populate({
        path: 'author',
        select: 'username'
      });
      
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    

    
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
};


const { v4: uuidv4 } = require('uuid'); // install with: npm i uuid

const createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        let imageUrl = null;
        
        console.log('Creating blog with file:', req.file ? 'Yes' : 'No');
        console.log('ImgBB API Key exists:', process.env.IMGBB_API_KEY ? 'Yes' : 'No');
        
        if (req.file) {
            console.log('Uploading to ImgBB...');
            const imgbbUrl = await uploadToImgBB(req.file.path, process.env.IMGBB_API_KEY);
            imageUrl = imgbbUrl;
            console.log('ImgBB URL:', imageUrl);
            
            // Delete local file after upload
            fs.unlinkSync(req.file.path);
        }
        
        const author = req.user.id;
        const blogId = uuidv4();

        const newBlog = await Blog.create({ 
            blogId, 
            title, 
            content, 
            imageUrl,
            author
        });

        res.status(201).json({
            success: true,
            message: "Blog created successfully.",
            blog: newBlog,
        });
    } catch (error) {
        console.error("Error creating blog:", error.message);
        console.error("Full error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Internal Server Error",
        });
    }
};


const updateBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const updateData = { title, content };

        if (req.file) {
            const imgbbUrl = await uploadToImgBB(req.file.path, process.env.IMGBB_API_KEY);
            updateData.imageUrl = imgbbUrl;
            
            // Delete local file after upload
            fs.unlinkSync(req.file.path);
        }

        // First try to find by blogId
        let blog = await Blog.findOne({ blogId: req.params.id });
        
        // If not found by blogId, try to find by _id
        if (!blog) {
            blog = await Blog.findById(req.params.id);
        }
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        
        // Update the blog
        Object.keys(updateData).forEach(key => {
            blog[key] = updateData[key];
        });
        
        // Save the updated blog
        const updated = await blog.save();
        
        res.json(updated);
    } catch (err) {
        console.error('Error updating blog:', err);
        res.status(500).json({ message: 'Error updating blog', error: err.message });
    }
};

const deleteBlog = async (req, res) => {
    try {
        // First try to find by blogId
        let blog = await Blog.findOne({ blogId: req.params.id });
        
        // If not found by blogId, try to find by _id
        if (!blog) {
            blog = await Blog.findById(req.params.id);
        }
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        
        // Delete the blog
        await Blog.findByIdAndDelete(blog._id);
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        console.error('Error deleting blog:', err);
        res.status(500).json({ message: 'Error deleting blog', error: err.message });
    }
};

module.exports = {
    getAllBlogs,
    getBlogbyId,
    createBlog,
    updateBlog,
    deleteBlog,
};