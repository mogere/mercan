import Button from "@/components/Button";
import CartCard from "@/components/CartCard";
import Card from "@/components/CartCard";
import Image from "next/image";
import React from "react";

const Cart = () => {
  return (
    <div className="flex flex-col bg-white items-center justify-center h-screen">
      <div className="flex justify-between w-full max-w-4xl p-5">
        <div className="flex items-center">
          {" "}
          <span className="text-xl text-black">Cart</span>
          <Image
            src="/cart1.svg"
            alt="cart"
            width={30}
            height={30}
            className="mb-5 items-center"
          />
        </div>
        <Button label="Browse Products" />
      </div>
      <div className="flex justify-between w-full max-w-4xl p-5">
        <div className="items">
          <CartCard
            imageUrl="/lcruiser.png"
            imageAlt="News Tips"
            title="Full Bodykit Toyota Prado 150"
            description="KES. 150,000.00"
          />
        </div>
        <div className="cart-totals">
          <Card
            imageUrl="/lcruiser.png"
            imageAlt="News Tips"
            title="Full Bodykit Toyota Prado 150"
            description="KES. 150,000.00"
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
