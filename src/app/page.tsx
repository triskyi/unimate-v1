"use client";

import React from "react";
import { useAuth } from "../app/context/AuthContext"; // Ensure the correct path
import Dashboard from "./Dashboard/page"; // Ensure correct path
import LandingPage from "./landingpage/page"; // Ensure correct path

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return <div>{isAuthenticated ? <Dashboard /> : <LandingPage />}</div>;
};

export default HomePage;
