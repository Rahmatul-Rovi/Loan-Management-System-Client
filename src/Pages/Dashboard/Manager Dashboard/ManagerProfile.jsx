import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserEdit } from 'react-icons/fa';
import { AuthContext } from '../../../Auth/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../../Firebase.init';
import Swal from 'sweetalert2';

const ManagerProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // User Data State from Database
  const [dbUser, setDbUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', photoURL: '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:3000/users/by-email?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setDbUser(data[0]);
            setFormData({
              name: data[0].name || '',
              photoURL: data[0].photoURL || ''
            });
          }
        });
    }
  }, [user]);

  if (!user || !dbUser) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading profile info...
      </div>
    );
  }

  // Profile Update Function
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
        // For User update db and UI
        setDbUser({ ...dbUser, name: formData.name, photoURL: formData.photoURL });
        Swal.fire("Success", "Profile Updated in Database!", "success");
      }
    } catch (error) {
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
    <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
      
      {/* --- Profile Card Start --- */}
      <div className="bg-white dark:bg-[#111B33] shadow-2xl rounded-3xl p-8 flex flex-col items-center border dark:border-gray-800">
        {/* Photo from database */}
        <img
          src={dbUser.photoURL || 'https://i.ibb.co/L9n66vP/admin-avatar.png'}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-indigo-500 mb-6 object-cover shadow-lg"
        />

        {/* Name from database */}
        <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-1">{dbUser.name || "Manager Name"}</h2>
        <p className="text-indigo-500 font-medium mb-6">{dbUser.email}</p>

        <div className="w-full space-y-4 text-gray-700 dark:text-gray-300">
          <div className="flex justify-between border-b dark:border-gray-700 pb-3">
            <span className="font-bold">Full Name</span>
            <span>{dbUser.name}</span>
          </div>
          <div className="flex justify-between border-b dark:border-gray-700 pb-3">
            <span className="font-bold">Role</span>
            <span className="capitalize">{dbUser.role}</span>
          </div>
          <div className="flex justify-between border-b dark:border-gray-700 pb-3">
            <span className="font-bold">Account Status</span>
            <span className="text-green-500 font-bold">Active</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-10 flex items-center gap-2 px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-lg transition-all w-full justify-center"
        >
          <FaSignOutAlt /> Sign Out
        </button>
      </div>

      {/* --- Profile Edit form --- */}
      <div className="bg-white dark:bg-[#111B33] shadow-2xl rounded-3xl p-8 border dark:border-gray-800">
        <div className="flex items-center gap-3 mb-8 text-indigo-600 dark:text-indigo-400">
            <FaUserEdit className="text-3xl" />
            <h2 className="text-2xl font-black italic">Settings</h2>
        </div>
        
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">Update Name</label>
            <input 
              type="text" 
              className="w-full p-4 rounded-2xl border dark:bg-[#0A122A] dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Your new name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">New Photo URL</label>
            <input 
              type="text" 
              className="w-full p-4 rounded-2xl border dark:bg-[#0A122A] dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.photoURL}
              onChange={(e) => setFormData({...formData, photoURL: e.target.value})}
              placeholder="Paste image link here"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={updating}
            className={`w-full py-4 rounded-2xl font-black text-white uppercase tracking-widest shadow-xl transition-all
              ${updating ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 transform hover:scale-[1.02]'}`}
          >
            {updating ? "Processing..." : "Update Profile"}
          </button>
        </form>
      </div>

    </div>
  );
};

export default ManagerProfile;