import React, { useState, useEffect,useRef } from 'react';
import zynthtext from '../../assets/zynth-text.png';
import { useNavigate, useLocation ,NavLink} from 'react-router-dom';
import { ChevronDown,X,ChevronUp } from "lucide-react";

const LandingPageNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
 
  
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const openDropdown = () => {
    if (closeTimeout) clearTimeout(closeTimeout); // Cancel any existing close timer
    setIsDropdownOpen(true);
  };
  interface ToggleDropdownEvent extends React.MouseEvent<HTMLButtonElement, MouseEvent> {}

  interface ToggleDropdownEvent extends React.MouseEvent<HTMLButtonElement, MouseEvent> {}

  const toggleDropdown = (event: ToggleDropdownEvent): void => {
    event.stopPropagation(); // Stop click from triggering outside click
    setIsDropdownOpen((prev) => !prev);
  };


  const closeDropdown = () => {
    // Set a 3-second delay before closing the dropdown
    const timeout = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 3000);

    setCloseTimeout(timeout);
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (!(event.target as HTMLElement).closest(".use-cases-dropdown")) {
      setIsDropdownOpen(false);
      if (closeTimeout) clearTimeout(closeTimeout); // Cancel the delayed close
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isDropdownOpen]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null); // Track active section
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
      resetInactivityTimer();
    };

    const handleMouseMove = () => {
      resetInactivityTimer();
    };

    let inactivityTimer: NodeJS.Timeout;
    const startInactivityTimer = () => {
      inactivityTimer = setTimeout(() => {
        if (isScrolled) {
          setIsNavbarVisible(false);
        }
      }, 1000);
    };

    const resetInactivityTimer = () => {
      setIsNavbarVisible(true);
      clearTimeout(inactivityTimer);
      startInactivityTimer();
    };

    const handleMouseEnter = (e: MouseEvent) => {
      if (e.clientY < 50) {
        setIsNavbarVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousemove', handleMouseEnter);

    startInactivityTimer();
    

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleMouseEnter);
      clearTimeout(inactivityTimer);
    };
  }, [isScrolled]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section'); // All sections
      let foundActiveSection = false;
  
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.3 && rect.bottom > 0;
  
        if (isVisible && !foundActiveSection) {
          setActiveSection(section.id); // Set the first visible section as active
          foundActiveSection = true; // Prevent multiple sections from becoming active
        }
      });
  
      if (!foundActiveSection) {
        setActiveSection(null); // Clear active section if no section is visible
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolled]);
  
 
  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    targetId: string
  ) => {
    e.preventDefault();

    if (['/pricing', '/blog'].includes(location.pathname)) {
      navigate('/');
      setTimeout(() => {
        // Special handling for pricing and blog, including offset
        const element = document.getElementById(targetId);
        if (element) {
          const offset = -20; // Adjust as needed
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition + offset;
    
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        const offset = -20; // Adjust as needed
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition + offset;
    
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
    
    setActiveSection(targetId);
    
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      } ${isNavbarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
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
      >
        How Zynth Works
      </a>
      <a
        href="#sample-presentation"
        className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200"
      >
        Sample Presentation
      </a>
      
       {/* Use Cases Dropdown with 3-second delay */}
       <div className="relative" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
       <button className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200 flex items-center">
  Use Cases <ChevronDown className="ml-1 w-5 h-5" />
</button>
        {isDropdownOpen && (
          <div className="absolute top-8 left-0 bg-white shadow-lg rounded-lg py-2 w-56 border">
            {[
              { name: "Sales", path: "/use-cases-sales" },
              { name: "Product", path: "/use-cases-product" },
              { name: "Pitch Decks", path: "/use-cases-pitch" },
              { name: "Marketing", path: "/use-cases-marketing" },
              { name: "Employee Engagement", path: "/use-cases-employee" },
              { name: "Project Proposal", path: "/use-cases-project" },
              { name: "Board Presentations", path: "/use-cases-board" },
              { name: "Education", path: "/use-cases-education" },
            ].map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        )}
      </div>

      <a
        href="#pricing"
        className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200"
        onClick={(e) => {
          e.preventDefault();
          window.open("/pricing", "_blank");
        }}
      >
        Pricing
      </a>
      <a
        href="#blog"
        className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200"
        onClick={(e) => {
          e.preventDefault();
          window.open("/blog", "_blank");
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
        <div className="lg:hidden bg-white shadow-md">
          <ul className="flex flex-col items-center space-y-2 p-4">
            <li>
              <a
                onClick={(e) => handleNavigation(e, "how-it-works")}
                href="#how-it-works"
                className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200 block"
              >
                How Zynth Works
              </a>
            </li>
            <li>
              <a
                onClick={(e) => handleNavigation(e, "sample-presentations")}
                href="#sample-presentation"
                className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200 block"
              >
                Sample Presentation
              </a>
            </li>

            {/* Use Cases Dropdown */}
            <div className="relative flex justify-center" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onMouseEnter={toggleDropdown}
        className="text-[#5D5F61] hover:text-blue-600 transition-colors duration-200 flex items-center"
      >
        Use Cases {isDropdownOpen ? <ChevronUp className="ml-1 w-5 h-5" /> : <ChevronDown className="ml-1 w-5 h-5" />}
      </button>

      {/* Centered Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg rounded-lg py-2 w-56 border">
          {[
            { name: "Sales", path: "/use-cases-sales" },
            { name: "Product", path: "/use-cases-product" },
            { name: "Pitch Decks", path: "/use-cases-pitch" },
            { name: "Marketing", path: "/use-cases-marketing" },
            { name: "Employee Engagement", path: "/use-cases-employee" },
            { name: "Project Proposal", path: "/use-cases-project" },
            { name: "Board Presentations", path: "/use-cases-board" },
            { name: "Education", path: "/use-cases-education" },
          ].map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsDropdownOpen(false)} // Close menu on selection
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>

            <li>
              <a
                onClick={() => navigate("/pricing")}
                className={`${
                  location.pathname === "/pricing" ? "text-blue-600" : "text-[#5D5F61]"
                } hover:text-blue-600 transition-colors duration-200`}
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate("/blog")}
                className={`${
                  location.pathname === "/blog" ? "text-blue-600" : "text-[#5D5F61]"
                } hover:text-blue-600 transition-colors duration-200`}
              >
                Blog
              </a>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/auth");
                  setIsMenuOpen(false);
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