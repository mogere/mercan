"use client";
import Image from "next/image";
import { useState } from "react";

const Home = () => {
  const [showHeader, setShowHeader] = useState(false);

  const handleGoHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setShowHeader(true), 600); // Wait for scroll animation
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">
      {/* Animated Header */}
      <header
        className={`fixed top-0 left-0 w-full z-20 bg-white shadow transition-all duration-700 ${
          showHeader ? "h-20 opacity-100" : "h-0 opacity-0 pointer-events-none"
        } flex items-center px-8`}
      >
        <div
          className={`transition-all duration-700 ${
            showHeader ? "translate-x-0" : "-translate-x-20 opacity-0"
          }`}
        >
          <Image src="/logo.png" alt="Logo" width={60} height={60} />
        </div>
        <nav
          className={`ml-10 flex gap-8 transition-opacity duration-700 ${
            showHeader ? "opacity-100" : "opacity-0"
          }`}
        >
          <a
            href="#"
            className="text-gray-700 font-semibold hover:text-orange-600"
          >
            Home
          </a>
          <a
            href="#"
            className="text-gray-700 font-semibold hover:text-orange-600"
          >
            Products
          </a>
          <a
            href="#"
            className="text-gray-700 font-semibold hover:text-orange-600"
          >
            Services
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <div
        className={`flex flex-col items-center justify-center transition-all duration-700 ${
          showHeader ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <Image src="/logo.png" alt="Logo" width={100} height={100} />
        <h1 className="text-3xl text-gray-600 font-bold text-center mt-10">
          Welcome to Mercan
        </h1>
        <p className="text-center text-gray-800 mt-4">
          Begin the journey to revitalize your ride.
        </p>
        <div className="flex justify-center mt-8">
          <a
            href="/checkout"
            onClick={handleGoHome}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
          >
            Go to home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
