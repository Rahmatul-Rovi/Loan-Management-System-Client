import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { FaMoneyBillWave, FaClipboardList, FaExclamationCircle } from "react-icons/fa";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const MyLoans = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Theme handler logic... (Keeping as it was)
  useEffect(() => {
    const updateTheme = () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
      setTheme(currentTheme);
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const fetchApplications = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`http://localhost:3000/applications/${encodeURIComponent(user.email)}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        // ✅ NEW: Sort by newest first (Reverse)
        const sortedData = [...data].reverse();
        setApplications(sortedData);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      Swal.fire("Error", "Failed to load applications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  // Calculations for Statistics
  const totalLoans = applications.length;
  const totalLoanAmount = applications.reduce((sum, app) => sum + Number(app.loanAmount || 0), 0);
  const remainingRepayment = applications
    .filter(app => app.repayStatus !== "paid" && app.status === "disbursed")
    .reduce((sum, app) => sum + Number(app.repayAmount || 0), 0);

  const handlePayClick = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleCancel = async (loanId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this application?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3000/applications/${loanId}`, { method: "DELETE" });
        if (res.ok) {
          setApplications((prev) => prev.filter((app) => app._id !== loanId));
          Swal.fire("Cancelled!", "Application removed.", "success");
        }
      } catch (err) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen font-bold">Loading...</div>;

  return (
    <div className={`min-h-screen p-6 ${theme === "dark" ? "bg-[#0A122A] text-white" : "bg-gray-50 text-gray-800"}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard theme={theme} icon={<FaClipboardList size={24} />} label="Total Applied" value={`${totalLoans} Loans`} color="blue" />
          <StatCard theme={theme} icon={<FaMoneyBillWave size={24} />} label="Total Loan Amount" value={`$${totalLoanAmount.toLocaleString()}`} color="green" />
          <StatCard theme={theme} icon={<FaExclamationCircle size={24} />} label="Remaining Repay" value={`$${remainingRepayment.toLocaleString()}`} color="red" />
        </div>

        <h1 className="text-3xl font-bold mb-6">My Loan Applications</h1>

        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className={`min-w-full border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
            <thead className={theme === "dark" ? "bg-[#111B33]" : "bg-gray-100"}>
              <tr>
                <th className="px-4 py-4 text-left uppercase text-xs">Title</th>
                <th className="px-4 py-4 text-left uppercase text-xs">Amount</th>
                <th className="px-4 py-4 text-left uppercase text-xs">Status</th>
                <th className="px-4 py-4 text-left uppercase text-xs">Repayment</th>
                <th className="px-4 py-4 text-left uppercase text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className={theme === "dark" ? "bg-[#0F172A]" : "bg-white"}>
              {applications.map((app) => (
                <tr key={app._id} className="border-b dark:border-gray-700 hover:bg-indigo-500/5 transition">
                  <td className="px-4 py-4 font-medium">{app.loanTitle || "N/A"}</td>
                  <td className="px-4 py-4 font-bold">${Number(app.loanAmount || 0).toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      app.status === "disbursed" ? "bg-blue-100 text-blue-700" :
                      app.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {app.repayStatus === "paid" ? (
                      <span className="text-green-500 font-bold text-xs flex items-center italic">✅ Paid</span>
                    ) : app.status === "disbursed" ? (
                      <button onClick={() => handlePayClick(app)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg transition transform hover:scale-105">
                        Pay Amount
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs italic">{app.status === "approved" ? "Processing Funds..." : "Waiting Approval"}</span>
                    )}
                  </td>
                  <td className="px-4 py-4 space-x-2">
                    <button onClick={() => navigate(`/all-loans/${app.loanId}`)} className="px-3 py-1 bg-gray-500/20 hover:bg-gray-500 hover:text-white text-xs rounded-lg transition">View</button>
                    {app.status === "pending" && (
                      <button onClick={() => handleCancel(app._id)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {isModalOpen && selectedApp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
          <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl ${theme === "dark" ? "bg-[#111B33] text-white border border-gray-700" : "bg-white text-gray-800"}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black">Repayment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-3xl leading-none hover:text-red-500 transition">&times;</button>
            </div>
            <div className="mb-6 p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <p className="text-sm opacity-70">Repaying for: <span className="font-bold">{selectedApp.loanTitle}</span></p>
              {/* ✅ This is the main fix: Showing full repayAmount */}
              <p className="text-2xl font-black mt-2">Total Payable: <span className="text-green-500">${Number(selectedApp.repayAmount).toLocaleString()}</span></p>
            </div>
            
            <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 shadow-inner">
              <Elements stripe={stripePromise}>
                {/* ✅ IMPORTANT: Ensure price={selectedApp.repayAmount} is passed to CheckoutForm if it uses that prop */}
                <CheckoutForm 
                  app={selectedApp} 
                  amountToPay={selectedApp.repayAmount} // Passing the correct amount here
                  closeModal={() => setIsModalOpen(false)} 
                  refreshData={fetchApplications} 
                />
              </Elements>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for clean stats
const StatCard = ({ theme, icon, label, value, color }) => (
  <div className={`p-6 rounded-2xl shadow-md flex items-center space-x-4 ${theme === "dark" ? "bg-[#111B33]" : "bg-white border"}`}>
    <div className={`p-3 bg-${color}-100 text-${color}-600 rounded-2xl`}>{icon}</div>
    <div>
      <p className="text-sm opacity-70">{label}</p>
      <h2 className={`text-2xl font-extrabold ${color === 'red' ? 'text-red-500' : ''}`}>{value}</h2>
    </div>
  </div>
);

export default MyLoans;