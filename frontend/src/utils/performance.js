// Performance optimization utilities

/**
 * Debounce function to limit the rate of function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately on first call
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

/**
 * Throttle function to limit function calls to once per specified time
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Intersection Observer for lazy loading
 * @param {Function} callback - Callback function when element intersects
 * @param {Object} options - Intersection observer options
 * @returns {IntersectionObserver} Observer instance
 */
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

/**
 * Preload critical resources
 * @param {Array} resources - Array of resource objects {href, as, type}
 */
export const preloadResources = (resources) => {
  resources.forEach(({ href, as, type, crossorigin }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    if (crossorigin) link.crossOrigin = crossorigin;
    document.head.appendChild(link);
  });
};

/**
 * Prefetch resources for future navigation
 * @param {Array} urls - Array of URLs to prefetch
 */
export const prefetchResources = (urls) => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Measure and log performance metrics
 * @param {string} name - Performance mark name
 * @param {Function} fn - Function to measure
 * @returns {Promise} Function result
 */
export const measurePerformance = async (name, fn) => {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  const measureName = `${name}-duration`;

  performance.mark(startMark);
  const result = await fn();
  performance.mark(endMark);
  performance.measure(measureName, startMark, endMark);

  if (process.env.NODE_ENV === 'development') {
    const measure = performance.getEntriesByName(measureName)[0];
    console.log(`${name} took ${measure.duration.toFixed(2)}ms`);
  }

  return result;
};

/**
 * Get Core Web Vitals
 * @param {Function} callback - Callback to receive metrics
 */
export const getCoreWebVitals = (callback) => {
  // Largest Contentful Paint
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    callback({
      name: 'LCP',
      value: lastEntry.startTime,
      rating: lastEntry.startTime > 2500 ? 'poor' : lastEntry.startTime > 1200 ? 'needs-improvement' : 'good'
    });
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      callback({
        name: 'FID',
        value: entry.processingStart - entry.startTime,
        rating: entry.processingStart - entry.startTime > 100 ? 'poor' : entry.processingStart - entry.startTime > 25 ? 'needs-improvement' : 'good'
      });
    });
  }).observe({ entryTypes: ['first-input'] });

  // Cumulative Layout Shift
  let clsValue = 0;
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
    callback({
      name: 'CLS',
      value: clsValue,
      rating: clsValue > 0.25 ? 'poor' : clsValue > 0.1 ? 'needs-improvement' : 'good'
    });
  }).observe({ entryTypes: ['layout-shift'] });
};

/**
 * Optimize images for different screen sizes
 * @param {string} src - Original image source
 * @param {number} width - Target width
 * @param {number} height - Target height
 * @param {string} format - Target format (webp, jpg, png)
 * @returns {string} Optimized image URL
 */
export const optimizeImage = (src, width, height, format = 'webp') => {
  if (!src) return '';
  
  // For external services like Unsplash
  if (src.includes('unsplash.com')) {
    return `${src}&w=${width}&h=${height}&fit=crop&fm=${format}&q=80`;
  }
  
  // For other CDNs or services, implement accordingly
  return src;
};

/**
 * Batch DOM updates to avoid layout thrashing
 * @param {Function} updateFn - Function containing DOM updates
 */
export const batchDOMUpdates = (updateFn) => {
  requestAnimationFrame(() => {
    updateFn();
  });
};

/**
 * Virtual scrolling helper for large lists
 * @param {Array} items - All items
 * @param {number} containerHeight - Container height
 * @param {number} itemHeight - Individual item height
 * @param {number} scrollTop - Current scroll position
 * @returns {Object} Visible items and positioning info
 */
export const getVirtualScrollItems = (items, containerHeight, itemHeight, scrollTop) => {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  return {
    visibleItems: items.slice(startIndex, endIndex),
    startIndex,
    endIndex,
    offsetY: startIndex * itemHeight,
    totalHeight: items.length * itemHeight
  };
};

/**
 * Memory usage monitoring
 * @returns {Object} Memory usage information
 */
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    return {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      usedPercentage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
    };
  }
  return null;
};

/**
 * Network information
 * @returns {Object} Network connection information
 */
export const getNetworkInfo = () => {
  if ('connection' in navigator) {
    return {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
      saveData: navigator.connection.saveData
    };
  }
  return null;
};

/**
 * Adaptive loading based on network conditions
 * @param {Object} options - Loading options for different network conditions
 * @returns {Object} Appropriate loading configuration
 */
export const getAdaptiveLoadingConfig = (options = {}) => {
  const networkInfo = getNetworkInfo();
  const defaultConfig = {
    imageQuality: 80,
    enableLazyLoading: true,
    preloadCount: 3,
    ...options.default
  };

  if (!networkInfo) return defaultConfig;

  const configs = {
    'slow-2g': {
      imageQuality: 60,
      enableLazyLoading: true,
      preloadCount: 1,
      ...options.slow
    },
    '2g': {
      imageQuality: 70,
      enableLazyLoading: true,
      preloadCount: 2,
      ...options.medium
    },
    '3g': {
      imageQuality: 80,
      enableLazyLoading: true,
      preloadCount: 3,
      ...options.fast
    },
    '4g': {
      imageQuality: 90,
      enableLazyLoading: false,
      preloadCount: 5,
      ...options.fast
    }
  };

  return configs[networkInfo.effectiveType] || defaultConfig;
};