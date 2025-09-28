import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const BlogCard = ({ blog }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  // Function to truncate content for preview
  const truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    const plainText = content.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  // Default image if none provided
  const defaultImage = 'https://placehold.co/400x250?text=Blog+Image';
  
  // Format image URL if it exists
  const getImageUrl = (url) => {
    if (!url) return defaultImage;
    
    // If URL already starts with http:// or https://, use it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If URL starts with /, append it to the base URL
    if (url.startsWith('/')) {
      return `https://blog-app-hh3f.onrender.com/${url}`;
    }
    
    // Otherwise, assume it's a relative path and prepend the base URL
    return `https://blog-app-hh3f.onrender.com//${url}`;
  };

  const handleReadMore = (e) => {
    if (!user) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border border-gray-100 dark:border-gray-700">
      {/* Image with overlay */}
      <div className="relative overflow-hidden">
        <img 
          src={getImageUrl(blog.imageUrl)} 
          alt={blog.title} 
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Category badge */}
        <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          📝 Article
        </div>
      </div>
      
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {blog.title}
        </h3>
        
        {/* Content preview */}
        <div className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
          {truncateContent(blog.content)}
        </div>
        
        {/* Author info */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
            {blog.author?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {blog.author?.username || 'Anonymous'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        
        {/* Read more button */}
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            5 min read
          </div>
          
          {user ? (
            <Link 
              to={`/blog/${blog.blogId || blog._id}`} 
              className="group/btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
            >
              Read More
              <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          ) : (
            <button
              onClick={handleReadMore}
              className="group/btn bg-gradient-to-r from-gray-500 to-gray-600 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
            >
              🔒 Login to Read
              <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;