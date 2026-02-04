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

  // Theme handler
  useEffect(() => {
    const updateTheme = () => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "light";
      setTheme(currentTheme);
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // Fetch applications
  const fetchApplications = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(
        `http://localhost:3000/applications/${encodeURIComponent(user.email)}`,
      );
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

  // Open payment modal
  const handlePayClick = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  // Cancel application
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
        const res = await fetch(
          `http://localhost:3000/applications/${loanId}`,
          { method: "DELETE" },
        );
        if (res.ok) {
          setApplications((prev) => prev.filter((app) => app._id !== loanId));
          Swal.fire("Cancelled!", "Application removed.", "success");
        }
      } catch (err) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-20 font-bold">Loading...</div>;
  }

  return (
    <div
      className={`min-h-screen p-6 ${
        theme === "dark"
          ? "bg-[#0A122A] text-white"
          : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Loan Applications</h1>

        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table
            className={`min-w-full border ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <thead
              className={theme === "dark" ? "bg-[#111B33]" : "bg-gray-100"}
            >
              <tr>
                <th className="px-4 py-3 text-left">Loan Title</th>
                <th className="px-4 py-3 text-left">Loan Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Repayment</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-3">{app.loanTitle || "N/A"}</td>

                  <td className="px-4 py-3">
                    ${Number(app.loanAmount || 0).toLocaleString()}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        app.status?.toLowerCase() === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>

                  {/* Repayment column */}
                  <td className="px-4 py-3">
                    {app.feeStatus?.toLowerCase() === "paid" ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        Paid
                      </span>
                    ) : app.status?.toLowerCase() === "approved" ? (
                      <button
                        onClick={() => handlePayClick(app)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition"
                      >
                        Pay Now
                      </button>
                    ) : (
                      <span className="text-gray-400 italic">
                        Waiting for approval
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => navigate(`/all-loans/${app.loanId}`)}
                      className="px-3 py-1 bg-gray-500 text-white text-xs rounded-lg"
                    >
                      View
                    </button>

                    {app.status?.toLowerCase() === "pending" && (
                      <button
                        onClick={() => handleCancel(app._id)}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg"
                      >
                        Cancel
                      </button>
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
          <div
            className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${
              theme === "dark"
                ? "bg-[#111B33] text-white border border-gray-700"
                : "bg-white text-gray-800"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Loan Repayment</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-2xl font-bold hover:text-red-500 transition"
              >
                &times;
              </button>
            </div>

            <div className="mb-4 text-sm">
              <p>
                Loan:{" "}
                <span className="font-bold text-blue-500">
                  {selectedApp.loanTitle}
                </span>
              </p>
              <p>
                Total Repay Amount:{" "}
                <span className="text-green-500 font-bold">
                  ${Number(selectedApp.repayAmount || 0).toLocaleString()}
                </span>
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-700">
              {stripePromise ? (
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    app={selectedApp}
                    closeModal={() => setIsModalOpen(false)}
                    refreshData={fetchApplications}
                  />
                </Elements>
              ) : (
                <p className="text-red-500">
                  Stripe loading failed. Check your public key.
                </p>
              )}
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 w-full text-gray-400 text-xs hover:text-red-500 underline transition"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLoans;
