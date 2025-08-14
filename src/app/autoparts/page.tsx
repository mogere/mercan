import Image from "next/image";
import React from "react";

const Autoparts = () => {
  return (
    <div className="p-4 mt-20  text-gray-600 bg-white">
      <div className="flex justify-center mt-10  mb-8">
        <select className="border w-1/5 p-2 rounded-l-lg mb-4">
          <option value="all">All </option>
          <option value="engine">Engine Parts</option>
          <option value="body">Body Parts</option>
          <option value="interior">Interior Parts</option>
          <option value="exterior">Exterior Parts</option>
        </select>
        <input
          type="text"
          placeholder="I'm looking for..."
          className="border w-3/5 rounded-r-lg p-2 mb-4 "
        />
        <button className="bg-orange-500 text-white p-2 rounded-lg mb-4  hover:bg-orange-600 transition duration-200">
          Search
        </button>
      </div>
      <select className="border-b w-70 p-2 ml-70 mb-4">
        <option value="all">All </option>
        <option value="engine">Engine Parts</option>
        <option value="body">Body Parts</option>
        <option value="interior">Interior Parts</option>
        <option value="exterior">Exterior Parts</option>
      </select>
      <div className="flex justify-between m-20 items-center ">
        <div>
          <p className="text-5xl font-bold mb-5 text-black">Power Your</p>
          <p className="text-orange-500 text-7xl font-extrabold"> Drive</p>
          <p className="text-4xl font-bold text-black"> with the right parts</p>
        </div>

        <Image
          src="/Powerdrive.png"
          alt="power drive"
          width={600}
          height={600}
          className=""
        />
      </div>
      <div className="flex justify-between border border-gray-400 rounded-lg w-full h-[230px] ">
        <div className="w-1/3 p-4">
          <Image
            src="/icons/spares.svg"
            alt="autoparts"
            width={64}
            height={64}
          />
          <h2 className="text-xl font-bold mt-4">Over 1000 Auto Spare Parts</h2>
        </div>
        <div className="w-1/3 p-4">
          <Image
            src="/icons/shipping.svg"
            alt="shipping"
            width={64}
            height={64}
          />
          <h2 className="text-xl font-bold mt-4">Free Shipping</h2>
        </div>
        <div className="w-1/3 p-4">
          <Image
            src="/icons/compliant.svg"
            alt="compliant"
            width={64}
            height={64}
          />
          <h2 className="text-xl font-bold mt-4">15 Days of Complaint</h2>
        </div>
      </div>
      <div className="m-20">
        <span className="text-2xl font-bold text-gray-700">
          <span className="text-orange-500">Find Autoparts</span> for Any Car
          Model
        </span>
        <Image
          src="/icons/underline.svg"
          alt="underline"
          width={316}
          height={19}
        />
      </div>
    </div>
  );
};

export default Autoparts;
