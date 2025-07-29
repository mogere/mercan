import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <>
      <footer className="w-full bg-[#3A3A3C] h-[650px] border-t border-gray-200 py-10 px-4 flex flex-col md:flex-row justify-between items-start">
        {/* Left: Logo & Address */}
        <div className="flex m-[3rem] flex-col items-start w-full md:w-1/3 mb-8 md:mb-0">
          <Image
            src="/logo.png"
            alt="Mercan Logo"
            width={60}
            height={60}
            className=""
          />
          <div className="text-white w-[20rem] text-md mt-2">
            <p>
              Revitalize Your Ride with Mercan — Where expert repairs, genuine
              spares, and trusted car sales come together to keep you moving
              with confidence.
            </p>
          </div>
          <div className="text-white w-[20rem] mt-7 text-md font-semibold ">
            <ul>
              <li className="flex gap-2 mb-1">
                <Image
                  src="/icons/location.svg"
                  alt="Location Icon"
                  width={16}
                  height={16}
                />
                Nairobi, Kenya
              </li>
              <li className=" flex gap-2 mb-1">
                <Image
                  src="/icons/phone.svg"
                  alt="Phone Icon"
                  width={16}
                  height={16}
                />
                Phone: +123 456 7890
              </li>
              <li className="flex gap-2 mb-1">
                <Image
                  src="/icons/mail.svg"
                  alt="Email Icon"
                  width={16}
                  height={16}
                />
                Email: info@mercan.com
              </li>
            </ul>
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
        <hr className="border-orange-500"></hr>
        <div className="text-white text-sm mt-8">
          <p className="text-center">
            © {new Date().getFullYear()} Mercan. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
