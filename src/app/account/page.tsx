"use client";

import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "../context/AuthContext";

interface FormDataState {
  profileImage?: File;
  username?: string;
  university?: string;
  gender?: string;
  nationality?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormDataState>({});
  const [error, setError] = useState<string | null>(null);
  const { login, signup } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const files = (e.target as HTMLInputElement).files;
    setFormData({
      ...formData,
      [name]: type === "file" ? (files ? files[0] : undefined) : value, // Safely handle file input
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Handle login
        if (!formData.username || !formData.password) {
          throw new Error("Username and password are required");
        }
        await login(formData.username, formData.password);
        window.location.href = "/";
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }

        const formDataForSignup = new FormData();
        Object.keys(formData).forEach((key) => {
          const value = formData[key as keyof FormDataState];
          if (value !== undefined && value !== null) {
            // Properly handle each value type
            if (value instanceof File) {
              formDataForSignup.append(key, value);
            } else {
              formDataForSignup.append(key, value as string);
            }
          }
        });

        await signup(formDataForSignup);
        alert("User registered successfully! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1d2327] text-white flex flex-col justify-center items-center p-4 sm:p-8">
      <div
        className="bg-[#2b3338] shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-lg mt-8"
        data-aos="fade-up"
      >
        <div className="flex justify-center mb-6">
          <button
            className={`text-lg font-bold px-4 py-2 border-b-2 ${
              isLogin
                ? "border-[#833ab4] text-[#833ab4]"
                : "border-transparent text-gray-500"
            } hover:text-[#833ab4]`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`text-lg font-bold px-4 py-2 border-b-2 ${
              !isLogin
                ? "border-[#833ab4] text-[#833ab4]"
                : "border-transparent text-gray-500"
            } hover:text-[#833ab4]`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {isLogin && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-lg font-medium text-gray-300"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 shadow-sm rounded-md bg-[#1d2327] text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#833ab4]"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-lg font-medium text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 shadow-sm rounded-md bg-[#1d2327] text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#833ab4]"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#833ab4] to-[#fc4545] text-white rounded-lg hover:from-[#fc4545] hover:to-[#833ab4] transition"
            >
              Login
            </button>
          </form>
        )}

        {/* Signup Form */}
        {!isLogin && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="profile-image"
                className="block text-lg font-medium text-gray-300"
              >
                Profile Image
              </label>
              <input
                type="file"
                id="profile-image"
                name="profileImage"
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 shadow-sm rounded-md bg-[#1d2327] text-white border border-gray-500 focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="username-signup"
                className="block text-lg font-medium text-gray-300"
              >
                Username
              </label>
              <input
                type="text"
                id="username-signup"
                name="username"
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 shadow-sm rounded-md bg-[#1d2327] text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#833ab4]"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="university"
                className="block text-lg font-medium text-gray-300"
              >
                University
              </label>
              <select
                id="university"
                name="university"
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 shadow-sm rounded-md bg-[#1d2327] text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#833ab4]"
                required
              >
                <option value="">Select your university</option>
                {/* Populate with actual university options */}
                <option value="Main Campus">Main Campus</option>
                <option value="Kampala Campus">Kampala Campus</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="gender"
                className="block text-lg font-medium text-gray-300"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 shadow-sm rounded-md bg-[#1d2327] text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#833ab4]"
                required
              >
                <option value="" className="text-white">
                  Select your gender
                </option>
                <option value="male" className="text-white">
                  Male
                </option>
                <option value="female" className="text-white">
                  Female
                </option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="nationality"
                className="block text-lg font-medium text-gray-300"
              >
                Nationality
              </label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 shadow-sm rounded-md bg-[#1d2327] text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#833ab4]"
                placeholder="Enter your nationality"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-lg font-medium text-gray-300"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 shadow-sm rounded-md bg-[#1d2327] text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#833ab4]"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password-signup"
                className="block text-lg font-medium text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password-signup"
                name="password"
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 shadow-sm rounded-md bg-[#1d2327] text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#833ab4]"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirm-password"
                className="block text-lg font-medium text-gray-300"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 shadow-sm rounded-md bg-[#1d2327] text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#833ab4]"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#833ab4] to-[#fc4545] text-white rounded-lg hover:from-[#fc4545] hover:to-[#833ab4] transition"
            >
              Sign Up
            </button>
          </form>
        )}

        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      </div>
    </div>
  );
}
