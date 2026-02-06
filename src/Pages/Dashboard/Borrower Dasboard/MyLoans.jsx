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

  // Theme handler
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
      setApplications(Array.isArray(data) ? data : []);
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

  // --- Calculations for Statistics ---
  const totalLoans = applications.length;
  const totalLoanAmount = applications.reduce((sum, app) => sum + Number(app.loanAmount || 0), 0);
  const remainingRepayment = applications
    .filter(app => app.feeStatus?.toLowerCase() !== "paid" && app.status?.toLowerCase() === "disbursed")
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
        
        {/* Statistics Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`p-6 rounded-2xl shadow-md flex items-center space-x-4 ${theme === "dark" ? "bg-[#111B33]" : "bg-white"}`}>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><FaClipboardList size={24} /></div>
            <div>
              <p className="text-sm opacity-70">Total Applied</p>
              <h2 className="text-2xl font-bold">{totalLoans} Loans</h2>
            </div>
          </div>
          
          <div className={`p-6 rounded-2xl shadow-md flex items-center space-x-4 ${theme === "dark" ? "bg-[#111B33]" : "bg-white"}`}>
            <div className="p-3 bg-green-100 text-green-600 rounded-full"><FaMoneyBillWave size={24} /></div>
            <div>
              <p className="text-sm opacity-70">Total Loan Amount</p>
              <h2 className="text-2xl font-bold">${totalLoanAmount.toLocaleString()}</h2>
            </div>
          </div>

          <div className={`p-6 rounded-2xl shadow-md flex items-center space-x-4 ${theme === "dark" ? "bg-[#111B33]" : "bg-white"}`}>
            <div className="p-3 bg-red-100 text-red-600 rounded-full"><FaExclamationCircle size={24} /></div>
            <div>
              <p className="text-sm opacity-70">Remaining Repay</p>
              <h2 className="text-2xl font-bold text-red-500">${remainingRepayment.toLocaleString()}</h2>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6">My Loan Applications</h1>

        <div className="overflow-x-auto rounded-xl shadow-lg border border-transparent">
          <table className={`min-w-full border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
            <thead className={theme === "dark" ? "bg-[#111B33]" : "bg-gray-100"}>
              <tr>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Title</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Status</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Repayment</th>
                <th className="px-4 py-3 text-left uppercase text-xs tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={theme === "dark" ? "bg-[#0F172A]" : "bg-white"}>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app._id} className="border-b dark:border-gray-700 hover:bg-gray-400/5 transition">
                    <td className="px-4 py-3 font-medium">{app.loanTitle || "N/A"}</td>
                    <td className="px-4 py-3">${Number(app.loanAmount || 0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        app.status === "disbursed" ? "bg-blue-100 text-blue-700" :
                        app.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {app.repayStatus === "paid" || app.feeStatus === "paid" ? (
                        <span className="text-green-500 font-bold text-xs flex items-center italic">✅ Paid</span>
                      ) : app.status === "disbursed" ? (
                        <button onClick={() => handlePayClick(app)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition">
                          Pay Now
                        </button>
                      ) : app.status === "approved" ? (
                        <span className="text-blue-500 text-xs italic">Processing Funds...</span>
                      ) : (
                        <span className="text-gray-400 text-xs">Waiting Approval</span>
                      )}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button onClick={() => navigate(`/all-loans/${app.loanId}`)} className="px-3 py-1 bg-gray-500/20 hover:bg-gray-500 hover:text-white text-xs rounded-lg transition duration-300">View</button>
                      {app.status === "pending" && (
                        <button onClick={() => handleCancel(app._id)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition">Cancel</button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-10 opacity-50">No applications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stripe Modal Section - No changes needed here, keeping your logic */}
      {isModalOpen && selectedApp && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 backdrop-blur-md">
          <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl ${theme === "dark" ? "bg-[#111B33] text-white border border-gray-700" : "bg-white text-gray-800"}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-extrabold tracking-tight">Repayment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-3xl leading-none hover:text-red-500 transition">&times;</button>
            </div>
            <div className="mb-6 p-4 rounded-xl bg-gray-500/5 border border-gray-500/10">
              <p className="text-sm opacity-70">Repaying for: <span className="font-bold text-blue-500">{selectedApp.loanTitle}</span></p>
              <p className="text-xl font-black mt-1">Total: <span className="text-green-500">${Number(selectedApp.repayAmount || 0).toLocaleString()}</span></p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 shadow-inner">
              <Elements stripe={stripePromise}>
                <CheckoutForm app={selectedApp} closeModal={() => setIsModalOpen(false)} refreshData={fetchApplications} />
              </Elements>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLoans;