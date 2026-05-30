import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
  {
    icon: '💰',
    title: 'Choose Your Loan',
    description:
      'Browse through our curated list of premium loans and select the one that fits your financial needs.',
  },
  {
    icon: '📝',
    title: 'Apply Online',
    description:
      'Fill out a simple online application form with your details and documents.',
  },
  {
    icon: '✅',
    title: 'Get Approved',
    description:
      'Our team reviews your application and approves it quickly, keeping you informed at every step.',
  },
  {
    icon: '💳',
    title: 'Receive Funds',
    description:
      'Once approved, the funds will be transferred to your account seamlessly and securely.',
  },
];

const Tutorial = () => {
  const [theme, setTheme] = useState('light');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' }); 

  // Observe theme changes
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

  return (
    <section className="w-11/12 mx-auto py-20 overflow-hidden" ref={ref}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
          How It Works
        </h2>
        <p
          className={`mt-3 text-base md:text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
          }`}
        >
          Your path to financial support is simplified into four effortless stages. Get funded without the traditional hassle.
        </p>
      </motion.div>

      {/* Steps Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.2, duration: 0.6, ease: 'easeOut' }}
            className={`relative rounded-2xl p-8 pt-12 flex flex-col items-center text-center cursor-default transform transition-all duration-300 hover:-translate-y-2 ${
              theme === 'dark'
                ? 'bg-[#111B33]/70 border border-[#1E293B] text-[#E2E8F0] hover:border-purple-500/50'
                : 'bg-white/90 border border-gray-200 text-[#1F2937] hover:border-purple-400/50'
            } backdrop-blur-lg shadow-lg hover:shadow-2xl`}
          >
            {/* Step number badge */}
            <div
              className={`absolute top-0 left-6 transform -translate-y-1/2 w-12 h-7 flex items-center justify-center rounded-md font-black text-sm shadow-md ${
                theme === 'dark'
                  ? 'bg-purple-600 text-white'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              0{index + 1}
            </div>

            {/* Connecting Line for Large Screens */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-purple-400/40 z-10" />
            )}

            {/* Icon Container with subtle background */}
            <div className={`w-16 h-16 flex items-center justify-center rounded-2xl text-4xl mb-5 shadow-inner ${
              theme === 'dark' ? 'bg-[#1E293B]' : 'bg-purple-50'
            }`}>
              {step.icon}
            </div>

            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text hover:text-transparent transition-all duration-300">
              {step.title}
            </h3>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Tutorial;