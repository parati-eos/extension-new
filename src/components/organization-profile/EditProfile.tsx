import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Color {
  P100: string
  P75_S25: string
  P50_S50: string
  P25_S75: string
  S100: string
  F_P100: string
  F_P75_S25: string
  F_P50_S50: string
  F_P25_S75: string
  F_S100: string
  SCL: string
  SCD: string
}

interface OrganizationData {
  _id: string
  orgId: string
  userId: string
  companyDescription: string
  tagline: string
  color: Color
  companyName: string
  industry: string
  sector: string
  logo: string
  websiteLink: string
  contactEmail: string
  contactPhone: string
  linkedinLink: string
}

const EditProfile: React.FC = () => {
  const [formData, setFormData] = useState<OrganizationData>({
    _id: '',
    orgId: '',
    userId: '',
    companyDescription: '',
    tagline: '',
    color: {
      P100: '',
      P75_S25: '',
      P50_S50: '',
      P25_S75: '',
      S100: '',
      F_P100: '',
      F_P75_S25: '',
      F_P50_S50: '',
      F_P25_S75: '',
      F_S100: '',
      SCL: '',
      SCD: '',
    },
    companyName: '',
    industry: '',
    sector: '',
    logo: '',
    websiteLink: '',
    contactEmail: '',
    contactPhone: '',
    linkedinLink: '',
  })
  const [loading, setLoading] = useState(false)
  const [otherSector, setOtherSector] = useState('')
  const [otherIndustry, setOtherIndustry] = useState('')
  const orgId = localStorage.getItem('orgId')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_ORG_URL}/organization/${orgId}`
        )
        const data = response.data
        setFormData(data)

        // Pre-fill "Other" fields if needed
        if (
          !['Technology', 'Healthcare', 'Finance', 'Education', ''].includes(
            data.sector
          )
        ) {
          setFormData((prev) => ({ ...prev, sector: 'Other' }))
          setOtherSector(data.sector)
        }

        if (
          !['Software', 'Biotechnology', 'Banking', 'E-Learning', ''].includes(
            data.industry
          )
        ) {
          setFormData((prev) => ({ ...prev, industry: 'Other' }))
          setOtherIndustry(data.industry)
        }
      } catch (error) {
        console.error('Failed to fetch profile data', error)
      }
    }

    fetchData()
  }, [orgId])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === 'sector' && value !== 'Other') {
      setOtherSector('')
    }
    if (name === 'industry' && value !== 'Other') {
      setOtherIndustry('')
    }
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const updatedData = {
        ...formData,
        sector: formData.sector === 'Other' ? otherSector : formData.sector,
        industry:
          formData.industry === 'Other' ? otherIndustry : formData.industry,
      }
      await axios.patch(
        `${process.env.REACT_APP_ORG_URL}/organizationedit/${orgId}`,
        updatedData
      )
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full md:w-[95%] h-[85vh] mt-2 flex flex-col p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Edit your profile</h2>
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-4 items-center justify-center border">
              <img
                src={formData.logo}
                alt="Organization Logo"
                className="w-20 h-20 mt-2 mb-2 rounded-full"
              />
              <button className="text-[#3667B2] border border-[#3667B2] px-3 py-1 rounded hover:bg-[#3667B2] hover:text-white transition">
                Change Logo
              </button>
            </div>
            <div className="md:col-span-1 md:col-start-2">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="AZ Corporation"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Website Link
              </label>
              <input
                type="url"
                name="website"
                value={formData.websiteLink}
                onChange={handleInputChange}
                placeholder="www.azcorporation.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Sector
              </label>
              <select
                name="sector"
                value={formData.sector}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
              >
                <option value="" disabled>
                  Select sector
                </option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
              {formData.sector === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter your sector"
                  value={otherSector}
                  onChange={(e) => setOtherSector(e.target.value)}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
                />
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Industry
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
              >
                <option value="" disabled>
                  Select industry
                </option>
                <option value="Software">Software</option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Banking">Banking</option>
                <option value="E-Learning">E-Learning</option>
                <option value="Other">Other</option>
              </select>
              {formData.industry === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter your industry"
                  value={otherIndustry}
                  onChange={(e) => setOtherIndustry(e.target.value)}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
                />
              )}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Company Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="+91-804 1457"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Company Linkedin
              </label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedinLink}
                onChange={handleInputChange}
                placeholder="azcorporation"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Company Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="contact@azcorporation.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-4 p-4 border-t">
          <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-[#3667B2] hover:border-[#3667B2] hover:text-white transition">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[#3667B2] text-white hover:bg-white hover:text-[#3667B2] border hover:border-[#3667B2] transition"
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
