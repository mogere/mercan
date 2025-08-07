import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <div className="w-full h-[600px]">
      <Image
        src="/main.svg"
        alt="main image"
        layout="fill"
        className="items-center"
      />
    </div>
  );
};

export default Hero;
