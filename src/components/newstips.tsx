import Image from "next/image";
import React from "react";

const NewsTips = () => {
  return (
    <div className="text-center p-8 ">
      <h2 className="text-orange-500 text-2xl">News and Tips</h2>
      <h1 className="font-extrabold text-4xl text-gray-700">
        <span className="text-orange-500">Latest</span> News & Updates
      </h1>
      <Image
        src="/icons/underline.svg"
        alt="News Tips"
        width={316}
        height={19}
        className="text-center"
      />
      <div className="flex justify-between items-center gap-10 my-8">
        <div className="w-[520px] ">
          <Image src="/filters.png" alt="News Tips" width={520} height={450} />
          <div className="flex flex-col shadow-md shadow-gray-300 gap-4">
            <h1 className="font-bold text-black p-4 text-2xl">
              5 Signs Your Car Needs Immediate Attention
            </h1>
            <span className="text-[#3A3A3C] text-xl">
              Strange noises? Warning lights? Don’t ignore the early signs of
              trouble. In this quick guide, we break down the top symptoms that
              mean it’s time to visit your mechanic
            </span>
          </div>
        </div>
        <div className="w-[520px] ">
          <Image src="/mechanic.png" alt="News Tips" width={500} height={300} />
          <div className="flex flex-col shadow-md shadow-gray-300 gap-4">
            <h1 className="font-bold text-black p-4 text-2xl">
              5 Signs Your Car Needs Immediate Attention
            </h1>
            <span className="text-[#3A3A3C] text-xl">
              Strange noises? Warning lights? Don’t ignore the early signs of
              trouble. In this quick guide, we break down the top symptoms that
              mean it’s time to visit your mechanic
            </span>
          </div>
        </div>
        <div className="w-[520px] ">
          <Image
            src="/attendant.png"
            alt="News Tips"
            width={500}
            height={300}
          />
          <div className="flex flex-col shadow-md shadow-gray-300 gap-4">
            <h1 className="font-bold text-black p-4 text-2xl">
              5 Signs Your Car Needs Immediate Attention
            </h1>
            <span className="text-[#3A3A3C] text-xl">
              Strange noises? Warning lights? Don’t ignore the early signs of
              trouble. In this quick guide, we break down the top symptoms that
              mean it’s time to visit your mechanic
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTips;
