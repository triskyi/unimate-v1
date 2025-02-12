"use client";

import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#2b3338] bg-opacity-90 p-4 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-white">
          <Link href="/" className="text-blue-800">
            Unimate
          </Link>
        </div>

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

const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        (event.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-16 bg-[#1e293b] text-[#f1f9ff]">
      <Navbar />
      <div className="container mx-auto px-4 pt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold" data-aos="fade-up">
            Contact Us
          </h2>
          <p className="mt-4 text-lg" data-aos="fade-up" data-aos-delay="200">
            We’d love to hear from you! Get in touch with us using the details
            below or by filling out the form.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Contact cards remain the same */}
        </div>

        <div
          className="bg-white p-8 shadow-lg rounded-lg"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">
            Send Us a Message
          </h3>
          <form
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="name"
                className="block text-lg font-medium text-gray-800"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 p-3 block w-full shadow-sm rounded-md border border-gray-300"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-800"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 p-3 block w-full shadow-sm rounded-md border border-gray-300"
                placeholder="Your Email"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="subject"
                className="block text-lg font-medium text-gray-800"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="mt-1 p-3 block w-full shadow-sm rounded-md border border-gray-300"
                placeholder="Subject"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="message"
                className="block text-lg font-medium text-gray-800"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="mt-1 p-3 block w-full shadow-sm rounded-md border border-gray-300"
                placeholder="Your Message"
                required
              ></textarea>
            </div>

            {submitStatus === "success" && (
              <div className="md:col-span-2 p-4 bg-green-100 text-green-700 rounded-lg">
                Message sent successfully!
              </div>
            )}
            {submitStatus === "error" && (
              <div className="md:col-span-2 p-4 bg-red-100 text-red-700 rounded-lg">
                Failed to send message. Please try again.
              </div>
            )}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#833ab4] to-[#fc4545] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
