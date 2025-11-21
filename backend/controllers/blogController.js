const Blog = require('../models/Blog');
const { uploadToImgBB } = require('../utils/imgbbUpload');
const fs = require('fs');
const path = require('path');

const getAllBlogs = async (req, res) => {
    try {
        const { category, genres, status, sortBy = 'createdAt', limit = 10, page = 1 } = req.query;
        
        let filter = {};
        
        if (category && category !== 'All') {
            filter.category = category;
        }
        
        if (genres) {
            const genreArray = Array.isArray(genres) ? genres : genres.split(',');
            filter.genres = { $in: genreArray };
        }
        
        if (status) {
            filter.status = status;
        }
        
        let sortOptions = {};
        switch (sortBy) {
            case 'rating':
                sortOptions = { overallRating: -1, totalRatings: -1 };
                break;
            case 'popular':
                sortOptions = { views: -1, totalRatings: -1 };
                break;
            case 'updated':
                sortOptions = { updatedAt: -1 };
                break;
            case 'hot':
                sortOptions = { views: -1, updatedAt: -1 };
                break;
            case 'new':
                sortOptions = { createdAt: -1 };
                break;
            default:
                sortOptions = { createdAt: -1 };
        }
        
        const skip = (page - 1) * limit;
        
        const blogs = await Blog.find(filter)
            .sort(sortOptions)
            .limit(parseInt(limit))
            .skip(skip)
            .populate({
                path: 'author',
                select: 'username'
            });
            
        const total = await Blog.countDocuments(filter);
        
        res.status(200).json({
            blogs,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                hasNext: skip + blogs.length < total
            }
        });
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
    
    // Increment view count
    blog.views += 1;
    await blog.save();
    
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
};


const { v4: uuidv4 } = require('uuid'); // install with: npm i uuid

const createBlog = async (req, res) => {
    try {
        const { title, content, category, genres, status, adminRating, episodes, chapters, alternativeNames, readingReview, releaseDate } = req.body;
        let imageUrl = null;
        
        if (req.file) {
            const imgbbUrl = await uploadToImgBB(req.file.path, process.env.IMGBB_API_KEY);
            imageUrl = imgbbUrl;
            
            // Validate file path to prevent path traversal
            const uploadsDir = path.resolve(__dirname, '../uploads');
            const filePath = path.resolve(req.file.path);
            if (filePath.startsWith(uploadsDir)) {
                fs.unlinkSync(filePath);
            }
        }
        
        const author = req.user.id;
        const blogId = uuidv4();
        
        const blogData = {
            blogId,
            title,
            content,
            imageUrl,
            author,
            category,
            genres: Array.isArray(genres) ? genres : (genres ? genres.split(',') : []),
            status: status || 'Ongoing',
            adminRating: parseFloat(adminRating) || 0,
            episodes: parseInt(episodes) || 0,
            chapters: parseInt(chapters) || 0,
            alternativeNames: Array.isArray(alternativeNames) ? alternativeNames : (alternativeNames ? alternativeNames.split(',').map(name => name.trim()) : []),
            readingReview: readingReview || '',
            releaseDate: releaseDate ? new Date(releaseDate) : new Date()
        };

        const newBlog = await Blog.create(blogData);

        res.status(201).json({
            success: true,
            message: "Blog created successfully.",
            blog: newBlog,
        });
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Internal Server Error",
        });
    }
};


const updateBlog = async (req, res) => {
    try {
        const { title, content, category, genres, status, adminRating, episodes, chapters, alternativeNames, readingReview, releaseDate } = req.body;
        const updateData = { 
            title, 
            content,
            category,
            genres: Array.isArray(genres) ? genres : (genres ? genres.split(',') : []),
            status,
            adminRating: parseFloat(adminRating),
            episodes: parseInt(episodes),
            chapters: parseInt(chapters),
            alternativeNames: Array.isArray(alternativeNames) ? alternativeNames : (alternativeNames ? alternativeNames.split(',').map(name => name.trim()) : []),
            readingReview,
            releaseDate: releaseDate ? new Date(releaseDate) : undefined,
            updatedAt: new Date()
        };

        if (req.file) {
            const imgbbUrl = await uploadToImgBB(req.file.path, process.env.IMGBB_API_KEY);
            updateData.imageUrl = imgbbUrl;
            
            // Validate file path to prevent path traversal
            const uploadsDir = path.resolve(__dirname, '../uploads');
            const filePath = path.resolve(req.file.path);
            if (filePath.startsWith(uploadsDir)) {
                fs.unlinkSync(filePath);
            }
        }

        let blog = await Blog.findOne({ blogId: req.params.id });
        if (!blog) {
            blog = await Blog.findById(req.params.id);
        }
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                blog[key] = updateData[key];
            }
        });
        
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

