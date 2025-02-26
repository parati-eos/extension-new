import React from 'react';
import LandingPageNavbar from '../components/landing-page/LandingPageNavbar';
import UseCases from '../components/landing-page/UseCasesSales';
import zynthtext from '../assets/zynth-text.png'
import { Link } from 'react-router-dom';
import UseCasesSales from '../components/landing-page/UseCasesSales';
import UseCasesProduct from '../components/landing-page/UseCasesProduct';

const UseCasesProductPage: React.FC = () => {
  return (
    <div className="no-scrollbar no-scrollbar::-webkit-scrollbar">
      <LandingPageNavbar />
    <div className='lg:py-8 py-12 bg-gray-50'>
        <UseCasesProduct />
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
                  <a href="https://www.parati.in/impactdb"   target="_blank"  className="text-gray-600 hover:underline">
                    Impact DB
                  </a>
                </li>
                <li>
                  <a href="https://www.parati.in/eos" target="_blank"  className="text-gray-600 hover:underline">
                    Parati Eos
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.parati.in/business-strategy" target="_blank"  className="text-gray-600 hover:underline">
                    Business Strategy
                  </a>
                </li>
                <li>
                  <a href="https://www.parati.in/investor-relations" target="_blank"  className="text-gray-600 hover:underline">
                    Investor Relations
                  </a>
                </li>
                <li>
                  <a href="https://www.parati.in/managed-operations" target="_blank" className="text-gray-600 hover:underline">
                    Managed Operations
                  </a>
                </li>
                <li>
                  <a href="https://www.parati.in/digital-transformation" target="_blank" className="text-gray-600 hover:underline">
                    Digital Transformation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Helpful Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://zynth.ai/about" target="_blank" className="text-gray-600 hover:underline">
                    About
                  </a>
                </li>
                <li>
                <Link to="/contact-us" className="text-gray-600 hover:underline">
  Contact us
</Link>
                </li>
                <li>
                
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://zynth.ai/uploads/privacy" className="text-gray-600 hover:underline" target="_blank">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="https://zynth.ai/uploads/refunds" className="text-gray-600 hover:underline" target="_blank">
                    Refunds and Cancellations
                  </a>
                </li>
                <li>
                  <a href="https://zynth.ai/uploads/terms" className="text-gray-600 hover:underline" target="_blank">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
        </div>
     
    </div>
  );
};

export default UseCasesProductPage;
