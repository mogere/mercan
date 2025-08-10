import Image from "next/image";
const Testimonials = () => {
  return (
    <div className="text-center p-8">
      <div className="why">
        <Image
          src="/why-mercan.svg"
          alt="Why Mercan"
          width={1635}
          height={775}
          className="items-center mb-8"
        />
      </div>
      <div className="compatible text-start mb-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-700">
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
            className="items-center"
          />
          <Image
            src="/icons/mercedes.svg"
            alt="Mercan compatible vehicles"
            width={134}
            height={134}
            className="items-center"
          />
          <Image
            src="/icons/honda.svg"
            alt="Mercan compatible vehicles"
            width={134}
            height={134}
            className="items-center"
          />{" "}
          <Image
            src="/icons/toyota.svg"
            alt="Mercan compatible vehicles"
            width={134}
            height={134}
            className="items-center"
          />
          <Image
            src="/icons/audi.svg"
            alt="Mercan compatible vehicles"
            width={134}
            height={134}
            className="items-center"
          />
          <Image
            src="/icons/bmw.svg"
            alt="Mercan compatible vehicles"
            width={134}
            height={134}
            className="items-center"
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
      <h2 className="text-orange-500 text-2xl">Testimonials</h2>
      <h1 className="font-extrabold text-4xl text-gray-700">
        <span className="text-gray-700">
          <span className="text-orange-500"> What </span>our Clients Say
        </span>
      </h1>
      <div className="flex justify-center items-center mt-4 mr-[120px]">
        <Image
          src="/icons/underline.svg"
          alt="Mercan underline"
          width={316}
          height={19}
          className="items-center"
        />
      </div>
      <div className="flex items-center mt-8">
        <Image
          src="/quotation.svg"
          alt="Mercan quotation marks"
          width={316}
          height={19}
          className="items-center"
        />
        <p className="text-gray-700 items-center w-2/3 text-4xl p-7">
          I bought my car from Mercan Auto Spares and later came back for
          servicing — both experiences were flawless. The team is honest, fast,
          and genuinely cares about quality. I wouldn’t trust my car anywhere
          else.
        </p>
      </div>
      <div className="flex justify-center mt-8">
        <Image
          src="/stars.svg"
          alt="5 star rating"
          width={316}
          height={19}
          className="items-center"
        />
      </div>
    </div>
  );
};

export default Testimonials;
