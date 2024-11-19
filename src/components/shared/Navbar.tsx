import { FaClock, FaUserCircle, FaPlus } from 'react-icons/fa'
import ZynthLogo from '../../assets/zynth-icon.png'
import ZynthLogoText from '../../assets/zynth-text.png'

const Navbar = () => {
  // const userProfilePictureUrl = localStorage.getItem('userDP') || '' // Replace with the actual URL of the user's profile picture

  // const handleProfileClick = () => {
  //   // Redirect to the user's profile page
  // }

  return (
    <nav className="bg-white p-2">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo with icon and text */}
        <div className="flex items-center space-x-2">
          <img src={ZynthLogo} alt="Logo Icon" className="h-8 w-8" />
          <img src={ZynthLogoText} alt="Logo Text" className="h-8" />
        </div>

        {/* Menu */}
        <div className="flex items-center space-x-4">
          <button className="bg-[#3667B2] text-white hover:bg-white hover:text-[#3667B2] hover:border-[#3667B2] hover:border text-base font-medium px-4 py-2 rounded-md">
            <span className="sm:hidden text-base">
              <FaPlus />
            </span>
            <span className="hidden sm:flex items-center space-x-2">
              <FaPlus />
              <span>New Presentation</span>
            </span>
          </button>
          <button className="bg-white border-[#3667B2] border text-[#3667B2] hover:bg-[#3667B2] hover:text-white hover:border-[#3667B2] hover:border text-base font-medium px-4 py-2 rounded-md">
            <span className="sm:hidden text-base">
              <FaClock />
            </span>
            <span className="hidden sm:flex items-center space-x-2">
              <FaClock />
              <span>History</span>
            </span>
          </button>
          <FaUserCircle className="text-[#3667B2] text-4xl" />
          {/* <img
            src={userProfilePictureUrl}
            alt="User Profile"
            className="w-8 h-8 rounded-full hover:scale-105 cursor-pointer"
            onClick={handleProfileClick}
          /> */}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
