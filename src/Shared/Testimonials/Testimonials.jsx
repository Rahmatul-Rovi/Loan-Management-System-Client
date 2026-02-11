import React, { useEffect, useState } from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/reviews')
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error(err));
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50 dark:bg-[#0A122A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-white mb-4 italic">Client Feedbacks</h2>
          <p className="text-gray-500 dark:text-gray-400">What our borrowers say about QuickLoan service.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div key={rev._id} className="bg-white dark:bg-[#111B33] p-8 rounded-[2.5rem] shadow-xl border dark:border-gray-800 hover:scale-105 transition-transform duration-300">
              <FaQuoteLeft className="text-4xl text-blue-500/20 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic leading-relaxed">
                "{rev.comment}"
              </p>
              <div className="flex items-center gap-4 border-t dark:border-gray-800 pt-6">
                <img src={rev.photo} className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500" alt={rev.name} />
                <div>
                  <h4 className="font-black text-gray-800 dark:text-white">{rev.name}</h4>
                  <div className="flex text-yellow-400 text-sm mt-1">
                    {[...Array(rev.rating)].map((_, i) => <FaStar key={i} />)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;