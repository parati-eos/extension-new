import React, { useState, useEffect } from 'react'
import axios from 'axios'
import uploadLogoToS3 from '../../utils/uploadLogoToS3'
import { useNavigate } from 'react-router-dom'

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
  const [logo, setLogo] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const orgId = sessionStorage.getItem('orgId')
  const navigate = useNavigate()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIsUploading(true) // Indicate uploading

      try {
        // Upload file to S3 and get the URL
        const url = await uploadLogoToS3(file)
        setLogo(url)
      } catch (error) {
        console.error('Error uploading logo:', error)
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleButtonClick = () => {
    document.getElementById('changeLogoInput')?.click()
  }

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
        logo: logo || formData.logo,
      }
      await axios.patch(
        `${process.env.REACT_APP_ORG_URL}/organizationedit/${orgId}`,
        updatedData
      )
      alert('Profile updated successfully!')
      navigate('/organization-profile')
    } catch (error) {
      console.error('Failed to update profile', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/organization-profile')
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full md:w-[95%] h-[85vh] mt-2 flex flex-col p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Edit your profile</h2>
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-4 items-center justify-center border rounded-lg">
              <img
                src={logo && !isUploading ? logo : formData.logo}
                alt="Organization Logo"
                className="w-20 h-20 mt-2 mb-2 rounded-full"
              />
              <button
                className="border text-gray-700 px-3 py-1 rounded hover:bg-[#3667B2] hover:text-white transition"
                onClick={handleButtonClick}
              >
                Change Logo
              </button>
              <input
                type="file"
                id="changeLogoInput"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {isUploading && <p>Uploading...</p>}
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
                className="w-full border border-[#8A8B8C] rounded-lg px-3 py-3 lg:py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Website Link
              </label>
              <input
                type="text"
                name="websiteLink"
                value={formData.websiteLink}
                onChange={handleInputChange}
                placeholder="www.azcorporation.com"
                className="w-full border border-[#8A8B8C] rounded-lg px-3 py-3 lg:py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
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
                className="w-full border border-[#8A8B8C] rounded-lg px-3 py-3 lg:py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
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
                  className="mt-2 w-full border border-[#8A8B8C] rounded-lg px-3 py-3 lg:py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
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
                className="w-full border border-[#8A8B8C] rounded-lg px-3 py-3 lg:py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
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
                  className="mt-2 w-full border border-[#8A8B8C] rounded-lg px-3 py-3 lg:py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
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
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="+91-804 1457"
                className="w-full border border-[#8A8B8C] rounded-lg px-3 py-3 lg:py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Company Linkedin
              </label>
              <input
                type="text"
                name="linkedinLink"
                value={formData.linkedinLink}
                onChange={handleInputChange}
                placeholder="azcorporation"
                className="w-full border border-[#8A8B8C] rounded-lg px-3 py-3 lg:py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Company Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="contact@azcorporation.com"
                className="w-full border border-[#8A8B8C] rounded-lg px-3 py-3 lg:py-2 text-gray-700 focus:outline-none focus:ring focus:border-[#3667B2]"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-end mt-4 lg:gap-x-2 p-4 border-t">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-3 lg:py-2 lg:w-[12%] rounded-lg mb-2 lg:mb-0 bg-[#3667B2] text-white hover:bg-white hover:text-[#3667B2] border hover:border-[#3667B2] transition"
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-3 lg:py-2 lg:w-[12%] rounded-lg border border-[#8A8B8C] text-gray-700 hover:bg-[#3667B2] hover:border-[#3667B2] hover:text-white transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
