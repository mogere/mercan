import Image from "next/image";
const Overview = () => {
  return (
    <div className="flex justify-between items-center gap-10 h-[300px] p-12 bg-[#3A3A3C] mb-4">
      <div className="projects ">
        <h1 className="text-orange-500 font-extrabold mb-4 text-7xl">50+</h1>
        <span className="text-white text-2xl">Projects completed</span>
      </div>
      <Image
        src="/vertical.svg"
        alt="vertical line"
        width={3}
        height={5}
        className="items-center"
      />
      <div className="customers">
        <h1 className="text-orange-500 font-extrabold mb-4 text-7xl">1K+</h1>
        <span className="text-white text-2xl">Happy Customers</span>
      </div>
      <Image
        src="/vertical.svg"
        alt="vertical line"
        width={3}
        height={5}
        className="items-center"
      />
      <div className="years">
        <h1 className="text-orange-500 font-extrabold mb-4 text-7xl">10+</h1>
        <span className="text-white text-2xl">Years of Experience</span>
      </div>
      <Image
        src="/vertical.svg"
        alt="vertical line"
        width={3}
        height={5}
        className="items-center"
      />
      <div className="team">
        <h1 className="text-orange-500 font-extrabold mb-4 text-7xl">20+</h1>
        <span className="text-white text-2xl">Team Members</span>
      </div>
    </div>
  );
};

export default Overview;
