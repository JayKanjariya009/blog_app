import { useState, useEffect } from 'react';
import { fetchAllBlogs } from '../utils/api';
import EnhancedBlogCard from '../components/blog/EnhancedBlogCard';
import SEOHead, { SEO_CONFIGS } from '../components/common/SEOHead';
import GenreFilter from '../components/filters/GenreFilter';
import StatusFilter from '../components/filters/StatusFilter';
import ChapterFilter from '../components/filters/ChapterFilter';
import CategoryFilter from '../components/filters/CategoryFilter';

const EnhancedBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [layout, setLayout] = useState('grid');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [chapterRange, setChapterRange] = useState({ min: 0, max: 100 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadBlogs();
  }, [sortBy]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await fetchAllBlogs();
      setBlogs(Array.isArray(data) ? data : data.blogs || []);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = (Array.isArray(blogs) ? blogs : []).filter(blog => {
    const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenres = selectedGenres.length === 0 || 
                         selectedGenres.some(genre => blog.genres?.includes(genre));
    const matchesStatus = selectedStatus === 'All' || blog.status === selectedStatus;
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    const blogChapters = blog.chapters || 0;
    const matchesChapters = blogChapters >= chapterRange.min && 
                           (chapterRange.max === 0 || blogChapters <= chapterRange.max);
    
    return matchesSearch && matchesGenres && matchesStatus && matchesCategory && matchesChapters;
  });

  return (
    <>
      <SEOHead {...SEO_CONFIGS.blogs} />
      <div className="container-responsive py-4 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">All Blogs</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Discover amazing stories and articles</p>
        </div>

        {/* Controls */}
        <div className="space-y-4 mb-6">
          {/* Search & Filter Toggle */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 text-sm"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
                Filters
              </button>
            </div>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <CategoryFilter 
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
                <StatusFilter 
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                />
                <GenreFilter 
                  selectedGenres={selectedGenres}
                  onGenresChange={setSelectedGenres}
                />
                <ChapterFilter 
                  minChapters={chapterRange.min}
                  maxChapters={chapterRange.max}
                  onChapterChange={setChapterRange}
                  blogs={blogs}
                />
              </div>
            </div>
          )}
          
          {/* Sort & Layout Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 text-sm"
            >
              <option value="createdAt">Latest</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
              <option value="updated">Recently Updated</option>
            </select>
            
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setLayout('grid')}
                className={`flex-1 px-4 py-2 rounded text-sm ${layout === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                Grid
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`flex-1 px-4 py-2 rounded text-sm ${layout === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className={layout === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "space-y-4"
          }>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm animate-pulse">
                <div className="h-40 sm:h-48 bg-gray-300 dark:bg-gray-700 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={layout === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "space-y-4"
          }>
            {filteredBlogs.map((blog) => (
              <EnhancedBlogCard key={blog._id} blog={blog} layout={layout} />
            ))}
          </div>
        )}
        
        {filteredBlogs.length === 0 && !loading && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-lg text-gray-600 mb-2">No blogs found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </>
  );
};

export default EnhancedBlogsPage;