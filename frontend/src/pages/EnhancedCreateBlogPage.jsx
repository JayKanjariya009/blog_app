import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../utils/api';
import StarRating from '../components/common/StarRating';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SEOHead, { SEO_CONFIGS } from '../components/common/SEOHead';

const EnhancedCreateBlogPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Manga',
    genres: [],
    status: 'Ongoing',
    adminRating: 0,
    episodes: 0,
    chapters: 0,
    alternativeNames: '',
    readingReview: '',
    releaseDate: new Date().toISOString().split('T')[0]
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ['Anime', 'Manhwa', 'Manhua', 'Manga'];
  const statuses = ['Ongoing', 'Hiatus', 'Cancelled', 'Completed'];
  const genres = [
    'Action', 'Adaptation', 'Adult', 'Adventure', 'Animal', 'Anthology', 'Cartoon', 'Comedy', 'Comic', 'Cooking', 'Cultivation', 'Demons', 'Doujinshi', 'Drama', 'Ecchi', 'Fantasy', 'Full Color', 'Game', 'Gender bender', 'Ghosts', 'Harem', 'Historical', 'Horror', 'Isekai', 'Josei', 'Long strip', 'Mafia', 'Magic', 'Manga', 'Manhua', 'Manhwa', 'Martial arts', 'Mature', 'Mecha', 'Medical', 'Military', 'Monster', 'Monster girls', 'Monsters', 'Music', 'Mystery', 'Office', 'Office workers', 'One shot', 'Police', 'Psychological', 'Reincarnation', 'Romance', 'School life', 'Sci fi', 'Science fiction', 'Seinen', 'Shoujo', 'Shoujo ai', 'Shounen', 'Shounen ai', 'Slice of life', 'Smut', 'Soft Yaoi', 'Sports', 'Super Power', 'Superhero', 'Supernatural', 'Thriller', 'Time travel', 'Tragedy', 'Vampire', 'Vampires', 'Video games', 'Villainess', 'Web comic', 'Webtoons', 'Yaoi', 'Yuri', 'Zombies'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreChange = (genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('adminRating', formData.adminRating);
      formDataToSend.append('episodes', formData.episodes);
      formDataToSend.append('chapters', formData.chapters);
      formDataToSend.append('readingReview', formData.readingReview);
      formDataToSend.append('releaseDate', formData.releaseDate);
      
      // Handle genres array
      formData.genres.forEach(genre => {
        formDataToSend.append('genres', genre);
      });
      
      // Handle alternative names
      const altNames = formData.alternativeNames.split(',').map(name => name.trim()).filter(name => name);
      altNames.forEach(name => {
        formDataToSend.append('alternativeNames', name);
      });
      
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await fetch('http://localhost:3001/api/blogs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
        },
        body: formDataToSend
      });
      
      if (response.ok) {
        navigate('/admin');
      } else {
        throw new Error('Failed to create blog');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Failed to create blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead {...SEO_CONFIGS.createBlog} />
      <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Blog</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Admin Rating</label>
            <StarRating
              rating={formData.adminRating}
              onRatingChange={(rating) => setFormData(prev => ({ ...prev, adminRating: rating }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Episodes</label>
            <input
              type="number"
              name="episodes"
              value={formData.episodes}
              onChange={handleInputChange}
              min="0"
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Chapters</label>
            <input
              type="number"
              name="chapters"
              value={formData.chapters}
              onChange={handleInputChange}
              min="0"
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Release Date</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Alternative Names (comma separated)</label>
          <input
            type="text"
            name="alternativeNames"
            value={formData.alternativeNames}
            onChange={handleInputChange}
            placeholder="Alt Name 1, Alt Name 2"
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Genres</label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {genres.map(genre => (
              <label key={genre} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.genres.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                  className="rounded"
                />
                <span className="text-sm">{genre}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <div className="bg-white dark:bg-gray-800 rounded-lg">
            <ReactQuill
              value={formData.content}
              onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  ['blockquote', 'code-block'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['link', 'image'],
                  ['clean']
                ]
              }}
              className="[&_.ql-editor]:bg-white dark:[&_.ql-editor]:bg-gray-800 [&_.ql-editor]:text-gray-900 dark:[&_.ql-editor]:text-gray-100"
              style={{ height: '200px', marginBottom: '50px' }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Reading Review</label>
          <textarea
            name="readingReview"
            value={formData.readingReview}
            onChange={handleInputChange}
            rows="4"
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            placeholder="Optional review section..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Blog'}
          </button>
        </div>
      </form>
      </div>
    </>
  );
};

export default EnhancedCreateBlogPage;