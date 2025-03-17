import React from "react";
import benefit1 from "../../assets/benefit-1.png";
import benefit2 from "../../assets/benefit-2.png";
import benefit3 from "../../assets/benefit-3.png";
import benefit4 from "../../assets/benefit-4.png";
import benefit5 from "../../assets/benefit-5.png";

const benefits = [
  { image: benefit1, title: "Business consultants & advisors", height: "md:h-72" },
  { image: benefit2, title: "Marketing and PR firms", height: "md:h-60" },
  { image: benefit3, title: "Digital agencies", height: "md:h-48" },
  { image: benefit4, title: "SaaS providers", height: "md:h-60" },
  { image: benefit5, title: "Professional service firms", height: "md:h-72" },
];

const WhoCanBenefit: React.FC = () => {
  return (
    <section className="py-16 bg-[#F0F6FF] text-center max-w-7xl mx-auto">
      {/* Section Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Who Can Benefit?
      </h2>
      <div className="w-16 h-0.5 bg-gray-300 mx-auto mb-8"></div>

      {/* Cards Container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:justify-center lg:items-center gap-4 max-w-6xl mx-auto px-8">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className={`relative h-48 ${benefit.height} w-44 md:w-48 lg:w-56 rounded-2xl overflow-hidden flex items-center justify-center`}
          >
            {/* Background Image */}
            <img
              src={benefit.image}
              alt={benefit.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            {/* Text */}
            <h3 className="absolute bottom-4 left-4 right-4 text-white font-semibold text-sm md:text-base leading-tight">
              {benefit.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhoCanBenefit;
