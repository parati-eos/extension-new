import React from "react";
import LandingPageNavbar from "../../components/extensionLandingPage/LandingPageNavbar";
import Heading from "../../components/extensionLandingPage/Heading";
import KeyFeaturesSection from "../../components/extensionLandingPage/KeyFeaturesSection";
import GoogleSlidesSteps from "../../components/extensionLandingPage/GoogleSlideSteps";
import AiToolkitSection from "../../components/extensionLandingPage/AiToolKitSection";
import SlideTypesSection from "../../components/extensionLandingPage/SlideTypeSection";
import ZynthUsersSection from "../../components/extensionLandingPage/ZynthUserSection"; 
import zynthtext from "../../assets/zynth-text.png";
import { Link } from "react-router-dom";
//D:\zynth\Extension\extension-new\src\assets\zynth-text.png
const LandingPage: React.FC = () => {
  return (
    <div className="no-scrollbar no-scrollbar::-webkit-scrollbar">
      <LandingPageNavbar />
      <Heading />
      <GoogleSlidesSteps />
      <KeyFeaturesSection />
      <AiToolkitSection />
      <SlideTypesSection />
      <ZynthUsersSection />
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
                © {new Date().getFullYear()} Parati Technologies Private Limited. All rights reserved.
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
                  <Link
                    to="/contact-us"
                    className="text-gray-600 hover:underline"
                  >
                    Contact us
                  </Link>
                </li>
                <li></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://zynth.ai/privacy-policy.html"
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
    </div>
  );
};
export default LandingPage;
