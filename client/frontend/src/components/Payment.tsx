import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { gql, useMutation } from "@apollo/client";

const PURCHASE_DINOSAUR = gql`
  mutation PurchaseDinosaur($dinosaurId: ID!) {
    purchaseDinosaur(dinosaurId: $dinosaurId) {
      id
      dinosaurId
      age
      species
      size
      price
      imageUrl
      description
      purchasedAt
    }
  }
`;

interface PaymentFormProps {
  dinosaur: any;
  onPaymentSuccess: () => void;
}

function PaymentForm({ dinosaur, onPaymentSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [purchaseDinosaur] = useMutation(PURCHASE_DINOSAUR, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    try {
      const response = await axios.post("/api/payments/create-payment-intent", {
        amount: dinosaur.price * 100,
      });

      const { clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
        setProcessing(false);
        return;
      }

      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        await purchaseDinosaur({
          variables: { dinosaurId: dinosaur.id },
          context: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        });
        onPaymentSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Payment failed");
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button type="submit" disabled={!stripe || processing}>
        {processing ? "Processing..." : "Pay"}
      </button>
    </form>
  );
}

export default PaymentForm;
