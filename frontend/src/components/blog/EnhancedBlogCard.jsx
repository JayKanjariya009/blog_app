import { Link } from 'react-router-dom';
import StarRating from '../common/StarRating';

const EnhancedBlogCard = ({ blog, layout = 'grid' }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Ongoing': return 'bg-green-500';
      case 'Completed': return 'bg-blue-500';
      case 'Hiatus': return 'bg-yellow-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden ${
      layout === 'list' ? 'flex flex-row' : ''
    }`}>
      {/* Image */}
      {blog.imageUrl && (
        <div className={`relative overflow-hidden ${
          layout === 'list' ? 'w-32 h-40 sm:w-40 sm:h-48 flex-shrink-0' : 'h-48'
        }`}>
          <img 
            src={blog.imageUrl} 
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded-full text-white text-xs ${getStatusColor(blog.status)}`}>
              {blog.status}
            </span>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className={`${layout === 'list' ? 'p-3 flex-1' : 'p-6'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
            {blog.category}
          </span>
          <div className="flex items-center gap-1">
            <StarRating rating={blog.overallRating || blog.adminRating} size="sm" readOnly />
            <span className="text-sm text-gray-600">
              ({blog.totalRatings || 0})
            </span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-theme mb-2 line-clamp-2">
          {blog.title}
        </h3>
        
        <p className="text-theme-secondary text-sm mb-4 line-clamp-3">
          {blog.description || blog.content?.replace(/<[^>]*>/g, '').substring(0, 150) || 'No description available.'}
        </p>
        
        {/* Genres */}
        {blog.genres?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {blog.genres.slice(0, 3).map((genre) => (
              <span key={genre} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                {genre}
              </span>
            ))}
            {blog.genres.length > 3 && (
              <span className="text-xs text-gray-500">+{blog.genres.length - 3} more</span>
            )}
          </div>
        )}
        
        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-theme-secondary mb-4">
          <div className="flex items-center gap-4">
            {blog.chapters > 0 && <span>Ch: {blog.chapters}</span>}
            {blog.episodes > 0 && <span>Ep: {blog.episodes}</span>}
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
              {blog.views || 0}
            </span>
          </div>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
        
        <Link 
          to={`/blog/${blog.blogId || blog._id}`}
          state={{ from: window.location.pathname }}
          className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-center py-2 rounded-lg transition-all duration-300 font-medium"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default EnhancedBlogCard;