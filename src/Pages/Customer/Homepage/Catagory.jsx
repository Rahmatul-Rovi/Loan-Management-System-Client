import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaMoneyBillWave, 
  FaGraduationCap, 
  FaHeart, 
  FaBriefcase, 
  FaBuilding, 
  FaLeaf, 
  FaHospitalUser, 
  FaLightbulb, 
  FaSeedling, 
  FaUmbrellaBeach 
} from 'react-icons/fa';
import Marquee from 'react-fast-marquee';

const Catagory = () => {
  const [loans, setLoans] = useState([]);
  const [theme, setTheme] = useState('light');

  // Detect theme changes
  useEffect(() => {
    const updateTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
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

  // Fetch loans
  useEffect(() => {
    fetch('https://loan-server-theta.vercel.app/loans')
      .then(res => res.json())
      .then(data => setLoans(data))
      .catch(err => console.error(err));
  }, []);

  // Fixed order of 10 categories from your images
  const categoryOrder = [
    'Personal', 
    'Education', 
    'Marriage Loan', 
    'Business', 
    'Property Loan', 
    'Eco-Friendly Car', 
    'Medical Emergency', 
    'Startup Capital', 
    'Agriculture Loan', 
    'Holiday Loan'
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Personal':
        return <FaMoneyBillWave className="text-5xl text-[#00B4D8]" />;
      case 'Education':
        return <FaGraduationCap className="text-5xl text-[#10B981]" />;
      case 'Marriage Loan':
        return <FaHeart className="text-5xl text-[#EC4899]" />;
      case 'Business':
        return <FaBriefcase className="text-5xl text-[#8B5CF6]" />;
      case 'Property Loan':
        return <FaBuilding className="text-5xl text-[#3B82F6]" />;
      case 'Eco-Friendly Car':
        return <FaLeaf className="text-5xl text-[#22C55E]" />;
      case 'Medical Emergency':
        return <FaHospitalUser className="text-5xl text-[#EF4444]" />;
      case 'Startup Capital':
        return <FaLightbulb className="text-5xl text-[#F59E0B]" />;
      case 'Agriculture Loan':
        return <FaSeedling className="text-5xl text-[#15803D]" />;
      case 'Holiday Loan':
        return <FaUmbrellaBeach className="text-5xl text-[#06B6D4]" />;
      default:
        return <FaMoneyBillWave className="text-5xl" />;
    }
  };

  return (
    <section className="w-11/12 mx-auto py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
          Loan Categories
        </h2>
        <p className={`mt-2 text-base md:text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-[#94A3B8]' : 'text-gray-600'}`}>
          Find the perfect financial solution tailored to your goals. Select a category below to view customized loan plans and competitive rates.
        </p>
      </div>

      {/* Categories Marquee */}
      <Marquee
        pauseOnHover={true}
        speed={50}
        gradient={false}
        autoFill={true}
      >
        <div className="flex gap-6 mr-6 py-4">
          {categoryOrder.map((category, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex-shrink-0 w-56 md:w-60 rounded-xl p-6 flex flex-col items-center text-center cursor-default transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-[#111B33]/80 border border-[#1E293B] text-[#E2E8F0]'
                  : 'bg-white/90 border border-gray-200 text-[#1F2937]'
              } backdrop-blur-md shadow-lg`}
            >
              <div className="mb-3">{getCategoryIcon(category)}</div>
              <h3 className="text-lg md:text-xl font-semibold mb-1 line-clamp-1">{category}</h3>
              <p className="text-sm md:text-base opacity-80">{`Explore all ${category} options.`}</p>
            </motion.div>
          ))}
        </div>
      </Marquee>
    </section>
  );
};

export default Catagory;