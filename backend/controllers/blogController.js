const Blog = require("../models/Blog");
const { v4: uuidv4 } = require("uuid");

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username",
      });

    // Ensure all imageUrls have the correct format
    const formattedBlogs = blogs.map((blog) => {
      const blogObj = blog.toObject();
      if (blogObj.imageUrl) {
        // Make sure imageUrl starts with http:// or https:// or /
        if (
          !blogObj.imageUrl.startsWith("http://") &&
          !blogObj.imageUrl.startsWith("https://") &&
          !blogObj.imageUrl.startsWith("/")
        ) {
          blogObj.imageUrl = `/${blogObj.imageUrl}`;
        }
      }
      return blogObj;
    });

    res.status(200).json(formattedBlogs);
  } catch (error) {
    console.log("Error getting all blogs", error);
    res.status(500).json({
      success: false,
      error: "An unexpected error occurred on the server.",
      message: "Internal Server Error. Please try again later.",
    });
  }
};

const getBlogbyId = async (req, res) => {
  try {
    const blog = await Blog.findOne({ blogId: req.params.id }).populate({
      path: "author",
      select: "username",
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Ensure imageUrl has the full server URL if it exists
    if (blog.imageUrl) {
      // Make sure imageUrl starts with http:// or https:// or /
      if (
        !blog.imageUrl.startsWith("http://") &&
        !blog.imageUrl.startsWith("https://") &&
        !blog.imageUrl.startsWith("/")
      ) {
        blog.imageUrl = `/${blog.imageUrl}`;
      }
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    // When using GridFS, req.file.filename is available once upload.single('image') has run.
    // Set the imageUrl to the new endpoint
    const imageUrl = req.file ? `/image/${req.file.filename}` : null;
    const author = req.user.id; // Assumed from authentication middleware

    const blogId = uuidv4();

    const newBlog = await Blog.create({
      blogId,
      title,
      content,
      imageUrl,
      author,
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
      updateData.imageUrl = `/image/${req.file.filename}`;
    }

    let blog = await Blog.findOne({ blogId: req.params.id });
    if (!blog) {
      blog = await Blog.findById(req.params.id);
    }
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    Object.keys(updateData).forEach((key) => {
      blog[key] = updateData[key];
    });
    const updated = await blog.save();
    res.json(updated);
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ message: "Error updating blog", error: err.message });
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
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete the blog
    await Blog.findByIdAndDelete(blog._id);
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ message: "Error deleting blog", error: err.message });
  }
};

module.exports = {
  getAllBlogs,
  getBlogbyId,
  createBlog,
  updateBlog,
  deleteBlog,
};