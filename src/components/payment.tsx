"use client"; // Ensure this is at the top of the file
import React, { useCallback, useState } from "react";
import { useFlutterwave } from "flutterwave-react-v3";
import { useRouter } from "next/navigation"; // Import from next/navigation

interface PaymentComponentProps {
  userId: string; // Ensure userId is a string
  onPaymentSuccess: () => void; // Callback function when payment is successful
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({
  userId,
  onPaymentSuccess,
}) => {
  const router = useRouter(); // For navigation
  const [isProcessing, setIsProcessing] = useState(false); // State to track payment processing
  const [checkPaymentInterval, setCheckPaymentInterval] =
    useState<NodeJS.Timeout | null>(null); // State to store the interval ID for payment polling
  const [attempts, setAttempts] = useState(0); // Track number of attempts
  const maxAttempts = 10; // Limit the number of polling attempts

  // Flutterwave configuration
  const config = {
    public_key: "FLWPUBK-89812fd511e8259fef6ef03a8e5a5d4f-X",
    tx_ref: Date.now().toString(),
    amount: 1000, // The payment amount
    currency: "UGX",
    payment_options: "mobilemoney", // Specify payment options
    customer: {
      email: "unimate@gmail.com", // Customer's email
      phone_number: "0789683140", // Customer's phone number
      name: "Tresor", // Customer's name
    },
    customizations: {
      title: "Unimate Monthly Pay", // Title for the payment modal
      description: "Payment for chatting services", // Description
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg", // Logo for the payment modal
    },
  };

  // Initialize Flutterwave payment
  const handleFlutterPayment = useFlutterwave(config);

  // Trigger payment
  const triggerPayment = useCallback(() => {
    if (isProcessing) return; // Prevent triggering another payment if already processing

    setIsProcessing(true); // Set processing state to true

    handleFlutterPayment({
      callback: async (response: {
        status: string;
        transaction_id: number;
      }) => {
        if (response.status === "successful") {
          // Save the payment status
          await savePaymentStatus(userId, {
            ...response,
            transaction_id: response.transaction_id.toString(),
          });

          // Start polling to check payment confirmation
          const interval = setInterval(() => {
            checkPaymentStatus(response.transaction_id.toString());
          }, 5000); // Poll every 5 seconds
          setCheckPaymentInterval(interval); // Save the interval ID
        } else {
          alert("Payment failed! Please try again.");
          setIsProcessing(false); // Reset processing state on failure
        }
      },
      onClose: () => {
        console.log("Payment modal closed");
        setIsProcessing(false); // Reset processing state if modal is closed
      },
    });
  }, [handleFlutterPayment, userId, isProcessing]);

  // Check Payment Status with Polling
  const checkPaymentStatus = async (transactionId: string) => {
    if (attempts >= maxAttempts) {
      clearInterval(checkPaymentInterval!); // Stop polling after maxAttempts
      alert("Payment verification timed out. Please try again.");
      setIsProcessing(false); // Reset processing state
      return;
    }

    try {
      const response = await fetch(`/api/paid?action=check-payment-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId, // Send transactionId to check the payment status
        }),
      });

      const data = await response.json();

      if (data.paymentStatus === "paid") {
        // Payment confirmed, stop polling
        clearInterval(checkPaymentInterval!);
        alert("Payment confirmed! Redirecting to chat.");
        onPaymentSuccess(); // Call the success callback
        router.push("/Dashboard"); // Redirect to dashboard after success
      } else {
        console.log("Payment still pending");
        setAttempts((prevAttempts) => prevAttempts + 1); // Increment attempts
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      alert("Network error occurred. Please check your connection.");
      setIsProcessing(false); // Reset processing state
    }
  };

  // Save payment status after successful payment
  const savePaymentStatus = async (
    userId: string,
    paymentResponse: { status: string; transaction_id: string }
  ) => {
    try {
      const response = await fetch(`/api/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId, // Send the userId along with payment information
          paymentStatus: paymentResponse.status,
          transactionId: paymentResponse.transaction_id,
        }),
      });

      if (!response.ok) {
        console.error("Error updating payment status");
        alert("Error updating payment status. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error occurred. Please check your connection.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="p-8 bg-gray-800 text-white text-center rounded-xl shadow-xl max-w-md mx-auto">
        <h2 className="text-4xl font-bold mb-6">Complete your payment</h2>
        <button
          onClick={triggerPayment} // Call triggerPayment on button click
          disabled={isProcessing} // Disable button while processing
          className={`bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out ${
            isProcessing ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default PaymentComponent;
