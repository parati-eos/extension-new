// // src/components/ViewProfile.tsx
import React, { useEffect, useState } from 'react'
import { FaEdit, FaLink, FaEnvelope, FaPhone, FaLinkedin } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { OrganizationData } from '../../types/types'

const ViewProfile: React.FC = () => {
  const navigate = useNavigate()
  const [organizationData, setOrganizationData] =
    useState<OrganizationData | null>(null)
  const [bgColor, setBgColor] = useState<string>('')
  const orgId = sessionStorage.getItem('orgId')
  const authToken = sessionStorage.getItem('authToken')

  const handleEditClick = () => {
    navigate('/edit-organization-profile')
  }

  // Call a GET API to fetch organization data
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/${orgId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setOrganizationData(response.data)
        setBgColor(response.data.color.P100)
      })
      .catch((error) => {
        console.error('Error fetching organization data:', error)
      })
  }, [orgId, authToken])

  return (
    <div className="bg-gray-100 flex flex-col items-center min-h-screen overflow-hidden">
      {/* Color Box for Mobile */}
      <div
        className="w-full h-[30vh] lg:hidden"
        style={{
          backgroundColor: bgColor,
        }}
      ></div>

      {/* Main White Box Container for Larger Screens */}
      <div className="hidden lg:flex relative bg-white rounded-lg mt-2 xl:mt-4 shadow-xl w-[95%] h-[88vh] justify-center p-6">
        {/* Color Box */}
        <div
          className="absolute top-0 w-[99%] lg:mt-1 xl:mt-2 h-1/2 rounded-lg shadow-md"
          style={{ backgroundColor: bgColor }}
        ></div>

        {/* Content Box */}
        <div className="absolute h-[83%] xl:mt-4 left-1/2 transform -translate-x-1/2 bg-white p-8 sm:p-10 rounded-lg shadow-lg w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%] z-10 flex flex-col items-center space-y-8">
          {/* Top Section: Logo, Organization Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Circular Logo */}
            <img
              src={organizationData?.logo}
              alt="Organization Logo"
              className="w-24 h-24 rounded-full shadow-md"
            />

            {/* Organization Info */}
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-800">
                {organizationData?.companyName}
              </h2>
              <p className="text-sm text-gray-500">
                {organizationData?.industry} • {organizationData?.sector}
              </p>
              {/* Edit Button */}
              <button
                onClick={handleEditClick}
                className="mt-4 bg-white hover:bg-[#3667B2] hover:text-white border border-gray-300 hover:border-[#3667B2] text-slate-900 px-4 py-2 rounded-md flex items-center space-x-2 shadow"
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="flex flex-col space-y-4 w-full flex-grow">
            {/* Website Link */}
            <div className="flex items-start space-x-4">
              <FaLink className="text-[#3667B2] text-base sm:text-lg" />
              <div>
                <h4 className="text-base font-semibold text-gray-700">
                  Website Link
                </h4>
                <p className="text-gray-600 break-words">
                  {organizationData?.websiteLink}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <FaEnvelope className="text-[#3667B2] text-base sm:text-lg" />
              <div>
                <h4 className="text-base font-semibold text-gray-700">Email</h4>
                <p className="text-gray-600 break-words">
                  {organizationData?.contactEmail}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-4">
              <FaPhone className="text-[#3667B2] text-base sm:text-lg" />
              <div>
                <h4 className="text-base font-semibold text-gray-700">Phone</h4>
                <p className="text-gray-600 break-words">
                  {organizationData?.contactPhone}
                </p>
              </div>
            </div>

            {/* LinkedIn Profile */}
            <div className="flex items-start space-x-4">
              <FaLinkedin className="text-[#3667B2] text-base sm:text-lg" />
              <div>
                <h4 className="text-base font-semibold text-gray-700">
                  LinkedIn Profile
                </h4>
                <p className="text-gray-600 break-all">
                  {organizationData?.linkedinLink}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="relative w-full lg:hidden flex items-center justify-center">
        {/* Content Box */}
        <div className="absolute mt-[60%] bg-white p-6 sm:p-8 rounded-lg shadow-lg w-[90%] sm:w-[75%] min-h-[65vh] flex flex-col items-center">
          {/* Top Section: Logo, Organization Info */}
          <div className="flex flex-col mb-4 items-center sm:items-start space-y-4">
            {/* Circular Logo */}
            <img
              src={organizationData?.logo}
              alt="Organization Logo"
              className="w-20 h-20 rounded-full shadow-md"
            />

            {/* Organization Info */}
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-gray-800 leading-relaxed">
                {organizationData?.companyName}
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed">
                {organizationData?.industry} • {organizationData?.sector}
              </p>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="flex flex-col mt-4 space-y-4 w-full flex-grow">
            {/* Website Link */}
            <div className="flex items-start space-x-4">
              <FaLink className="text-[#3667B2] mt-2 text-lg" />
              <div>
                <h4 className="text-xl font-semibold text-gray-700 leading-relaxed">
                  Website Link
                </h4>
                <p className="text-gray-600 text-lg break-words leading-relaxed">
                  {organizationData?.websiteLink}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <FaEnvelope className="text-[#3667B2] mt-2 text-lg" />
              <div>
                <h4 className="text-xl font-semibold text-gray-700 leading-relaxed">
                  Email
                </h4>
                <p className="text-gray-600 text-lg break-words leading-relaxed">
                  {organizationData?.contactEmail}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-4">
              <FaPhone className="text-[#3667B2] mt-2 text-lg" />
              <div>
                <h4 className="text-xl font-semibold text-gray-700 leading-relaxed">
                  Phone
                </h4>
                <p className="text-gray-600 text-lg break-words leading-relaxed">
                  {organizationData?.contactPhone}
                </p>
              </div>
            </div>

            {/* LinkedIn Profile */}
            <div className="flex items-start space-x-4">
              <FaLinkedin className="text-[#3667B2] mt-2 text-lg" />
              <div>
                <h4 className="text-xl font-semibold text-gray-700 leading-relaxed">
                  LinkedIn Profile
                </h4>
                <p className="text-gray-600 text-lg break-words leading-relaxed">
                  {organizationData?.linkedinLink}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={handleEditClick}
            className="w-full mt-4 bg-white hover:bg-[#3667B2] hover:text-white border border-gray-300 hover:border-[#3667B2] text-slate-900 px-4 py-3 rounded-lg flex items-center justify-center space-x-2 shadow"
          >
            <FaEdit />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewProfile
