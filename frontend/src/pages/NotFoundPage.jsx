import { Link } from 'react-router-dom';
import SEOHead, { SEO_CONFIGS } from '../components/common/SEOHead';

const NotFoundPage = () => {
  return (
    <>
      <SEOHead {...SEO_CONFIGS.notFound} />
      <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-8">Page Not Found</h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
      >
        Go to Homepage
      </Link>
      </div>
    </>
  );
};

export default NotFoundPage;