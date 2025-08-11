import QuestionAnswer from "@/atoms/qa";
import Image from "next/image";
const Faq = () => {
  const questions = [
    {
      question: "Do you offer a warranty on car repairs and spare parts?",
      answer:
        "Yes, we do. All our repairs and parts come with a warranty period to guarantee quality and peace of mind. The duration depends on the specific service or part, and we will always clarify this before any work begins.",
    },
    {
      question: "What types of vehicles do you service?",
      answer:
        "We service a wide range of vehicles including sedans, SUVs, trucks, and hybrids. Our team is trained to handle various makes and models.",
    },
    {
      question: "How can I book an appointment?",
      answer:
        "You can book an appointment through our website or by calling our customer service line. We recommend booking in advance to secure your preferred time slot.",
    },
  ];

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
        {questions.map((question, index) => (
          <QuestionAnswer key={index} question={question} />
        ))}
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
