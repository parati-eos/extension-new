import React, { useState } from 'react'

const EditProfile: React.FC = () => {
  const [sector, setSector] = useState('')
  const [industry, setIndustry] = useState('')

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4">
      {/* Main White Box Container */}
      <div className="relative bg-white rounded-lg shadow-xl w-full md:w-[95%] h-[85vh] mt-2 flex flex-col p-6 overflow-y-auto">
        {/* Edit Profile Content */}
        <h2 className="text-2xl font-semibold mb-4">Edit your profile</h2>

        {/* Section - Basic Information */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Logo Upload */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-gray-100 w-20 h-20 flex items-center justify-center rounded-full mb-2">
                <span className="text-2xl font-bold text-gray-600">AZ</span>
              </div>
              <button className="text-[#3667B2] border border-[#3667B2] px-3 py-1 rounded hover:bg-[#3667B2] hover:text-white transition">
                Change Logo
              </button>
            </div>

            {/* Company Name */}
            <div className="md:col-span-1 md:col-start-2">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Company Name
              </label>
              <input
                type="text"
                placeholder="AZ Corporation"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
              />
            </div>

            {/* Website Link */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Website Link
              </label>
              <input
                type="url"
                placeholder="www.azcorporation.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
              />
            </div>

            {/* Sector */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Sector
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
              >
                <option value="">Select Sector</option>
                <option value="Public Sector">Public Sector</option>
                <option value="Private Sector">Private Sector</option>
                <option value="Non-Profit">Non-Profit</option>
                <option value="Other">Other</option>
              </select>
              {sector === 'Other' && (
                <input
                  type="text"
                  placeholder="Please specify"
                  className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
                />
              )}
            </div>

            {/* Industry */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
              >
                <option value="">Select Industry</option>
                <option value="Transportation">Transportation</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other">Other</option>
              </select>
              {industry === 'Other' && (
                <input
                  type="text"
                  placeholder="Please specify"
                  className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
                />
              )}
            </div>
          </div>
        </div>

        {/* Section - Contact Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Company Phone */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Company Phone
              </label>
              <input
                type="text"
                placeholder="+91-804 1457"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
              />
            </div>

            {/* Company Linkedin */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Company Linkedin
              </label>
              <input
                type="text"
                placeholder="azcorporation"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
              />
            </div>

            {/* Company Email */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Company Email
              </label>
              <input
                type="email"
                placeholder="contact@azcorporation.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-4 space-x-4 p-4 border-t">
          <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-[#3667B2] hover:border-[#3667B2] hover:text-white transition">
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-[#3667B2] text-white hover:bg-white hover:text-[#3667B2] border hover:border-[#3667B2] transition">
            Update
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
