import { useState, useEffect } from 'react';

const AnimatedHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-gradient-to-br from-blue-600 to-purple-700 dark:from-gray-800 dark:to-purple-900 text-white py-12 md:py-20 rounded-xl overflow-hidden">
      <div className="container-responsive text-center">
        <div className={`transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
        }`}>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 animate-pulse">
            Welcome to WeebTsuki ✨
          </h1>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto animate-fade-in-up">
            Discover amazing stories and share your own with our community
          </p>
        </div>
      </div>
    </section>
  );
};

export default AnimatedHero;