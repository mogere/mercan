import Image from "next/image";
const Faq = () => {
  return (
    <div className="flex justify-between m-8 p-4">
      <div className="w-1/2">
        <h1 className="text-orange-500 text-2xl">Frequently Asked Questions</h1>
        <h1 className="text-gray-700 text-4xl mt-4 font-extrabold">
          <span className="text-orange-500">Got Questions?</span> We have the
          answers
        </h1>

        <Image
          src="/icons/underline.svg"
          alt="Mercan underline"
          width={316}
          height={19}
          className="items-center"
        />
        <div className="flex  gap-4 mt-8">
          <div className="questions">
            <div>
              <h2 className="font-extrabold text-2xl text-orange-500">
                Do you offer a warranty on car repairs and spare parts?
                <Image
                  src="/icons/closeaccordion.svg"
                  alt="close accordion icon"
                  width={24}
                  height={24}
                  className="inline-block ml-10 cursor-pointer"
                />
              </h2>
              <hr className="border-orange-300 my-4" />

              <p className="text-wrap p-2 text-xl text-gray-700">
                Yes, we do. All our repairs and parts come with a warranty
                period to guarantee quality and peace of mind. The duration
                depends on the specific service or part, and we will always
                clarify this before any work begins.
              </p>
            </div>
            <hr className="border-orange-300 my-4" />
            <div>
              <h2 className="font-extrabold text-2xl text-gray-700">
                Do you offer a warranty on car repairs and spare parts?
                <Image
                  src="/icons/openaccordion.svg"
                  alt="open accordion icon"
                  width={24}
                  height={24}
                  className="inline-block ml-10 cursor-pointer"
                />
              </h2>
            </div>
            <hr className="border-orange-300 my-4" />

            <div>
              <h2 className="font-extrabold text-2xl text-gray-700">
                Do you offer a warranty on car repairs and spare parts?
                <Image
                  src="/icons/openaccordion.svg"
                  alt="open accordion icon"
                  width={24}
                  height={24}
                  className="inline-block ml-10 cursor-pointer"
                />
              </h2>
            </div>
            <hr className="border-orange-300 my-4" />

            <div>
              <h2 className="font-extrabold text-2xl text-gray-700">
                Do you offer a warranty on car repairs and spare parts?
                <Image
                  src="/icons/openaccordion.svg"
                  alt="open accordion icon"
                  width={24}
                  height={24}
                  className="inline-block ml-10 cursor-pointer"
                />
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Image
          src="/questionman.svg"
          alt="question man"
          width={526}
          height={800}
          className="items-center"
        />
      </div>
    </div>
  );
};

export default Faq;
