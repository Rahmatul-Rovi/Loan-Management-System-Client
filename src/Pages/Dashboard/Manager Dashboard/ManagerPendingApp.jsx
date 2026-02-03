import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const ManagerPendingApp = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch pending applications
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await fetch('http://localhost:3000/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        // ✅ FIX: status is lowercase
        const pendingApps = data.filter(app => app.status === 'pending');
        setApplications(pendingApps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [token]);

  // Approve loan
  const handleApprove = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to approve this loan application!",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#16a34a", // Green
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Approve it!"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3000/applications/${id}/approve`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed');
        
        setApplications(prev => prev.map(app => app._id === id ? {...app, status: 'approved'} : app));
        Swal.fire("Approved!", "Loan has been approved successfully.", "success");
      } catch (err) {
        Swal.fire("Error", "Something went wrong!", "error");
      }
    }
  });
};

  // Reject loan
 // Reject loan with SweetAlert2 Confirmation
  const handleReject = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to reject this loan application!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // Red color for reject
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Reject it!',
      cancelButtonText: 'No, Keep it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `http://localhost:3000/applications/${id}/reject`,
            {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) throw new Error('Failed to reject application');

          // UI update
          setApplications(applications.filter(app => app._id !== id));
          
          Swal.fire(
            'Rejected!',
            'The application has been rejected.',
            'error' 
          );
        } catch (err) {
          Swal.fire('Error', err.message, 'error');
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading applications...
      </div>
    );
  }

const stats = {
  total: applications.length,
  pending: applications.filter(app => app.status === 'pending').length,
  approved: applications.filter(app => app.status === 'approved').length,
  totalAmount: applications.reduce((sum, app) => sum + Number(app.loanAmount || 0), 0)
};

  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Pending Loan Applications
      </h2>

    <div className="p-6 text-black">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Manager Overview</h2>
    
    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
        <p className="text-blue-600 text-sm font-semibold uppercase">Total Applications</p>
        <p className="text-3xl font-bold">{stats.total}</p>
      </div>
      <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-100 shadow-sm">
        <p className="text-yellow-600 text-sm font-semibold uppercase">Pending Loans</p>
        <p className="text-3xl font-bold">{stats.pending}</p>
      </div>
      <div className="bg-green-50 p-5 rounded-2xl border border-green-100 shadow-sm">
        <p className="text-green-600 text-sm font-semibold uppercase">Approved Loans</p>
        <p className="text-3xl font-bold">{stats.approved}</p>
      </div>
      <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 shadow-sm">
        <p className="text-purple-600 text-sm font-semibold uppercase">Total Loan Volume</p>
        <p className="text-3xl font-bold">${stats.totalAmount.toLocaleString()}</p>
      </div>
    </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Loan ID</th>
              <th className="px-4 py-3 text-left">Borrower</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No pending applications
                </td>
              </tr>
            ) : (
              applications.map((app) => (
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

                  <td className="px-4 py-3 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleApprove(app._id)}
                      className="px-3 py-1 rounded-xl bg-green-600 text-white hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(app._id)}
                      className="px-3 py-1 rounded-xl bg-red-600 text-white hover:bg-red-700"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-3 py-1 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
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

      {/* View Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4">
            <h3 className="text-xl font-bold">Loan Application Details</h3>

            <div className="space-y-2 text-sm">
              <p><strong>Borrower:</strong> {selectedApp.fullName}</p>
              <p><strong>Email:</strong> {selectedApp.borrowerEmail}</p>
              <p><strong>Loan Title:</strong> {selectedApp.loanTitle}</p>
              <p><strong>Amount:</strong> ${selectedApp.loanAmount}</p>
              <p><strong>Interest Rate:</strong> {selectedApp.interestRate}</p>
              <p><strong>Reason:</strong> {selectedApp.reason}</p>
              <p><strong>Status:</strong> {selectedApp.status}</p>
              <p>
                <strong>Date Applied:</strong>{' '}
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
    </div>
  );
};

export default ManagerPendingApp;
