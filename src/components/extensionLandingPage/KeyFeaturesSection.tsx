import React from "react";
import { IconType } from "react-icons";
import {
  FaFileAlt,
  FaThLarge,
  FaMagic,
  FaTint,
  FaImage,
  FaPenFancy,
} from "react-icons/fa";

type FeatureItem = {
  icon: IconType;
  heading: string;
  info: string;
};

const features: FeatureItem[] = [
  {
    icon: FaFileAlt,
    heading: "Text to Slide Generator",
    info: "Convert raw text or documents into full slide decks in seconds.",
  },
  {
    icon: FaThLarge,
    heading: "Proven Slide Layouts",
    info: "Business-ready structures for pitches, reports, timelines, and more.",
  },
  {
    icon: FaMagic,
    heading: "AI Slide Generation",
    info: "AI builds content, layout, and visuals based on your input–so you don’t start from a blank page.",
  },
  {
    icon: FaTint,
    heading: "Brand-Aware Design",
    info: "Auto-apply your logos, fonts, and colors across every slide.",
  },
  {
    icon: FaImage,
    heading: "Built-in AI Image Generator",
    info: "Generate or search for high-quality images without leaving Slides.",
  },
  {
    icon: FaPenFancy,
    heading: "Rewrite & Refine Text",
    info: "Select any text, and instantly improve tone, structure, length, or language–no more jumping to ChatGPT.",
  },
];

const KeyFeaturesSection = () => {
  return (
    <div className="bg-gradient-to-r from-[#009e73] via-[#2ba8a3] to-[#3667B2] py-20 px-6 md:px-12">
      <div className="text-center mb-12">
        <h1 className="text-white text-3xl md:text-4xl font-bold">
          Why Zynth is the Smartest
        </h1>
        <h1 className="text-white text-3xl md:text-4xl font-bold mt-1">
          Google Slides™ Add-on
        </h1>
      </div>
      <div className="max-w-7xl w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
          >
            <feature.icon className="text-[#0A8568] text-2xl mb-4" />
            <h3 className="text-[#0A8568] text-lg font-semibold mb-2">
              {feature.heading}
            </h3>
            <p className="text-gray-700 text-sm">{feature.info}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyFeaturesSection;
