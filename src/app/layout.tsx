// src/app/layout.tsx
"use client";

import React, { useEffect, useState } from "react"; // Import useState
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "../app/context/AuthContext"; // Ensure correct path
import "../styles/globals.css";
import Dashboard from "./Dashboard/page"; // Ensure correct path
import { usePathname } from "next/navigation"; // Import usePathname

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Unimate</title>
      </head>
      <body>
        <AuthProvider>
          <LayoutWithAuthCheck>{children}</LayoutWithAuthCheck>
        </AuthProvider>
      </body>
    </html>
  );
}

function LayoutWithAuthCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // If the user is authenticated
    if (isAuthenticated) {
      // Handle routing based on the current pathname
      if (pathname === "/") {
        router.push("/Dashboard"); // Redirect to Dashboard if at home
      }
    }
    setIsLoading(false); // Always set loading to false after checking
  }, [isAuthenticated, router, pathname]);

  if (typeof window === "undefined" || isLoading) {
    return <div>Loading...</div>; // Show loading indicator while checking auth
  }

  // Conditional rendering based on authentication and pathname
  if (isAuthenticated) {
    // Allow access to specific pages
    if (pathname === "/chat" || pathname === "/payment") {
      return <>{children}</>; // Render chat or payment page
    }

    // Render Dashboard for authenticated users trying to access non-specified routes
    if (pathname === "/Dashboard") {
      return <Dashboard />;
    }
    // Redirect to Dashboard for all other paths
    return <Dashboard />; // Or return a 404 if you want
  }

  // Render children for unauthenticated users
  return <>{children}</>;
}
