import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/blog/BlogCard';
import { fetchAllBlogs } from '../utils/api';
import SEOHead, { SEO_CONFIGS } from '../components/common/SEOHead';
import { BlogCardSkeleton } from '../components/common/LoadingSpinner';

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
    <>
      <SEOHead {...SEO_CONFIGS.home} />
      <div className="relative">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-gray-800 dark:via-purple-900 dark:to-indigo-900 text-white py-16 sm:py-20 lg:py-24 rounded-2xl mb-12 sm:mb-16 overflow-hidden shadow-2xl">
        {/* Background animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-indigo-700/50 animate-gradient-x"></div>
        
        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-16 sm:w-20 h-16 sm:h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-24 sm:w-32 h-24 sm:h-32 bg-white/5 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/4 w-12 sm:w-16 h-12 sm:h-16 bg-white/10 rounded-full blur-lg animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="relative container-responsive text-center z-10">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent animate-pulse-slow leading-tight">
            Welcome to BlogApp ✨
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed text-blue-100">
            Discover insightful articles, stories, and perspectives from our community of passionate writers. 
            Join us on a journey of knowledge and inspiration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/blogs" 
              className="bg-white text-blue-700 hover:bg-blue-50 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg will-change-transform"
            >
              🚀 Explore All Blogs
            </Link>
            <Link 
              to="/register" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 will-change-transform"
            >
              📝 Start Writing
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-12 sm:mb-16">
        <div className="container-responsive">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 will-change-transform">
              <div className="text-3xl sm:text-4xl mb-4">📚</div>
              <h3 className="text-xl sm:text-2xl font-bold text-theme mb-2">{blogs.length}+</h3>
              <p className="text-theme-secondary">Amazing Articles</p>
            </div>
            <div className="text-center bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 will-change-transform">
              <div className="text-3xl sm:text-4xl mb-4">✍️</div>
              <h3 className="text-xl sm:text-2xl font-bold text-theme mb-2">10+</h3>
              <p className="text-theme-secondary">Talented Writers</p>
            </div>
            <div className="text-center bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 will-change-transform sm:col-span-2 lg:col-span-1">
              <div className="text-3xl sm:text-4xl mb-4">🌟</div>
              <h3 className="text-xl sm:text-2xl font-bold text-theme mb-2">1000+</h3>
              <p className="text-theme-secondary">Happy Readers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section>
        <div className="container-responsive">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-theme mb-2">Featured Blogs</h2>
              <p className="text-theme-secondary">Discover our most popular and recent articles</p>
            </div>
            <Link 
              to="/blogs" 
              className="group flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-300 self-start sm:self-auto"
            >
              View All 
              <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <BlogCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-6 rounded-xl backdrop-blur-sm">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-4xl sm:text-6xl mb-4">📝</div>
              <h3 className="text-xl sm:text-2xl text-theme-secondary mb-2">No blogs available yet.</h3>
              <p className="text-theme-muted">Be the first to share your story!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blogs.slice(0, 6).map((blog) => (
                <BlogCard key={blog.blogId || blog._id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </section>
      </div>
    </>
  );
};

export default HomePage;