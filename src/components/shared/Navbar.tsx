import React, { useState } from 'react'
import { FaUserCircle, FaBars, FaTimes, FaClock } from 'react-icons/fa'
import ZynthLogo from '../../assets/zynth-icon.png'
import ZynthLogoText from '../../assets/zynth-text.png'

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="bg-gray-400 p-2">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo with icon and text */}
        <div className="flex items-center space-x-2">
          <img src={ZynthLogo} alt="Logo Icon" className="h-8 w-8" />
          <img src={ZynthLogoText} alt="Logo Text" className="h-8" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center space-x-4">
          <button className="bg-[#3667B2] text-white hover:bg-white hover:text-[#3667B2] hover:border-[#3667B2] hover:border text-base font-medium px-4 py-2 rounded-md">
            + New Presentation
          </button>
          <button className="bg-white text-[#3667B2] hover:bg-[#3667B2] hover:text-white border-[#3667B2] border text-base font-medium px-4 py-2 rounded-md flex items-center space-x-2">
            <FaClock className="text-base" />
            <span>History</span>
          </button>
          <FaUserCircle className="text-white text-2xl" />
        </div>

        {/* Mobile Menu Icon */}
        <div className="sm:hidden flex items-center">
          <button onClick={toggleMenu} className="text-white text-2xl">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Conditionally Render Mobile Dropdown Menu */}
      {isOpen && (
        <div className="sm:hidden mt-4 bg-gray-700 text-white space-y-2 p-4 rounded transition-transform duration-300 ease-in-out transform translate-y-0 opacity-100">
          <button className="w-full bg-[#3667B2] text-white text-base font-medium px-4 py-2 rounded-md">
            + New Presentation
          </button>
          <button className="w-full bg-white text-[#3667B2] border-[#3667B2] border-[1px] text-base font-medium px-4 py-2 rounded-md flex items-center justify-center space-x-2">
            <FaClock className="text-[#3667B2] text-base" />
            <span>History</span>
          </button>
          <FaUserCircle className="text-white text-2xl mx-auto" />
        </div>
      )}
    </nav>
  )
}

export default Navbar
