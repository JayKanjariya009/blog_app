// Image optimization utilities for production

/**
 * Generate responsive image URLs with different sizes
 * @param {string} baseUrl - Base image URL
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @param {string} quality - Image quality (default: 'auto')
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (baseUrl, width = 800, height = 400, quality = 'auto') => {
  if (!baseUrl) return null;
  
  // If it's already an external URL (like Unsplash), add optimization parameters
  if (baseUrl.includes('unsplash.com')) {
    return `${baseUrl}&w=${width}&h=${height}&fit=crop&crop=center&q=${quality === 'auto' ? '80' : quality}`;
  }
  
  // If it's a placeholder URL, return as is
  if (baseUrl.includes('placehold.co') || baseUrl.includes('placeholder')) {
    return baseUrl;
  }
  
  // For other URLs, return as is (could be enhanced with image CDN)
  return baseUrl;
};

/**
 * Generate srcSet for responsive images
 * @param {string} baseUrl - Base image URL
 * @param {Array} sizes - Array of sizes [{width, height, descriptor}]
 * @returns {string} srcSet string
 */
export const generateSrcSet = (baseUrl, sizes = []) => {
  if (!baseUrl || !sizes.length) return '';
  
  return sizes
    .map(({ width, height, descriptor }) => 
      `${getOptimizedImageUrl(baseUrl, width, height)} ${descriptor}`
    )
    .join(', ');
};

/**
 * Get default image based on context
 * @param {string} context - Context (card, hero, avatar, etc.)
 * @returns {string} Default image URL
 */
export const getDefaultImage = (context = 'card') => {
  const defaults = {
    card: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop&crop=center&q=80',
    hero: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop&crop=center&q=80',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&q=80',
    placeholder: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop&crop=center&q=80'
  };
  
  return defaults[context] || defaults.placeholder;
};

/**
 * Preload critical images
 * @param {Array} imageUrls - Array of image URLs to preload
 */
export const preloadImages = (imageUrls) => {
  if (!Array.isArray(imageUrls)) return;
  
  imageUrls.forEach(url => {
    if (url) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    }
  });
};

/**
 * Lazy load image with intersection observer
 * @param {HTMLImageElement} img - Image element
 * @param {string} src - Image source
 * @param {Function} onLoad - Callback when image loads
 */
export const lazyLoadImage = (img, src, onLoad) => {
  if (!img || !src) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target;
        image.src = src;
        image.onload = () => {
          image.classList.add('loaded');
          if (onLoad) onLoad();
        };
        observer.unobserve(image);
      }
    });
  }, {
    rootMargin: '50px'
  });
  
  observer.observe(img);
};

/**
 * Check if image URL is valid
 * @param {string} url - Image URL
 * @returns {Promise<boolean>} Promise that resolves to true if image is valid
 */
export const isValidImageUrl = (url) => {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

/**
 * Get image dimensions
 * @param {string} url - Image URL
 * @returns {Promise<{width: number, height: number}>} Promise with image dimensions
 */
export const getImageDimensions = (url) => {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('No URL provided'));
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
};

/**
 * Convert image to WebP format (if supported)
 * @param {string} url - Original image URL
 * @returns {string} WebP URL or original URL
 */
export const getWebPUrl = (url) => {
  if (!url) return url;
  
  // Check if browser supports WebP
  const supportsWebP = (() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  })();
  
  if (!supportsWebP) return url;
  
  // For Unsplash images, add WebP format
  if (url.includes('unsplash.com')) {
    return url.includes('?') ? `${url}&fm=webp` : `${url}?fm=webp`;
  }
  
  return url;
};

/**
 * Responsive image sizes for different breakpoints
 */
export const RESPONSIVE_SIZES = {
  blogCard: [
    { width: 400, height: 250, descriptor: '400w' },
    { width: 600, height: 375, descriptor: '600w' },
    { width: 800, height: 500, descriptor: '800w' }
  ],
  blogHero: [
    { width: 800, height: 400, descriptor: '800w' },
    { width: 1200, height: 600, descriptor: '1200w' },
    { width: 1600, height: 800, descriptor: '1600w' }
  ],
  avatar: [
    { width: 40, height: 40, descriptor: '40w' },
    { width: 80, height: 80, descriptor: '80w' },
    { width: 120, height: 120, descriptor: '120w' }
  ]
};