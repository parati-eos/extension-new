import React from "react";
import step1 from "../../assets/aimaker1.png";
import step2 from "../../assets/aimaker2.png";
import step3 from "../../assets/aimaker3.png";

const steps = [
  {
    number: 1,
    title: "Input Your Content or Upload a File",
    description:
      "Start with a topic, some text, or upload a document. Zynth’s AI instantly transforms it into a polished presentation in Google Slides™.",
    image: step1,
  },
  {
    number: 2,
    title: "Customize Style and Branding",
    description:
      "Add a reference URL, choose your brand colors, fonts, and theme. Tailor the tone, creativity, and language—Zynth adapts everything for you.",
    image: step2,
  },
  {
    number: 3,
    title: "Watch Your Slides Come Alive",
    description:
      "In under 2 minutes, you’ll have a fully editable, professional deck. Preview, polish, and present without the grunt work.",
    image: step3,
  },
];

const GoogleSlidesSteps: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-b from-[#f0f8f4] via-[#e5f3f1] to-[#ffffff] py-16 px-6 md:px-12">
      <div className="mb-10 max-w-7xl mx-auto px-4 md:px-0">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          AI Presentation Maker <br /> for Google Slides™
        </h2>
        <p className="text-gray-600 text-base mt-2 font-medium">
          Free, Fast, & Powerful
        </p>
      </div>

      <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex flex-col items-center text-center px-4"
          >
            <img
              src={step.image}
              alt={`Step ${step.number}`}
              className="w-full h-auto rounded-lg shadow-md mb-6"
            />
            <div className="flex items-center justify-center mb-2">
              <span className="text-[#0A8568] font-bold text-xl border border-[#0A8568] rounded-full w-8 h-8 flex items-center justify-center">
                {step.number}
              </span>
            </div>
            <h3
              className={`text-lg font-bold mb-2 ${
                step.number === 1
                  ? "text-[#0A8568]"
                  : step.number === 2
                  ? "text-[#0A8568]"
                  : "text-[#1B9A6B]"
              }`}
            >
              {step.title}
            </h3>
            <p className="text-sm text-gray-700">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoogleSlidesSteps;
