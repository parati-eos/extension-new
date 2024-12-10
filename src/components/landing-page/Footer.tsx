import React from 'react'
import freepikbg from '../../assets/freepik.png'
import createimage from '../../assets/image1.png'
import evolutionimage from '../../assets/image3.png'
import zynthtext from '../../assets/zynth-text.png'

const Footer: React.FC = () => {
  return (
    <div>
      {/* Blue Background Section */}
      <div
        className="bg-cover bg-center py-16 text-center text-white"
        style={{ backgroundImage: `url(${freepikbg})` }}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Get Started with Zynth </h1>
          <p className="text-lg mb-8">
            More than a simple PowerPoint make Zynth is your personal <br></br>{' '}
            AI presentation creator.
          </p>
          <button className="bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-600">
            Get Started for Free
          </button>
        </div>

        {/* Image Section */}
        <div className="container mx-auto px-4 py-12 ">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <img
              src={createimage}
              alt="Create or Refine Presentation"
              className="w-full md:w-1/2 bg-white rounded-3xl"
            />
            <img
              src={evolutionimage}
              alt="Evolution of Our Path"
              className="w-full md:w-1/2 bg-white rounded-3xl"
            />
          </div>
        </div>
      </div>
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
              <p className="text-gray-700 text-sm">
                Create your investor presentations in a few minutes using our
                AI-powered pitch deck builder. No design skills needed.
              </p>
              <p className="text-gray-500 text-sm mt-2">
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
                  <a href="#" className="text-gray-600 hover:underline">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:underline">
                    Impact DB
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:underline">
                    Parati Eos
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:underline">
                    Business Strategy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:underline">
                    Investor Relations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:underline">
                    Managed Operations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:underline">
                    Digital Transformation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Helpful Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:underline">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:underline">
                    Contact us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:underline">
                    Managed Operations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:underline">
                    Digital Transformation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:underline">
                    Refunds and Cancellations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:underline">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
