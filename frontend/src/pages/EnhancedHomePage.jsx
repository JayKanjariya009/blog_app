import { useState, useEffect } from 'react';
import { fetchHomeSections } from '../utils/api';
import BlogSection from '../components/blog/BlogSection';
import SEOHead, { SEO_CONFIGS } from '../components/common/SEOHead';
import AnimatedHero from '../components/common/AnimatedHero';

const EnhancedHomePage = () => {
  const [sections, setSections] = useState({
    highestRated: [],
    mostPopular: [],
    recentlyUpdated: [],
    trending: [],
    newest: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    loadHomeSections();
  }, [selectedCategory]);

  const loadHomeSections = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHomeSections(selectedCategory);
      setSections(data);
    } catch (err) {
      console.error('Error loading home sections:', err);
      setError('Failed to load content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Anime', 'Manga', 'Manhwa', 'Manhua'];



  return (
    <>
      <SEOHead {...SEO_CONFIGS.home} />
      <div className="space-y-6 sm:space-y-8 md:space-y-12">
        <AnimatedHero />

        {/* Category Filter */}
        <section className="container-responsive">
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <div className="container-responsive">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md animate-pulse">
                  <div className="h-48 sm:h-56 md:h-64 bg-gray-300 dark:bg-gray-700 rounded-t-lg"></div>
                  <div className="p-3 sm:p-4 md:p-6">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-16 sm:h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="container-responsive">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-lg">
              <span>{error}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-12">
            <BlogSection 
              title="🏆 Highest Rated" 
              blogs={sections.highestRated} 
              viewAllLink="/blogs?sortBy=rating"
              icon="🏆"
            />
            
            <BlogSection 
              title="🔥 Most Popular" 
              blogs={sections.mostPopular} 
              viewAllLink="/blogs?sortBy=popular"
              icon="🔥"
            />
            
            <BlogSection 
              title="📈 Trending" 
              blogs={sections.trending} 
              viewAllLink="/blogs?sortBy=hot"
              icon="📈"
            />
            
            <BlogSection 
              title="🆕 Recently Updated" 
              blogs={sections.recentlyUpdated} 
              viewAllLink="/blogs?sortBy=updated"
              icon="🆕"
            />
            
            <BlogSection 
              title="✨ Latest Releases" 
              blogs={sections.newest} 
              viewAllLink="/blogs?sortBy=new"
              icon="✨"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default EnhancedHomePage;