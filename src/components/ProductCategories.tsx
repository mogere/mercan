"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Button from "./Button";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  inStock: boolean;
}

const ProductCategories = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?limit=8&page=1");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.slice(0, 8));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="px-6 md:px-20 py-10">
      <h1 className="font-extrabold text-2xl md:text-4xl text-gray-700">
        <span className="text-gray-700">
          <span className="text-orange-500"> Product </span>Categories
        </span>
      </h1>
      <Image
        src="/icons/underline.svg"
        alt="News Tips"
        width={316}
        height={19}
        className="w-[200px] md:w-[316px] items-center"
      />
      <div className="flex flex-col md:flex-row mt-4 justify-between gap-4">
        <p className="text-lg text-gray-700">
          Explore our top products category to help you find exactly what you
          need — fast.
        </p>
        <div className="flex gap-2">
          <Link href="/shop?categoryId=3">
            <Button
              label="Performance"
              iconUrl="/buttondropdown.svg"
              size="small"
            />
          </Link>
          <Link href="/shop">
            <Button
              label="All Parts"
              iconUrl="/buttondropdown.svg"
              size="small"
            />
          </Link>
          <Link href="/shop">
            <Button label="Search" iconUrl="/search.svg" size="small" underline />
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 mt-5 gap-6 md:gap-10">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              imageUrl={product.imageUrl || "/product.png"}
              title={product.name}
              description={product.description || ""}
              price={product.price}
              inStock={product.inStock}
            />
          ))
        ) : (
          // Placeholder cards while loading
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96" />
          ))
        )}
      </div>

      {/* Compatible Products */}
      <div className="compatible text-start mt-20 mb-8">
        <div className="overflow-scroll scrollbar-hide mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-700">
            <span className="text-orange-500">Compatible</span> With the
            vehicles you know and trust
          </h1>
          <Image
            src="/icons/underline.svg"
            alt="Mercan underline"
            width={316}
            height={19}
            className="items-center mt-4"
          />
        </div>
        <div className="flex justify-center gap-8 md:gap-20 items-center mt-8 overflow-x-auto">
          <Image
            src="/icons/scroll-left.svg"
            alt="Scroll left icon"
            width={55}
            height={55}
            className="hidden md:block"
          />
          <Image
            src="/icons/mercedes.svg"
            alt="Mercedes compatible"
            width={100}
            height={100}
            className="md:w-[134px] md:h-[134px]"
          />
          <Image
            src="/icons/honda.svg"
            alt="Honda compatible"
            width={100}
            height={100}
            className="md:w-[134px] md:h-[134px]"
          />
          <Image
            src="/icons/toyota.svg"
            alt="Toyota compatible"
            width={100}
            height={100}
            className="md:w-[134px] md:h-[134px]"
          />
          <Image
            src="/icons/audi.svg"
            alt="Audi compatible"
            width={100}
            height={100}
            className="md:w-[134px] md:h-[134px]"
          />
          <Image
            src="/icons/bmw.svg"
            alt="BMW compatible"
            width={100}
            height={100}
            className="md:w-[134px] md:h-[134px]"
          />
          <Image
            src="/icons/scroll-right.svg"
            alt="Scroll right icon"
            width={55}
            height={55}
            className="hidden md:block"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCategories;