const rateBlog = async (req, res) => {
    try {
        const { rating } = req.body;
        const userId = req.user.id;
        const blogId = req.params.id;
        
        if (rating < 0 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 0 and 5' });
        }
        
        let blog = await Blog.findOne({ blogId });
        if (!blog) {
            blog = await Blog.findById(blogId);
        }
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        
        // Check if user already rated
        const existingRating = blog.userRatings.find(r => r.user.toString() === userId);
        
        if (existingRating) {
            existingRating.rating = rating;
        } else {
            blog.userRatings.push({ user: userId, rating });
        }
        
        // Calculate overall rating
        const totalRatings = blog.userRatings.length;
        const sumRatings = blog.userRatings.reduce((sum, r) => sum + r.rating, 0);
        blog.overallRating = totalRatings > 0 ? (sumRatings / totalRatings) : 0;
        blog.totalRatings = totalRatings;
        
        await blog.save();
        
        res.json({ 
            message: 'Rating updated successfully',
            overallRating: blog.overallRating,
            totalRatings: blog.totalRatings
        });
    } catch (error) {
        console.error('Error rating blog:', error);
        res.status(500).json({ message: 'Error rating blog', error: error.message });
    }
};

const getTopBlogs = async (req, res) => {
    try {
        const { category, type = 'rating' } = req.query;
        
        let filter = {};
        if (category && category !== 'All') {
            filter.category = category;
        }
        
        let sortOptions = {};
        switch (type) {
            case 'rating':
                sortOptions = { overallRating: -1, totalRatings: -1 };
                break;
            case 'popular':
                sortOptions = { views: -1, totalRatings: -1 };
                break;
            case 'new':
                sortOptions = { createdAt: -1 };
                break;
            case 'hot':
                sortOptions = { updatedAt: -1, views: -1 };
                break;
            default:
                sortOptions = { overallRating: -1 };
        }
        
        const blogs = await Blog.find(filter)
            .sort(sortOptions)
            .limit(6)
            .populate({
                path: 'author',
                select: 'username'
            });
            
        res.json(blogs);
    } catch (error) {
        console.error('Error getting top blogs:', error);
        res.status(500).json({ message: 'Error getting top blogs', error: error.message });
    }
};

const updateEpisodesChapters = async (req, res) => {
    try {
        const { episodes, chapters, action } = req.body; // action: 'increment' or 'decrement'
        const blogId = req.params.id;
        
        let blog = await Blog.findOne({ blogId });
        if (!blog) {
            blog = await Blog.findById(blogId);
        }
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        
        if (action === 'increment') {
            if (episodes) blog.episodes += 1;
            if (chapters) blog.chapters += 1;
        } else if (action === 'decrement') {
            if (episodes && blog.episodes > 0) blog.episodes -= 1;
            if (chapters && blog.chapters > 0) blog.chapters -= 1;
        } else {
            if (episodes !== undefined) blog.episodes = parseInt(episodes);
            if (chapters !== undefined) blog.chapters = parseInt(chapters);
        }
        
        blog.updatedAt = new Date();
        await blog.save();
        
        res.json({ 
            message: 'Episodes/Chapters updated successfully',
            episodes: blog.episodes,
            chapters: blog.chapters
        });
    } catch (error) {
        console.error('Error updating episodes/chapters:', error);
        res.status(500).json({ message: 'Error updating episodes/chapters', error: error.message });
    }
};

const getHomeSections = async (req, res) => {
    try {
        const { category } = req.query;
        let filter = {};
        
        if (category && category !== 'All') {
            filter.category = category;
        }
        
        // Get highest rated blogs (admin + user ratings combined)
        const highestRated = await Blog.aggregate([
            { $match: filter },
            {
                $addFields: {
                    combinedRating: {
                        $add: [
                            { $multiply: ['$adminRating', 0.6] },
                            { $multiply: ['$overallRating', 0.4] }
                        ]
                    }
                }
            },
            { $sort: { combinedRating: -1, totalRatings: -1 } },
            { $limit: 3 },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                    pipeline: [{ $project: { username: 1 } }]
                }
            },
            {
                $addFields: {
                    author: { $arrayElemAt: ['$author', 0] }
                }
            }
        ]);
        
        // Get most popular blogs (by views)
        const mostPopular = await Blog.find(filter)
            .sort({ views: -1, totalRatings: -1 })
            .limit(3)
            .populate({ path: 'author', select: 'username' });
        
        // Get recently updated blogs
        const recentlyUpdated = await Blog.find(filter)
            .sort({ updatedAt: -1 })
            .limit(3)
            .populate({ path: 'author', select: 'username' });
        
        // Get trending blogs (high views + recent activity)
        const trending = await Blog.find({
            ...filter,
            updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
        })
            .sort({ views: -1, updatedAt: -1 })
            .limit(3)
            .populate({ path: 'author', select: 'username' });
        
        // Get newest blogs (by release date)
        const newest = await Blog.find(filter)
            .sort({ releaseDate: -1 })
            .limit(3)
            .populate({ path: 'author', select: 'username' });
        
        res.json({
            highestRated,
            mostPopular,
            recentlyUpdated,
            trending,
            newest
        });
    } catch (error) {
        console.error('Error getting home sections:', error);
        res.status(500).json({ message: 'Error getting home sections', error: error.message });
    }
};

module.exports = {
    getAllBlogs,
    getBlogbyId,
    createBlog,
    updateBlog,
    deleteBlog,
    rateBlog,
    getTopBlogs,
    updateEpisodesChapters,
    getHomeSections,
};