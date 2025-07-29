import React from "react";
import Image from "next/image";
import Link from "next/link";

const Header = ({ showHeader }: { showHeader: boolean }) => {
  return (
    <div>
      <header
        className={` flex justify-between fixed top-0 left-0 w-full z-20 bg-white shadow transition-all duration-700 ${
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
          <Link
            href="#"
            className="text-gray-700 font-semibold hover:text-orange-600"
          >
            Home
          </Link>
          <Link
            href="#"
            className="text-gray-700 font-semibold hover:text-orange-600"
          >
            About
          </Link>
          <Link
            href="#"
            className="text-gray-700 font-semibold hover:text-orange-600"
          >
            Products & Services
          </Link>
          <Link
            href="#"
            className="text-gray-700 font-semibold hover:text-orange-600"
          >
            Contacts
          </Link>
        </nav>
        <button className="bg-orange-600 text-white font-semibold py-2 px-4 rounded shadow hover:bg-orange-500 transition duration-300">
          Get Started
        </button>
      </header>
    </div>
  );
};

export default Header;
