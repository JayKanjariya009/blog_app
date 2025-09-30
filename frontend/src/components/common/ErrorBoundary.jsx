import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you might want to log to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      if (Fallback) {
        return <Fallback error={this.state.error} retry={this.handleRetry} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-theme mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-theme-secondary">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-theme px-6 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                Refresh Page
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-theme-secondary hover:text-theme transition-colors">
                  Error Details (Development Only)
                </summary>
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <pre className="text-xs text-red-700 dark:text-red-300 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export const withErrorBoundary = (Component, fallback) => {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

// Custom error fallback components
export const BlogErrorFallback = ({ error, retry }) => (
  <div className="text-center py-12">
    <div className="text-4xl mb-4">📝</div>
    <h3 className="text-xl text-theme-secondary mb-2">Failed to load blog</h3>
    <p className="text-theme-muted mb-4">Something went wrong while loading this blog post.</p>
    <button
      onClick={retry}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
    >
      Try Again
    </button>
  </div>
);

export const CardErrorFallback = ({ error, retry }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
    <div className="text-center">
      <div className="text-2xl mb-2">⚠️</div>
      <p className="text-theme-secondary text-sm mb-3">Failed to load content</p>
      <button
        onClick={retry}
        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        Retry
      </button>
    </div>
  </div>
);

export default ErrorBoundary;