import React from "react";
import Image from "next/image";

interface Slide {
  image: string;
  title: string;
  desc: string;
}

interface SlideProps {
  carSlides: Slide[];
  current: number;
  setCurrent: (index: number) => void;
}

const Slideshow = ({ carSlides, current, setCurrent }: SlideProps) => {
  return (
    <div className="w-full flex flex-col items-center mt-20 mb-8 transition-all duration-700">
      <div className="overflow-hidden  shadow-lg bg-grey-50">
        <div
          className="flex transition-transform duration-700"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {carSlides.map((slide, idx) => (
            <div
              key={idx}
              className="min-w-full flex flex-col items-center p-8"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                width={500}
                height={200}
                className="object-cover rounded-lg"
              />
              <h2 className="text-2xl text-gray-600 font-bold mt-6">
                {slide.title}
              </h2>
              <p className="text-gray-600 mt-2">{slide.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mb-5 mt-4">
          {carSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
                current === idx ? "bg-orange-600" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slideshow;
