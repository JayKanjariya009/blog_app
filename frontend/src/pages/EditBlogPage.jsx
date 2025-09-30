import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBlogById, updateBlog } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import RichTextEditor from '../components/common/RichTextEditor';

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

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useContext(AuthContext);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Redirect if user is not admin
    if (user && !isAdmin()) {
      navigate('/');
      return;
    }

    const getBlog = async () => {
      try {
        const data = await fetchBlogById(id);
        setTitle(data.title);
        setContent(data.content);
        setCurrentImageUrl(data.imageUrl);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching blog ${id}:`, err);
        setError('Failed to load blog. Please try again later.');
        setLoading(false);
      }
    };

    getBlog();
  }, [id, user, isAdmin, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    setSaving(true);
    setError('');
    
    try {
      const blogData = {
        title,
        content,
        image
      };
      
      await updateBlog(id, blogData);
      navigate(`/blog/${id}`);
    } catch (err) {
      console.error('Error updating blog:', err);
      setError('Failed to update blog. Please try again.');
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Blog</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 mb-2 font-medium">Blog Title</label>
          <input
            type="text"
            id="title"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="image" className="block text-gray-700 mb-2 font-medium">Featured Image</label>
          <input
            type="file"
            id="image"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept="image/*"
            onChange={handleImageChange}
          />
          
          {imagePreview ? (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">New image preview:</p>
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-64 rounded-lg"
              />
            </div>
          ) : currentImageUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Current image:</p>
              <img 
                src={formatImageUrl(currentImageUrl)} 
                alt="Current" 
                className="max-h-64 rounded-lg"
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-theme mb-2 font-medium">Blog Content</label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write your blog content here..."
          />
        </div>
        
        <div className="pt-10">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Update Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlogPage;