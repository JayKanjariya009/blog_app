const ChapterFilter = ({ minChapters, maxChapters, onChapterChange, blogs = [] }) => {
  const maxAvailableChapters = Math.max(...blogs.map(blog => blog.chapters || 0), 0);
  
  const handleMinChange = (value) => {
    const newMin = Math.max(0, Math.min(value, maxAvailableChapters));
    onChapterChange({ min: newMin, max: maxChapters });
  };

  const handleMaxChange = (value) => {
    const newMax = Math.max(0, Math.min(value, maxAvailableChapters));
    onChapterChange({ min: minChapters, max: newMax });
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Chapters</label>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400 w-8">Min:</span>
          <button
            onClick={() => handleMinChange(minChapters - 1)}
            className="w-8 h-8 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            -
          </button>
          <input
            type="number"
            value={minChapters}
            onChange={(e) => handleMinChange(parseInt(e.target.value) || 0)}
            className="flex-1 p-2 border rounded text-sm text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            min="0"
            max={maxAvailableChapters}
          />
          <button
            onClick={() => handleMinChange(minChapters + 1)}
            className="w-8 h-8 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400 w-8">Max:</span>
          <button
            onClick={() => handleMaxChange(maxChapters - 1)}
            className="w-8 h-8 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            -
          </button>
          <input
            type="number"
            value={maxChapters}
            onChange={(e) => handleMaxChange(parseInt(e.target.value) || 0)}
            className="flex-1 p-2 border rounded text-sm text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            min="0"
            max={maxAvailableChapters}
          />
          <button
            onClick={() => handleMaxChange(maxChapters + 1)}
            className="w-8 h-8 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChapterFilter;