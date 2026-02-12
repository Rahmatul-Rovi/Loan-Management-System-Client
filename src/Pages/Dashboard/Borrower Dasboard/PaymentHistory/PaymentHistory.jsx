import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Auth/AuthContext";


const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);

 useEffect(() => {
  // From backend route
  fetch(`http://localhost:3000/transactions/${user?.email}`)
    .then(res => res.json())
    .then(data => setPayments(data));
}, [user?.email]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Payment History</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
         <tbody>
  {payments.length > 0 ? (
    payments.map((p, index) => (
      <tr key={p._id}>
        <td>{index + 1}</td>
        <td>{p.transactionId}</td>
        <td>${p.amount.toLocaleString()}</td>
        <td>{new Date(p.date).toLocaleDateString()}</td>
        <td><span className="text-green-600 font-bold">Success</span></td>
      </tr>
    ))
  ) : (
    <tr><td colSpan="5" className="text-center py-4">No Transactions Found</td></tr>
  )}
</tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;