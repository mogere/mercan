"use client";
import Header from "@/components/Header";
import Slideshow from "@/components/slideshow";
import Image from "next/image";
import { useState, useEffect } from "react";

const carSlides = [
  {
    image: "/car1.webp",
    title: "Sleek Sedan",
    desc: "Experience comfort and style with our latest sedan.",
  },
  {
    image: "/car2.jpg",
    title: "Sporty Coupe",
    desc: "Feel the thrill with our high-performance coupe.",
  },
  {
    image: "/car3.avif",
    title: "Family SUV",
    desc: "Space and safety for your whole family.",
  },
];
const Home = () => {
  const [showHeader, setShowHeader] = useState(false);
  const [current, setCurrent] = useState(0);

  const handleGoHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setShowHeader(true), 600); // Wait for scroll animation
  };

  useEffect(() => {
    if (!showHeader) return;
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % carSlides.length);
    }, 4000);
    return () => clearTimeout(timer);
  }, [current, showHeader]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">
      {/* Animated Header */}
      <Header showHeader={showHeader} />

      {/* Slideshow */}
      {showHeader && (
        <Slideshow
          carSlides={carSlides}
          current={current}
          setCurrent={setCurrent}
        />
      )}
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
