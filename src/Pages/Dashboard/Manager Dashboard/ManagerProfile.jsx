import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserEdit } from 'react-icons/fa';
import { AuthContext } from '../../../Auth/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../../Firebase.init';
import Swal from 'sweetalert2';

const ManagerProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Update Form-এর জন্য স্টেট
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    photoURL: user?.photoURL || ''
  });
  const [updating, setUpdating] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading profile...
      </div>
    );
  }

  // প্রোফাইল আপডেট ফাংশন
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch(`http://localhost:3000/users/update/${user?.email}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        Swal.fire("Success", "Profile Updated! Please refresh to see changes.", "success");
      }
    } catch (error) {
      console.error("Update Error:", error);
      Swal.fire("Error", "Failed to update profile", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* --- প্রোফাইল কার্ড (আপনার আগের ডিজাইন) --- */}
      <div className="bg-white dark:bg-[#111B33] shadow-lg rounded-3xl p-6 flex flex-col items-center border dark:border-gray-800">
        <img
          src={user.photoURL || 'https://i.ibb.co/4pDNDk1/avatar.png'}
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-indigo-500 mb-4 object-cover"
        />

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user.displayName || "Manager"}</h2>
        <p className="text-gray-500">{user.email}</p>
        <p className="text-gray-500 mb-4 capitalize">Role: Manager</p>

        <div className="w-full mt-6 space-y-3 text-gray-700 dark:text-gray-300">
          <div className="flex justify-between border-b dark:border-gray-700 py-2">
            <span className="font-medium">Email</span>
            <span className="text-sm">{user.email}</span>
          </div>
          <div className="flex justify-between border-b dark:border-gray-700 py-2">
            <span className="font-medium">Account Status</span>
            <span className="text-green-500 font-bold">Active</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-10 flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow transition w-full justify-center"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* --- প্রোফাইল এডিট ফর্ম (নতুন যোগ করা হলো) --- */}
      <div className="bg-white dark:bg-[#111B33] shadow-lg rounded-3xl p-8 border dark:border-gray-800">
        <div className="flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400">
            <FaUserEdit className="text-2xl" />
            <h2 className="text-2xl font-bold">Edit Profile</h2>
        </div>
        
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
            <input 
              type="text" 
              className="w-full mt-2 p-3 rounded-xl border dark:bg-[#0A122A] dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Profile Photo URL</label>
            <input 
              type="text" 
              className="w-full mt-2 p-3 rounded-xl border dark:bg-[#0A122A] dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.photoURL}
              onChange={(e) => setFormData({...formData, photoURL: e.target.value})}
              placeholder="Link: https://example.com/photo.jpg"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={updating}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg 
              ${updating ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1'}`}
          >
            {updating ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>

    </div>
  );
};

export default ManagerProfile;