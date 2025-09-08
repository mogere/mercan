import Image from "next/image";
import React from "react";

const Service = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <div className="w-[340px] h-[272px] ">
      <Image
        src={imageUrl}
        alt="service image"
        width={340}
        height={272}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Service;
