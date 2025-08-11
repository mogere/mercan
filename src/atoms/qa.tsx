"use client";
import Image from "next/image";
import { useState } from "react";
const QuestionAnswer = ({
  question,
}: {
  question: { question: string; answer: string };
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <div className="questions mt-10">
      <div>
        <h2
          className={`font-extrabold text-3xl flex flex-between gap-8 ${
            showAnswer ? "text-orange-500" : "text-gray-700"
          }`}
        >
          {question.question}
          <div>
            <Image
              src={`${
                showAnswer
                  ? "/icons/closeaccordion.svg"
                  : "/icons/openaccordion.svg"
              }`}
              alt={showAnswer ? "close accordion icon" : "open accordion icon"}
              width={24}
              height={24}
              className="inline-block ml-10  cursor-pointer"
              onClick={() => setShowAnswer(!showAnswer)}
            />
          </div>
        </h2>

        {showAnswer && <hr className="border-orange-300 my-4" />}

        <p className="text-wrap p-2 text-xl text-gray-700">
          {showAnswer && (
            <span className="text-gray-700">{question.answer}</span>
          )}
        </p>
        <hr className="border-orange-300 my-4" />
      </div>
    </div>
  );
};

export default QuestionAnswer;
