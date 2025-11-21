import { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AuthGuard = ({ children, requireAuth = false }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Check if token is expired
  const isTokenExpired = () => {
    const token = localStorage.getItem('token');
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  useEffect(() => {
    // Clear expired token and user data
    if (user && isTokenExpired()) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.reload();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If visiting root path and not authenticated, redirect to login
  if (location.pathname === '/' && !user) {
    return <Navigate to="/login" replace />;
  }

  // If accessing protected route without auth or with expired token
  if (requireAuth && (!user || isTokenExpired())) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;