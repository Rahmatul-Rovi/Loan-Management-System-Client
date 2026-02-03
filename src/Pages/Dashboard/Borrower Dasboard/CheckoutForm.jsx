import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const CheckoutForm = ({ app, closeModal, refreshData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);

  // লোন অ্যামাউন্টটি ভেরিয়েবল এ রাখা (যাতে কোড পড়তে সুবিধা হয়)
  const amountToPay = app?.loanAmount || 0;

  useEffect(() => {
    if (amountToPay > 0) {
      fetch("http://localhost:3000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // এখানে price এর বদলে amount পাঠাচ্ছি যা ব্যাকএন্ড রিসিভ করবে
        body: JSON.stringify({ amount: amountToPay }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        });
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
          // তোমার লোন ডাটা অনুযায়ী এখানে প্রপার্টি নাম ঠিক করে দিয়েছি
          name: app?.userName || "Borrower",
          email: app?.borrowerEmail || "test@mail.com",
        },
      },
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      // পেমেন্ট সফল হলে এই এপিআই কল হবে (তোমার ব্যাকএন্ডের রাউট অনুযায়ী)
      // আমি index.js এ যে রাউট দিয়েছিলাম সেটার নাম /applications/pay/:id ছিল
      await fetch(`http://localhost:3000/applications/pay/${app._id}`, {
        method: "PATCH",
      });

      Swal.fire("Success", `Loan of $${amountToPay} repaid successfully!`, "success");
      closeModal();
      refreshData();
      setProcessing(false);
    }
  };

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
      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 hover:shadow-blue-500/50 transform hover:-translate-y-1 active:scale-95"
    }`}
>
  <div className="flex items-center justify-center gap-2">
    {processing ? (
      <>
        <span className="loading loading-spinner loading-sm"></span>
        <span>Processing Payment...</span>
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