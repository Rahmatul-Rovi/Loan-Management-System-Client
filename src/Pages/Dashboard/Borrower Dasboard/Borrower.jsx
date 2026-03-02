import React, { useState, useEffect, useContext } from 'react';
import { FaUser, FaMoneyCheckAlt, FaAngleDown, FaBars, FaTimes, FaHistory, FaRegStar, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import BorrowerProfile from './BorrowerProfile';
import MyLoans from './MyLoans';
import { AuthContext } from '../../../Auth/AuthContext';
import PaymentHistory from './PaymentHistory/PaymentHistory';
import GiveReview from './GiveReview';

const Borrower = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('profile');
  const [borrowerMenuOpen, setBorrowerMenuOpen] = useState(true);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const updateTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(currentTheme);
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const borrowerChildren = [
    { key: 'profile', label: 'Profile', icon: <FaUser /> },
    { key: 'my-loans', label: 'My Loans', icon: <FaMoneyCheckAlt /> },
    { key: 'payment-history', label: 'Payment History', icon: <FaHistory /> },
    { key: 'give-review', label: 'Give Review', icon: <FaRegStar /> },
    { key: 'home', label: 'Back to Home', icon: <FaHome />, isLink: true },
  ];

  const handleMenuClick = (item) => {
    if (item.isLink) {
      navigate('/');
    } else {
      setActivePage(item.key);
    }
    setSidebarOpen(false); 
  };

  const bgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const sidebarBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const sidebarText = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const activeClass = "bg-blue-600 text-white";
  const hoverClass = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100';

  return (
    <div className={`flex h-screen overflow-hidden ${bgClass}`}>
      
      {/* --- Sidebar (Mobile & Desktop) --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform ${sidebarBg} shadow-2xl transition-transform duration-300 md:translate-x-0 md:static md:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-blue-600">Borrower Panel</span>
          <button onClick={toggleSidebar} className="md:hidden text-gray-500"><FaTimes size={20} /></button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-4">
            <button
              onClick={() => setBorrowerMenuOpen(!borrowerMenuOpen)}
              className={`flex items-center justify-between w-full p-3 rounded-lg font-semibold ${sidebarText} ${hoverClass}`}
            >
              <span className="flex items-center gap-3"><FaUser /> Menu</span>
              <FaAngleDown className={`transition-transform ${borrowerMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {borrowerMenuOpen && (
              <div className="ml-4 mt-2 flex flex-col gap-1">
                {borrowerChildren.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleMenuClick(item)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${activePage === item.key && !item.isLink ? activeClass : `${sidebarText} ${hoverClass}`}`}
                  >
                    {item.icon} <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Logout Button in Sidebar */}
        <div className="p-4 border-t dark:border-gray-700">
          <button onClick={() => signOutUser()} className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition font-bold">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Dashboard Header (Navbar এর বিকল্প) */}
        <header className={`flex items-center justify-between px-6 py-4 shadow-sm ${sidebarBg}`}>
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="md:hidden text-gray-600 dark:text-gray-300"><FaBars size={22} /></button>
            <h1 className="text-lg font-bold md:text-xl truncate">Welcome, {user?.displayName || 'Borrower'}</h1>
          </div>
          <div className="flex items-center gap-3">
             <img src={user?.photoURL || "https://i.ibb.co/3S3s8V3/user-placeholder.png"} className="w-10 h-10 rounded-full border shadow-sm" alt="profile" />
          </div>
        </header>

        {/* Content Section */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
             {activePage === 'profile' && <BorrowerProfile theme={theme} />}
             {activePage === 'my-loans' && <MyLoans theme={theme} />}
             {activePage === 'payment-history' && <PaymentHistory theme={theme} />}
             {activePage === 'give-review' && <GiveReview theme={theme} />}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity" />}
    </div>
  );
};

export default Borrower;