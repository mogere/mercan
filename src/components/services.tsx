import Image from "next/image";
import Card from "./Card";
const Services = () => {
  return (
    <div className="p-8 sm:mt-[20rem]">
      <h2 className="text-gray-700 font-bold text-4xl">
        <span className="text-orange-500 ">Our</span> Services
      </h2>
      <Image
        src="/icons/underline.svg"
        alt="News Tips"
        width={316}
        height={19}
        className="items-center"
      />
      <div className="md:flex sm:px-2 flex-row justify-between gap-10 my-8">
        <Card
          imageUrl="/filters.png"
          imageAlt="News Tips"
          title="Professional Auto Repairs And Upgrades"
          description="From diagnostics to body kit conversions  we restore and enhance your ride."
        />
        <Card
          imageUrl="/mechanic.png"
          imageAlt="News Tips"
          title="Genuine Auto Spares Supply"
          description="Top-quality parts for all vehicle types, ready for installation or purchase."
        />
        <Card
          imageUrl="/attendant.png"
          imageAlt="News Tips"
          title="Trusted Car Sales and Trade-Ins"
          description="Browse our handpicked selection of vehicles or trade in yours with confidence."
        />
      </div>
      <div className="about mt-10 sm:flex justify-between sm:p-10 sm:mt-20">
        <div className="hidden sm:block ">
          <Image
            src="/welcometeam.png"
            alt="About Us"
            width={600}
            height={600}
            className="items-center"
          />
        </div>
        <div className="text-gray-700 md:pl-5 sm:w-1/2">
          <h1 className="text-2xl sm:text-4xl font-extrabold">
            <span className="text-orange-500">About</span> Mercan Auto Spares
          </h1>
          <Image
            src="/icons/underline.svg"
            alt="About Us"
            width={316}
            height={19}
            className="items-center"
          />
          <p className="mt-10 md:pl-5 text-xl md:mt-20 md:text-3xl">
            At Mercan Auto Spares, we specialize in keeping your vehicle in peak
            condition — inside and out. Whether you need expert mechanical
            repairs, custom body kit upgrades, quality auto spares, or you are
            looking to buy or trade in a car, we’ve got you covered. With a
            strong focus on reliability, customer satisfaction, and automotive
            excellence, we’re more than just a garage.
          </p>
          <p className="mt-10 md:mt-20 md:pl-5 text-xl md:text-3xl">
            We are your trusted car care partner.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;
