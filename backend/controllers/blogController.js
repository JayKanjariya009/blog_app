const Blog = require('../models/Blog');

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({})
            .sort({ createdAt: -1 })
            .populate({
                path: 'author',
                select: 'username'
            });
            
        // Ensure all imageUrls have the correct format
        const formattedBlogs = blogs.map(blog => {
            const blogObj = blog.toObject();
            if (blogObj.imageUrl) {
                // Use placeholder for missing images on Render
                blogObj.imageUrl = 'https://placehold.co/400x250?text=Blog+Image';
            }
            return blogObj;
        });
        
        res.status(200).json(formattedBlogs);
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
    
    // Use placeholder for missing images on Render
    if (blog.imageUrl) {
      blog.imageUrl = 'https://placehold.co/400x250?text=Blog+Image';
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
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const author = req.user.id; // Get author ID from authenticated user

        const blogId = uuidv4(); // or use Date.now().toString() for simple IDs

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
        console.log("Error creating blog", error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};


const updateBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const updateData = { title, content };

        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
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