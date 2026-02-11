import React, { useEffect, useState } from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true); // New Loading State

  useEffect(() => {
    fetch('http://localhost:3000/reviews')
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false); // Stop loading
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Show a spinner or text while waiting for the database
  if (loading) {
    return <div className="py-20 text-center font-bold">Loading Testimonials...</div>;
  }

  // If the database is actually empty, show this instead of nothing
  if (reviews.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-400">No reviews found in database.</h2>
        <p>Go to your dashboard and add a review first!</p>
      </div>
    );
  }

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
                <img 
                  src={rev.photo || "https://i.ibb.co/3S3s8V3/user-placeholder.png"} 
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500" 
                  alt={rev.name} 
                />
                <div>
                  <h4 className="font-black text-gray-800 dark:text-white">{rev.name}</h4>
                  <div className="flex text-yellow-400 text-sm mt-1">
                    {[...Array(Number(rev.rating) || 0)].map((_, i) => <FaStar key={i} />)}
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