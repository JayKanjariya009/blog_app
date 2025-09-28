import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchBlogById, deleteBlog } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import CommentSection from '../components/comment/CommentSection';

// Helper function to format image URLs
const formatImageUrl = (url) => {
  if (!url) return '';
  
  // If URL already starts with http:// or https://, use it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If URL starts with /, append it to the base URL
  if (url.startsWith('/')) {
    return `https://blog-app-hh3f.onrender.com${url}`;
  }
  
  // Otherwise, assume it's a relative path and prepend the base URL
  return `https://blog-app-hh3f.onrender.com/${url}`;
};

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useContext(AuthContext);
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBlog = async () => {
      try {
        setLoading(true);
        const data = await fetchBlogById(id);
        setBlog(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      getBlog();
    }
  }, [id]);

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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Blog Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{blog.title}</h1>
        
        <div className="flex justify-between items-center text-gray-600 mb-6">
          <div>
            <span>By {blog.author?.username || 'Unknown'}</span>
            <span className="mx-2">•</span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
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
        <div className="mb-8">
          <img 
            src={formatImageUrl(blog.imageUrl)} 
            alt={blog.title} 
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}
      
      {/* Blog Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
      
      {/* Comments Section */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        <CommentSection blogId={id} />
      </div>
    </div>
  );
};

export default BlogDetailPage;