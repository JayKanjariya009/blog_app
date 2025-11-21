# Google Analytics Guide for Beginners

## What is Google Analytics?
Google Analytics is a free tool that tells you who visits your website, what they do, and how they found you. Think of it like a visitor counter for your blog, but much smarter!

## What We Added to Your Blog

### 1. The Tracking Code
We added a small piece of code to your website that watches what visitors do. It's invisible to users but sends data to Google.

**Location**: `frontend/index.html`
- This code runs on every page of your blog
- It automatically starts tracking when someone visits

### 2. Analytics Helper File
**Location**: `frontend/src/utils/analytics.js`

This file has two main functions:

#### `trackPageView(path)`
- **What it does**: Counts when someone visits a page
- **When it runs**: Automatically when users click links or type URLs
- **Example**: Someone visits your "About" page → Google Analytics records it

#### `trackEvent(action, category, label, value)`
- **What it does**: Tracks specific actions users take
- **When to use**: When you want to count button clicks, downloads, etc.
- **Example**: Someone clicks "Read More" → You can track this action

## How to Use Custom Tracking

### Basic Event Tracking
Add this code to any component where you want to track actions:

```javascript
import { trackEvent } from '../utils/analytics';

// Track when someone reads a blog post
trackEvent('read_blog', 'engagement', 'My Blog Title');

// Track when someone submits a comment
trackEvent('comment_posted', 'engagement', 'blog_comment');

// Track when someone downloads something
trackEvent('download', 'file', 'my-file.pdf');
```

### Real Examples for Your Blog

#### Track Blog Views
Add this to your blog detail page:
```javascript
// When someone opens a blog post
trackEvent('view_blog', 'content', blogTitle);
```

#### Track Comments
Add this when someone submits a comment:
```javascript
// When someone posts a comment
trackEvent('comment', 'engagement', 'new_comment');
```

#### Track Search
Add this when someone searches:
```javascript
// When someone searches for blogs
trackEvent('search', 'engagement', searchTerm);
```

## How to Check Your Analytics

1. Go to [Google Analytics](https://analytics.google.com)
2. Sign in with your Google account
3. Look for your website "Weeb Tsuki"
4. You'll see:
   - How many people visited today
   - Which pages are most popular
   - Where visitors come from
   - What devices they use

## What Data You'll See

### Automatic Data (No extra code needed)
- **Page Views**: Which pages people visit most
- **Users**: How many different people visit
- **Sessions**: How long people stay on your site
- **Bounce Rate**: How many people leave quickly
- **Traffic Sources**: Where visitors come from (Google, social media, etc.)

### Custom Data (When you add tracking events)
- **Button Clicks**: Which buttons people click most
- **Downloads**: What files people download
- **Form Submissions**: How many people fill out forms
- **Video Plays**: If you have videos, when people watch them

## Important Notes

### Privacy
- Google Analytics follows privacy laws
- It doesn't collect personal information like names or emails
- It uses cookies (small files) to remember visitors

### Data Delay
- New data takes 24-48 hours to show up
- Real-time data is available but limited

### Your Measurement ID
- Your ID: `G-CBR3Q2829W`
- This connects your website to your Google Analytics account
- Keep this ID safe and don't share it publicly

## Quick Start Checklist

✅ Google Analytics code is installed
✅ Automatic page tracking works
✅ Custom event tracking is ready to use

## Next Steps

1. **Wait 24-48 hours** for data to start showing
2. **Check your Google Analytics dashboard** to see visitor data
3. **Add custom tracking** to important buttons or actions
4. **Review data weekly** to understand your audience better

## Need Help?

- Google Analytics has a built-in help section
- Data might take time to appear - be patient!
- Test on your live website, not local development

---

**Remember**: Google Analytics helps you understand your visitors so you can make your blog better for them!