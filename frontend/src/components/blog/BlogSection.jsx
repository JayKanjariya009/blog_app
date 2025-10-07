import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import EnhancedBlogCard from './EnhancedBlogCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BlogSection = ({ title, blogs, viewAllLink, icon }) => {
  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="container-responsive">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl">{icon}</span>}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-theme">{title}</h2>
        </div>
        {viewAllLink && (
          <Link 
            to={viewAllLink} 
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All →
          </Link>
        )}
      </div>
      
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={16}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
        className="pb-12"
      >
        {blogs.map((blog) => (
          <SwiperSlide key={blog.blogId || blog._id}>
            <EnhancedBlogCard blog={blog} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default BlogSection;