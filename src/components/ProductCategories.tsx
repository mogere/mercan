import Image from "next/image";
import React from "react";
import Button from "./Button";
import ProductCard from "./ProductCard";

const ProductCategories = () => {
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
      <div className="flex mt-4 justify-between">
        <p className=" text-lg  text-gray-700">
          Explore our top products category to help you find exactly what you
          need — fast.
        </p>
        <div className="flex gap-2">
          <Button
            label="Engine & Performance"
            iconUrl="/buttondropdown.svg"
            size="small"
          />
          <Button
            label="All Parts"
            iconUrl="/buttondropdown.svg"
            size="small"
          />
          <Button label="Search" iconUrl="/search.svg" size="small" underline />
        </div>
      </div>
      <div className="grid grid-cols-4 mt-5 sm:grid-cols-4 gap-10">
        <ProductCard
          imageUrl="/product.png"
          title="Exide Din50-50ah Mileage Car Battery"
          description="Opening & Fitting of Clutch Set"
          price="Ksh 10,000"
        />
        <ProductCard
          imageUrl="/product.png"
          title="Exide Din50-50ah Mileage Car Battery"
          description="Opening & Fitting of Clutch Set"
          price="Ksh 10,000"
        />
        <ProductCard
          imageUrl="/product.png"
          title="Exide Din50-50ah Mileage Car Battery"
          description="Opening & Fitting of Clutch Set"
          price="Ksh 10,000"
        />
        <ProductCard
          imageUrl="/product.png"
          title="Exide Din50-50ah Mileage Car Battery"
          description="Opening & Fitting of Clutch Set"
          price="Ksh 10,000"
        />

        {/* ------------------------------------------------------ */}
        <ProductCard
          imageUrl="/product.png"
          title="Exide Din50-50ah Mileage Car Battery"
          description="Opening & Fitting of Clutch Set"
          price="Ksh 10,000"
        />
        <ProductCard
          imageUrl="/product.png"
          title="Exide Din50-50ah Mileage Car Battery"
          description="Opening & Fitting of Clutch Set"
          price="Ksh 10,000"
        />
        <ProductCard
          imageUrl="/product.png"
          title="Exide Din50-50ah Mileage Car Battery"
          description="Opening & Fitting of Clutch Set"
          price="Ksh 10,000"
        />
        <ProductCard
          imageUrl="/product.png"
          title="Exide Din50-50ah Mileage Car Battery"
          description="Opening & Fitting of Clutch Set"
          price="Ksh 10,000"
        />
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
        <div className="flex justify-center gap-20 items-center mt-8">
          <Image
            src="/icons/scroll-left.svg"
            alt="Scroll left icon"
            width={55}
            height={55}
            className=""
          />
          <Image
            src="/icons/mercedes.svg"
            alt="Mercan compatible vehicles"
            width={134}
            height={134}
            className=""
          />
          <Image
            src="/icons/honda.svg"
            alt="Mercan compatible vehicles"
            width={134}
            height={134}
            className=""
          />{" "}
          <Image
            src="/icons/toyota.svg"
            alt="Mercan compatible vehicles"
            width={134}
            height={134}
            className=""
          />
          <Image
            src="/icons/audi.svg"
            alt="Mercan compatible vehicles"
            width={134}
            height={134}
            className=""
          />
          <Image
            src="/icons/bmw.svg"
            alt="Mercan compatible vehicles"
            width={134}
            height={134}
            className=""
          />
          <Image
            src="/icons/scroll-right.svg"
            alt="Scroll right icon"
            width={55}
            height={55}
            className="items-center"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCategories;
