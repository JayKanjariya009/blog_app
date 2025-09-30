import { useState, useEffect } from 'react';
import BlogCard from '../components/blog/BlogCard';
import { fetchAllBlogs } from '../utils/api';
import SEOHead, { SEO_CONFIGS } from '../components/common/SEOHead';
import { BlogCardSkeleton } from '../components/common/LoadingSpinner';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter(blog => 
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SEOHead 
        {...SEO_CONFIGS.blogs}
        title={`All Blogs (${blogs.length}) - BlogApp`}
        description={`Explore our collection of ${blogs.length} amazing blog posts from talented writers around the world.`}
      />
      <div className="container-responsive py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-theme mb-4">All Blogs</h1>
        <p className="text-theme-secondary">Explore our collection of {blogs.length} articles</p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search blogs..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-theme placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search blogs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-theme-muted hover:text-theme transition-colors duration-200"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-theme-secondary">
            Found {filteredBlogs.length} result{filteredBlogs.length !== 1 ? 's' : ''} for "{searchTerm}"
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 9 }).map((_, index) => (
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
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="text-4xl sm:text-6xl mb-4">
            {searchTerm ? '🔍' : '📝'}
          </div>
          <h3 className="text-xl sm:text-2xl text-theme-secondary mb-2">
            {searchTerm ? 'No blogs found matching your search.' : 'No blogs available yet.'}
          </h3>
          {searchTerm ? (
            <p className="text-theme-muted">Try adjusting your search terms</p>
          ) : (
            <p className="text-theme-muted">Be the first to share your story!</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog.blogId || blog._id} blog={blog} />
          ))}
        </div>
      )}
      </div>
    </>
  );
};

export default BlogsPage;