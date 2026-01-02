"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

interface ProductCardProps {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  inStock?: boolean;
}

const ProductCard = ({
  id,
  imageUrl,
  title,
  description,
  price,
  inStock = true,
}: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: id.toString(),
      productId: id,
      name: title,
      price,
      quantity: 1,
      imageUrl,
      inStock,
    });

    // Optional: Show a toast notification
    alert(`${title} added to cart!`);
  };

  return (
    <Link href={`/products/${id}`}>
      <div className="flex bg-white justify-center border border-gray-200 rounded-lg p-3 sm:p-4 w-full flex-col gap-2 hover:shadow-lg transition-all cursor-pointer">
        <div className="relative w-full aspect-square mb-2 bg-gray-50 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
          {!inStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
        </div>
        <h2 className="text-base sm:text-lg text-black font-bold line-clamp-2">
          {title}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        <p className="text-lg sm:text-xl text-orange-600 font-semibold">
          KES {price.toLocaleString()}
        </p>
        <div className="mt-1">
          <Button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
