import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchBlogById, deleteBlog, constructImageUrl } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import CommentSection from '../components/comment/CommentSection';
import SEOHead from '../components/common/SEOHead';
import LoadingSpinner, { SkeletonLoader } from '../components/common/LoadingSpinner';
import { getOptimizedImageUrl, getDefaultImage } from '../utils/imageUtils';



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
      <div className="container-responsive py-8">
        <SkeletonLoader 
          lines={4} 
          showAvatar={true} 
          showImage={true} 
          className="max-w-4xl mx-auto"
        />
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

  const estimateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.replace(/<[^>]*>/g, '').split(' ').length || 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const defaultImage = getDefaultImage('hero');
  const optimizedImageUrl = blog.imageUrl ? getOptimizedImageUrl(constructImageUrl(blog.imageUrl), 800, 400) : defaultImage;
  
  // SEO data
  const seoData = {
    title: `${blog.title} - BlogApp`,
    description: blog.content?.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
    keywords: `blog, article, ${blog.title}, ${blog.author?.username}`,
    author: blog.author?.username || 'BlogApp',
    image: optimizedImageUrl,
    type: 'article',
    publishedTime: blog.createdAt,
    modifiedTime: blog.updatedAt,
    section: 'Blog',
    tags: [blog.title.split(' ').slice(0, 3)].flat()
  };

  return (
    <>
      <SEOHead {...seoData} />
      <article className="container-responsive py-8">
      {/* Blog Header */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-theme mb-6 leading-tight">
          {blog.title}
        </h1>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-theme-secondary mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                {blog.author?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <p className="font-medium text-theme">
                  {blog.author?.username || 'Unknown'}
                </p>
                <div className="flex items-center text-sm text-theme-muted">
                  <time dateTime={blog.createdAt}>
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <span className="mx-2">•</span>
                  <span>{estimateReadTime(blog.content)} min read</span>
                </div>
              </div>
            </div>
          </div>
          
          {isAdmin() && (
            <div className="flex space-x-3 no-print">
              <Link 
                to={`/admin/edit-blog/${id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center text-sm font-medium"
                aria-label="Edit this blog post"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>
              <button 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center text-sm font-medium"
                aria-label="Delete this blog post"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </header>
      
      {/* Featured Image */}
      <figure className="mb-8 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
        <img 
          src={optimizedImageUrl}
          alt={blog.title || 'Blog post featured image'} 
          className="blog-image-hero shadow-xl"
          loading="eager"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
      </figure>
      
      {/* Blog Content */}
      <div className="prose prose-lg prose-gray dark:prose-invert max-w-none mb-12 text-theme">
        <div 
          dangerouslySetInnerHTML={{ __html: blog.content }} 
          className="leading-relaxed"
        />
      </div>
      
      {/* Comments Section */}
      <section className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-2xl font-bold mb-6 text-theme">Comments</h2>
        <CommentSection blogId={id} />
      </section>
    </article>
    </>
  );
};

export default BlogDetailPage;