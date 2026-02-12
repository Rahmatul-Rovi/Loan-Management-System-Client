import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const CheckoutForm = ({ app, closeModal, refreshData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);

  // NEW LOGIC: Pay Amount with charge
  // if Overdue then payableWithPenalty ,  otherwise repayAmount
  const amountToPay = app?.isOverdue ? app.payableWithPenalty : (app?.repayAmount || 0);

  useEffect(() => {
    // APi Call 
    if (amountToPay > 0) {
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

    if (paymentIntent.status === "succeeded") {
      const paymentInfo = {
        transactionId: paymentIntent.id,
        amount: amountToPay, // Taka add with extra charge
        email: app?.borrowerEmail,
        penaltyPaid: app?.isOverdue ? app.penaltyAmount : 0 // extra chage for record 
      };

      await fetch(`http://localhost:3000/applications/pay/${app._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentInfo),
      });

      Swal.fire({
        title: "Success!",
        text: `Payment Successful. ID: ${paymentIntent.id}`,
        icon: "success",
        confirmButtonColor: "#4F46E5",
      });
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
        <div className="flex flex-col items-center justify-center">
          {processing ? (
            <div className="flex items-center gap-2">
              <span className="loading loading-spinner loading-sm"></span>
              <span>Processing...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span>{app?.isOverdue ? "Pay Total (with Fine)" : "Pay Full Amount"}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
                  ${Number(amountToPay).toLocaleString()}
                </span>
              </div>
              {app?.isOverdue && (
                <span className="text-[10px] font-normal opacity-80">
                  (Includes ${app.penaltyAmount} late fee)
                </span>
              )}
            </>
          )}
        </div>
      </button>
    </form>
  );
};

export default CheckoutForm;