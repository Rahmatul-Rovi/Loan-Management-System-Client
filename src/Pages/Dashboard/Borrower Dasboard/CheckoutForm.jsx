import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const CheckoutForm = ({ app, closeModal, refreshData }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState("");
    const [processing, setProcessing] = useState(false);

    // ফিক্সড প্রসেসিং ফি ১০ ডলার/টাকা
    const price = 10; 

    useEffect(() => {
        // ব্যাকএন্ড থেকে পেমেন্ট ইনটেন্ট আনা
        fetch("http://localhost:3000/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ price }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
            }
        });
    }, [price]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (card == null) return;

        setProcessing(true);

        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: app?.userName || 'Anonymous',
                    email: app?.userEmail || 'unknown@mail.com'
                },
            },
        });

        if (error) {
            Swal.fire("Error", error.message, "error");
            setProcessing(false);
        } else if (paymentIntent.status === "succeeded") {
            // পেমেন্ট সফল হলে ডাটাবেজ আপডেট
            fetch(`http://localhost:3000/applications/pay/${app._id}`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' }
            })
            .then((res) => res.json())
            .then((data) => {
                Swal.fire("Success!", "Payment completed and status updated.", "success");
                setProcessing(false);
                closeModal(); // মডাল বন্ধ করা
                refreshData(); // টেবিল রিফ্রেশ করা
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-800 mb-4">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': { color: '#aab7c4' },
                            },
                            invalid: { color: '#9e2146' },
                        },
                    }}
                />
            </div>
            <button
                type="submit"
                disabled={!stripe || !clientSecret || processing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition duration-200 disabled:bg-gray-400"
            >
                {processing ? "Processing..." : `Pay $${price}`}
            </button>
        </form>
    );
};

export default CheckoutForm;