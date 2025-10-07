import { useState } from 'react';

const GenreFilter = ({ selectedGenres, onGenresChange }) => {
  const [tempGenres, setTempGenres] = useState(selectedGenres);
  const [isOpen, setIsOpen] = useState(false);

  const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 
    'Sci-fi', 'Slice of life', 'Sports', 'Supernatural', 'Thriller', 'Mystery',
    'Historical', 'Psychological', 'Martial arts', 'School life', 'Isekai'
  ];

  const handleGenreToggle = (genre) => {
    setTempGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleApply = () => {
    onGenresChange(tempGenres);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempGenres(selectedGenres);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 text-left flex justify-between items-center"
      >
        <span className="text-sm">
          {selectedGenres.length > 0 ? `${selectedGenres.length} genres selected` : 'Select genres'}
        </span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {genres.map(genre => (
                <label key={genre} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={tempGenres.includes(genre)}
                    onChange={() => handleGenreToggle(genre)}
                    className="rounded"
                  />
                  <span>{genre}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleApply}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700"
              >
                Apply
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-300 dark:bg-gray-600 py-2 px-4 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenreFilter;