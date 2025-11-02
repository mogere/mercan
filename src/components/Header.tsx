"use client";
import { useState } from "react";
import Image from "next/image";
// import Link from "next/link";
import { ShoppingCart, User, ChevronDown } from "lucide-react";

const Header = ({ showHeader }: { showHeader: boolean }) => {
  const [category, setCategory] = useState("All");
  console.log("Show Header:", showHeader);

  return (
    <header className="w-full text-black flex items-center justify-between px-6 py-3 shadow-sm bg-white">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Image
          src="/logo.png" // Replace with your logo path
          alt="Mercan Auto Spares"
          width={60}
          height={60}
          className="object-contain"
        />
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mx-6 hidden md:flex">
        <div className="flex w-full border border-gray-300 rounded-lg overflow-hidden">
          <div className="flex items-center px-3 bg-gray-100 border-r border-gray-300 cursor-pointer">
            <span className="font-semibold text-sm">{category}</span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </div>
          <input
            type="text"
            placeholder="I am Looking for…."
            className="flex-1 px-4 py-2 outline-none"
          />
          <button
            className="bg-[#e3703b] text-white font-semibold px-5 hover:bg-[#cf602c] transition"
            onClick={() => setCategory("All")}
          >
            Search
          </button>
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center space-x-6">
        {/* Login */}
        <button className="flex items-center text-sm font-medium hover:text-[#e3703b] transition">
          <User className="w-5 h-5 mr-1" />
          Login
        </button>

        {/* Cart */}
        <div className="relative cursor-pointer hover:text-[#e3703b] transition">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            1
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
