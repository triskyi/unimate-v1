"use client"; // Ensure this is at the top of the file

import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import PaymentComponent to ensure it's client-side only
const PaymentComponent = dynamic(() => import("../../components/payment"), {
  ssr: false,
});

function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch userId and payment status from local storage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId"); // Get the userId from local storage
    const paymentStatus = localStorage.getItem("hasPaid"); // Get the payment status from local storage

    if (storedUserId) {
      setUserId(storedUserId); // Set the userId
    } else {
      console.error("User ID not found in local storage");
    }

    // Check if the user has paid
    setHasPaid(paymentStatus === "true"); // Convert string to boolean
    setIsLoading(false); // Set loading to false after checking
  }, []); // Runs only once on mount

  // Function to fetch all users
  const fetchAllUsers = useCallback(async () => {
    if (!userId) return; // Ensure userId is available

    try {
      const response = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const usersList = await response.json();
      console.log("Fetched users:", usersList);

      // Process the fetched users (example processing logic)
      const validUsers = usersList.filter((user: any) => user.id); // Filter valid users
      // Update your state or perform actions with validUsers here
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [userId]); // Only runs when userId changes

  // Fetch users whenever userId changes
  useEffect(() => {
    if (userId) {
      fetchAllUsers(); // Call the function to fetch users
    }
  }, [fetchAllUsers, userId]); // This will prevent infinite loops

  // Show loading indicator while userId and payment status are being fetched
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If userId is not available, show an error message
  if (!userId) {
    return (
      <div>You are not authorized to access this page. Please log in.</div>
    ); // Only logged-in users can access this page
  }

  // Render the payment page regardless of payment status
  return (
    <div className="App">
      <PaymentComponent
        userId={userId} // Pass the userId to PaymentComponent
        onPaymentSuccess={() => {
          console.log("Payment was successful!");
          setHasPaid(true); // Set hasPaid to true after successful payment
          localStorage.setItem("hasPaid", "true"); // Save payment status to local storage
        }}
      />
    </div>
  );
}

export default App;
