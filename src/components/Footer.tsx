import Image from "next/image";

const Footer = () => {
  return (
    <>
      <footer className="w-full bg-[#3A3A3C] h-[500px] border-t border-gray-200 py-10 px-4 flex flex-col md:flex-row justify-between items-start">
        <div className="flex m-[3rem] flex-col  h-full items-start w-full md:w-1/3 mb-8 md:mb-0">
          <Image
            src="/logo.png"
            alt="Mercan Logo"
            width={60}
            height={60}
            className=""
          />
          <div className="text-white w-[20rem] text-xl mt-2">
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
        <div className="w-full mt-20 h-full text-2xl  md:w-2/3 flex justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-2xl">
            <ul className="space-y-2 text-xl text-white ">
              <li>
                <h1 className="text-orange-500 ">Services</h1>
              </li>
              <li className="flex gap-2 mb-4">
                <Image
                  src="/icons/pointer.svg"
                  alt="Phone Icon"
                  width={16}
                  height={16}
                />
                Garage
              </li>
              <li className="flex gap-2 mb-4">
                <Image
                  src="/icons/pointer.svg"
                  alt="Pointer Icon"
                  width={16}
                  height={16}
                />
                Auto Spares
              </li>
              <li className="flex gap-2 mb-4">
                <Image
                  src="/icons/pointer.svg"
                  alt="Pointer Icon"
                  width={16}
                  height={16}
                />
                Body-kit Conversion
              </li>
              <li className="flex gap-2 mb-4">
                <Image
                  src="/icons/pointer.svg"
                  alt="Pointer Icon"
                  width={16}
                  height={16}
                />
                Car sales
              </li>
            </ul>
            <ul className="space-y-2 text-white text-2xl ">
              <li>
                <h1 className="text-orange-500 ">Quick links</h1>
              </li>
              <li className="flex gap-2 mb-4">
                <Image
                  src="/icons/pointer.svg"
                  alt="Phone Icon"
                  width={16}
                  height={16}
                />
                About Us
              </li>
              <li className="flex gap-2 mb-4">
                <Image
                  src="/icons/pointer.svg"
                  alt="Pointer Icon"
                  width={16}
                  height={16}
                />
                Products & Services
              </li>
              <li className="flex gap-2 mb-4">
                <Image
                  src="/icons/pointer.svg"
                  alt="Pointer Icon"
                  width={16}
                  height={16}
                />
                Contact Us
              </li>
              <li className="flex gap-2 mb-4">
                <Image
                  src="/icons/pointer.svg"
                  alt="Pointer Icon"
                  width={16}
                  height={16}
                />
                Car sales
              </li>
            </ul>
            <div>
              <h1 className="text-orange-500">Schedule An Appointment Today</h1>
              <div className="flex mb-2 h-10 mt-2">
                <input
                  type="email"
                  placeholder="Write your email..."
                  className="p-2 text-sm  bg-white text-gray-800  h-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button className=" bg-orange-500 text-white py-2 h-full w-[50px] hover:bg-orange-600 transition duration-200">
                  <Image
                    src="/icons/send.svg"
                    alt="Send Icon"
                    width={30}
                    height={30}
                    className=""
                  />
                </button>
              </div>
              <span className="text-orange-500 text-small ">
                Open Hours:{" "}
                <span className="text-white">9:00 AM - 6:00 PM</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
      <hr className=" mx-1 border-orange-500"></hr>
      <div className="text-white text-sm mt-8">
        <p className="text-center">
          © {new Date().getFullYear()} Mercan. All rights reserved.
        </p>
      </div>
    </>
  );
};

export default Footer;
