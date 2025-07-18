import React, { useState, useEffect, useRef } from 'react';
import zynthtext from '../../assets/zynth-text.png';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

const LandingPageNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
      resetInactivityTimer();
    };

    let inactivityTimer: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      setIsNavbarVisible(true);
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (isScrolled) setIsNavbarVisible(false);
      }, 1000);
    };

    const handleMouseMove = () => resetInactivityTimer();
    const handleMouseEnter = (e: MouseEvent) => {
      if (e.clientY < 50) setIsNavbarVisible(true);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousemove', handleMouseEnter);

    resetInactivityTimer();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleMouseEnter);
      clearTimeout(inactivityTimer);
    };
  }, [isScrolled]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.use-cases-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    targetId: string
  ) => {
    e.preventDefault();

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const offset = -20;
          const top = element.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        const offset = -20;
        const top = element.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }

    setIsMenuOpen(false);
  };

  const useCases = [
    { name: 'Sales', path: 'https://zynth.ai/use-cases-sales' },
    { name: 'Product', path: 'https://zynth.ai/use-cases-product' },
    { name: 'Pitch Decks', path: 'https://zynth.ai/use-cases-pitch' },
    { name: 'Marketing', path: 'https://zynth.ai/use-cases-marketing' },
    { name: 'Employee Engagement', path: 'https://zynth.ai/use-cases-employee' },
    { name: 'Project Proposal', path: 'https://zynth.ai/use-cases-project' },
    { name: 'Board Presentations', path: 'https://zynth.ai/use-cases-board' },
    { name: 'Education', path: 'https://zynth.ai/use-cases-education' },
    { name: 'White Label', path: 'https://zynth.ai/white-label' },
  ];
  interface ToggleDropdownEvent
    extends React.MouseEvent<HTMLButtonElement, MouseEvent> {}

  interface ToggleDropdownEvent
    extends React.MouseEvent<HTMLButtonElement, MouseEvent> {}
   const toggleDropdown = (event: ToggleDropdownEvent): void => {
    event.stopPropagation(); 
    setIsDropdownOpen((prev) => !prev);
  };


  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white text-black shadow-md'
          : 'bg-gradient-to-r from-green-600 via-teal-500 to-blue-600 text-white'
      } ${isNavbarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <a href="/" className="transition transform hover:scale-105">
          <img src={zynthtext} className="h-8" alt="Zynth" />
        </a>

        <div className="hidden lg:flex items-center space-x-8">
         
          <a
            onClick={(e) => {
              e.preventDefault();
              window.open('/pricing', '_blank');
            }}
            href="#pricing"
            className={`hover:text-gray-200 transition-colors duration-200 ${
              isScrolled ? 'text-[#5D5F61] hover:text-blue-600' : 'text-white'
            }`}
          >
            Pricing
          </a>

         <div className="relative flex justify-center" ref={dropdownRef}>
              
              <button
                onMouseEnter={toggleDropdown}
                className={`hover:text-gray-200 transition-colors duration-200 ${
              isScrolled ? 'text-[#5D5F61] hover:text-blue-600' : 'text-white'
            } flex items-center`}
              >
                Use Cases{" "}
                {isDropdownOpen ? (
                  <ChevronUp className="ml-1 w-5 h-5" />
                ) : (
                  <ChevronDown className="ml-1 w-5 h-5" />
                )}
              </button>

             
              {isDropdownOpen && (
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg rounded-lg py-2 w-56 border">
                  {useCases.map((item, index) => (
                    <a
                      key={index}
                     
                      href={item.path}
                      target="_blank"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)} // Close menu on selection
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

          

          <a
            onClick={(e) => {
              e.preventDefault();
              window.open('https://zynth.ai/blog', '_blank');
            }}
            href="#blog"
            className={`hover:text-gray-200 transition-colors duration-200 ${
              isScrolled ? 'text-[#5D5F61] hover:text-blue-600' : 'text-white'
            }`}
          >
            Blog
          </a>
        </div>

        {/* <div className="hidden lg:flex">
          <button
            onClick={() => navigate('/')}
            className={`px-4 py-2 border rounded-md transition-all duration-300 active:scale-95 ${
              isScrolled
                ? 'border-black text-black hover:bg-black hover:text-white'
                : 'border-white text-white hover:bg-white hover:text-black'
            }`}
          >
            Sign in / Log in
          </button>
        </div> */}

        <div className="lg:hidden">
          <button title='menu'onClick={() => setIsMenuOpen(true)}>
            <div className="space-y-1">
              <span className="block h-0.5 w-6 bg-white"></span>
              <span className="block h-0.5 w-6 bg-white"></span>
              <span className="block h-0.5 w-6 bg-white"></span>
            </div>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          <div className="ml-auto w-[80%] sm:w-72 h-full bg-white shadow-xl p-6 space-y-6 text-black">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button title='menu' onClick={() => setIsMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <ul className="space-y-4">
             
              <li>
                <div className="text-sm font-semibold text-gray-500">Use Cases</div>
                <ul className="mt-2 space-y-1">
                  {useCases.map((item, index) => (
                    <li key={index}>
                      <NavLink
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-[#5D5F61] hover:text-blue-600"
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <a
                  onClick={() => {
                    navigate('/pricing');
                    setIsMenuOpen(false);
                  }}
                  className="block text-[#5D5F61] hover:text-blue-600"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    window.open('https://zynth.ai/blog', '_blank');
                    setIsMenuOpen(false);
                  }}
                  className="block text-[#5D5F61] hover:text-blue-600"
                >
                  Blog
                </a>
              </li>
             
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingPageNavbar;
