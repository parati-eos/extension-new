// import React, { useState, useEffect } from 'react'
// import zynthtext from '../../assets/zynth-text.png'
// import { useNavigate } from 'react-router-dom'

// const LandingPageNavbar: React.FC = () => {
//   const [isScrolled, setIsScrolled] = useState(false)
//   const navigate = useNavigate()

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 0)
//     }

//     window.addEventListener('scroll', handleScroll)
//     return () => {
//       window.removeEventListener('scroll', handleScroll)
//     }
//   }, [])

//   return (
//     <nav
//       className={`fixed w-full z-50 transition-all duration-300 ${
//         isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
//       }`}
//     >
//       <div className="container mx-auto flex items-center justify-between py-4 px-6">
//         {/* Logo */}
//         <div className="text-xl font-bold text-gray-800">
//           <span className="flex items-center">
//             <a href="/" target="_blank" rel="noopener noreferrer">
//               <img className="h-8" src={zynthtext} alt="Zynth" />
//             </a>
//           </span>
//         </div>

//         {/* Center Links */}
//         <div className="flex space-x-10 items-center">
//           <a
//             href="#how-it-works"
//             className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200"
//           >
//             How it works
//           </a>
//           <a
//             href="#pricing"
//             className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200"
//           >
//             Pricing
//           </a>
//           <a
//             href="#blog"
//             className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200"
//           >
//             Blog
//           </a>
//         </div>

//         {/* Right Buttons */}
//         <div className="flex space-x-10">
//           <button
//             onClick={() => navigate('/auth')}
//             className="text-gray-800 hover:text-blue-600 transition-colors duration-200"
//           >
//             Login
//           </button>
//           <button className="border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-200 px-6 py-1.5 rounded">
//             Try Now
//           </button>
//         </div>
//       </div>
//     </nav>
//   )
// }

// export default LandingPageNavbar

import React, { useState, useEffect } from 'react'
import zynthtext from '../../assets/zynth-text.png'
import { useNavigate } from 'react-router-dom'

const LandingPageNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true) // Navbar hides when scrolled down
      } else {
        setIsScrolled(false) // Navbar visible when at the top
      }
      resetInactivityTimer() // Reset inactivity timer on scroll
    }

    const handleMouseMove = () => {
      resetInactivityTimer() // Reset inactivity timer on mouse move
    }

    // Inactivity timer function
    let inactivityTimer: NodeJS.Timeout
    const startInactivityTimer = () => {
      inactivityTimer = setTimeout(() => {
        if (isScrolled) {
          // Only hide when scrolled down
          setIsNavbarVisible(false) // Hide navbar after inactivity
        }
      }, 1000) // 1 second of inactivity
    }

    const resetInactivityTimer = () => {
      setIsNavbarVisible(true) // Show navbar when activity occurs
      clearTimeout(inactivityTimer) // Clear any existing timers
      startInactivityTimer() // Start a new timer
    }

    // Handle hover at the top of the page
    const handleMouseEnter = (e: MouseEvent) => {
      if (e.clientY < 50) {
        // If mouse is near the top
        setIsNavbarVisible(true) // Show navbar
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousemove', handleMouseEnter) // Hover near the top

    startInactivityTimer() // Start the inactivity timer when the component mounts

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousemove', handleMouseEnter)
      clearTimeout(inactivityTimer) // Clean up timer when component unmounts
    }
  }, [isScrolled])

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      } ${isNavbarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} // Hide navbar when inactive
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800">
          <span className="flex items-center">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <img className="h-8" src={zynthtext} alt="Zynth" />
            </a>
          </span>
        </div>

        {/* Mobile & Small Screen Navbar */}
        <div className="md:hidden flex items-center space-x-4">
          <button className="border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-200 px-4 py-1 rounded">
            Try Now
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-800 focus:outline-none"
          >
            <div className="space-y-1">
              <span className="block h-0.5 w-6 bg-gray-800"></span>
              <span className="block h-0.5 w-6 bg-gray-800"></span>
              <span className="block h-0.5 w-6 bg-gray-800"></span>
            </div>
          </button>
        </div>

        {/* Desktop Center Links */}
        <div className="hidden md:flex space-x-10 items-center">
          <a
            href="#how-it-works"
            className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault()
              document
                .getElementById('how-it-works')
                ?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault()
              document
                .getElementById('pricing')
                ?.scrollIntoView({ behavior: 'smooth' })
            }}
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
        <div className="hidden md:flex space-x-10">
          <button
            onClick={() => navigate('/auth')}
            className="text-gray-800 hover:text-blue-600 active:scale-95 active:text-blue-700 transition-all duration-200"
          >
            Login
          </button>

          <button className="border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white active:scale-95 active:bg-gray-700 active:text-white transition-all duration-200 px-6 py-1.5 rounded">
            Try Now
          </button>
        </div>
      </div>

      {/* Dropdown for Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col items-center space-y-2 p-4">
            <li>
              <a
                href="#how-it-works"
                className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200 block"
              >
                How it works
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200 block"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#blog"
                className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200 block"
              >
                Blog
              </a>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate('/auth')
                  setIsMenuOpen(false)
                }}
                className="text-gray-800 hover:text-blue-600 transition-colors duration-200 block"
              >
                Login
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}

export default LandingPageNavbar
