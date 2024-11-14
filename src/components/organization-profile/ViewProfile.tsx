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
    <div className="min-h-screen lg:min-h-[90vh] bg-gray-100 flex items-center justify-center p-4">
      {/* Main White Box Container */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl h-auto overflow-hidden flex flex-col">
        {/* Color Box */}
        <div className="absolute rounded-lg m-2 w-[98%] h-1/2 bg-slate-800"></div>

        {/* Content Box */}
        <div className="relative bg-white p-6 sm:p-8 m-4 rounded-lg shadow-md z-10 flex flex-col space-y-8 h-auto w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto mt-8">
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
                Organization Name
              </h2>
              <p className="text-sm text-gray-500">
                Industry: Tech &bull; Sector: Software
              </p>
              <button
                onClick={handleEditClick}
                className="mt-2 bg-white hover:bg-slate-500 hover:text-white border-slate-500 border text-slate-900 px-4 py-2 rounded-md flex items-center justify-center space-x-2 shadow"
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="flex flex-col space-y-4">
            {/* Website Link */}
            <div className="flex items-start space-x-4">
              <FaLink className="text-gray-500 text-xl" />
              <div>
                <h4 className="text-lg font-semibold text-gray-700">
                  Website Link
                </h4>
                <p className="text-gray-600 break-words">https://example.com</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <FaEnvelope className="text-gray-500 text-xl" />
              <div>
                <h4 className="text-lg font-semibold text-gray-700">Email</h4>
                <p className="text-gray-600 break-words">info@example.com</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-4">
              <FaPhone className="text-gray-500 text-xl" />
              <div>
                <h4 className="text-lg font-semibold text-gray-700">Phone</h4>
                <p className="text-gray-600 break-words">+1 (123) 456-7890</p>
              </div>
            </div>

            {/* LinkedIn Profile */}
            <div className="flex items-start space-x-4">
              <FaLinkedin className="text-gray-500 text-xl" />
              <div>
                <h4 className="text-lg font-semibold text-gray-700">
                  LinkedIn Profile
                </h4>
                <p className="text-gray-600 break-words">
                  https://linkedin.com/company/example
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewProfile
