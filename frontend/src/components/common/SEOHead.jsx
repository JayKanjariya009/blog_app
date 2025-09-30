import { useEffect } from 'react';

const SEOHead = ({
  title = 'BlogApp - Share Your Stories',
  description = 'Discover insightful articles, stories, and perspectives from our community of passionate writers.',
  keywords = 'blog, articles, stories, writing, community',
  author = 'BlogApp',
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website',
  publishedTime,
  modifiedTime,
  section,
  tags = []
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      if (!content) return;
      
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'BlogApp', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Article specific tags
    if (type === 'article') {
      updateMetaTag('article:author', author, true);
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true);
      }
      if (section) {
        updateMetaTag('article:section', section, true);
      }
      if (tags.length > 0) {
        tags.forEach(tag => {
          const tagMeta = document.createElement('meta');
          tagMeta.setAttribute('property', 'article:tag');
          tagMeta.setAttribute('content', tag);
          document.head.appendChild(tagMeta);
        });
      }
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // JSON-LD structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'BlogPosting' : 'WebSite',
      name: title,
      description: description,
      url: url,
      image: image,
      author: {
        '@type': 'Person',
        name: author
      }
    };

    if (type === 'article') {
      structuredData.headline = title;
      if (publishedTime) {
        structuredData.datePublished = publishedTime;
      }
      if (modifiedTime) {
        structuredData.dateModified = modifiedTime;
      }
      if (section) {
        structuredData.articleSection = section;
      }
      if (tags.length > 0) {
        structuredData.keywords = tags.join(', ');
      }
    }

    let jsonLd = document.querySelector('script[type="application/ld+json"]');
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify(structuredData);

    // Cleanup function to remove article-specific tags when component unmounts
    return () => {
      if (type === 'article' && tags.length > 0) {
        const articleTags = document.querySelectorAll('meta[property="article:tag"]');
        articleTags.forEach(tag => tag.remove());
      }
    };
  }, [title, description, keywords, author, image, url, type, publishedTime, modifiedTime, section, tags]);

  return null; // This component doesn't render anything
};

// Hook for easy SEO management
export const useSEO = (seoData) => {
  useEffect(() => {
    // This could be used for more complex SEO logic
    // For now, it's just a placeholder for future enhancements
  }, [seoData]);
};

// Predefined SEO configurations
export const SEO_CONFIGS = {
  home: {
    title: 'BlogApp - Share Your Stories & Discover Amazing Content',
    description: 'Join our community of passionate writers and readers. Share your stories, discover amazing content, and connect with like-minded individuals.',
    keywords: 'blog, writing, stories, articles, community, share, discover'
  },
  blogs: {
    title: 'All Blogs - BlogApp',
    description: 'Explore our collection of amazing blog posts from talented writers around the world.',
    keywords: 'blogs, articles, posts, writing, stories, collection'
  },
  login: {
    title: 'Login - BlogApp',
    description: 'Login to your BlogApp account to start sharing your stories and engaging with the community.',
    keywords: 'login, signin, account, access'
  },
  register: {
    title: 'Register - BlogApp',
    description: 'Join BlogApp today and start sharing your stories with our amazing community of writers and readers.',
    keywords: 'register, signup, join, account, community'
  }
};

export default SEOHead;