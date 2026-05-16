import React, { useEffect, useState } from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://loan-server-theta.vercel.app/reviews')
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center font-bold text-black">
        Loading Testimonials...
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-black">No reviews found in database.</h2>
        <p className="text-black mt-2">Go to your dashboard and add a review first!</p>
      </div>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-info/10 text-info text-sm font-semibold mb-4 border border-info/20">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
            Client{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-info">
              Feedbacks
            </span>
          </h2>
          <p className="text-black/60 text-lg">
            What our borrowers say about QuickLoan service.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <motion.div
              key={rev._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group bg-[#0B132B] p-8 rounded-3xl shadow-lg border border-white/10 hover:border-info/40 hover:shadow-2xl transition-all duration-300"
            >
              <FaQuoteLeft className="text-4xl text-info/40 mb-4" />
              <p className="text-white mb-6 italic leading-relaxed">
                "{rev.comment}"
              </p>
              <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                <img
                  src={rev.photo || "https://i.ibb.co/3S3s8V3/user-placeholder.png"}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-info"
                  alt={rev.name}
                />
                <div>
                  <h4 className="font-black text-white">{rev.name}</h4>
                  <div className="flex text-yellow-400 text-sm mt-1">
                    {[...Array(Number(rev.rating) || 0)].map((_, i) => <FaStar key={i} />)}
                  </div>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="mt-5 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary to-info transition-all duration-500 rounded-full"></div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;