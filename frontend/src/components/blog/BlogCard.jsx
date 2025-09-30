import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { constructImageUrl } from '../../utils/api';

const BlogCard = ({ blog }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    const plainText = content.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  const defaultImage = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop&crop=center';
  
  const getImageUrl = (url) => {
    if (!url) return defaultImage;
    return constructImageUrl(url);
  };

  const handleReadMore = (e) => {
    if (!user) {
      e.preventDefault();
      navigate('/login');
    }
  };

  const estimateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.replace(/<[^>]*>/g, '').split(' ').length || 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  return (
    <article className="blog-card group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 dark:border-gray-700 will-change-transform gpu-accelerated">
      {/* Image with overlay */}
      <div className="relative bg-gray-100 dark:bg-gray-700">
        <img 
          src={getImageUrl(blog.imageUrl)} 
          alt={blog.title || 'Blog post image'} 
          className="blog-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
          📝 Article
        </div>
        
        {/* Reading time badge */}
        <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
          {estimateReadTime(blog.content)} min
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold mb-3 text-theme line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {blog.title}
        </h3>
        
        {/* Content preview */}
        <p className="text-theme-secondary mb-4 line-clamp-3 leading-relaxed text-sm sm:text-base">
          {truncateContent(blog.content)}
        </p>
        
        {/* Author info */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 flex-shrink-0">
            {blog.author?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-theme truncate">
              {blog.author?.username || 'Anonymous'}
            </p>
            <p className="text-xs text-theme-muted">
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        
        {/* Action button */}
        <div className="flex justify-end">
          {user ? (
            <Link 
              to={`/blog/${blog.blogId || blog._id}`} 
              className="group/btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center text-sm font-medium"
              aria-label={`Read more about ${blog.title}`}
            >
              Read More
              <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          ) : (
            <button
              onClick={handleReadMore}
              className="group/btn bg-gradient-to-r from-gray-500 to-gray-600 hover:from-blue-600 hover:to-purple-600 text-white px-4 sm:px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center text-sm font-medium"
              aria-label="Login to read this article"
            >
              🔒 Login to Read
              <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogCard;