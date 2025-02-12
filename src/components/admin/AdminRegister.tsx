"use client";

import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const jsonData = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      phone: formData.phone,
    };

    try {
      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        throw new Error("Failed to register.");
      }

      alert("Admin registered successfully!");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col justify-center items-center p-4">
      <div
        className="bg-gray-900 shadow-lg rounded-lg p-6 w-full max-w-lg"
        data-aos="fade-up"
      >
        <h2 className="text-center text-2xl font-bold mb-6">Admin Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-lg font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-3 rounded-md bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 rounded-md bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-3 rounded-md bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 rounded-md bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-3 rounded-md bg-gray-700 text-white"
              required
            />
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
