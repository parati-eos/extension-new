import React from "react";
import bannerImage from "../../assets/Banner-V.png"; // Background Image
import zynthtext from '../../assets/Group 545.png'
import { useNavigate } from "react-router-dom"; // Import useNavigate

const HeroBanner: React.FC = () => {
    const navigate = useNavigate(); // Initialize navigate function
  return (
    <>
 {/* Hero Banner Section */}
<section className="w-full flex flex-col items-center text-center pt-16 md:pt-24 px-10">

  {/* Heading & Subtitle (Separate from Background) */}
  <div className="relative z-10 max-w-4xl px-6">
    <h1 className="text-2xl md:text-4xl font-extrabold text-black leading-tight">
      EXPAND YOUR BUSINESS WITH YOUR <br />
      <span className="text-[#3667B2]">OWN PRESENTATION BUILDER</span>
    </h1>
 
  </div>

{/* Background Image with Centered Content */}
<div 
    className="relative w-full h-[300px] md:h-[400px] mt-10 bg-cover bg-center flex items-center justify-center  "
    style={{ backgroundImage: `url(${bannerImage})` }}
  >


    {/* Centered Content */}
    <div className="relative z-10 text-white text-center px-6 space-y-10">
      <p className="text-lg md:text-xl font-medium">
        Offer more value, increase client loyalty, and unlock new growth
        opportunities  <br/>— all with a solution that’s easy to set up and scale.
      </p>
      <button
      onClick={() => navigate('/contact-us')} // Navigate to Contact Us page
      
      className="px-6 py-3 text-lg font-semibold text-white bg-transparent rounded-lg border border-white/60 backdrop-blur-md shadow-lg hover:bg-white/10 transition">
  Get Started
</button>

    </div>
  </div>

</section>




      {/* Footer Section */}
      <footer className="bg-white py-12">
        <div className="container mx-auto px-4">
          {/* Footer Logo & Text */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="text-left mb-6 md:mb-0">
              <img
                src={zynthtext}
                alt="Zynth Logo"
                className="h-10 mb-4 md:mb-2 mx-auto md:mx-0"
              />
              <p className="text-black text-sm">
                Create your investor presentations in a few minutes using our
                AI-powered pitch deck builder. No design skills needed.
              </p>
              <p className="text-black text-sm mt-2">
                © 2024 Parati Technologies Private Limited. All rights reserved.
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.parati.in/about-us"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:underline"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.parati.in/impactdb"
                    target="_blank"
                    className="text-gray-600 hover:underline"
                  >
                    Impact DB
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.parati.in/eos"
                    target="_blank"
                    className="text-gray-600 hover:underline"
                  >
                    Parati Eos
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.parati.in/business-strategy"
                    target="_blank"
                    className="text-gray-600 hover:underline"
                  >
                    Business Strategy
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.parati.in/investor-relations"
                    target="_blank"
                    className="text-gray-600 hover:underline"
                  >
                    Investor Relations
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.parati.in/managed-operations"
                    target="_blank"
                    className="text-gray-600 hover:underline"
                  >
                    Managed Operations
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.parati.in/digital-transformation"
                    target="_blank"
                    className="text-gray-600 hover:underline"
                  >
                    Digital Transformation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Helpful Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://zynth.ai/about"
                    target="_blank"
                    className="text-gray-600 hover:underline"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a href="/contact-us" className="text-gray-600 hover:underline">
                    Contact us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://zynth.ai/uploads/privacy"
                    className="text-gray-600 hover:underline"
                    target="_blank"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="https://zynth.ai/uploads/refunds"
                    className="text-gray-600 hover:underline"
                    target="_blank"
                  >
                    Refunds and Cancellations
                  </a>
                </li>
                <li>
                  <a
                    href="https://zynth.ai/uploads/terms"
                    className="text-gray-600 hover:underline"
                    target="_blank"
                  >
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HeroBanner;
