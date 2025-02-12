"use client"; // Ensure this is a client component

import React, { useEffect, useState } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

import {
  BriefcaseIcon,
  GlobeAltIcon,
  HeartIcon,
  CheckCircleIcon,
  UsersIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
// State for mobile menu toggle
export default function HomePage() {
  const [matchesCount, setMatchesCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);

  // Initialize AOS and counting animations
  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with animation duration

    const animateCount = (
      start: number,
      end: number,
      duration: number,
      setter: (value: number) => void
    ) => {
      const stepTime = Math.abs(Math.floor(duration / end));
      let current = start;
      const timer = setInterval(() => {
        current += 1;
        setter(current);
        if (current === end) {
          clearInterval(timer);
        }
      }, stepTime);
    };

    // Start counting animation
    animateCount(0, 200, 2000, setMatchesCount); // 100,000 Matches
    animateCount(0, 300, 2000, setUsersCount); // 500,000 Users
    animateCount(0, 10, 2000, setEventsCount); // 50 Events
  }, []);

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

  interface FAQ {
    question: string;
    answer: string;
  }

  const faqs: FAQ[] = [
    {
      question: "What is the pricing structure?",
      answer:
        "By now we offer one pricing plans which is called Standard that works for two weeks  ",
    },

    {
      question: "Is there a free trial available?",
      answer: "We offer trial that don't allow chating .",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can reach out to our support team via the contact form on our website or by emailing support@unimate.com.",
    },
  ];

  const FAQSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAnswer = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
    };

    return (
      <section className="py-16 bg-[#1d2327] text-[#f1f9ff]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#2b3338] p-6 rounded-lg shadow-lg cursor-pointer"
                onClick={() => toggleAnswer(index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{faq.question}</h3>
                  <span className="text-[#89c550] text-2xl">
                    {openIndex === index ? "-" : "+"}
                  </span>
                </div>
                {openIndex === index && (
                  <p className="mt-4 text-gray-300">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const Footer: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    // Handle email subscription
    const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!email) {
        setMessage("Please enter a valid email address.");
        return;
      }

      try {
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage("Thank you for subscribing!");
          setEmail("");
        } else {
          setMessage(data.message || "Something went wrong. Please try again.");
        }
      } catch (error) {
        setMessage("Failed to subscribe. Please try again later.");
      }
    };

    return (
      <footer className="bg-[#1d2327] text-[#f1f9ff] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul>
                <li className="mb-2">Kampala, Uganda</li>
                <li className="mb-2">Phone: +256-789-683-140</li>
                <li>
                  Email:{" "}
                  <a
                    href="mailto:support@unimate.com"
                    className="text-[#89c550] hover:text-white"
                  >
                    support@unimate.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Navigation Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="hidden md:block space-y-4 text-lg text-white">
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
            </div>

            {/* Newsletter Signup & Social Media */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <form onSubmit={handleSubscribe} className="mb-6">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-2 rounded-l-lg border-none text-gray-800"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#89c550] p-2 rounded-r-lg text-white font-semibold hover:bg-[#77a747]"
                >
                  Subscribe
                </button>
              </form>
              {message && (
                <p className="text-sm text-[#89c550] mb-4">{message}</p>
              )}
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com/unimate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#89c550] hover:text-white"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="w-6 h-6" />
                </a>
                <a
                  href="https://twitter.com/unimate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#89c550] hover:text-white"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-6 h-6" />
                </a>
                <a
                  href="https://linkedin.com/company/unimate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#89c550] hover:text-white"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-8 border-t border-gray-600 pt-4 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} Unimate. All rights reserved.
            </p>
            <p>
              <a
                href="/privacy-policy"
                className="text-[#89c550] hover:text-white"
              >
                Privacy Policy
              </a>{" "}
              |{" "}
              <a
                href="/terms-of-service"
                className="text-[#89c550] hover:text-white"
              >
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </footer>
    );
  };
  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen p-8 bg-[#1e293b] text-white font-sans">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl font-bold mb-4" data-aos="fade-up">
            Welcome to Unimate!
          </h1>
          <p className="text-lg mb-6" data-aos="fade-up" data-aos-delay="200">
            Discover amazing people and find your match with ease.
          </p>
          <div
            className="mt-8 flex justify-center lg:justify-start"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <Link href="/account">
              <button className="px-6 py-3 bg-gradient-to-r from-[#833ab4] to-[#fc4545] text-white rounded-lg hover:from-[#fc4545] hover:to-[#833ab4] transition">
                Get Started
              </button>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 mt-8 lg:mt-0">
          <Image
            src="/images/p10.jpg" // Correct path for public directory
            alt="Illustration"
            width={500}
            height={500}
            className="object-contain rounded-lg"
            data-aos="fade-up"
            data-aos-delay="600"
          />
        </div>
      </div>
      {/* Wire Decoration */}
      <div className="relative">
        <div className="absolute inset-x-0 top-full h-1 bg-[#2b3338] z-[-1]">
          <div className="w-full h-full bg-gradient-to-r from-[#1d2327] to-[#2b3338]"></div>
        </div>
      </div>
      {/* Achievement Section */}
      <section className="py-16 bg-[#1e293b] text-[#f1f9ff]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-8" data-aos="fade-up">
              Our Achievements
            </h2>
            <p
              className="text-lg text-gray-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              We are proud of the impact we have made in connecting people
              through meaningful relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Matches Achieved */}
            <div
              className="flex flex-col items-center p-6 bg-[#2b3338] shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <HeartIcon className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-5xl font-bold mb-2">
                {matchesCount.toLocaleString()}
              </h3>
              <p className="text-lg text-gray-300">Successful Search</p>
            </div>

            {/* Users Count */}
            <div
              className="flex flex-col items-center p-6 bg-[#2b3338] shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <UsersIcon className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-5xl font-bold mb-2">
                {usersCount.toLocaleString()}
              </h3>
              <p className="text-lg text-gray-300">Active Users</p>
            </div>

            {/* Events Held */}
            <div
              className="flex flex-col items-center p-6 bg-[#2b3338] shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <CalendarIcon className="h-16 w-16 text-blue-500 mb-4" />
              <h3 className="text-5xl font-bold mb-2">{eventsCount}</h3>
              <p className="text-lg text-gray-300">Events Hosted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Highlight Section */}
      <section className="py-16 bg-[#1e293b] text-white">
        <div className="container mx-auto px-4">
          <h2
            className="text-4xl font-bold text-center mb-12"
            data-aos="fade-up"
          >
            Our Core Services
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Matching */}
            <div
              className="flex flex-col items-center text-center p-8 shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <HeartIcon className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Profile Search</h3>
              <p className="text-gray-400 text-lg">
                Our intelligent algorithm matches you with compatible users
                based on search you are interested in and preferences.
              </p>
            </div>

            {/* Messaging */}
            <div
              className="flex flex-col items-center text-center p-8 shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <BriefcaseIcon className="h-16 w-16 text-blue-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Private Messaging</h3>
              <p className="text-gray-400 text-lg">
                Connect with your matches through our secure and easy-to-use
                messaging platform.
              </p>
            </div>

            {/* Global Community */}
            <div
              className="flex flex-col items-center text-center p-8 shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <GlobeAltIcon className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Global Community</h3>
              <p className="text-gray-400 text-lg">
                Meet people from around the world and expand your connections
                beyond your local area.
              </p>
            </div>

            {/* Event Hosting */}
            <div
              className="flex flex-col items-center text-center p-8 shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay="800"
            >
              <CalendarIcon className="h-16 w-16 text-yellow-500 mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Event Hosting</h3>
              <p className="text-gray-400 text-lg">
                Join virtual and in-person events to meet other singles and
                engage in fun activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#1e293b] text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Key Benefits of Our Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div
              className="flex flex-col items-center text-center p-6 bg-gradient-to-r from-[#1d2327] via-[#2d3a3f] to-[#1d2327] shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <CheckCircleIcon className="h-16 w-16 text-[#89c550] mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Personalized Search
              </h3>
              <p className="text-[#f1f9ff]">
                Our advanced algorithm ensures that you search based on your
                preferences and interests, making your search more effective and
                enjoyable.
              </p>
            </div>
            <div
              className="flex flex-col items-center text-center p-6 bg-gradient-to-r from-[#1d2327] via-[#2d3a3f] to-[#1d2327] shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <CheckCircleIcon className="h-16 w-16 text-[#89c550] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Safe and Secure</h3>
              <p className="text-[#f1f9ff]">
                We prioritize your safety with robust security measures and
                privacy features, so you can connect with confidence.
              </p>
            </div>
            <div
              className="flex flex-col items-center text-center p-6 bg-gradient-to-r from-[#1d2327] via-[#2d3a3f] to-[#1d2327] shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <CheckCircleIcon className="h-16 w-16 text-[#89c550] mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                User-Friendly Interface
              </h3>
              <p className="text-[#f1f9ff]">
                Enjoy a seamless experience with our intuitive and
                easy-to-navigate interface designed for all users.
              </p>
            </div>
            <div
              className="flex flex-col items-center text-center p-6 bg-gradient-to-r from-[#1d2327] via-[#2d3a3f] to-[#1d2327] shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay="800"
            >
              <CheckCircleIcon className="h-16 w-16 text-[#89c550] mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-[#f1f9ff]">
                Our dedicated support team is available around the clock to
                assist you with any questions or issues you may encounter.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-[#1e293b] text-[#f1f9ff]">
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-12"
            data-aos="fade-up"
          >
            Pricing Plans
          </h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {/* Standard Plan */}
            <div className="bg-[#2b3338] text-[#f1f9ff] shadow-lg rounded-lg p-6 flex flex-col items-center ring-2 ring-[#89c550] ring-offset-4">
              <h3 className="text-2xl font-bold mb-4">Standard</h3>
              <p className="text-xl font-semibold mb-4">1000 UGX /2 Weeks</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="text-[#89c550] mr-2">✓</span> Chating
                </li>

                <li className="flex items-center">
                  <span className="text-[#89c550] mr-2">✓</span> Profile Boost
                </li>

                <li className="flex items-center">
                  <span className="text-[#89c550] mr-2">✓</span> Priority
                  Support
                </li>
              </ul>
              <button className="bg-[#89c550] text-white px-4 py-2 rounded-lg hover:bg-[Black] transition">
                <Link
                  href="/account"
                  className="text-white hover:text-gray-400"
                >
                  Choose Plan
                </Link>
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-[#1e293b] text-[f1f9ff]">
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-12"
            data-aos="fade-up"
          >
            Testimonials from Our Users
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              className="flex flex-col items-center text-center p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Image
                src="/images/p10.jpg" // Ensure the path is correct
                alt="User 1"
                width={100}
                height={100}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />

              <p className="text-sm text-gray-600 mb-4">Noella</p>
              <p className="text-gray-800">
                “This platform has completely transformed how I connect with
                others. It&#39;s intuitive and easy to use!”
              </p>
            </div>
            <div
              className="flex flex-col items-center text-center p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <Image
                src="/images/p10.jpg" // Ensure the path is correct
                alt="User 2"
                width={100}
                height={100}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />

              <p className="text-sm text-gray-600 mb-4">Betty</p>
              <p className="text-gray-800">
                “I love how easy it is to find people who share my interests.
                The user interface is superb!”
              </p>
            </div>
            <div
              className="flex flex-col items-center text-center p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <Image
                src="/images/p10.jpg" // Ensure the path is correct
                alt="User 3"
                width={100}
                height={100}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />

              <p className="text-sm text-gray-600 mb-4">Sheba</p>
              <p className="text-gray-800">
                “The support team is incredibly responsive and helpful. I’ve had
                a great experience overall!”
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <FAQSection />
      </section>

      <section>
        <Footer />
      </section>
    </div>
  );
}
