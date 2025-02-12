"use client";
// src/app/about/page.tsx
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  SparklesIcon,
  EyeIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
// Navbar Component
const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#2b3338] bg-opacity-90 p-4 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="text-xl font-bold text-white">
          <Link href="/" className="text-blue-800">
            Unimate
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center space-x-6 text-lg text-white">
          <li>
            <Link href="/" className="hover:text-gray-400">
              Home
            </Link>
          </li>
          <li>
            <Link href="/who_we_are" className="hover:text-gray-400">
              Who We Are
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-gray-400">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-gray-400">
              Contact
            </Link>
          </li>
        </ul>

        {/* Sign Up and Login Buttons for Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/account" className="text-white hover:text-gray-400">
            Log In
          </Link>
          <Link
            href="/account"
            className="px-6 py-3 bg-gradient-to-r from-[#833ab4] to-[#fc4545] text-white rounded-lg hover:from-[#fc4545] hover:to-[#833ab4] transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <XMarkIcon className="h-8 w-8 text-white" />
            ) : (
              <Bars3Icon className="h-8 w-8 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {isOpen && (
        <div className="md:hidden bg-[#2b3338] text-white py-4">
          <ul className="flex flex-col space-y-4 items-center">
            <li>
              <Link
                href="/"
                className="hover:text-gray-400"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/who_we_are"
                className="hover:text-gray-400"
                onClick={() => setIsOpen(false)}
              >
                Who We Are
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-gray-400"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-gray-400"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/account"
                className="hover:text-gray-400"
                onClick={() => setIsOpen(false)}
              >
                Log In
              </Link>
            </li>
            <li>
              <Link
                href="/account"
                className="px-6 py-3 bg-gradient-to-r from-[#833ab4] to-[#fc4545] text-white rounded-lg hover:from-[#fc4545] hover:to-[#833ab4] transition"
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

const AboutPage: React.FC = () => {
  // Initialize AOS when the component mounts
  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // Initialize AOS with animation duration and trigger only once
  }, []);

  return (
    <section className="relative py-16 bg-[#1d2327] text-[#f1f9ff]">
      <Navbar />
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/p10.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="opacity-30"
        />
      </div>
      <div className="relative container mx-auto px-4 pt-32">
        {/* Mission, Vision, and Values */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl font-bold text-white mb-12"
            data-aos="fade-up"
          >
            Our Mission, Vision, and Values
          </h2>
          <div className="md:flex md:justify-between gap-8">
            <div
              className="md:w-1/3 mb-8 md:mb-0"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="p-6 bg-[#2b3338] text-[#f1f9ff] shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
                <SparklesIcon className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-2xl font-semibold mb-4">Mission</h3>
                <p>
                  Our mission is to connect Students through meaningful
                  Freindship. We are committed to creating a safe, user-friendly
                  platform for everyone.
                </p>
              </div>
            </div>
            <div
              className="md:w-1/3 mb-8 md:mb-0"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="p-6 bg-[#2b3338] text-[#f1f9ff] shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
                <EyeIcon className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-2xl font-semibold mb-4">Vision</h3>
                <p>
                  Our vision is to become the leading University Chating
                  Platform recognized for our innovative approach and our
                  dedication to user satisfaction.
                </p>
              </div>
            </div>
            <div className="md:w-1/3" data-aos="fade-up" data-aos-delay="600">
              <div className="p-6 bg-[#2b3338] text-[#f1f9ff] shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
                <GlobeAltIcon className="h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-2xl font-semibold mb-4">Values</h3>
                <p>
                  Our core values include integrity, respect, and inclusivity.
                  We believe in creating an environment where everyone feels
                  valued and supported.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Brief History */}
        <div className="mb-16">
          <h2
            className="text-4xl font-bold text-center text-white mb-8"
            data-aos="fade-up"
          >
            A Brief History
          </h2>
          <p
            className="text-center text-gray-300"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Founded in 2025, we started with the vision of creating university
            chating platform that prioritizes user experience and safety.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
