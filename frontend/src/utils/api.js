import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://blog-app-hh3f.onrender.com/api";
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (error) {
      console.warn('Invalid user data in localStorage');
      localStorage.removeItem('user');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle authentication redirects
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Blog API functions
// utils/api.js
export const constructImageUrl = (path) => {
  if (!path) return null;
  
  // ImgBB returns full URLs, so just return them directly
  return path;
};

export const fetchAllBlogs = async (params = {}) => {
  try {
    const response = await api.get("/blogs", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export const fetchHomeSections = async (category = 'All') => {
  try {
    const response = await api.get("/blogs/home/sections", { params: { category } });
    return response.data;
  } catch (error) {
    console.error("Error fetching home sections:", error);
    throw error;
  }
};



export const rateBlog = async (blogId, rating) => {
  try {
    const response = await api.post(`/blogs/${blogId}/rate`, { rating });
    return response.data;
  } catch (error) {
    console.error("Error rating blog:", error);
    throw error;
  }
};

export const updateEpisodesChapters = async (blogId, data) => {
  try {
    const response = await api.patch(`/blogs/${blogId}/episodes-chapters`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating episodes/chapters:", error);
    throw error;
  }
};

export const fetchBlogById = async (id) => {
  try {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog ${id}:`, error);
    throw error;
  }
};

export const createBlog = async (blogData) => {
  try {
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("content", blogData.content);
    formData.append("genre", blogData.genre);

    if (blogData.image) {
      formData.append("image", blogData.image);
    }

    const response = await api.post("/blogs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};

export const updateBlog = async (id, blogData) => {
  try {
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("content", blogData.content);
    formData.append("genre", blogData.genre);

    if (blogData.image) {
      formData.append("image", blogData.image);
    }

    const response = await api.put(`/blogs/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error updating blog ${id}:`, error);
    throw error;
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting blog ${id}:`, error);
    throw error;
  }
};

// Authentication API functions
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Comment API functions
export const fetchComments = async (blogId) => {
  try {
    const response = await api.get(`/blogs/${blogId}/comments`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for blog ${blogId}:`, error);
    throw error;
  }
};

export const addComment = async (blogId, content) => {
  try {
    const response = await api.post(`/blogs/${blogId}/comments`, { content });
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error);
    throw error;
  }
};

export { api };
export default api;
