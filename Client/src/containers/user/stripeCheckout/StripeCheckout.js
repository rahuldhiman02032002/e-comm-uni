import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import Header from "../../../components/Header";

const stripePromise = loadStripe(
  "pk_test_51Q7vMxIxWxp8yQwBNiUHQunYZ8xRtg3uL8jnxgNg8tNBRCCJPSCz6MS9j4TOfHZKDO891pWijpSBSnDK6WQO5fNq00CTBYGRei"
);

function StripeCheckout({ totalAmount, userId, products, userDetails }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Payment Intent
      const { data } = await axios.post(
        "http://localhost:8081/Controller/create-payment-intent",
        {
          amount: totalAmount,
          userId,
          products,
          userDetails,
        }
      );

      const clientSecret = data.clientSecret;

      // 2. Confirm Payment
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (paymentResult.error) {
        console.error("Payment failed:", paymentResult.error);
        alert("Payment failed!");
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        // 3. Save Order Details
        await axios.post("http://localhost:8081/Controller/confirm-order", {
          userId,
          userDetails,
          products,
          totalAmount,
          transactionId: paymentResult.paymentIntent.id,
        });

        alert("Payment successful! Order placed.");
      }
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <Elements stripe={stripePromise}>
        <form onSubmit={handlePayment}>
          <h3>Total Amount: ${totalAmount}</h3>
          <CardElement />
          <button type="submit" disabled={!stripe || loading}>
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>
      </Elements>
    </div>
  );
}

export default StripeCheckout;
