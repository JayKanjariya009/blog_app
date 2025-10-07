import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-12 rounded-full overflow-hidden transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
      aria-label="Toggle theme"
    >
      {/* Sun (Light mode) */}
      <div className={`absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full transition-all duration-500 ${
        isDarkMode ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
      }`}>
        <div className="absolute inset-2 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Moon (Dark mode) */}
      <div className={`absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full transition-all duration-500 ${
        isDarkMode ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}>
        <div className="absolute inset-1 bg-slate-800 rounded-full flex items-center justify-center relative overflow-hidden">
          {/* Moon crescent */}
          <div className="absolute inset-0 bg-slate-600 rounded-full object-contain "></div>
          <div className="absolute top-1 right-1 w-6 h-6 bg-slate-900 rounded-full"></div>
          <svg className="w-4 h-4 text-slate-300 relative z-10" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;