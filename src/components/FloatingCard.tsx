import React, { useState } from "react";

const FloatingCard = () => {
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const carBrands = [
    {
      name: "Audi",
      models: ["A4", "Q5", "Q7"],
      details: "Audi is known for luxury and performance.",
    },
    {
      name: "Bentley",
      models: ["Bentayga", "Continental GT", "Flying Spur"],
      details: "Bentley offers high-end luxury vehicles.",
    },
    {
      name: "BMW",
      models: ["3 Series", "5 Series", "X5"],
      details: "BMW is famous for sporty driving dynamics.",
    },
  ];

  return (
    <div>
      <div className="fixed top-32 left-8 z-30 flex">
        {/* Brand List Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 w-56">
          <h3 className="font-bold text-blue-900 mb-4">Find Your Car</h3>
          <ul>
            {carBrands.map((brand, idx) => (
              <li
                key={brand.name}
                className={`cursor-pointer px-3 py-2 rounded flex justify-between items-center text-gray-500 mb-1 hover:bg-gray-200 ${
                  selectedBrand === idx ? "bg-gray-200 font-semibold" : ""
                }`}
                onClick={() =>
                  setSelectedBrand(selectedBrand === idx ? null : idx)
                }
              >
                {brand.name}
                <span className="ml-2">{">"}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Brand Details Card */}
        {selectedBrand !== null && (
          <div className="bg-white rounded-xl shadow-lg p-4 w-64 ml-4 animate-fade-in">
            <h4 className="font-bold text-gray-800 mb-2">
              {carBrands[selectedBrand].name} Models
            </h4>
            <ul className="mb-3">
              {carBrands[selectedBrand].models.map((model) => (
                <li
                  key={model}
                  className="py-1 border-b text-gray-600 last:border-b-0"
                >
                  {model}
                </li>
              ))}
            </ul>
            <div className="text-gray-800 text-sm">
              {carBrands[selectedBrand].details}
            </div>
            <button
              className="mt-4 text-xs text-orange-600 hover:underline"
              onClick={() => setSelectedBrand(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingCard;
