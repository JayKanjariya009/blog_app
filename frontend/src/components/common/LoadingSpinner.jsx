import { useTheme } from '../../context/ThemeContext';

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  showText = true,
  className = '',
  variant = 'default'
}) => {
  const { isDarkMode } = useTheme();

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const variants = {
    default: {
      primary: 'border-blue-500',
      secondary: 'border-purple-500'
    },
    minimal: {
      primary: 'border-gray-400 dark:border-gray-500',
      secondary: 'border-gray-300 dark:border-gray-600'
    },
    gradient: {
      primary: 'border-transparent bg-gradient-to-r from-blue-500 to-purple-500',
      secondary: 'border-transparent bg-gradient-to-r from-purple-500 to-pink-500'
    }
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        {/* Primary spinner */}
        <div 
          className={`
            ${sizeClasses[size]} 
            animate-spin 
            rounded-full 
            border-4 
            border-t-4 
            border-b-4 
            ${variant === 'gradient' ? currentVariant.primary : `border-t-transparent border-b-transparent ${currentVariant.primary}`}
          `}
          role="status"
          aria-label="Loading"
        />
        
        {/* Secondary spinner for dual effect */}
        {variant === 'default' && (
          <div 
            className={`
              absolute 
              top-0 
              left-0 
              ${sizeClasses[size]} 
              animate-spin 
              rounded-full 
              border-4 
              border-r-4 
              border-l-4 
              border-r-transparent 
              border-l-transparent 
              ${currentVariant.secondary}
            `}
            style={{
              animationDirection: 'reverse',
              animationDuration: '1.5s'
            }}
          />
        )}
      </div>
      
      {showText && text && (
        <p className="text-theme-secondary text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

// Skeleton loading component for content
export const SkeletonLoader = ({ 
  lines = 3, 
  showAvatar = false, 
  showImage = false,
  className = '' 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {showImage && (
        <div className="skeleton h-48 w-full mb-4 rounded-lg" />
      )}
      
      <div className="space-y-3">
        {showAvatar && (
          <div className="flex items-center space-x-3">
            <div className="skeleton h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="skeleton h-4 w-1/4 rounded" />
              <div className="skeleton h-3 w-1/6 rounded" />
            </div>
          </div>
        )}
        
        <div className="skeleton h-6 w-3/4 rounded" />
        
        {Array.from({ length: lines }).map((_, index) => (
          <div 
            key={index}
            className={`skeleton h-4 rounded ${
              index === lines - 1 ? 'w-2/3' : 'w-full'
            }`} 
          />
        ))}
      </div>
    </div>
  );
};

// Card skeleton for blog cards
export const BlogCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="skeleton h-48 w-full" />
      <div className="p-6">
        <div className="skeleton h-6 w-3/4 mb-3 rounded" />
        <div className="space-y-2 mb-4">
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-2/3 rounded" />
        </div>
        <div className="flex items-center mb-4">
          <div className="skeleton h-8 w-8 rounded-full mr-3" />
          <div className="space-y-1 flex-1">
            <div className="skeleton h-4 w-1/3 rounded" />
            <div className="skeleton h-3 w-1/4 rounded" />
          </div>
        </div>
        <div className="flex justify-end">
          <div className="skeleton h-10 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
};

// Page loading overlay
export const PageLoader = ({ message = 'Loading page...' }) => {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" text={message} />
      </div>
    </div>
  );
};

export default LoadingSpinner;