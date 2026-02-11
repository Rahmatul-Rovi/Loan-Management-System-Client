import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaStar, FaUserCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ManageReviews = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = () => {
        fetch('http://localhost:3000/reviews')
            .then(res => res.json())
            .then(data => setReviews(data));
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#374151",
            confirmButtonText: "Yes, delete it!",
            background: '#1F2937', // SweetAlert background matching theme
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:3000/reviews/${id}`, {
                    method: 'DELETE'
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            title: "Deleted!",
                            icon: "success",
                            background: '#1F2937',
                            color: '#fff'
                        });
                        fetchReviews();
                    }
                });
            }
        });
    };

    return (
        <div className="p-4 md:p-8 min-h-screen bg-[#374151]"> {/* Deep background */}
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-extrabold mb-8 text-white tracking-tight">
                    Manage All Reviews
                </h2>
                
                <div className="overflow-hidden bg-[#1F2937] rounded-2xl shadow-2xl border border-gray-700">
                    <table className="table w-full border-collapse">
                        {/* Table Head */}
                        <thead className="bg-[#111827] text-gray-300">
                            <tr>
                                <th className="p-5 text-left font-semibold uppercase text-sm">#</th>
                                <th className="p-5 text-left font-semibold uppercase text-sm">User Info</th>
                                <th className="p-5 text-left font-semibold uppercase text-sm">Comment</th>
                                <th className="p-5 text-left font-semibold uppercase text-sm">Rating</th>
                                <th className="p-5 text-center font-semibold uppercase text-sm">Action</th>
                            </tr>
                        </thead>
                        
                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-700">
                            {reviews.map((rev, index) => (
                                <tr key={rev._id} className="hover:bg-[#2D3748] transition-colors duration-200">
                                    <td className="p-5 text-gray-400 font-medium">{index + 1}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="avatar">
                                                <div className="w-12 h-12 rounded-full ring-2 ring-blue-500 ring-offset-2 ring-offset-[#1F2937] overflow-hidden">
                                                    {rev.photo ? (
                                                        <img src={rev.photo} alt={rev.name} />
                                                    ) : (
                                                        <FaUserCircle className="w-full h-full text-gray-500" />
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-lg">{rev.name}</div>
                                                <div className="text-sm text-gray-400">{rev.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-gray-300 italic max-w-xs overflow-hidden text-ellipsis">
                                        "{rev.comment}"
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-1 bg-[#111827] w-fit px-3 py-1 rounded-full border border-gray-600">
                                            <span className="text-yellow-400 font-bold mr-1">{rev.rating}</span>
                                            <FaStar className="text-yellow-400" size={14} />
                                        </div>
                                    </td>
                                    <td className="p-5 text-center">
                                        <button 
                                            onClick={() => handleDelete(rev._id)}
                                            className="group flex items-center gap-2 mx-auto px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all duration-300 border border-red-500/20"
                                        >
                                            <FaTrashAlt size={16} />
                                            <span className="font-semibold">Delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {reviews.length === 0 && (
                        <div className="p-10 text-center text-gray-500 bg-[#1F2937]">
                            No reviews found in the database.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageReviews;