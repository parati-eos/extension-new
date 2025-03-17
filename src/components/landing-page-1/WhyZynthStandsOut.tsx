import React from "react";
import presentationGif from "../../assets/Scrolling Presentation GIF 1.png";
import bulletIcon from "../../assets/Group 596.png"; // Bullet icon

const features = [
  "Completely customizable to your business and design themes",
  "Seamless sync with Google Slides to provide best-in-class editing",
  "No technology management at your end",
];

const WhyZynthStandsOut: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-gray-100">
      {/* Section Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Why Zynth Stands Out
        </h2>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
        {/* Left Side - Bullet Points */}
        <div className="md:w-1/2 space-y-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4">
              {/* Bullet Icon */}
              <img src={bulletIcon} alt="bullet icon" className="w-max h-8" />
              {/* Feature Text */}
              <p className="text-lg text-gray-800 font-medium">{feature}</p>
            </div>
          ))}
        </div>

        {/* Right Side - Presentation GIF */}
        <div className="md:w-1/2">
          <div className="relative shadow-lg rounded-xl overflow-hidden">
            <img src={presentationGif} alt="Scrolling Presentation" className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyZynthStandsOut;
