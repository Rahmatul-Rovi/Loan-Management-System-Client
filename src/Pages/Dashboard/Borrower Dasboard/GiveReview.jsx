import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../Auth/AuthContext';
import { FaStar } from 'react-icons/fa';
import Swal from 'sweetalert2';

const GiveReview = () => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return Swal.fire("Error", "Please select a star rating", "error");

    setLoading(true);
    const reviewData = {
      name: user?.displayName || "Anonymous",
      photo: user?.photoURL || "https://i.ibb.co/3S3s8V3/user-placeholder.png",
      email: user?.email,
      rating: rating,
      comment: comment,
    };

    try {
      const res = await fetch('http://localhost:3000/reviews', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Success", "Thank you for your feedback!", "success");
        setComment("");
        setRating(0);
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-10 bg-white dark:bg-[#111B33] rounded-3xl shadow-2xl border dark:border-gray-800">
      <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-6 text-center italic">Share Your Experience</h2>
      
      <div className="flex justify-center gap-2 mb-8">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <FaStar
              key={index}
              className="cursor-pointer transition-transform hover:scale-125"
              size={40}
              color={starValue <= (hover || rating) ? "#FFD700" : "#E5E7EB"}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
            />
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-5 rounded-2xl border dark:bg-[#0A122A] dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 h-32"
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl hover:opacity-90 transition-all uppercase tracking-widest"
        >
          {loading ? "Submitting..." : "Post Review"}
        </button>
      </form>
    </div>
  );
};

export default GiveReview;