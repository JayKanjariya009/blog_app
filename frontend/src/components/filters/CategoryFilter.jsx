const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categories = ['All', 'Anime', 'Manga', 'Manhwa', 'Manhua'];

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Category</label>
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 text-sm"
      >
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;