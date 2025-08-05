import Image from "next/image";
const Testimonials = () => {
  return (
    <div className="text-center p-8">
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
    </div>
  );
};

export default Testimonials;
