import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const CheckoutForm = ({ app, closeModal, refreshData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);

  //  FIX: Changed loanAmount to repayAmount to include interest
  const amountToPay = app?.repayAmount || 0; 

  useEffect(() => {
    if (amountToPay > 0) {
      //  Log checking: See if it's sending 66300 in console
      console.log("Creating Payment Intent for:", amountToPay);

      fetch("http://localhost:3000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountToPay }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        })
        .catch(err => console.error("Payment Intent Error:", err));
    }
  }, [amountToPay]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    const card = elements.getElement(CardElement);

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: app?.fullName || "Borrower", 
          email: app?.borrowerEmail || "test@mail.com",
        },
      },
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
      setProcessing(false);
      return;
    }

   // Inside handleSubmit function after paymentIntent.status === "succeeded"
if (paymentIntent.status === "succeeded") {
  const paymentInfo = {
    transactionId: paymentIntent.id,
    amount: amountToPay,
    email: app?.borrowerEmail,
  };

  // Call the update API with payment details
  await fetch(`http://localhost:3000/applications/pay/${app._id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentInfo), // Passing the data to backend
  });

  Swal.fire("Success", `Payment ID: ${paymentIntent.id}`, "success");
  closeModal();
  refreshData();
}
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4 border rounded-lg mb-4 bg-white dark:bg-gray-800">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#9e2146" },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg 
          ${!stripe || !clientSecret || processing 
            ? "bg-blue-400 cursor-not-allowed opacity-70" 
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 transform hover:-translate-y-1 active:scale-95"
          }`}
      >
        <div className="flex items-center justify-center gap-2">
          {processing ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Pay Full Amount</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
                ${Number(amountToPay).toLocaleString()}
              </span>
            </>
          )}
        </div>
      </button>
    </form>
  );
};

export default CheckoutForm;