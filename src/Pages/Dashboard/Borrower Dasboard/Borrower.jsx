import React, { useState, useEffect, useContext } from 'react';
import { FaUser, FaMoneyCheckAlt, FaAngleDown, FaTimes, FaHistory, FaRegStar } from 'react-icons/fa'; // Added FaRegStar
import Navbar from '../../../Shared/Navbar/Navbar';
import Footer from '../../../Shared/Footer/Footer';
import BorrowerProfile from './BorrowerProfile';
import MyLoans from './MyLoans';
import { AuthContext } from '../../../Auth/AuthContext';
import PaymentHistory from './PaymentHistory/PaymentHistory';
import GiveReview from './GiveReview';

const Borrower = () => {
  const { user } = useContext(AuthContext);
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
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // 1. FIXED: Added 'give-review' to the children array so it shows in Sidebar
  const borrowerChildren = [
    { key: 'profile', label: 'Profile', icon: <FaUser /> },
    { key: 'my-loans', label: 'My Loans', icon: <FaMoneyCheckAlt /> },
    { key: 'payment-history', label: 'Payment History', icon: <FaHistory /> },
    { key: 'give-review', label: 'Give Review', icon: <FaRegStar /> }, // New Item
  ];

  const bgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const textClass = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const sidebarBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const sidebarText = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const hoverClass = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const activeClass = theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white';

  return (
    <div className={`flex h-screen overflow-hidden ${bgClass}`}>
      {/* Sidebar logic remains the same... (Desktop & Mobile) */}
      <aside className={`hidden md:flex flex-col fixed top-0 left-0 h-full w-64 ${sidebarBg} shadow-xl`}>
        <nav className="flex-1 p-4">
          <button
            onClick={() => setBorrowerMenuOpen(!borrowerMenuOpen)}
            className={`flex items-center justify-between w-full p-3 rounded-lg ${sidebarText} ${hoverClass} transition`}
          >
            <span className="flex items-center gap-3">
              <FaUser />
              <span className="font-medium">Borrower Dashboard</span>
            </span>
            <FaAngleDown className={`transition-transform ${borrowerMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {borrowerMenuOpen && (
            <div className="ml-6 mt-2 flex flex-col gap-2">
              {borrowerChildren.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActivePage(item.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition w-full text-left ${
                    activePage === item.key ? activeClass : `${sidebarText} ${hoverClass}`
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 md:ml-64 ${bgClass} ${textClass}`}>
        <Navbar toggleSidebar={toggleSidebar} userName={user?.name || 'User'} theme={theme} />

        <main className="flex-1 overflow-auto p-6">
          {activePage === 'profile' && <BorrowerProfile theme={theme} />}
          {activePage === 'my-loans' && <MyLoans theme={theme} />}
          {activePage === 'payment-history' && <PaymentHistory theme={theme} />}
          
          {/* 2. FIXED: Removed quotes and fixed the logic check */}
          {activePage === 'give-review' && <GiveReview theme={theme} />}
        </main>

        <div className="flex-shrink-0">
          <Footer theme={theme} />
        </div>
      </div>
    </div>
  );
};

export default Borrower;