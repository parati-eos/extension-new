import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import bannerBg from '../../assets/landing-bg.png';
import signIcon from "../../assets/sign-Vector.png"; 

const NewBanner: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <div>
      <div
        className="relative flex flex-col items-center justify-center h-[500px] md:h-[600px] w-full bg-contain bg-center text-white"
        style={{ backgroundImage: `url(${bannerBg})` }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 md:px-10">
          <h2 className="text-3xl md:text-5xl font-light leading-tight">
            Get Your Own <br />
            <span className="font-bold">Branded Presentation Builder</span>
          </h2>

          {/* Call-to-Action Button */}
          <button
            onClick={() => navigate('/contact-us')} // Navigate to Contact Us page
            className="mt-6 px-8 py-3 text-[#3667B2] font-bold text-xl rounded-2xl shadow-2xl border border-white/50 backdrop-blur-lg hover:opacity-90 transition"
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, #E6E9EC 50%, #C4DCF4 100%)",
            }}
          >
            Unlock New <br /> Revenue Streams
          </button>
        </div>
      </div>

      {/* Additional Section */}
      <div className="flex flex-col items-center text-center px-6 md:px-16 py-12 bg-gradient-to-b from-white to-[#F8FAFC]">
        {/* Icon */}
        <img src={signIcon} alt="Zynth Icon" className="w-14 h-14 md:w-16 md:h-16 mb-4" />

        {/* Heading */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Offer More, Win More – 
          <span className="text-[#4270B7] font-bold"> Power Up Your Business with Zynth</span>
        </h2>

        {/* Description */}
        <p className="text-[#5D5F61] max-w-3xl mt-4 text-sm md:text-base leading-relaxed">
          Enhance your offerings and elevate your business by providing your own branded presentation
          builder. Whether it's for client reports, pitch decks, or marketing presentations, empower
          your clients to create stunning, professional presentations in minutes using Zynth's powerful
          platform — <br />
          <span className="font-semibold text-gray-800">
            while expanding your product portfolio and driving new revenue streams.
          </span>
        </p>

        {/* Bottom Border */}
        <div className="w-full max-w-4xl border-b border-gray-300 mt-6"></div>
      </div>
    </div>
  );
};

export default NewBanner;
