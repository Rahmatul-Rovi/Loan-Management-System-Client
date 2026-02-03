import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const MyLoans = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // থিম হ্যান্ডলার
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

  // ডাটা ফেচিং
  const fetchApplications = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`http://localhost:3000/applications/${encodeURIComponent(user.email)}`);
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  // পেমেন্ট মডাল ওপেন (Stripe এর জন্য)
  const handlePayClick = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  // ক্যানসেল লোন
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

  if (loading) return <div className="text-center mt-20 font-bold">Loading...</div>;

  return (
    <div className={`min-h-screen p-6 ${theme === "dark" ? "bg-[#0A122A] text-white" : "bg-gray-50 text-gray-800"}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Loan Applications</h1>

        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className={`min-w-full border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
            <thead className={theme === "dark" ? "bg-[#111B33]" : "bg-gray-100"}>
              <tr>
                <th className="px-4 py-3 text-left">Loan Title</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Fee Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-3">{app.loanTitle || "N/A"}</td>
                  <td className="px-4 py-3">${Number(app.loanAmount).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${app.status?.toLowerCase() === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {/* লজিক: লোন approved হলে এবং status unpaid থাকলে Pay বাটন আসবে */}
                    {app.status?.toLowerCase() === "approved" && app.feeStatus?.toLowerCase() === "unpaid" ? (
                      <button onClick={() => handlePayClick(app)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">
                        Pay Now
                      </button>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs ${app.feeStatus?.toLowerCase() === "paid" ? "bg-green-100 text-green-700" : "text-gray-400 italic"}`}>
                        {app.feeStatus?.toLowerCase() === "paid" ? "Paid" : "Pending Approval"}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 space-x-2">
                    <button onClick={() => navigate(`/all-loans/${app.loanId}`)} className="px-3 py-1 bg-gray-500 text-white text-xs rounded-lg">View</button>
                    {app.status?.toLowerCase() === "pending" && (
                      <button onClick={() => handleCancel(app._id)} className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= STRIPE MODAL ================= */}
      {isModalOpen && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
          <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${theme === "dark" ? "bg-[#111B33] text-white border border-gray-700" : "bg-white text-gray-800"}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Loan Repayment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl font-bold hover:text-red-500">&times;</button>
            </div>

            <div className="mb-4">
              <p className="text-sm">Loan: <span className="font-bold">{selectedApp.loanTitle}</span></p>
              <p className="text-sm">Total Amount: <span className="text-green-500 font-bold">${selectedApp.loanAmount}</span></p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-700">
              {stripePromise ? (
                <Elements stripe={stripePromise}>
                  <CheckoutForm app={selectedApp} closeModal={() => setIsModalOpen(false)} refreshData={fetchApplications} />
                </Elements>
              ) : (
                <p className="text-red-500">Stripe loading failed...</p>
              )}
            </div>
            
            <button onClick={() => setIsModalOpen(false)} className="mt-6 w-full text-gray-400 text-xs hover:text-red-500 underline">
              Cancel Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLoans;