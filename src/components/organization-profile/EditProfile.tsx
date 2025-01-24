import React, { useState, useEffect } from 'react'
import axios from 'axios'
import uploadFileToS3 from '../../utils/uploadFileToS3'
import { useNavigate } from 'react-router-dom'
import { OrganizationData } from '../../types/types'
import { industrySectorMap } from '../../utils/industrySector'
import { toast } from 'react-toastify'

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
  const [validationErrors, setValidationErrors] = useState<{
    contactPhone?: string
    linkedinLink?: string
    contactEmail?: string
    websiteLink?: string
  }>({})
  const [originalData, setOriginalData] = useState<OrganizationData | null>(
    null
  )

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIsUploading(true) // Indicate uploading

      try {
        const uploadedFile = {
          name: file.name,
          type: file.type,
          body: file,
        }

        // Upload file to S3 and get the URL
        const url = await uploadFileToS3(uploadedFile)
        setLogo(url)
      } catch (error) {
        console.error('Error uploading logo:', error)
      } finally {
        setIsUploading(false)
      }
    }
  }
  const [error, setError] = useState('')
  const handleButtonClick = () => {
    document.getElementById('changeLogoInput')?.click()
  }
  // Independent validation functions for each field
  const validateContactPhone = (value: string) => {
    if (value.trim() === '') return undefined // Skip validation if input is empty
    if (!/^[1-9]\d{9}$/.test(value)) {
      return 'Phone number must be 10 digits.'
    }
    return undefined
  }

  const validateLinkedInLink = (value: string) => {
    if (value.trim() === '') return undefined // Skip validation if input is empty
    if (
      !/^https:\/\/(www\.)?linkedin\.com\/(in|company|pub)\/[a-zA-Z0-9_-]{3,}\/?$/.test(
        value
      )
    ) {
      return 'Please enter a valid LinkedIn URL.'
    }
    return undefined
  }

  const validateContactEmail = (value: string) => {
    if (value.trim() === '') return undefined // Skip validation if input is empty
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      return 'Please enter a valid email address.'
    }
    return undefined
  }

  const validateWebsiteLink = (value: string) => {
    if (value.trim() === '') {
      setError('') // Clear error if input is empty
      return
    }
    const websiteRegex =
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/
    if (!websiteRegex.test(value)) {
      return 'Please enter a valid website link'
    }
    return undefined
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

      // Create an object to store only the changed fields
      const changedFields: Partial<OrganizationData> = {}

      // Compare current values with original values
      if (originalData) {
        if (formData.companyName !== originalData.companyName) {
          changedFields.companyName = formData.companyName
        }
        if (formData.tagline !== originalData.tagline) {
          changedFields.tagline = formData.tagline
        }
        if (sectorData !== originalData.sector) {
          changedFields.sector = sectorData
        }
        if (industryData !== originalData.industry) {
          changedFields.industry = industryData
        }
        if (formData.websiteLink !== originalData.websiteLink) {
          changedFields.websiteLink = formData.websiteLink
        }
        if (formData.contactPhone !== originalData.contactPhone) {
          changedFields.contactPhone = formData.contactPhone
        }
        if (formData.contactEmail !== originalData.contactEmail) {
          changedFields.contactEmail = formData.contactEmail
        }
        if (formData.linkedinLink !== originalData.linkedinLink) {
          changedFields.linkedinLink = formData.linkedinLink
        }
        if (logo && logo !== originalData.logo) {
          changedFields.logo = logo
        }
      }

      // Only make the API call if there are actually changed fields
      if (Object.keys(changedFields).length > 0) {
        const updatedData = {
          ...changedFields,
          orgId: orgId,
          userId: userId,
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
        setLoading(false)
        navigate('/organization-profile')
      } else {
        setLoading(false)
        toast.info('No changes detected', {
          position: 'top-right',
          autoClose: 3000,
        })
      }
    } catch (error: any) {
      console.error('Failed to update profile', error)
      if (error.response?.status === 404) {
        toast.error('Error updating profile data', {
          position: 'top-right',
          autoClose: 3000,
        })
      }
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
        setOriginalData(data) // Store the original data

        if (
          !Object.keys(industrySectorMap).includes(data.sector) &&
          data.sector
        ) {
          setSector('Other')
          setOtherSector(data.sector)
        } else {
          setSector(data.sector)
        }

        if (
          !Object.values(industrySectorMap).flat().includes(data.industry) &&
          data.industry
        ) {
          setIndustry('Other')
          setOtherIndustry(data.industry)
        } else {
          setIndustry(data.industry)
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

  const handlevalidationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target

    // Update the formData state
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Call the corresponding validation function
    let error: string | undefined
    if (name === 'contactPhone') error = validateContactPhone(value)
    if (name === 'linkedinLink') error = validateLinkedInLink(value)
    if (name === 'contactEmail') error = validateContactEmail(value)
    if (name === 'websiteLink') error = validateWebsiteLink(value)

    // Update the validationErrors state
    setValidationErrors((prev) => ({ ...prev, [name]: error }))
  }

  const isButtonDisabled = () => {
    const hasErrors = Object.values(validationErrors).some((error) => error)

    return hasErrors || loading
  }

  return (
    <>
      {initialLoading && (
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="bg-gray-100 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full md:w-[95%] h-[85vh] mt-2 flex flex-col p-6 overflow-y-auto scrollbar-none">
          <h2 className="text-2xl font-semibold mb-4">Edit your profile</h2>
          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="hidden md:grid  md:grid-cols-3 gap-6">
              {/* First Grid: Company Name and Logo */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter Company Name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-4 border rounded-lg p-4">
                  <img
                    src={logo && !isUploading ? logo : formData.logo}
                    alt="Organization Logo"
                    className="w-24 h-24 rounded-full  shadow-md object-cover aspect-auto"
                  />
                  <button
                    className="border text-gray-700 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition"
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
              </div>

              {/* Second Grid: Tagline and Sector */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    placeholder="Enter Your Tagline"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Sector
                  </label>
                  <select
                    name="sector"
                    value={sector}
                    onChange={handleSectorChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  {sector === 'Other' && (
                    <input
                      type="text"
                      placeholder="Enter Your Sector"
                      value={otherSector}
                      onChange={(e) => setOtherSector(e.target.value)}
                      className="w-full border mt-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>

              {/* Third Grid: Website Link and Industry */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Website Link
                  </label>
                  <input
                    type="text"
                    name="websiteLink"
                    value={formData.websiteLink}
                    onChange={handlevalidationChange}
                    placeholder="Enter Website Name"
                    className={`w-full border ${
                      validationErrors.websiteLink
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 ${
                      validationErrors.websiteLink
                        ? 'focus:ring-red-500'
                        : 'focus:ring-blue-500'
                    }`}
                  />
                  {validationErrors.websiteLink && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.websiteLink}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Industry
                  </label>
                  <select
                    name="industry"
                    value={industry}
                    onChange={handleIndustryChange}
                    disabled={!sector || sector === 'Other'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  {(industry === 'Other' || sector === 'Other') && (
                    <input
                      type="text"
                      placeholder="Enter Your Industry"
                      value={otherIndustry}
                      onChange={(e) => setOtherIndustry(e.target.value)}
                      className="w-full border mt-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className=" md:hidden grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter Company Name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    placeholder="Enter Your Tagline"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-4 border rounded-lg p-4">
                  <img
                    src={logo && !isUploading ? logo : formData.logo}
                    alt="Organization Logo"
                    className="w-28 h-28 rounded-full shadow-md object-cover aspect-auto"
                  />

                  <button
                    className="border text-gray-700 px-2 py-1 rounded hover:bg-blue-600 hover:text-white transition"
                    onClick={handleButtonClick}
                  >
                    {isUploading ? 'Uploading...' : 'Change Logo'}
                  </button>
                  <input
                    type="file"
                    id="changeLogoInput"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* First: Website Link */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Website Link
                </label>
                <input
                  type="text"
                  name="websiteLink"
                  value={formData.websiteLink}
                  onChange={handlevalidationChange}
                  placeholder="Enter Website Name"
                  className={`w-full border ${
                    validationErrors.websiteLink
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 ${
                    validationErrors.websiteLink
                      ? 'focus:ring-red-500'
                      : 'focus:ring-blue-500'
                  }`}
                />
                {validationErrors.websiteLink && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.websiteLink}
                  </p>
                )}
              </div>

              {/* Second: Sector */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Sector
                </label>
                <select
                  name="sector"
                  value={sector}
                  onChange={handleSectorChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                {sector === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter Your Sector"
                    value={otherSector}
                    onChange={(e) => setOtherSector(e.target.value)}
                    className="w-full border mt-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              {/* Third: Industry */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Industry
                </label>
                <select
                  name="industry"
                  value={industry}
                  onChange={handleIndustryChange}
                  disabled={!sector || sector === 'Other'}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                {(industry === 'Other' || sector === 'Other') && (
                  <input
                    type="text"
                    placeholder="Enter Your Industry"
                    value={otherIndustry}
                    onChange={(e) => setOtherIndustry(e.target.value)}
                    className="w-full border mt-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  type="tel"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handlevalidationChange}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                  placeholder="Enter Company Phone"
                  className={`w-full border ${
                    validationErrors.contactPhone
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 ${
                    validationErrors.contactPhone
                      ? 'focus:ring-red-500'
                      : 'focus:ring-blue-500'
                  }`}
                />
                {validationErrors.contactPhone && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.contactPhone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Company LinkedIn
                </label>
                <input
                  type="text"
                  name="linkedinLink"
                  value={formData.linkedinLink}
                  onChange={handlevalidationChange}
                  placeholder="Enter Company LinkedIn"
                  className={`w-full border ${
                    validationErrors.linkedinLink
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 ${
                    validationErrors.linkedinLink
                      ? 'focus:ring-red-500'
                      : 'focus:ring-blue-500'
                  }`}
                />
                {validationErrors.linkedinLink && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.linkedinLink}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Company Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handlevalidationChange}
                  placeholder="Enter Company Email"
                  className={`w-full border ${
                    validationErrors.contactEmail
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 ${
                    validationErrors.contactEmail
                      ? 'focus:ring-red-500'
                      : 'focus:ring-blue-500'
                  }`}
                />
                {validationErrors.contactEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.contactEmail}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-end mt-4 lg:gap-x-2 p-4 border-t">
            <button
              onClick={handleUpdate}
              disabled={isButtonDisabled()}
              className={`px-4 py-3 lg:py-2 lg:w-[12%] rounded-lg mb-2 lg:mb-0 ${
                isButtonDisabled()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#3667B2] text-white hover:bg-white hover:text-[#3667B2] border hover:border-[#3667B2]'
              } active:scale-95 transition transform duration-300`}
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
