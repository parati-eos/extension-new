import React, { useState, useEffect } from "react";
import zynthlogo from '../../assets/zynth-icon.png'
import zynthtext from '../../assets/zynth-text.png'

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800">
          <span className="flex items-center">
            <span className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-2">
              <img src={zynthlogo} alt="logo"/>
            </span>
            <img src={zynthtext} alt="Zynth"/>
          </span>
        </div>

        {/* Center Links */}
        <div className="flex space-x-10 items-center">
          <a
            href="#how-it-works"
            className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200"
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200"
          >
            Pricing
          </a>
          <a
            href="#blog"
            className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200"
          >
            Blog
          </a>
        </div>

        {/* Right Buttons */}
        <div className="flex space-x-10">
          <button className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
            Login
          </button>
          <button className="border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-200 px-6 py-1.5 rounded">
            Try Now
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
