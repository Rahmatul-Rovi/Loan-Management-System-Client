import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../Auth/AuthContext';
import { updateProfile, updateEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { auth } from '../../../Firebase.init';
import { FaUserEdit, FaEnvelope, FaUser, FaLink } from 'react-icons/fa';

const BorrowerProfile = ({ theme = 'light' }) => {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return <div className="flex justify-center p-10 font-bold">Loading user info...</div>;

  const openModal = () => {
    setName(user.displayName || '');
    setEmail(user.email || '');
    setPhoto(user.photoURL || '');
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      // Name বা Photo URL চেঞ্জ হলে আপডেট হবে
      if (user.displayName !== name || user.photoURL !== photo) {
        await updateProfile(auth.currentUser, { 
          displayName: name,
          photoURL: photo 
        });
      }
      
      if (user.email !== email) {
        await updateEmail(auth.currentUser, email);
      }
      
      toast.success('Profile updated successfully!');
      setIsModalOpen(false);
      // পেজ রিলোড দিলে আপডেট ডাটা দেখা যাবে
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      toast.error(`Update failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // স্টাইল ভেরিয়েবল
  const isDark = theme === 'dark';
  const cardClass = isDark ? 'bg-[#111B33] text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200';

  return (
    <div className="max-w-md mx-auto mt-10">
      {/* প্রোফাইল কার্ড */}
      <div className={`${cardClass} border rounded-3xl shadow-2xl overflow-hidden transition-all duration-300`}>
        {/* টপ ব্যানার/কালার */}
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        
        <div className="px-6 pb-8">
          <div className="relative -mt-12 mb-4">
            <img
              src={user.photoURL || 'https://i.ibb.co/3S3s8V3/user-placeholder.png'}
              alt="User"
              className="w-24 h-24 rounded-2xl border-4 border-white dark:border-[#111B33] shadow-lg object-cover mx-auto"
            />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-black tracking-tight">{user.displayName || 'Borrower Name'}</h2>
            <p className="text-sm opacity-60 flex items-center justify-center gap-2 mt-1">
              <FaEnvelope className="text-blue-500" /> {user.email}
            </p>
          </div>

          <button
            onClick={openModal}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition transform active:scale-95 shadow-lg"
          >
            <FaUserEdit /> Edit Profile
          </button>
        </div>
      </div>

      {/* মডার্ন মোডাল */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className={`${isDark ? 'bg-[#0F172A]' : 'bg-white'} w-full max-w-sm p-8 rounded-[2rem] shadow-2xl transform transition-all`}>
            <h3 className={`text-2xl font-black mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Update Info</h3>

            <div className="space-y-4">
              {/* নাম ইনপুট */}
              <div>
                <label className="text-xs font-bold uppercase opacity-50 ml-1">Full Name</label>
                <div className="relative mt-1">
                  <FaUser className="absolute left-3 top-3.5 text-blue-500 text-sm" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none transition`}
                    placeholder="Enter Name"
                  />
                </div>
              </div>

              {/* ফটো ইউআরএল ইনপুট */}
              <div>
                <label className="text-xs font-bold uppercase opacity-50 ml-1">Photo URL</label>
                <div className="relative mt-1">
                  <FaLink className="absolute left-3 top-3.5 text-blue-500 text-sm" />
                  <input
                    type="text"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none transition`}
                    placeholder="Image link (https://...)"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className={`flex-1 py-3 rounded-xl font-bold ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} transition`}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowerProfile;