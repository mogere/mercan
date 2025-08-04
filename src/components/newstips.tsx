import Image from "next/image";
import React from "react";
import Card from "./Card";

const NewsTips = () => {
  return (
    <div className="text-center p-8 ">
      <h2 className="text-orange-500 text-2xl">News and Tips</h2>
      <h1 className="font-extrabold text-4xl text-gray-700">
        <span className="text-orange-500">Latest</span> News & Updates
      </h1>
      <div className="flex justify-center items-center mt-4 mr-[120px]">
        <Image
          src="/icons/underline.svg"
          alt="News Tips"
          width={316}
          height={19}
          className="items-center"
        />
      </div>
      <div className="flex justify-between gap-10 my-8">
        <Card
          imageUrl="/filters.png"
          imageAlt="News Tips"
          title="5 Signs Your Car Needs Immediate Attention"
          description="Strange noises? Warning lights? Do not ignore the early signs of trouble. In this quick guide, we break down the top symptoms that mean it is time to visit your mechanic"
        />
        <Card
          imageUrl="/mechanic.png"
          imageAlt="News Tips"
          title="5 Signs Your Car Needs Immediate Attention"
          description="Strange noises? Warning lights? Do not ignore the early signs of trouble. In this quick guide, we break down the top symptoms that mean it is time to visit your mechanic"
        />
        <Card
          imageUrl="/attendant.png"
          imageAlt="News Tips"
          title="5 Signs Your Car Needs Immediate Attention"
          description="Strange noises? Warning lights? Do not ignore the early signs of trouble. In this quick guide, we break down the top symptoms that mean it is time to visit your mechanic"
        />
      </div>
    </div>
  );
};

export default NewsTips;
