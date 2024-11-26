import { FaClock, FaPlus } from 'react-icons/fa'
import ZynthLogo from '../../assets/zynth-icon.png'
import ZynthLogoText from '../../assets/zynth-text.png'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/')
  }

  useEffect(() => {
    setTimeout(() => {
      setDropdownOpen(false)
    }, 5000)
  }, [dropdownOpen])

  useEffect(() => {
    const userDP = sessionStorage.getItem('userDP')
    if (userDP) {
      setUserProfileImage(`${userDP}?timestamp=${Date.now()}`)
    }
  }, [])
  return (
    <nav className="bg-white p-2 pt-12 lg:p-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo with icon and text */}
        <div className="flex items-center space-x-2">
          <img src={ZynthLogo} alt="Logo Icon" className="h-8 w-8" />
          <img src={ZynthLogoText} alt="Logo Text" className="h-8" />
        </div>

        {/* Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/new-presentation')}
            className="bg-[#3667B2] lg:h-[2.5rem] text-white hover:bg-white hover:text-[#3667B2] hover:border-[#3667B2] hover:border text-base font-medium px-4 py-4 lg:py-2 rounded-md"
          >
            <span className="sm:hidden text-base">
              <FaPlus />
            </span>
            <span className="hidden sm:flex items-center space-x-2">
              <FaPlus />
              <span>New Presentation</span>
            </span>
          </button>
          <button
            onClick={() => navigate('/history')}
            className="bg-white lg:h-[2.5rem] border-[#3667B2] border text-[#3667B2] hover:bg-[#3667B2] hover:text-white hover:border-[#3667B2] hover:border text-base font-medium px-4 py-4 lg:py-2 rounded-md"
          >
            <span className="sm:hidden text-base">
              <FaClock />
            </span>
            <span className="hidden sm:flex items-center space-x-2">
              <FaClock />
              <span>History</span>
            </span>
          </button>
          {/* User Profile Icon */}
          <img
            src={userProfileImage!}
            alt="User Profile"
            className="w-11 h-11 lg:w-11 lg:h-10 rounded-full hover:scale-105 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute top-20 lg:top-17 right-2 lg:right-4 bg-white shadow-lg rounded-md p-2 z-50 w-48 h-32">
              <button
                onClick={() => navigate('/organization-profile')}
                className="w-full text-[#5D5F61] text-left text-sm py-1  px-4 hover:bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap"
              >
                Organization Profile
              </button>
              <button className="w-full text-[#5D5F61] text-left text-sm py-1 px-4 hover:bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap">
                Subscription Plans
              </button>
              <button className="w-full text-[#5D5F61] text-left text-sm py-1 px-4 hover:bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap">
                Billing and Invoice
              </button>
              <button
                className="w-full text-[#5D5F61] text-left text-sm py-1 px-4 hover:bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
