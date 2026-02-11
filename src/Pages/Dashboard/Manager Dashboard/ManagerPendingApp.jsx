import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ManagerPendingApp = () => {
  const [pendingApps, setPendingApps] = useState([]);
  const [approvedApps, setApprovedApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const token = localStorage.getItem("token");

  const fetchLoans = async () => {
    try {
      const res = await fetch("http://localhost:3000/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Reverse to show newest first
      const sortedData = Array.isArray(data) ? [...data].reverse() : [];

      setPendingApps(sortedData.filter((app) => app.status === "pending"));
      setApprovedApps(sortedData.filter((app) => app.status === "approved"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [token]);

  // --- Auto Approval Logic ---
  const handleApprove = async (loan) => {
    // Interest Calculation Automatic
    const principal = Number(loan.loanAmount || 0);
    const rate = parseFloat(loan.interestRate?.replace("%", "") || 0);
    const autoCalculatedRepay = Math.round(
      principal + (principal * rate) / 100,
    );

    const { value: formValues } = await Swal.fire({
      title: "Approve Loan",
      html: `
        <div style="text-align: left; margin-bottom: 10px;">
          <label>Total repay amount (Calculated with ${loan.interestRate} interest):</label>
          <input id="swal-repay" type="number" class="swal2-input" value="${autoCalculatedRepay}">
        </div>
        <div style="text-align: left;">
          <label>Select Deadline:</label>
          <input id="swal-deadline" type="date" class="swal2-input">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Approve",
      preConfirm: () => {
        const repayAmount = document.getElementById("swal-repay").value;
        const deadline = document.getElementById("swal-deadline").value;

        if (!repayAmount || !deadline) {
          Swal.showValidationMessage(
            "Both repay amount and deadline are required!",
          );
          return false;
        }

        return { repayAmount: Number(repayAmount), deadline };
      },
    });

    if (!formValues) return;

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
        },
      );

      if (!res.ok) throw new Error("Approve failed");

      Swal.fire(
        "Approved!",
        `Loan approved with $${formValues.repayAmount} repayment.`,
        "success",
      );
      fetchLoans();
    } catch (err) {
      Swal.fire("Error", err.message || "Something went wrong", "error");
    }
  };

  // Reject and Send Money logic remains the same...
  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: "Reject Application?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Reject",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(
        `http://localhost:3000/applications/${id}/reject`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        Swal.fire("Rejected", "", "success");
        fetchLoans();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMoney = async (app) => {
    Swal.fire({
      title: "Processing Disbursement...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const res = await fetch(
        `http://localhost:3000/payment/admin/send/${app._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error("URL error");
    } catch (err) {
      Swal.fire("Error", "Disbursement failed", "error");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-6 text-black space-y-12">
      {/* Pending Table */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">
          Pending Requests
        </h2>
        <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-indigo-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Borrower</th>
                <th className="px-4 py-3 text-left">Loan (Interest)</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApps.map((app) => (
                <tr key={app._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{app.fullName}</td>
                  <td className="px-4 py-3">
                    ${app.loanAmount}{" "}
                    <span className="text-xs text-red-500">
                      ({app.interestRate})
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(app.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleApprove(app)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(app._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="bg-gray-800 text-white px-3 py-1 rounded-lg transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Disbursement Table */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-green-700">
          Approved (Ready to Disburse)
        </h2>
        <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-green-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Borrower</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-center">Disbursement</th>
              </tr>
            </thead>
            <tbody>
              {approvedApps.map((app) => (
                <tr key={app._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{app.fullName}</td>
                  <td className="px-4 py-3 font-bold text-green-600">
                    ${app.loanAmount}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleSendMoney(app)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full shadow-md transition"
                    >
                      Disburse (Stripe)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* View Modal remains the same... */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Application Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <p>
                <strong>Name:</strong> {selectedApp.fullName}
              </p>
              <p>
                <strong>Interest:</strong> {selectedApp.interestRate}
              </p>
              <p>
                <strong>Monthly Income:</strong> ${selectedApp.monthlyIncome}
              </p>
              <p>
                <strong>Source:</strong> {selectedApp.incomeSource}
              </p>
              <p className="col-span-2">
                <strong>Reason:</strong> {selectedApp.reason}
              </p>
            </div>
            <button
              onClick={() => setSelectedApp(null)}
              className="mt-6 w-full py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerPendingApp;
