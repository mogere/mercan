"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Card from "./Card";
import Service from "./service";
import Button from "./Button";
import FilterDropdown from "./FilterDropdown";

const Services = () => {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [make, setMake] = useState("");
  const [product, setProduct] = useState("");
  const imageUrls = [
    "/garage.png",
    "/autospares.png",
    "/bodykit.png",
    "/carsales.png",
  ];

  const categoryOptions = [
    { value: "bodykits", label: "Body kits" },
    { value: "autospares", label: "Auto Spares" },
    { value: "garage", label: "Garage" },
    { value: "carsales", label: "Car Sales" },
  ];

  const makeOptions = [
    { value: "toyota", label: "Toyota" },
    { value: "honda", label: "Honda" },
    { value: "mercedes", label: "Mercedes" },
    { value: "audi", label: "Audi" },
    { value: "bmw", label: "BMW" },
    { value: "suzuki", label: "Suzuki" },
    { value: "porsche", label: "Porsche" },
    { value: "subaru", label: "Subaru" },
    { value: "volkswagen", label: "Volkswagen" },
    { value: "aston", label: "Aston Martin" },
  ];

  const productOptions = [
    { value: "frontsplitter", label: "Front Splitter" },
    { value: "sideskirtsplitter", label: "Side Skirt Splitter" },
    { value: "reardiffuser", label: "Rear Diffuser" },
    { value: "spoiler", label: "Spoiler" },
    { value: "rearvalance", label: "Rear Valance" },
    { value: "eyebrows", label: "Eyebrows" },
    { value: "garnards", label: "Garnards" },
    { value: "grill", label: "Grill" },
    { value: "bumper", label: "Bumpers" },
    { value: "headlights", label: "Headlights" },
  ];

  const handleBrowseAll = () => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (make) params.append("make", make);
    if (product) params.append("product", product);

    router.push(`/shop${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="mt-10 mb-20 px-4 sm:px-6 md:px-10 items-center">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-10 my-8">
        {imageUrls.map((imageUrl, index) => (
          <Service key={index} imageUrl={imageUrl} />
        ))}
      </div>
      <div className="text-center p-4 sm:p-8">
        <FilterDropdown
          placeholder="Select Category"
          options={categoryOptions}
          value={category}
          onChange={setCategory}
          className="w-full max-w-md mx-auto"
        />
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 my-8">
        <Image
          src="/filter.svg"
          alt="Filter"
          width={35}
          height={35}
          className="hidden md:block"
        />
        <FilterDropdown
          placeholder="Make"
          options={makeOptions}
          value={make}
          onChange={setMake}
          className="w-full md:w-[25rem]"
        />
        <FilterDropdown
          placeholder="Product"
          options={productOptions}
          value={product}
          onChange={setProduct}
          className="w-full md:w-[25rem]"
        />
      </div>
      <div className="flex sm:px-2 flex-row gap-2 justify-between ">
        <div className="flex flex-col mt-4  rounded-xl p-4 bg-[#F2F2F2] h-full">
          <Image
            src="/logo.png"
            alt="mercan"
            width={70}
            height={70}
            className="mb-5 items-center"
          />

          <Image
            src="/wheels.svg"
            alt="wheels"
            width={70}
            height={70}
            className="mb-5 items-center"
          />
          <Image
            src="/engines.svg"
            alt="engines"
            width={70}
            height={70}
            className="mb-5 items-center"
          />
          <Image
            src="/batterys.svg"
            alt="battery"
            width={70}
            height={70}
            className="mb-5 items-center"
          />
          <Image
            src="/clutch.svg"
            alt="clutch"
            width={70}
            height={70}
            className="mb-5  items-center"
          />
          <Image
            src="/headlights.svg"
            alt="headlights"
            width={70}
            height={70}
            className="mb-5 items-center"
          />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 gap-10">
          <Card
            imageUrl="/lcruiser.png"
            imageAlt="News Tips"
            title="Full Bodykit Toyota Prado 150"
            description="KES. 150,000.00"
          />
          <Card
            imageUrl="/beamer.png"
            imageAlt="BMW"
            title="Full Bodykit BMW M3 GTR"
            description="KES. 150,000.00"
          />
          <Card
            imageUrl="/mercedes.png"
            imageAlt="News Tips"
            title="Full Bodykit Mercedes Benz W205"
            description="KES. 150,000.00"
          />
          <Card
            imageUrl="/lcruiser.png"
            imageAlt="News Tips"
            title="Professional Auto Repairs And Upgrades"
            description="From diagnostics to body kit conversions  we restore and enhance your ride."
          />
          <Card
            imageUrl="/beamer.png"
            imageAlt="News Tips"
            title="Genuine Auto Spares Supply"
            description="Top-quality parts for all vehicle types, ready for installation or purchase."
          />
          <Card
            imageUrl="/mercedes.png"
            imageAlt="News Tips"
            title="Trusted Car Sales and Trade-Ins"
            description="Browse our handpicked selection of vehicles or trade in yours with confidence."
          />
          <Card
            imageUrl="/lcruiser.png"
            imageAlt="News Tips"
            title="Professional Auto Repairs And Upgrades"
            description="From diagnostics to body kit conversions  we restore and enhance your ride."
          />
          <Card
            imageUrl="/beamer.png"
            imageAlt="News Tips"
            title="Genuine Auto Spares Supply"
            description="Top-quality parts for all vehicle types, ready for installation or purchase."
          />
          <Card
            imageUrl="/mercedes.png"
            imageAlt="News Tips"
            title="Trusted Car Sales and Trade-Ins"
            description="Browse our handpicked selection of vehicles or trade in yours with confidence."
          />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Button
          label="Browse all"
          iconUrl="/browse.svg"
          underline
          onClick={handleBrowseAll}
        />
      </div>
    </div>
  );
};

export default Services;
