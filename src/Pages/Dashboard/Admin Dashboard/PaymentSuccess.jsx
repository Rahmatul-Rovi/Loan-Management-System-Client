import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";

const PaymentSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/applications/pay/${id}`, {
      method: "PATCH",
    })
      .then(() => {
        Swal.fire("Success", "Payment completed successfully!", "success");
        navigate("/dashboard/my-loans");
      })
      .catch(() => {
        Swal.fire("Error", "Failed to update payment status", "error");
      });
  }, [id, navigate]);

  return <div className="p-10 text-center">Processing payment...</div>;
};

export default PaymentSuccess;
