"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Use next/navigation in the app directory

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      // Store the token, admin status, and username in localStorage
      localStorage.setItem("token", data.token); // Store the token
      localStorage.setItem("isAdmin", "true"); // Set admin status
      localStorage.setItem("username", username); // Store the username

      alert(data.message); // Show success message
      router.push("/admin/dashboard"); // Redirect to the admin dashboard
    } else {
      alert(data.message); // Show error message
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1d2327]">
      <form
        onSubmit={handleLogin}
        className="bg-[#17202A] p-8 rounded-lg shadow-lg w-full max-w-md transition-transform transform hover:scale-105 duration-300"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-[#f0f0f0]">
          Admin Login
        </h2>
        <div className="mb-4">
          <label className="block text-lg text-[#f0f0f0] font-medium">
            Username:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-2 w-full p-3 border border-[#3b3b3b] rounded bg-[#1d2327] text-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
        </div>
        <div className="mb-6">
          <label className="block text-lg text-[#f0f0f0] font-medium">
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-2 w-full p-3 border border-[#3b3b3b] rounded bg-[#1d2327] text-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:bg-gradient-to-l transition duration-200"
        >
          Login
        </button>
      </form>
      <p className="mt-6 text-[#f0f0f0]">
        Don’t have an account?{" "}
        <Link href="/admin/register" className="text-blue-400 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default AdminLogin;
