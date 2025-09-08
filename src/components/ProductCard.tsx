import Image from "next/image";
import React from "react";
import Button from "./Button";

interface ProductCardProps {
  imageUrl: string;
  title: string;
  description: string;
  price: string;
}

const ProductCard = ({
  imageUrl,
  title,
  description,
  price,
}: ProductCardProps) => {
  return (
    <div className="flex bg-white justify-center border border-gray-950 rounded-sm p-4 w-fit  flex-col gap-2">
      <Image src={imageUrl} alt="Product" width={150} height={160} />
      <h2 className="text-lg text-black font-bold">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <p className="text-xl text-orange-500">{price}</p>
      <Button label="Add to Cart" iconUrl="/cart.svg" underline />
    </div>
  );
};

export default ProductCard;
