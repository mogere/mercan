import Image from "next/image";
const Faq = () => {
  return (
    <div className="m-8 p4">
      <h1 className="text-orange-500 text-2xl">Frequently Asked Questions</h1>
      <h1 className="text-gray-700 text-4xl font-extrabold">
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
            <h2 className="font-extrabold text-4xl text-orange-500">
              Do you offer a warranty on car repairs and spare parts?
            </h2>
            <p className="text-wrap p-7  text-gray-700">
              Yes, we do. All our repairs and parts come with a warranty period
              to guarantee quality and peace of mind. The duration depends on
              the specific service or part, and we will always clarify this
              before any work begins.
            </p>
          </div>
          <div>
            <h2>Question 2</h2>
            <p>Answer to question 2.</p>
          </div>
        </div>
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
