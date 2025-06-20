import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/blog/BlogCard';
import { fetchAllBlogs } from '../utils/api';

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        setLoading(true);
        const data = await fetchAllBlogs();
        setBlogs(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again later.');
        setLoading(false);
      }
    };

    getBlogs();
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-gray-800 dark:via-purple-900 dark:to-indigo-900 text-white py-20 rounded-2xl mb-16 overflow-hidden shadow-2xl">
        {/* Background animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-indigo-700/50 animate-gradient-x"></div>
        
        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="relative container mx-auto px-4 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent animate-pulse-slow">
            Welcome to BlogApp ✨
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed text-blue-100">
            Discover insightful articles, stories, and perspectives from our community of passionate writers. 
            Join us on a journey of knowledge and inspiration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/blogs" 
              className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
            >
              🚀 Explore All Blogs
            </Link>
            <Link 
              to="/register" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              📝 Start Writing
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{blogs.length}+</h3>
            <p className="text-gray-600 dark:text-gray-300">Amazing Articles</p>
          </div>
          <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">10+</h3>
            <p className="text-gray-600 dark:text-gray-300">Talented Writers</p>
          </div>
          <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">1000+</h3>
            <p className="text-gray-600 dark:text-gray-300">Happy Readers</p>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section>
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Featured Blogs</h2>
            <p className="text-gray-600 dark:text-gray-300">Discover our most popular and recent articles</p>
          </div>
          <Link 
            to="/blogs" 
            className="group flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-300"
          >
            View All 
            <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-r-4 border-l-4 border-purple-500" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-6 rounded-xl backdrop-blur-sm">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl text-gray-600 dark:text-gray-400">No blogs available yet.</h3>
            <p className="text-gray-500 dark:text-gray-500 mt-2">Be the first to share your story!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.slice(0, 6).map((blog) => (
              <BlogCard key={blog.blogId || blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;