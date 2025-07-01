import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="w-full m-2 rounded-sm bg-gray-100">
      {/* Top Footer Band */}
      {/* Footer Contact Band */}
      <div className="w-full  bg-orange-600 text-white py-3 px-4 flex flex-col md:flex-row items-center justify-between text-center text-sm font-medium">
        <span>📞 0741000000</span>
        <span className="mx-2 hidden md:inline">|</span>
        <span>✉️ info@mercan.com</span>
      </div>

      {/* Footer Main */}
      <footer className="w-full bg-white border-t border-gray-200 py-10 px-4 flex flex-col md:flex-row justify-between items-start">
        {/* Left: Logo & Address */}
        <div className="flex flex-col items-start w-full md:w-1/3 mb-8 md:mb-0">
          <Image
            src="/logo.png"
            alt="Mercan Logo"
            width={60}
            height={60}
            className="mb-2"
          />
          <div className="text-gray-700 text-sm mt-2">
            Bungoma Road, off Bunyala Road
            <br />
            Nairobi, Kenya.
          </div>
        </div>
        {/* Right: Car Brands */}
        <div className="w-full md:w-2/3 flex justify-end">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-2xl">
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="font-semibold text-gray-800 mb-1">Toyota</li>
              <li>Nissan</li>
              <li>Honda</li>
              <li>Mazda</li>
              <li>Mitsubishi</li>
            </ul>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="font-semibold text-gray-800 mb-1">Mercedes</li>
              <li>BMW</li>
              <li>Audi</li>
              <li>Volkswagen</li>
              <li>Porsche</li>
            </ul>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="font-semibold text-gray-800 mb-1">Subaru</li>
              <li>Ford</li>
              <li>Chevrolet</li>
              <li>Kia</li>
              <li>Hyundai</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
