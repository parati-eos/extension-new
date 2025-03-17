import React from "react";
import img1 from "../../assets/presentation-example-1.png";
import img2 from "../../assets/presentation-example-2.png";
import img3 from "../../assets/presentation-example-3.png";
import img4 from "../../assets/presentation-example-4.png";
import img5 from "../../assets/presentation-example-5.png";

import flipImg1 from "../../assets/Rectangle 286.png";
import flipImg2 from "../../assets/Rectangle 287.png";
import flipImg3 from "../../assets/Rectangle 288.png";
import flipImg4 from "../../assets/Rectangle 289.png";
import flipImg5 from "../../assets/Rectangle 290.png";

import icon1 from "../../assets/presentation-example-icon-1.png";
import icon2 from "../../assets/presentation-example-icon-2.png";
import icon3 from "../../assets/presentation-example-icon-3.png";
import icon4 from "../../assets/presentation-example-icon-4.png";
import icon5 from "../../assets/presentation-example-icon-5.png";

import arrowIcon from "../../assets/arrow-reverse-vector.png";

const features = [
  { 
    image: img1, flipImage: flipImg1, icon: icon1, title: "Expand Your\nCurrent Offering",
    description: "Complement your existing products and services with a value-added tool that meets a critical business need."
  },
  { 
    image: img2, flipImage: flipImg2, icon: icon2, title: "Become\nTechnology Enabled",
    description: "Elevate your business with a cutting-edge platform that streamlines presentation creation and boosts client satisfaction."
  },
  { 
    image: img3, flipImage: flipImg3, icon: icon3, title: "Gain a\nCompetitive Advantage",
    description: "Differentiate yourself from competitors by offering a branded, AI-powered solution that delivers real business results."
  },
  { 
    image: img4, flipImage: flipImg4, icon: icon4, title: "Unlock\nAdditional \nRevenue",
    description: "Earn recurring revenue through subscriptions and export fees while increasing customer retention."
  },
  { 
    image: img5, flipImage: flipImg5, icon: icon5, title: "Custom\nBranding",
    description: "Deliver a seamless experience with your logo and brand identity integrated into the platform."
  },
];

const PresentationBuilder: React.FC = () => {
  return (
    <div className="py-16 bg-gray-100 text-center">
      {/* Section Title */}
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-10">
        Why Add a Presentation Builder to Your Business?
      </h2>
{/* Feature Cards Layout */}
<div className="max-w-6xl mx-auto px-6">
  <div className="grid gap-6">
    
    {/* First Row - 3 Cards */}
    <div className="grid grid-cols-3 gap-6">
      {features.slice(0, 3).map((feature, index) => (
        <div key={index} className="group perspective">
          <div className="relative w-full h-[250px] md:h-[300px] rounded-xl overflow-hidden shadow-lg transition-transform duration-500 transform-style-3d group-hover:rotate-y-180">
            
            {/* Front Side */}
            <div
              className="absolute inset-0 bg-cover bg-center flex flex-col justify-center items-center backface-hidden"
              style={{ backgroundImage: `url(${feature.image})` }}
            >
              <div className="absolute inset-0 bg-blue-900 bg-opacity-60"></div>
              <img src={arrowIcon} alt="Arrow Icon" className="absolute top-4 right-4 w-6 h-6 opacity-80" />
              <img src={feature.icon} alt={feature.title} className="relative w-12 h-12 mb-3" />
              <p className="relative text-white text-lg font-semibold whitespace-pre-line text-center">
                {feature.title}
              </p>
            </div>

            {/* Back Side */}
            <div
              className="absolute inset-0 bg-cover bg-center flex flex-col justify-center items-center text-center p-6 rotate-y-180 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backface-hidden"
              style={{ backgroundImage: `url(${feature.flipImage})` }}
            >
              <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
              <p className="relative text-white text-lg font-medium px-4">
                {feature.description}
              </p>
            </div>

          </div>
        </div>
      ))}
    </div>

    {/* Second Row - 2 Centered Cards */}
    <div className="grid grid-cols-2 gap-6 justify-center place-content-center">
      {features.slice(3, 5).map((feature, index) => (
        <div key={index} className="group perspective">
          <div className="relative w-full h-[250px] md:h-[300px] rounded-xl overflow-hidden shadow-lg transition-transform duration-500 transform-style-3d group-hover:rotate-y-180">
            
            {/* Front Side */}
            <div
              className="absolute inset-0 bg-cover bg-center flex flex-col justify-center items-center backface-hidden"
              style={{ backgroundImage: `url(${feature.image})` }}
            >
              <div className="absolute inset-0 bg-blue-900 bg-opacity-60"></div>
              <img src={arrowIcon} alt="Arrow Icon" className="absolute top-4 right-4 w-6 h-6 opacity-80" />
              <img src={feature.icon} alt={feature.title} className="relative w-12 h-12 mb-3" />
              <p className="relative text-white text-lg font-semibold whitespace-pre-line text-center">
                {feature.title}
              </p>
            </div>

            {/* Back Side */}
            <div
              className="absolute inset-0 bg-cover bg-center flex flex-col justify-center items-center text-center p-6 rotate-y-180 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backface-hidden"
              style={{ backgroundImage: `url(${feature.flipImage})` }}
            >
              <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
              <p className="relative text-white text-lg font-medium px-4">
                {feature.description}
              </p>
            </div>

          </div>
        </div>
      ))}
    </div>

  </div>
</div>



    </div>
  );
};

export default PresentationBuilder;
