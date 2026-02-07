import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ManagerPendingApp = () => {
  const [pendingApps, setPendingApps] = useState([]);
  const [approvedApps, setApprovedApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch all applications
  const fetchLoans = async () => {
    try {
      const res = await fetch("http://localhost:3000/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const pending = data.filter((app) => app.status === "pending");
      const approved = data.filter((app) => app.status === "approved");

      setPendingApps(pending);
      setApprovedApps(approved);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [token]);

  // Approve loan
  const handleApprove = async (loan) => {
  const { value: formValues } = await Swal.fire({
    title: "Approve Loan",
    html: `
      <input id="swal-repay" type="number" class="swal2-input" placeholder="Total repay amount (with interest)">
      <input id="swal-deadline" type="date" class="swal2-input">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Approve",
    preConfirm: () => {
      const repayAmount = document.getElementById("swal-repay").value;
      const deadline = document.getElementById("swal-deadline").value;

      if (!repayAmount || !deadline) {
        Swal.showValidationMessage("Both repay amount and deadline are required!");
        return false;
      }

      if (Number(repayAmount) <= 0) {
        Swal.showValidationMessage("Repay amount must be greater than 0");
        return false;
      }

      return { repayAmount: Number(repayAmount), deadline };
    },
  });

  if (!formValues) return; // Cancel pressed

  try {
    const res = await fetch(
      `http://localhost:3000/applications/approve/${loan._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formValues),
      }
    );

    if (!res.ok) throw new Error("Approve failed");

    Swal.fire("Approved!", "Loan approved successfully.", "success");
    fetchLoans(); // বা fetchPendingLoans()
  } catch (err) {
    Swal.fire("Error", err.message || "Something went wrong", "error");
  }
};


  // Reject loan
  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to reject this loan application!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Reject it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(
        `http://localhost:3000/applications/${id}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to reject application");

      Swal.fire("Rejected!", "The application has been rejected.", "error");
      fetchLoans();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // Stripe Disbursement
  // Stripe Disbursement (Updated with Error Handling)
  const handleSendMoney = async (app) => {
    const result = await Swal.fire({
      title: "Confirm Disbursement?",
      text: `Are you sure you want to disburse $${app.loanAmount} to ${app.fullName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Send Money",
      confirmButtonColor: "#2563eb",
    });

    if (!result.isConfirmed) return;

    // Loading State start
    Swal.fire({
      title: 'Processing Payment...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      const res = await fetch(`http://localhost:3000/payment/admin/send/${app._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // টোকেন পাঠানো জরুরি
        },
      });

      const data = await res.json();

      if (data.url) {
        // যদি স্ট্রাইপ ইউআরএল আসে, সেখানে পাঠানোর আগে নিশ্চিত করুন সাকসেস ইউআরএল ঠিক আছে
        window.location.href = data.url;
      } else {
        throw new Error("Payment URL not found");
      }
    } catch (err) {
      console.error("Disbursement Error:", err);
      Swal.fire("Error", "Payment failed or Admin Session Expired", "error");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="p-6 text-black space-y-12">
      {/* ================= Pending Applications ================= */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Pending Loan Applications
        </h2>

        <div className="overflow-x-auto bg-white shadow-lg rounded-2xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3">Loan ID</th>
                <th className="px-4 py-3">Borrower</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {pendingApps.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No pending applications
                  </td>
                </tr>
              ) : (
                pendingApps.map((app) => (
                  <tr key={app._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {app.loanId?.slice(-6) || app._id.slice(-6)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{app.fullName}</div>
                      <div className="text-xs text-gray-500">
                        {app.borrowerEmail}
                      </div>
                    </td>
                    <td className="px-4 py-3">${app.loanAmount}</td>
                    <td className="px-4 py-3">
                      {new Date(app.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button
                        onClick={() => handleApprove(app)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(app._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => setSelectedApp(app)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= Approved Loans (Disbursement) ================= */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Approved Loans (Send Money)
        </h2>

        <div className="overflow-x-auto bg-white shadow-lg rounded-2xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3">Borrower</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {approvedApps.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">
                    No approved loans yet
                  </td>
                </tr>
              ) : (
                approvedApps.map((app) => (
                  <tr key={app._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{app.fullName}</td>
                    <td className="px-4 py-3">${app.loanAmount}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleSendMoney(app)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Send Money (Stripe)
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= View Modal ================= */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4">
            <h3 className="text-xl font-bold">Loan Application Details</h3>

            <div className="space-y-2 text-sm">
              <p><strong>Borrower:</strong> {selectedApp.fullName}</p>
              <p><strong>Email:</strong> {selectedApp.borrowerEmail}</p>
              <p><strong>Loan Title:</strong> {selectedApp.loanTitle}</p>
              <p><strong>Amount:</strong> ${selectedApp.loanAmount}</p>
              <p><strong>Status:</strong> {selectedApp.status}</p>
              <p>
                <strong>Date Applied:</strong>{" "}
                {new Date(selectedApp.date).toLocaleString()}
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerPendingApp;
