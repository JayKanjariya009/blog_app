import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllBlogs, deleteBlog, updateEpisodesChapters } from '../utils/api';
import StarRating from '../components/common/StarRating';
import SEOHead, { SEO_CONFIGS } from '../components/common/SEOHead';

const EnhancedAdminDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [layout, setLayout] = useState('grid');

  useEffect(() => {
    loadBlogs();
  }, [selectedCategory, selectedGenres, selectedStatus]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        genres: selectedGenres.length > 0 ? selectedGenres.join(',') : undefined,
        status: selectedStatus !== 'All' ? selectedStatus : undefined
      };
      
      const data = await fetchAllBlogs(params);
      setBlogs(Array.isArray(data) ? data : data.blogs || []);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id);
        setBlogs(blogs.filter(blog => (blog.blogId || blog._id) !== id));
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Failed to delete blog');
      }
    }
  };

  const handleEpisodeChapterUpdate = async (blogId, type, action) => {
    try {
      const data = { [type]: true, action };
      await updateEpisodesChapters(blogId, data);
      loadBlogs(); // Refresh the list
    } catch (error) {
      console.error('Error updating episodes/chapters:', error);
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

  return (
    <>
      <SEOHead {...SEO_CONFIGS.admin} />
      <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Enhanced Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your blog content ({blogs.length} total)</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setLayout('grid')}
              className={`px-4 py-2 rounded text-sm ${layout === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
            >
              Grid
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`px-4 py-2 rounded text-sm ${layout === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
            >
              List
            </button>
          </div>
          <Link 
            to="/admin/create-blog" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            + Create New Blog
          </Link>
        </div>
      </div>



      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className={layout === 'grid' 
          ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {blogs.map((blog) => (
            <div key={blog._id} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${
              layout === 'list' ? 'flex flex-row' : ''
            }`}>
              <div className={`relative overflow-hidden ${
                layout === 'list' ? 'w-32 h-40 sm:w-40 sm:h-48 flex-shrink-0' : 'h-48'
              }`}>
                <img 
                  src={blog.imageUrl || 'https://placehold.co/400x250?text=Blog+Image'} 
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(blog.status)}`}>
                    {blog.status}
                  </span>
                  <span className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs">
                    {blog.category}
                  </span>
                </div>
              </div>
              
              <div className={`${layout === 'list' ? 'p-3 flex-1' : 'p-4'}`}>
                <h3 className={`font-bold mb-2 line-clamp-2 ${
                  layout === 'list' ? 'text-sm sm:text-lg' : 'text-lg'
                }`}>{blog.title}</h3>
                
                {blog.alternativeNames?.length > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Alt: {blog.alternativeNames.slice(0, 2).join(', ')}
                  </p>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <StarRating rating={blog.overallRating || blog.adminRating} readOnly size="sm" />
                    <span className="text-sm text-gray-600">({blog.totalRatings || 0})</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {blog.showUserRatings ? 'User Ratings' : 'Admin Rating'}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-4 text-sm">
                    {blog.chapters > 0 && (
                      <div className="flex items-center gap-1">
                        <span>Ch: {blog.chapters}</span>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleEpisodeChapterUpdate(blog._id, 'chapters', 'decrement')}
                            className="w-5 h-5 bg-red-500 text-white rounded text-xs"
                          >
                            -
                          </button>
                          <button 
                            onClick={() => handleEpisodeChapterUpdate(blog._id, 'chapters', 'increment')}
                            className="w-5 h-5 bg-green-500 text-white rounded text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                    {blog.episodes > 0 && (
                      <div className="flex items-center gap-1">
                        <span>Ep: {blog.episodes}</span>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleEpisodeChapterUpdate(blog._id, 'episodes', 'decrement')}
                            className="w-5 h-5 bg-red-500 text-white rounded text-xs"
                          >
                            -
                          </button>
                          <button 
                            onClick={() => handleEpisodeChapterUpdate(blog._id, 'episodes', 'increment')}
                            className="w-5 h-5 bg-green-500 text-white rounded text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={`flex flex-wrap gap-1 mb-4 ${
                  layout === 'list' ? 'hidden sm:flex' : ''
                }`}>
                  {blog.genres?.slice(0, layout === 'list' ? 2 : 3).map((genre) => (
                    <span key={genre} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                      {genre}
                    </span>
                  ))}
                  {blog.genres?.length > (layout === 'list' ? 2 : 3) && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                      +{blog.genres.length - (layout === 'list' ? 2 : 3)}
                    </span>
                  )}
                </div>
                
                <div className={`flex gap-2 ${
                  layout === 'list' ? 'flex-col sm:flex-row' : ''
                }`}>
                  <Link 
                    to={`/admin/edit-blog/${blog.blogId || blog._id}`}
                    className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-center ${
                      layout === 'list' ? 'px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm' : 'px-3 py-2 text-sm'
                    }`}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(blog.blogId || blog._id)}
                    className={`flex-1 bg-red-600 hover:bg-red-700 text-white rounded ${
                      layout === 'list' ? 'px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm' : 'px-3 py-2 text-sm'
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {blogs.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600 mb-4">No blogs found</h3>
          <Link 
            to="/admin/create-blog" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Create Your First Blog
          </Link>
        </div>
      )}
      </div>
    </>
  );
};

export default EnhancedAdminDashboard;