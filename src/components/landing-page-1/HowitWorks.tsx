import React from "react";
import icon1 from "../../assets/how-it-works-icon-1.png";
import icon2 from "../../assets/how-it-works-icon-2.png";
import icon3 from "../../assets/how-it-works-icon-3.png";

const steps = [
  {
    icon: icon1,
    title: "Set Up Your Branded Platform",
    description: "You get a fully branded, ready-to-use presentation builder.",
  },
  {
    icon: icon2,
    title: "Introduce to Your Clients",
    description: "Offer it as a value-added service to your existing and new clients.",
  },
  {
    icon: icon3,
    title: "Earn and Scale",
    description: "Generate new revenue streams through subscriptions and usage fees.",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-white text-center">
      {/* Section Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10">
        How It Works
      </h2>

      {/* Card Container */}
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-10 border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center px-6 relative">
              {/* Icon */}
              <img src={step.icon} alt={step.title} className="w-12 h-13 mb-4" />

              {/* Title with line breaks */}
              <h3 className="text-lg font-semibold text-gray-900 whitespace-pre-line">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mt-2">{step.description}</p>

              {/* Vertical Divider (Except Last Item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/4 bottom-1/4 right-0 w-px bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
