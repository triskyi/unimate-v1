"use client";

import React, { useEffect } from "react";
import App from "../../../chat/app"; // Adjust the path if needed
import { useAuth } from "../context/AuthContext"; // Adjust path to your AuthContext

const ChatPage = () => {
  const { user } = useAuth(); // Get user state from context

  useEffect(() => {
    if (!user) {
      // If no user, redirect to login
      window.location.href = "/login";
    }
  }, [user]);

  // Remove loading state check

  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

export default ChatPage;
