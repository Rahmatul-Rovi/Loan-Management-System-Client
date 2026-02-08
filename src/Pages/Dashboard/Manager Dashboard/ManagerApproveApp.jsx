import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaClock, FaSearch, FaFilter } from 'react-icons/fa';

const ManagerApproveApp = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);

  // --- সার্চ এবং ফিল্টার স্টেট ---
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest'); // newest, oldest, highAmount, lowAmount

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await fetch('http://localhost:3000/applications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [token]);

  // --- সার্চ এবং ফিল্টার লজিক ---
  const filteredApplications = applications
    .filter((app) => {
      // ১. ইমেইল বা নাম দিয়ে সার্চ
      const matchesSearch = 
        app.borrowerEmail?.toLowerCase().includes(searchText.toLowerCase()) || 
        app.fullName?.toLowerCase().includes(searchText.toLowerCase());
      
      // ২. স্ট্যাটাস দিয়ে ফিল্টার
      const matchesStatus = filterStatus === 'all' || app.status === filterStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // ৩. সর্টিং লজিক
      if (sortOrder === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOrder === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOrder === 'highAmount') return Number(b.loanAmount) - Number(a.loanAmount);
      if (sortOrder === 'lowAmount') return Number(a.loanAmount) - Number(b.loanAmount);
      return 0;
    });

  // --- Stats Calculation (সব ডাটার ওপর ভিত্তি করে) ---
  const stats = {
    totalApproved: applications.filter(app => app.status === 'approved' || app.status === 'disbursed').length,
    totalRejected: applications.filter(app => app.status === 'rejected').length,
    totalDisbursed: applications
      .filter(app => app.status === 'disbursed')
      .reduce((sum, app) => sum + Number(app.loanAmount || 0), 0),
    totalPendingRepay: applications
      .filter(app => app.status === 'disbursed' && app.repayStatus !== 'paid')
      .reduce((sum, app) => sum + Number(app.repayAmount || 0), 0),
  };

  if (loading) return <div className="text-center py-10 font-bold">Loading Management System...</div>;

  return (
    <div className="p-6 text-black bg-gray-50 min-h-screen">
      {/* --- Dashboard Stats --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Approved" value={stats.totalApproved} icon={<FaCheckCircle className="text-green-500" />} />
        <StatCard title="Total Rejected" value={stats.totalRejected} icon={<FaTimesCircle className="text-red-500" />} />
        <StatCard title="Admin Disbursed" value={`$${stats.totalDisbursed}`} icon={<FaMoneyBillWave className="text-blue-500" />} />
        <StatCard title="User Owed (Repay)" value={`$${stats.totalPendingRepay}`} icon={<FaClock className="text-yellow-500" />} />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-black text-gray-800">Application Management</h2>
        
        {/* --- Search & Filter UI --- */}
        <div className="flex flex-wrap gap-3">
          {/* Search Input */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by Email or Name..."
              className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select 
            className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="disbursed">Disbursed</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Sort Order */}
          <select 
            className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highAmount">Highest Amount</option>
            <option value="lowAmount">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* --- Data Table --- */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border border-gray-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-4 text-left">Loan Info</th>
              <th className="px-4 py-4 text-left">Borrower</th>
              <th className="px-4 py-4 text-left">Amount</th>
              <th className="px-4 py-4 text-left">Loan Status</th>
              <th className="px-4 py-4 text-left">Payment Status</th>
              <th className="px-4 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((loan) => (
                <tr key={loan._id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-bold text-indigo-600">#{loan._id.slice(-6)}</div>
                    <div className="text-xs text-gray-400">{new Date(loan.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium">{loan.fullName}</div>
                    <div className="text-xs text-gray-500">{loan.borrowerEmail}</div>
                  </td>
                  <td className="px-4 py-4 font-semibold">${loan.loanAmount}</td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      loan.status === 'disbursed' ? 'bg-blue-100 text-blue-700' :
                      loan.status === 'approved' ? 'bg-green-100 text-green-700' :
                      loan.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {loan.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                     <span className={`px-2 py-1 rounded-md text-xs border ${
                      loan.repayStatus === 'paid' ? 'border-green-500 text-green-600 bg-green-50' : 'border-orange-300 text-orange-500'
                    }`}>
                      {loan.repayStatus === 'paid' ? 'PAID' : 'UNPAID'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button onClick={() => setSelectedLoan(loan)} className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
                      Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500">No applications found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Modal (আপনার আগের কোডই আছে) --- */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 border-b pb-2">Application Review</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-400">Borrower Name</p><p className="font-bold">{selectedLoan.fullName}</p></div>
              <div><p className="text-gray-400">Loan Amount</p><p className="font-bold text-indigo-600">${selectedLoan.loanAmount}</p></div>
              <div className="col-span-2"><p className="text-gray-400">Reason</p><p className="italic">"{selectedLoan.reason}"</p></div>
            </div>
            <div className="flex justify-end pt-6">
              <button onClick={() => setSelectedLoan(null)} className="px-6 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold mt-1 text-gray-800">{value}</p>
    </div>
    <div className="text-3xl p-3 bg-gray-50 rounded-xl">{icon}</div>
  </div>
);

export default ManagerApproveApp;