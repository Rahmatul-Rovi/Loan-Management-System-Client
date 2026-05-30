import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: '⚡',
    title: 'Instant Approval',
    description: 'Get your loan decision within minutes through our high-speed automated processing.',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    icon: '💳',
    title: 'Tailored Plans',
    description: 'Choose a customized repayment schedule that perfectly matches your personal financial budget.',
    color: 'from-indigo-500 to-blue-600',
  },
  {
    icon: '🔒',
    title: 'Elite Security',
    description: 'Your sensitive data is guarded around the clock with top-tier military-grade encryption.',
    color: 'from-fuchsia-500 to-purple-600',
  },
  {
    icon: '📞',
    title: '24/7 Premium Support',
    description: 'Our dedicated financial experts are available anytime to assist you with your queries.',
    color: 'from-pink-500 to-rose-600',
  },
];

const Feature = () => {
  const [theme, setTheme] = useState('light');

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
    <section className="w-full py-24 overflow-hidden">
      <div className="w-11/12 mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
            Why Choose Us
          </h2>
          <p
            className={`mt-3 text-base md:text-lg max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'
            }`}
          >
            Discover why our services stand out in providing a premium financial experience with zero hidden fees.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`relative w-full rounded-3xl p-6 pt-8 flex flex-col items-center text-center cursor-default border transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-[#111B33]/60 border-[#1E293B] text-[#E2E8F0] hover:border-purple-500/40 hover:shadow-[0_20px_40px_rgba(139,92,246,0.15)]'
                  : 'bg-white border-gray-100 text-[#1F2937] hover:border-purple-400/40 hover:shadow-[0_20px_40px_rgba(99,102,241,0.08)]'
              } shadow-lg`}
            >
              {/* Floating Icon with unique gradient matching the theme */}
              <div
                className={`absolute -top-8 w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-tr ${feature.color} text-white text-3xl shadow-xl transform rotate-3 hover:rotate-12 transition-transform duration-300`}
              >
                {feature.icon}
              </div>

              <div className="mt-8 flex flex-col justify-between h-full">
                <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text hover:text-transparent transition-all duration-300">
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;