import React, { useState, useEffect } from 'react'
import zynthtext from '../../assets/zynth-text.png'
import { useNavigate,useLocation } from 'react-router-dom'

const LandingPageNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation(); // Track the current path

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
  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    targetId: string
  ) => {
    e.preventDefault()
    if (
      window.location.pathname === '/pricing' ||
      window.location.pathname === '/blog'
    ) {
      navigate('/')
      setTimeout(() => {
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: 'smooth' })
      }, 100) // Adjust the timeout as needed
    } else {
      if (targetId === 'how-it-works') {
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: 'smooth' })
      } else {
        const element = document.getElementById(targetId)
        if (element) {
          const offset = -20 // Adjust this value to control how much higher the scroll should stop
          const elementPosition =
            element.getBoundingClientRect().top + window.scrollY
          const offsetPosition = elementPosition + offset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
        }
      }
    }
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      } ${isNavbarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} // Hide navbar when inactive
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800">
          <span className="flex items-center">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 transform hover:scale-110 active:scale-95 active:opacity-80"
            >
              <img className="h-8" src={zynthtext} alt="Zynth" />
            </a>
          </span>
        </div>

        {/* Mobile & Small Screen Navbar */}
        <div className="lg:hidden flex items-center space-x-4">
          <button
            onClick={() => navigate('/auth')}
            className="border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white active:scale-95 transition transform duration-300 px-4 py-1 rounded"
          >
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
        <div className="hidden lg:flex space-x-10 items-center">
          <a
            href="#how-it-works"
            className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200"
            onClick={(e) => handleNavigation(e, 'how-it-works')}
          >
            How Zynth Works
          </a>
          <a
            href="#sample-presentation"
            className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200"
            onClick={(e) => handleNavigation(e, 'sample-presentation')}
          >
            Sample Presentation
          </a>
          <a
            href="#pricing"
            className={`${
              isActive('/pricing') ? 'text-blue-600' : 'text-[#5D5F61]'
            } hover:text-blue-600 transition-colors duration-200`}
            onClick={(e) => {
              e.preventDefault()
              window.open('/pricing', '_blank')
            }}
          >
            Pricing
          </a>
          <a
            href="#blog"
            className={`${
              isActive('/blog') ? 'text-blue-600' : 'text-[#5D5F61]'
            } hover:text-blue-600 transition-colors duration-200`}
            onClick={(e) => {
              e.preventDefault()
              window.open('/blog', '_blank')
            }}
          >
            Blog
          </a>
        </div>

        {/* Right Buttons */}
        <div className="hidden lg:flex space-x-10">
          <button
            onClick={() => navigate('/auth')}
            className="text-gray-800 hover:text-blue-600 active:scale-95 transition-all transform duration-300"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-all active:scale-95 active:bg-blue-800 transform duration-300 px-6 py-1.5 rounded"
          >
            Try Now
          </button>
        </div>
      </div>

      {/* Dropdown for Mobile */}
      {isMenuOpen && (
        <div className="lg:hidden  bg-white shadow-md">
          <ul className="flex flex-col items-center space-y-2 p-4">
            <li>
              <a
                onClick={(e) => handleNavigation(e, 'how-it-works')}
                href="#how-it-works"
                className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200 block"
              >
                How Zynth Works
              </a>
            </li>
            <li>
              <a
                onClick={(e) => handleNavigation(e, 'sample-presentation')}
                href="#sample-presentation"
                className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200 block"
              >
                Sample Presentation
              </a>
            </li>
            <li>
              <a
                 onClick={() => navigate('/pricing')}
                 className={`${
                  isActive('/pricing') ? 'text-blue-600' : 'text-[#5D5F61]'
                } hover:text-blue-600 transition-colors duration-200`}
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate('/blog')}
                className={`${
                  isActive('/blog') ? 'text-blue-600' : 'text-[#5D5F61]'
                } hover:text-blue-600 transition-colors duration-200`}
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
                className="text-gray-800 hover:text-blue-600 active:scale-95 active:bg-blue-800 transition-all transform duration-300 block"
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
