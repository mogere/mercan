import Image from "next/image";
const Subscribe = () => {
  return (
    <div className="news px-4 py-8">
      <div className="newsBanner flex justify-between items-center gap-10 h-[223px] my-[50px] bg-[#00000099] mb-8">
        <Image
          src="/Spares.png"
          alt="spares"
          width={417}
          height={362}
          className=""
        />
        <div className="text-white w-[600px] mr-10">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-orange-500">Latest</span> News & Updates
          </h2>
          <p className="text-lg">
            Sign Up to Receive Incentives, Discount $ Other Tips
          </p>
        </div>
        <div className="flex gap-4 mb-2 h-20 mr-5 mt-2">
          <input
            type="email"
            placeholder="Write your email..."
            className="p-2 text-sm w-[380px] bg-white text-gray-800  h-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button className="text-black flex gap-4 pl-8 text-2xl bg-orange-500 font-bold items-center p-2 h-full w-[200px] hover:bg-orange-600 transition duration-200">
            Subscribe
            <Image
              src="/icons/subscribe-arrow.png"
              alt="Send Icon"
              width={25}
              height={25}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
