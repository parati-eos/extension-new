// src/components/ViewProfile.tsx
import React from 'react'
import { FaEdit, FaLink, FaEnvelope, FaPhone, FaLinkedin } from 'react-icons/fa'
import ZynthLogo from '../../assets/zynth-icon.png'
import { useNavigate } from 'react-router-dom'

const ViewProfile: React.FC = () => {
  const navigate = useNavigate()

  const handleEditClick = () => {
    navigate('/edit-organization-profile')
  }

  return (
    <div className=" bg-gray-100 flex items-center justify-center p-4">
      {/* Main White Box Container */}
      <div className="relative bg-white rounded-lg shadow-xl w-[95%] h-[85vh] flex mt-2 justify-center p-6">
        {/* Color Box */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-r from-green-400 to-green-600 rounded-t-lg shadow-md"></div>

        {/* Content Box */}
        <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 bg-white p-8 sm:p-10 rounded-lg shadow-lg w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%] z-10 flex flex-col items-center space-y-8">
          {/* Top Section: Logo, Organization Info, Edit Profile */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Circular Logo */}
            <img
              src={ZynthLogo}
              alt="Organization Logo"
              className="w-20 h-20 rounded-full border-4 border-white shadow-md"
            />

            {/* Organization Info */}
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-800">
                AZ Corporation
              </h2>
              <p className="text-sm text-gray-500">
                Transportation • Public Sector
              </p>
              <button
                onClick={handleEditClick}
                className="mt-2 bg-white hover:bg-[#3667B2] hover:text-white border border-gray-300 hover:border-[#3667B2] text-slate-900 px-4 py-2 rounded-md flex items-center justify-center space-x-2 shadow"
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="flex flex-col space-y-4 w-full">
            {/* Website Link */}
            <div className="flex items-start space-x-4">
              <FaLink className="text-[#3667B2] text-xl" />
              <div>
                <h4 className="text-lg font-semibold text-gray-700">
                  Website Link
                </h4>
                <p className="text-gray-600 break-words">
                  https://azcorporation.com
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <FaEnvelope className="text-[#3667B2] text-xl" />
              <div>
                <h4 className="text-lg font-semibold text-gray-700">Email</h4>
                <p className="text-gray-600 break-words">
                  contact@azcorporation.com
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-4">
              <FaPhone className="text-[#3667B2] text-xl" />
              <div>
                <h4 className="text-lg font-semibold text-gray-700">Phone</h4>
                <p className="text-gray-600 break-words">+91-804-1457</p>
              </div>
            </div>

            {/* LinkedIn Profile */}
            <div className="flex items-start space-x-4">
              <FaLinkedin className="text-[#3667B2] text-xl" />
              <div>
                <h4 className="text-lg font-semibold text-gray-700">
                  LinkedIn Profile
                </h4>
                <p className="text-gray-600 break-words">azcorporation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewProfile
