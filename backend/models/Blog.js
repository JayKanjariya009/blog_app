const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  blogId: {
    type: String,
    unique: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  category: {
    type: String,
    enum: ['Anime', 'Manhwa', 'Manhua', 'Manga'],
    required: true,
  },
  genres: [{
    type: String,
    enum: ['Action', 'Adaptation', 'Adult', 'Adventure', 'Animal', 'Anthology', 'Cartoon', 'Comedy', 'Comic', 'Cooking', 'Cultivation', 'Demons', 'Doujinshi', 'Drama', 'Ecchi', 'Fantasy', 'Full Color', 'Game', 'Gender bender', 'Ghosts', 'Harem', 'Historical', 'Horror', 'Isekai', 'Josei', 'Long strip', 'Mafia', 'Magic', 'Manga', 'Manhua', 'Manhwa', 'Martial arts', 'Mature', 'Mecha', 'Medical', 'Military', 'Monster', 'Monster girls', 'Monsters', 'Music', 'Mystery', 'Office', 'Office workers', 'One shot', 'Police', 'Psychological', 'Reincarnation', 'Romance', 'School life', 'Sci fi', 'Science fiction', 'Seinen', 'Shoujo', 'Shoujo ai', 'Shounen', 'Shounen ai', 'Slice of life', 'Smut', 'Soft Yaoi', 'Sports', 'Super Power', 'Superhero', 'Supernatural', 'Thriller', 'Time travel', 'Tragedy', 'Vampire', 'Vampires', 'Video games', 'Villainess', 'Web comic', 'Webtoons', 'Yaoi', 'Yuri', 'Zombies']
  }],
  status: {
    type: String,
    enum: ['Ongoing', 'Hiatus', 'Cancelled', 'Completed'],
    default: 'Ongoing',
  },
  adminRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  userRatings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  }],
  overallRating: {
    type: Number,
    default: 0,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  episodes: {
    type: Number,
    default: 0,
  },
  chapters: {
    type: Number,
    default: 0,
  },
  alternativeNames: [{
    type: String,
    trim: true,
  }],
  readingReview: {
    type: String,
    default: '',
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  showUserRatings: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  releaseDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
