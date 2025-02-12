"use client"; // Ensure this is at the top of the file

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import App from "../../components/chat";

import {
  Bars3Icon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: number;
  title: string;
  content: string;
  image?: string; // Optional field
}
const Dashboard = () => {
  const { logout, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [hasPaid, setHasPaid] = useState(null); // Initially null to check payment status

  const [posts, setPosts] = useState<Post[]>([]);

  // Function to check payment status
  const checkPaymentStatus = useCallback(async () => {
    if (!user?.id || hasPaid !== null) return; // Avoid re-fetch if `hasPaid` is already set

    try {
      const token = localStorage.getItem("token");
      const urlEncodedData = new URLSearchParams();
      urlEncodedData.append("userId", String(user.id)); // Convert userId to string

      const response = await fetch(`/api/paid?action=check-payment-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // URL-encoded form submission
          Authorization: `Bearer ${token}`, // Include the Authorization token
        },
        body: urlEncodedData.toString(),
      });

      const data = await response.json();
      setHasPaid(data.hasPaid); // Set the payment status in state
    } catch (error) {
      console.error("Error fetching payment status:", error);
    }
  }, [user?.id, hasPaid]);

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push("/"); // Redirect to home after logout
  };

  // Fetch posts and check payment status when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Only call checkPaymentStatus if hasPaid is null
      if (hasPaid === null) {
        checkPaymentStatus();
      }

      // Fetch posts regardless of payment status
      const fetchPosts = async () => {
        try {
          const response = await fetch("/api/post");
          const data = await response.json();
          setPosts(data);
        } catch (error) {
          console.error("Failed to fetch posts:", error);
        }
      };

      fetchPosts();
    } else if (!isAuthenticated) {
      router.push("/"); // Redirect to home if not authenticated
    }
  }, [isAuthenticated, user, checkPaymentStatus, hasPaid, router]);

  // Redirect to payment page if the user hasn't paid
  useEffect(() => {
    if (hasPaid === false && isAuthenticated) {
    }
  }, [hasPaid, isAuthenticated, router]);

  if (hasPaid === null || !isAuthenticated) {
    return <div className="text-center text-xl p-4">Loading dashboard...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
        <div className="flex items-center">
          {/* Mobile menu toggle for Left Sidebar */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden mr-4"
          >
            <Bars3Icon className="h-6 w-6 text-white" />
          </button>
          <h1 className="text-2xl font-bold">UNIMATE</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/*<BellIcon className="h-6 w-6 text-white" />}
         { /*<UserCircleIcon className="h-6 w-6 text-white" />*}
          {/* Mobile menu toggle for Right Sidebar */}
          <button
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="md:hidden"
          >
            <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={handleLogout}
            className="text-sm bg-blue-500 hover:bg-skyblue-600 transition-colors px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Left Sidebar */}
        <aside
          className={`bg-gray-800 text-white w-64 p-6 md:block ${
            sidebarOpen ? "block" : "hidden"
          } md:static absolute z-10 top-0 left-0 h-full transition-transform transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:transform-none`}
        >
          <h3 className="text-2xl font-semibold mb-4">Advertise with Us</h3>

          {/* Add your advertisement content here */}
          <div className="bg-gray-700 rounded-lg p-4 mb-4 shadow-md">
            <p className="font-medium">Looking to engage students?</p>
            <p>
              Advertise your services and events directly to university
              students.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-900 text-white min-h-screen max-w-screen-lg mx-auto flex">
          <div className="flex-1 pr-6">
            <h2 className="text-4xl font-semibold mb-6 text-center">
              Welcome, {user?.username}
            </h2>
            <p className="text-lg mb-10 text-center">
              This is your personalized dashboard. Explore the features tailored
              for you!
            </p>

            <h3 className="text-2xl font-semibold mb-6 mt-10">
              Latest Articles
            </h3>

            {/* Display articles vertically */}
            <div className="space-y-12">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-shadow duration-300"
                >
                  <Image
                    src={post.image || "/default-image.jpg"}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="w-full h-48 object-contain"
                  />
                  <div className="p-6 text-gray-900">
                    <h3 className="text-2xl font-semibold mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-700 mb-4">{post.content}</p>

                    <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-400 hover:to-purple-500 transition-all duration-300">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Advertisement Section */}
        </main>

        {/* Right Sidebar */}
        <aside
          className={`bg-gray-800 text-white w-64 p-6 md:block ${
            rightSidebarOpen ? "block" : "hidden"
          } md:static absolute z-10 top-0 right-0 h-full transition-transform transform ${
            rightSidebarOpen ? "translate-x-0" : "translate-x-full"
          } md:transform-none`}
        >
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <ul className="space-y-4">
            <li>
              <Link
                href={hasPaid ? "/chat" : "/payment"}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  hasPaid ? "hover:bg-gray-700" : "bg-gray-600 opacity-50"
                }`}
              >
                <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 mr-2" />
                {hasPaid ? "Chat with friends" : "Please pay to chat"}
              </Link>
            </li>
          </ul>
          <App />
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
