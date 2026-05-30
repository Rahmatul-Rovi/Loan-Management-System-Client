import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaQuoteLeft } from 'react-icons/fa';

const feedbacks = [
  {
    name: 'Zayan Ahmed',
    role: 'Tech Entrepreneur',
    message: 'The loan process was incredibly smooth and fast. Highly recommend this platform for instant funding!',
    color: 'bg-purple-500',
  },
  {
    name: 'Nafisa Kamal',
    role: 'Freelance UI/UX Designer',
    message: 'I received my education loan approval within just 24 hours. Super transparent and hassle-free process.',
    color: 'bg-indigo-500',
  },
  {
    name: 'Asif Chowdhury',
    role: 'E-commerce Business Owner',
    message: 'Professional support team and competitive interest rates. The best financial platform I have used so far!',
    color: 'bg-pink-500',
  },
  {
    name: 'Tanvir Hossain',
    role: 'Startup Founder',
    message: 'Amazing platform with an intuitive user experience. Got my startup capital seamlessly secured.',
    color: 'bg-amber-500',
  },
  {
    name: 'Mariam Begum',
    role: 'Agro Investor',
    message: 'Reliable, secure, and trustworthy. Everything regarding the loan terms was explained crystal clear.',
    color: 'bg-emerald-500',
  },
  {
    name: 'Sajid Rahman',
    role: 'Corporate Professional',
    message: 'Seamless verification from start to finish. I will definitely suggest this platform to my network.',
    color: 'bg-cyan-500',
  },
];

const Feedback = () => {
  const [theme, setTheme] = useState('light');
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const total = feedbacks.length;

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dark mode observer
  useEffect(() => {
    const updateTheme = () => {
      const currentTheme =
        document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(currentTheme);
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  const prevSlide = () => setCurrent((prev) => (prev - 1 + total) % total);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % total);

  // Get initials for Avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <section className="w-11/12 mx-auto py-20 relative overflow-hidden">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
          Customer Stories
        </h2>
        <p
          className={`mt-3 text-base md:text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
          }`}
        >
          Hear directly from our successful clients and see how we simplify financial steps for everyone.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative flex items-center justify-center px-4 md:px-12">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className={`absolute left-2 md:left-6 z-20 p-3 rounded-full shadow-lg border backdrop-blur-md hover:scale-110 transition duration-300 ${
            theme === 'dark' 
              ? 'bg-[#111B33]/90 border-[#1E293B] text-purple-400 hover:text-purple-300' 
              : 'bg-white/90 border-gray-200 text-indigo-600 hover:text-indigo-500'
          }`}
        >
          <FaArrowLeft className="text-xl" />
        </button>

        <div className="flex items-center justify-center w-full min-h-[380px] overflow-hidden">
          <div className="flex items-center gap-4 md:gap-8 justify-center relative w-full">
            {feedbacks.map((fb, index) => {
              const position =
                index === current
                  ? 'main'
                  : index === (current - 1 + total) % total
                  ? 'left'
                  : index === (current + 1) % total
                  ? 'right'
                  : 'hidden';

              if (isMobile && position !== 'main') return null;

              return (
                <AnimatePresence key={index}>
                  {(position === 'main' || position === 'left' || position === 'right') && (
                    <motion.div
                      initial={{
                        x: position === 'main' ? 0 : position === 'left' ? -150 : 150,
                        scale: position === 'main' ? 0.95 : 0.8,
                        opacity: 0,
                      }}
                      animate={{
                        x: 0,
                        scale: position === 'main' ? 1 : 0.85,
                        opacity: position === 'main' ? 1 : 0.4,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                      className={`relative w-full max-w-[340px] md:max-w-[360px] min-h-[320px] p-8 rounded-3xl flex flex-col justify-between items-center text-center transition-all duration-500 ${
                        theme === 'dark'
                          ? 'bg-[#111B33]/70 border border-[#1E293B]/80 text-[#E2E8F0] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]'
                          : 'bg-white border border-gray-100 text-[#1F2937] shadow-[0_20px_40px_rgba(139,92,246,0.06)]'
                      }`}
                      style={{
                        filter:
                          isMobile
                            ? 'none'
                            : position === 'main'
                            ? 'none'
                            : 'blur(3px) brightness(0.8)',
                      }}
                    >
                      {/* Quote Icon */}
                      <div className="text-purple-500/20 text-4xl absolute top-6 left-8">
                        <FaQuoteLeft />
                      </div>

                      {/* Feedback Message */}
                      <p className={`text-base md:text-lg italic font-medium leading-relaxed mt-4 relative z-10 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        "{fb.message}"
                      </p>

                      {/* User Info & Avatar */}
                      <div className="flex flex-col items-center mt-6">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md mb-3 ${fb.color}`}>
                          {getInitials(fb.name)}
                        </div>
                        <h4 className="text-lg font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text hover:text-transparent transition-all duration-300">
                          {fb.name}
                        </h4>
                        <p className={`text-xs mt-0.5 tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
                          {fb.role}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              );
            })}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className={`absolute right-2 md:right-6 z-20 p-3 rounded-full shadow-lg border backdrop-blur-md hover:scale-110 transition duration-300 ${
            theme === 'dark' 
              ? 'bg-[#111B33]/90 border-[#1E293B] text-purple-400 hover:text-purple-300' 
              : 'bg-white/90 border-gray-200 text-indigo-600 hover:text-indigo-500'
          }`}
        >
          <FaArrowRight className="text-xl" />
        </button>
      </div>
    </section>
  );
};

export default Feedback;