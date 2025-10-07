# Home Page Features

## New Blog Sections Added

### 1. 🏆 Highest Rated
- **Criteria**: Combined rating from admin ratings (60% weight) and user ratings (40% weight)
- **Limit**: Top 3 blogs
- **Sorting**: Highest combined rating first, then by total number of ratings

### 2. 🔥 Most Popular  
- **Criteria**: Based on view counts
- **Limit**: Top 3 blogs
- **Sorting**: Highest views first, then by total ratings as tiebreaker

### 3. 📈 Trending
- **Criteria**: High views + recent activity (updated within last 7 days)
- **Limit**: Top 3 blogs
- **Sorting**: Views first, then by update date

### 4. 🆕 Recently Updated
- **Criteria**: Most recently updated blogs
- **Limit**: Top 3 blogs
- **Sorting**: Latest update date first

### 5. ✨ Latest Releases
- **Criteria**: Most recently released blogs (by admin-set release date)
- **Limit**: Top 3 blogs
- **Sorting**: Latest release date first

## Database Changes

### Blog Model Updates
- **Added `views` field**: Tracks how many times a blog has been viewed
- **Added `releaseDate` field**: Admin-controlled release date for proper chronological ordering
- **View tracking**: Automatically increments when users visit blog detail page

### New API Endpoints
- `GET /api/blogs/home/sections?category=All` - Fetches all home page sections
- Supports category filtering (All, Anime, Manga, Manhwa, Manhua)

### Enhanced Sorting Options
Updated existing endpoints to support:
- `sortBy=popular` - Sort by views
- `sortBy=hot` - Sort by views + update date
- `sortBy=new` - Sort by creation date

## Frontend Updates

### Home Page Sections
- **Category Filter**: Toggle between All, Anime, Manga, Manhwa, Manhua
- **Section Components**: Reusable BlogSection component for each category
- **View All Links**: Direct links to filtered blog pages

### Blog Card Enhancements
- **View Counter**: Shows eye icon with view count
- **Responsive Design**: Works on mobile, tablet, and desktop

## Migration Scripts

### `addViewsField.js`
- Adds `views` field to existing blogs (default: 0)
- Ensures all blogs have proper default values

### `addSampleViews.js`
- Adds random view counts for testing (10-1000 views)
- Useful for demonstrating the popularity features

### `addReleaseDates.js`
- Adds release date field to existing blogs (defaults to creation date)
- Ensures all blogs have proper release date for sorting

## Usage

### Admin Release Date Control
- **Create Blog**: Admin sets release date when creating new content
- **Edit Blog**: Admin can modify release date for existing content
- **Latest Releases**: Section shows content by release date, not creation date
- **Future Releases**: Can set future dates for scheduled content

### For Anime Content
The same structure works for anime since the Blog model includes:
- `category` field with 'Anime' option
- All sections automatically filter by category
- Same rating, view tracking, and release date system

### API Examples

```javascript
// Get all home sections for anime
GET /api/blogs/home/sections?category=Anime

// Get popular blogs
GET /api/blogs?sortBy=popular&limit=10

// Get trending content
GET /api/blogs?sortBy=hot&limit=10
```

## Future Enhancements

1. **User Engagement Metrics**: Track likes, bookmarks, reading time
2. **Personalized Recommendations**: Based on user reading history
3. **Advanced Trending Algorithm**: Consider engagement rate, not just views
4. **Weekly/Monthly Top Lists**: Time-based popularity rankings