import Image from "next/image";
import Card from "./Card";
import Service from "./service";
import Button from "./Button";
const Services = () => {
  const imageUrls = [
    "/garage.png",
    "/autospares.png",
    "/bodykit.png",
    "/carsales.png",
  ];

  async function fetchServices() {
    const res = await fetch("/api/service");
    const data = await res.json();
    return data;
  }

  console.log(
    "these are the services ",
    fetchServices().then((data) => data)
  );

  return (
    <div className="mt-10 mb-20 px-10 items-center">
      <div className="md:flex sm:px-2 flex-row justify-between gap-10 my-8">
        {imageUrls.map((imageUrl, index) => (
          <Service key={index} imageUrl={imageUrl} />
        ))}
      </div>
      <div className="text-center p-8">
        <select className="text-gray-700 w-[25rem]  border-b-2 text-lg font-bold mb-4">
          <option value="bodykits">Body kits</option>
          <option value="autospares">Auto Spares</option>
          <option value="garage">Garage</option>
          <option value="carsales">Car Sales</option>
        </select>
      </div>
      <div className=" md:flex sm:px-2 flex-row justify-center gap-10 my-8">
        <Image
          src="/filter.svg"
          alt="Filter"
          width={35}
          height={35}
          className="mb-5"
        />
        <select className="text-gray-700 w-[25rem] h-[4rem] border border-orange-500 px-7 p-2 text-xl font-bold mb-4">
          <option value="">Make</option>
          <option value="toyota">Toyota</option>
          <option value="honda">Honda</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
          <option value="bmw">BMW</option>
          <option value="suzuki">Suzuki</option>
          <option value="porsche">Porsche</option>
          <option value="subaru">Subaru</option>
          <option value="volkswagen">Volkswagen</option>
          <option value="aston">Aston Martin</option>
        </select>
        <select className="text-gray-700 border w-[25rem] h-[4rem] border-orange-500 p-2 text-xl font-bold mb-4">
          <option value="">Product</option>
          <option value="frontsplitter">Front Splitter</option>
          <option value="sideskirtsplitter">Side Skirt Splitter</option>
          <option value="reardiffuser">Rear Diffuser</option>
          <option value="spoiler">Spoiler</option>
          <option value="rearvalance">Rear Valance</option>
          <option value="eyebrows">Eyebrows</option>
          <option value="garnards">Garnards</option>
          <option value="grill">Grill</option>
          <option value="bumper">Bumpers</option>
          <option value="headlights">Headlights</option>
        </select>
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
        <Button label="Browse all" iconUrl="/browse.svg" underline />
      </div>
    </div>
  );
};

export default Services;
