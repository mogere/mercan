import Button from "./Button";
import ProductCard from "./ProductCard";
import Image from "next/image";
const NewProducts = () => {
  return (
    <div>
      <div className="flex flex-col justify-between gap-10 h-fit p-6 bg-[#3A3A3C] ">
        <div className="flex justify-between">
          <div>
            <h1 className="text-orange-500 font-extrabold mb-2 text-2xl md:text-5xl">
              New Products
            </h1>
            <span>
              Fresh arrivals built for performance, style, and reliability.
            </span>
          </div>
          <div>
            <Button label="Learn More" iconUrl="/browse.svg" underline />
          </div>
        </div>

        <div className="projects grid grid-cols-2 md:grid-cols-4 gap-4">
          <ProductCard
            imageUrl="/brakepad.png"
            title="Exide Din50-50ah Mileage Car Battery"
            description="Opening & Fitting of Clutch Set"
            price="Ksh 10,000"
          />{" "}
          <ProductCard
            imageUrl="/brakepad.png"
            title="Exide Din50-50ah Mileage Car Battery"
            description="Opening & Fitting of Clutch Set"
            price="Ksh 10,000"
          />{" "}
          <ProductCard
            imageUrl="/brakepad.png"
            title="Exide Din50-50ah Mileage Car Battery"
            description="Opening & Fitting of Clutch Set"
            price="Ksh 10,000"
          />{" "}
          <ProductCard
            imageUrl="/brakepad.png"
            title="Exide Din50-50ah Mileage Car Battery"
            description="Opening & Fitting of Clutch Set"
            price="Ksh 10,000"
          />{" "}
        </div>
      </div>
      <div className=" bg-[#3A3A3C] grid grid-cols-2 mx-8 gap-4">
        <Image
          src="/gear.png"
          alt="Product"
          width={650}
          height={500}
          className=""
        />
        <div className=" m-8 ">
          <h1 className="text-orange-500 text-4xl mb-8 font-bold">
            Stay Ahead with the Latest Auto Gear
          </h1>
          <span className="text-xl ">
            Subscribe to our newsletter and be the first to know when new
            products drop — from premium spares to performance upgrades. Get
            exclusive deals, tips, and updates straight to your inbox.
          </span>
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 w-1/2 p-2 mt-4 bg-white text-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

export default NewProducts;
