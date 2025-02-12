"use client"; // Ensure this is a client component

import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles

import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

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

// WhoWeAre Component
const WhoWeAre: React.FC = () => {
  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Sample team members data

  return (
    <section className="relative py-16 bg-[#1e293b] text-[#f1f9ff]">
      <Navbar /> {/* Render the Navbar here */}
      <div className="container mx-auto px-4 pt-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white" data-aos="fade-up">
            Who We Are
          </h2>
        </div>

        {/* Company Culture */}
        <div className="bg-[#374151] p-8 rounded-lg mb-16" data-aos="fade-up">
          <h3 className="text-3xl font-semibold text-white text-center">
            Our Culture and Values
          </h3>
          <p
            className="mt-4 max-w-2xl mx-auto text-center text-gray-300"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            At Unimate, we believe in fostering a culture of innovation,
            respect, and collaboration. Our values are built on inclusivity and
            integrity, and we work together to create a welcoming environment
            for both our team and our users.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
