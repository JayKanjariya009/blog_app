import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-gray-800 dark:via-gray-900 dark:to-black text-white shadow-lg backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="container-responsive py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent hover:scale-105 transform transition-all duration-300 will-change-transform"
            aria-label="BlogApp Home"
          >
            ✨ BlogApp
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:block" aria-label="Main navigation">
            <ul className="flex space-x-6 xl:space-x-8 items-center">
              <li>
                <Link 
                  to="/" 
                  className="hover:text-blue-200 transition-colors duration-300 relative group font-medium"
                >
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-200 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/blogs" 
                  className="hover:text-blue-200 transition-colors duration-300 relative group font-medium"
                >
                  Blogs
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-200 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              
              {/* Theme Toggle */}
              <li>
                <ThemeToggle />
              </li>
              
              {user ? (
                <>
                  <li className="flex items-center">
                    <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 border border-white/20">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                        {(user.username || user.email).charAt(0).toUpperCase()}
                      </div>
                      <span className="mr-2 font-medium text-sm truncate max-w-24">
                        {user.username || user.email}
                      </span>
                      {user.role === 'admin' && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-xs px-2 py-1 rounded-full text-black font-semibold ml-2 flex-shrink-0">
                          Admin
                        </span>
                      )}
                    </div>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link 
                        to="/admin/dashboard" 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm font-medium will-change-transform"
                        aria-label="Admin Dashboard"
                      >
                        Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm font-medium will-change-transform"
                      aria-label="Logout"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      to="/login" 
                      className="hover:text-blue-200 transition-colors duration-300 relative group font-medium"
                    >
                      Login
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-200 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/register" 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm font-medium will-change-transform"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-3 lg:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-white/20 animate-slide-up" aria-label="Mobile navigation">
            <ul className="flex flex-col space-y-4 pt-4">
              <li>
                <Link 
                  to="/" 
                  className="block hover:text-blue-200 transition-colors duration-300 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/blogs" 
                  className="block hover:text-blue-200 transition-colors duration-300 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blogs
                </Link>
              </li>
              
              {user ? (
                <>
                  <li className="flex items-center">
                    <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {(user.username || user.email).charAt(0).toUpperCase()}
                      </div>
                      <span className="mr-2 font-medium">
                        {user.username || user.email}
                      </span>
                      {user.role === 'admin' && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-xs px-2 py-1 rounded-full text-black font-semibold ml-2">
                          Admin
                        </span>
                      )}
                    </div>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link 
                        to="/admin/dashboard" 
                        className="block text-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-full transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-center bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-2 rounded-full transition-all duration-300"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      to="/login" 
                      className="block hover:text-blue-200 transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/register" 
                      className="block text-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-full transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;