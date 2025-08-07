import Image from "next/image";
import Card from "./Card";
const Services = () => {
  return (
    <div className="p-8">
      <h2 className="text-gray-700 font-bold text-2xl">
        <span className="text-orange-500">Our</span> Services
      </h2>
      <Image
        src="/icons/underline.svg"
        alt="News Tips"
        width={316}
        height={19}
        className="items-center"
      />
      <div className="flex justify-between gap-10 my-8">
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
    </div>
  );
};

export default Services;
