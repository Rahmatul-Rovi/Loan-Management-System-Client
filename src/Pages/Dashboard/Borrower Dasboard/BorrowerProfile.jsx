import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../Auth/AuthContext';
import { updateProfile } from 'firebase/auth';
import { toast } from 'react-toastify';
import { auth } from '../../../Firebase.init';
import { FaUserEdit, FaEnvelope, FaUser, FaLink } from 'react-icons/fa';

const BorrowerProfile = ({ theme = 'light' }) => {
  const { user, setUser } = useContext(AuthContext);   
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setPhoto(user.photoURL || '');
    }
  }, [user]);

  if (!user) return <div className="flex justify-center p-10 font-bold">Loading user info...</div>;

  const openModal = () => {
    setName(user.displayName || '');
    setPhoto(user.photoURL || '');
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });

      await auth.currentUser.reload();   

      setUser(auth.currentUser);         
      toast.success('Profile updated successfully!');
      setIsModalOpen(false);

    } catch (error) {
      console.error(error);
      toast.error(`Update failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';
  const cardClass = isDark ? 'bg-[#111B33] text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200';

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <div className={`${cardClass} border rounded-3xl shadow-2xl overflow-hidden transition-all duration-300`}>
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        <div className="px-6 pb-8 text-center">
          <div className="relative -mt-12 mb-4">
            <img
              src={user?.photoURL || 'https://i.ibb.co/3S3s8V3/user-placeholder.png'}
              alt="User"
              loading="lazy"
              onError={(e) => (e.target.src = 'https://i.ibb.co/3S3s8V3/user-placeholder.png')}
              className="w-24 h-24 rounded-2xl border-4 border-white dark:border-[#111B33] shadow-lg object-cover mx-auto transition-all duration-300"
            />
          </div>

          <div className="mb-6">
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className={`${isDark ? 'bg-[#0F172A]' : 'bg-white text-gray-900'} w-full max-w-sm p-8 rounded-[2rem] shadow-2xl`}>
            <h3 className={`text-2xl font-black mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Update Info</h3>

            <div className="space-y-4">
              <div>
                <label className={`text-xs font-bold uppercase opacity-50 ml-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Full Name
                </label>
                <div className="relative mt-1">
                  <FaUser className="absolute left-3 top-3.5 text-blue-500 text-sm" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none`}
                  />
                </div>
              </div>

              <div>
                <label className={`text-xs font-bold uppercase opacity-50 ml-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Photo URL
                </label>
                <div className="relative mt-1">
                  <FaLink className="absolute left-3 top-3.5 text-blue-500 text-sm" />
                  <input
                    type="text"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    placeholder="https://..."
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none`}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className={`flex-1 py-3 rounded-xl font-bold ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowerProfile;
