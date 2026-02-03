import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const CheckoutForm = ({ app, closeModal, refreshData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: app.repayAmount }),
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, [app]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const card = elements.getElement(CardElement);

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: app?.userName || "User",
          email: app?.userEmail || "test@mail.com",
        },
      },
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      await fetch(`http://localhost:3000/applications/repay/${app._id}`, {
        method: "PATCH",
      });

      Swal.fire("Success", "Loan repaid successfully!", "success");
      closeModal();
      refreshData();
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4 border rounded mb-4">
        <CardElement />
      </div>

      <button
        disabled={!stripe || !clientSecret || processing}
        className="w-full bg-blue-600 text-white py-3 rounded"
      >
        {processing ? "Processing..." : `Pay $${app.repayAmount}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
