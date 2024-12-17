import React, { useState, useEffect } from 'react'
import axios from 'axios'
import uploadLogoToS3 from '../../utils/uploadLogoToS3'
import { useNavigate } from 'react-router-dom'
import { OrganizationData } from '../../types/types'
import { industrySectorMap } from '../../utils/industrySector'

type SectorType = keyof typeof industrySectorMap

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
  const [initialLoading, setInitialLoading] = useState(true)
  const [sector, setSector] = useState(formData.sector)
  const [industry, setIndustry] = useState(formData.industry)
  const [otherSector, setOtherSector] = useState('')
  const [otherIndustry, setOtherIndustry] = useState('')
  const [logo, setLogo] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const navigate = useNavigate()
  const orgId = sessionStorage.getItem('orgId')
  const userId = sessionStorage.getItem('userEmail')
  const authToken = sessionStorage.getItem('authToken')
  const [industryOptions, setIndustryOptions] = useState<string[]>([])

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === 'sector') {
      if (value === 'Other') {
        setOtherSector('')
        setOtherIndustry('')
        setIndustryOptions([])
      } else {
        setIndustryOptions(
          industrySectorMap[value as keyof typeof industrySectorMap] || []
        )
      }
    }

    if (name === 'industry' && value !== 'Other') {
      setOtherIndustry('')
    }
  }

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value as SectorType // Cast to SectorType
    setSector(selectedValue)
    if (selectedValue === 'Other') {
      setOtherSector('')
      setOtherIndustry('')
    }
  }

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    setIndustry(selectedValue)
    if (selectedValue !== 'Other') {
      setOtherIndustry('') // Clear otherIndustry input
    }
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const sectorData = sector === 'Other' ? otherSector : sector
      const industryData = industry === 'Other' ? otherIndustry : industry
      const updatedData = {
        ...formData,
        orgId: orgId,
        userId: userId,
        sector: sectorData,
        industry: industryData,
        logo: logo || formData.logo,
      }
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organizationedit/${orgId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
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

  // Fetch Profile Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/${orgId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        const data = response.data
        setFormData(data)

        if (
          !Object.keys(industrySectorMap).includes(formData.sector) &&
          formData.sector
        ) {
          setSector('Other')
          setOtherSector(formData.sector)
        } else {
          setSector(formData.sector)
        }

        if (
          !Object.values(industrySectorMap)
            .flat()
            .includes(formData.industry) &&
          formData.industry
        ) {
          setIndustry('Other')
          setOtherIndustry(formData.industry)
        } else {
          setIndustry(formData.industry)
        }

        setInitialLoading(false)
      } catch (error) {
        console.error('Failed to fetch profile data', error)
      }
    }

    fetchData()
  }, [orgId, authToken])

  useEffect(() => {
    if (sector && sector !== 'Other' && sector in industrySectorMap) {
      setIndustryOptions([...industrySectorMap[sector as SectorType], 'Other'])
    }

    // Automatically set industry to "Other" if sector is "Other"
    if (sector === 'Other') {
      setIndustry('Other')
      setOtherIndustry('') // Reset otherIndustry input
    }
  }, [sector])

  return (
    <>
      {initialLoading && (
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      )}
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 "
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 "
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Sector
                </label>
                <select
                  name="sector"
                  value={sector}
                  onChange={handleSectorChange}
                 className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 "
                >
                  <option value="" disabled>
                    Select sector
                  </option>
                  {Object.keys(industrySectorMap).map((sectorKey) => (
                    <option key={sectorKey} value={sectorKey}>
                      {sectorKey}
                    </option>
                  ))}
                </select>
                {formData.sector === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter your sector"
                    value={otherSector}
                    onChange={(e) => setOtherSector(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 "
                  />
                )}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Industry
                </label>
                <select
                  name="industry"
                  value={industry}
                  onChange={handleIndustryChange}
                  disabled={!sector || sector === 'Other'}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 "
                >
                  {sector !== 'Other' && (
                    <option value="" disabled>
                      Select industry
                    </option>
                  )}
                  {sector === 'Other' && (
                    <option value="" disabled>
                      Other
                    </option>
                  )}
                  {industryOptions.map((industryOption) => (
                    <option key={industryOption} value={industryOption}>
                      {industryOption}
                    </option>
                  ))}
                </select>
                {industry === 'Other' || sector === 'Other' ? (
                  <input
                    type="text"
                    placeholder="Enter your industry"
                    value={otherIndustry}
                    onChange={(e) => setOtherIndustry(e.target.value)}
                   className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 "
                  />
                ) : (
                  <></>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 "
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
                 className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 "
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 "
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-end mt-4 lg:gap-x-2 p-4 border-t">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-4 py-3 lg:py-2 lg:w-[12%] rounded-lg mb-2 lg:mb-0 bg-[#3667B2] text-white hover:bg-white hover:text-[#3667B2] border hover:border-[#3667B2] active:scale-95 transition transform duration-300"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-3 lg:py-2 lg:w-[12%] rounded-lg border border-[#8A8B8C] text-gray-700 hover:bg-[#3667B2] hover:border-[#3667B2] hover:text-white active:scale-95 transition transform duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditProfile
