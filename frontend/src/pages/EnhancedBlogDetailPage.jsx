import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { fetchBlogById, deleteBlog, rateBlog } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import CommentSection from '../components/blog/CommentSection';
import StarRating from '../components/common/StarRating';
import SEOHead, { getBlogSEO } from '../components/common/SEOHead';

const EnhancedBlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useContext(AuthContext);
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    loadBlog();
  }, [id]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const data = await fetchBlogById(id);
      setBlog(data);
      
      // Check if user has already rated
      if (user && data.userRatings) {
        const existingRating = data.userRatings.find(r => r.user === user.id);
        if (existingRating) {
          setUserRating(existingRating.rating);
        }
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('Failed to load blog. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id);
        navigate('/blogs');
      } catch (err) {
        console.error('Error deleting blog:', err);
        alert('Failed to delete blog. Please try again.');
      }
    }
  };

  const handleRating = async (rating) => {
    if (!user) {
      alert('Please login to rate this blog');
      navigate('/login');
      return;
    }

    try {
      setRatingLoading(true);
      const response = await rateBlog(id, rating);
      setUserRating(rating);
      
      // Update blog with new rating
      setBlog(prev => ({
        ...prev,
        overallRating: response.overallRating,
        totalRatings: response.totalRatings
      }));
    } catch (error) {
      console.error('Error rating blog:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        navigate('/login');
      } else {
        alert('Failed to rate blog. Please try again.');
      }
    } finally {
      setRatingLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ongoing': return 'bg-green-500';
      case 'Completed': return 'bg-blue-500';
      case 'Hiatus': return 'bg-yellow-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-gray-600">Blog not found.</h3>
        <Link to="/blogs" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Blogs
        </Link>
      </div>
    );
  }

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate('/blogs');
    }
  };

  return (
    <>
      {blog && <SEOHead {...getBlogSEO(blog)} />}
      
      {/* Mobile Back Button */}
      <div className="md:hidden sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-3">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blogs
        </button>
      </div>
      
      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
      {/* Blog Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
          <span className={`px-2 sm:px-3 py-1 rounded-full text-white text-xs sm:text-sm ${getStatusColor(blog.status)}`}>
            {blog.status}
          </span>
          <span className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded-full text-xs sm:text-sm">
            {blog.category}
          </span>
        </div>
        
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">{blog.title}</h1>
        
        {blog.alternativeNames?.length > 0 && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Alternative Names: {blog.alternativeNames.join(', ')}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
          <div>
            <span>By {blog.author?.username || 'Unknown'}</span>
            <span className="mx-2">•</span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            {blog.chapters > 0 && <span>Ch: {blog.chapters}</span>}
            {blog.episodes > 0 && <span>Ep: {blog.episodes}</span>}
          </div>
          
          {isAdmin() && (
            <div className="flex space-x-4">
              <Link 
                to={`/admin/edit-blog/${id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </Link>
              <button 
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Featured Image */}
      {blog.imageUrl && (
        <div className="mb-6 sm:mb-8">
          <img 
            src={blog.imageUrl} 
            alt={blog.title} 
            className="w-full h-auto rounded-lg shadow-md object-contain max-h-64 sm:max-h-96"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      {/* Rating Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-md">
        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Rating</h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StarRating rating={blog.overallRating || blog.adminRating} readOnly />
                <span className="text-base sm:text-lg font-semibold">
                  {(blog.overallRating || blog.adminRating || 0).toFixed(1)}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                {blog.totalRatings || 0} ratings
              </p>
            </div>
          </div>
          
          {user && (
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Your Rating:</p>
              <StarRating 
                rating={userRating}
                onRatingChange={handleRating}
                readOnly={ratingLoading}
              />
            </div>
          )}
        </div>
        
        {blog.genres?.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Genres:</h4>
            <div className="flex flex-wrap gap-2">
              {blog.genres.map((genre) => (
                <span key={genre} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Blog Content */}
      <div className="prose prose-sm sm:prose-lg max-w-none mb-8 sm:mb-12 bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-md">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
      
      {/* Reading Review */}
      {blog.readingReview && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold mb-4 text-blue-800 dark:text-blue-200">Reading Review</h3>
          <div className="text-blue-700 dark:text-blue-300">
            {blog.readingReview}
          </div>
        </div>
      )}
      
      {/* Comments Section */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        <CommentSection blogId={id} />
      </div>
      </div>
    </>
  );
};

export default EnhancedBlogDetailPage;