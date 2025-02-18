import React, { useState, useEffect } from 'react'
import axios from 'axios'
import uploadFileToS3 from '../../utils/uploadFileToS3'
import { useNavigate } from 'react-router-dom'
import { OrganizationData } from '../../types/orgProfileTypes'
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
    const [isLoading, setIsLoading] = useState<boolean>(false); // Add a loading state
      const [brandingColors, setBrandingColors] = useState<string[]>([]); // Initialize branding colors
        const [primaryColor, setPrimaryColor] = useState('#000000'); // Define the primary color
         const [secondaryColor, setSecondaryColor] = useState('#FFFFFF'); // Define the secondary color
        const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    contactPhone?: string
    linkedinLink?: string
    contactEmail?: string
    websiteLink?: string
  }>({})
  const [originalData, setOriginalData] = useState<OrganizationData | null>(
    null
  )
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      color: {
        P100: primaryColor,
        S100: secondaryColor,
        P75_S25: prevData.color.P75_S25 || '',
        P50_S50: prevData.color.P50_S50 || '',
        P25_S75: prevData.color.P25_S75 || '',
        F_P100: prevData.color.F_P100 || '',
        F_P75_S25: prevData.color.F_P75_S25 || '',
        F_P50_S50: prevData.color.F_P50_S50 || '',
        F_P25_S75: prevData.color.F_P25_S75 || '',
        F_S100: prevData.color.F_S100 || '',
        SCL: prevData.color.SCL || '',
        SCD: prevData.color.SCD || '',
      },
    }));
  }, [primaryColor, secondaryColor]);
  
  
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
  const handleSaveColors = async () => {
    setIsLoading(true); // Show loading state
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile//organization/updateColors/${orgId}`,
        { primaryColor, secondaryColor },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
  
      if (response.status === 200) {
        const colors = response.data.colors ; // Extract color object
  
        // Convert object values into an array
        const colorArray: string[] = [
          colors.P100,
          colors.P75_S25,
          colors.P50_S50,
          colors.P25_S75,
          colors.S100,
            
         
         
        ];
  
       await setBrandingColors([...colorArray]); // Ensure React detects state change
      }
    } catch (error) {
      console.error("Error updating branding colors:", error);
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };
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
  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (!orgId) {
        console.error("Error: Organization ID is missing.");
        return;
      }

      setLoading(true);
      const requestUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/${orgId}`;

      try {
        console.log("Fetching Organization Data:", requestUrl);

        const response = await axios.get(requestUrl, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.status !== 200) throw new Error("Failed to fetch organization data");

        const data = response.data;

// Ensure colors exist before processing
if (data.color && typeof data.color === "object") {
  const colorMap = {
    P100: data.color.P100 || "#000000",
    P75_S25: data.color.P75_S25 || "#290000",
    P50_S50: data.color.P50_S50 || "#520000",
    P25_S75: data.color.P25_S75 || "#7A0000",
    S100: data.color.S100 || "#a30000",
  };

  const colorArray = [
    colorMap.P100,
    colorMap.P75_S25,
    colorMap.P50_S50,
    colorMap.P25_S75,
    colorMap.S100,
  ];


  setBrandingColors(colorArray);
  setPrimaryColor(colorMap.P100);
  setSecondaryColor(colorMap.S100);
        }


        console.log("Fetched Data:", data);
      } catch (error) {
        console.error("Error fetching organization data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationData();
  }, [orgId, authToken]); // Runs when `orgId` or `authToken` changes
  const handleUpdate = async () => {
    setLoading(true);
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
          changedFields.logo = logo;
        }
        if (primaryColor !== originalData.color.P100) {
          changedFields.color = { 
            ...changedFields.color, 
            P100: primaryColor,
            P75_S25: formData.color.P75_S25 || '',
            P50_S50: formData.color.P50_S50 || '',
            P25_S75: formData.color.P25_S75 || '',
            S100: formData.color.S100 || '',
            F_P100: formData.color.F_P100 || '',
            F_P75_S25: formData.color.F_P75_S25 || '',
            F_P50_S50: formData.color.F_P50_S50 || '',
            F_P25_S75: formData.color.F_P25_S75 || '',
            F_S100: formData.color.F_S100 || '',
            SCL: formData.color.SCL || '',
            SCD: formData.color.SCD || ''
          };
        }
        if (secondaryColor !== originalData.color.S100) {
          changedFields.color = { 
            ...changedFields.color, 
            S100: secondaryColor,
            P100: changedFields.color?.P100 || '',
            P75_S25: changedFields.color?.P75_S25 || '',
            P50_S50: changedFields.color?.P50_S50 || '',
            P25_S75: changedFields.color?.P25_S75 || '',
            F_P100: changedFields.color?.F_P100 || '',
            F_P75_S25: changedFields.color?.F_P75_S25 || '',
            F_P50_S50: changedFields.color?.F_P50_S50 || '',
            F_P25_S75: changedFields.color?.F_P25_S75 || '',
            F_S100: changedFields.color?.F_S100 || '',
            SCL: changedFields.color?.SCL || '',
            SCD: changedFields.color?.SCD || ''
          };
        }
      }
  
      // Only make the API call if there are actually changed fields
      if (Object.keys(changedFields).length > 0) {
        const updatedData = {
          ...changedFields,
          orgId: orgId,
          userId: userId,
        };
  
        await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organizationedit/${orgId}`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setLoading(false);
        navigate("/organization-profile");
      } else {
        setLoading(false);
        navigate("/organization-profile");
      }
    } catch (error: any) {
      console.error("Failed to update profile", error);
      if (error.response?.status === 404) {
        toast.error("Error updating profile data", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  

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
    const hasErrors = Object.values(validationErrors).some((error) => error);
  
    return hasErrors || loading || isLoading ||isUploading;
  };
  const [activeTab, setActiveTab] = useState("basic");

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
          <div className="pb-4 mb-4">
     {/* Tabs Navigation */}
     <div className="flex border-b mb-4">
        {[
          { id: "basic", label: "Basic Information" },
          { id: "branding", label: "Branding" },
          { id: "contact", label: "Contact Information" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-medium border-b-2 transition-colors duration-300 ${
              activeTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
            {/* Tab Content */}
            {activeTab === "basic" && (
         <div className="w-full mx-auto p-4 bg-white">
         <h3 className="text-xl font-semibold text-center mb-6">Basic Information</h3>
       
         <div className="grid md:grid-cols-3 gap-6">
           {/* Company Name */}
           <div className="flex flex-col items-start gap-2">
             <label className="text-gray-700 text-sm font-medium text-left">Company Name</label>
             <input
               type="text"
               name="companyName"
               value={formData.companyName}
               onChange={handleInputChange}
               placeholder="Enter Company Name"
               className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
             />
           </div>
       
           {/* Tagline */}
           <div className="flex flex-col items-start gap-2">
             <label className="text-gray-700 text-sm font-medium text-left">Tagline</label>
             <input
               type="text"
               name="tagline"
               value={formData.tagline}
               onChange={handleInputChange}
               placeholder="Enter Your Tagline"
               className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
             />
           </div>
       
           {/* Website Link */}
           <div className="flex flex-col items-start gap-2">
             <label className="text-gray-700 text-sm font-medium text-left">Website Link</label>
             <input
               type="text"
               name="websiteLink"
               value={formData.websiteLink}
               onChange={handlevalidationChange}
               placeholder="Enter Website Link"
               className={`w-full border px-4 py-3 rounded-lg focus:ring-2 ${
                 validationErrors.websiteLink ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
               }`}
             />
             {validationErrors.websiteLink && (
               <p className="text-red-500 text-sm">{validationErrors.websiteLink}</p>
             )}
           </div>
       
           {/* Sector */}
           <div className="flex flex-col items-start gap-2">
             <label className="text-gray-700 text-sm font-medium text-left">Sector</label>
             <div className="relative w-full">
               <select
                 name="sector"
                 value={sector}
                 onChange={handleSectorChange}
                 className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
               >
                 <option value="" disabled>Select sector</option>
                 {Object.keys(industrySectorMap).map((sectorKey) => (
                   <option key={sectorKey} value={sectorKey}>{sectorKey}</option>
                 ))}
               </select>
       
               {/* Custom Dropdown Arrow */}
               <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                 <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                 </svg>
               </div>
             </div>
       
             {sector === 'Other' && (
               <input
                 type="text"
                 placeholder="Enter Your Sector"
                 value={otherSector}
                 onChange={(e) => setOtherSector(e.target.value)}
                 className="w-full border mt-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
               />
             )}
           </div>
       
           {/* Industry */}
           <div className="flex flex-col items-start gap-2">
             <label className="text-gray-700 text-sm font-medium text-left">Industry</label>
             <div className="relative w-full">
               <select
                 name="industry"
                 value={industry}
                 onChange={handleIndustryChange}
                 disabled={!sector || sector === 'Other'}
                 className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
               >
                 {sector !== 'Other' && <option value="" disabled>Select industry</option>}
                 {industryOptions.map((industryOption) => (
                   <option key={industryOption} value={industryOption}>{industryOption}</option>
                 ))}
               </select>
       
               {/* Custom Dropdown Arrow */}
               <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                 <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                 </svg>
               </div>
             </div>
       
             {(industry === 'Other' || sector === 'Other') && (
               <input
                 type="text"
                 placeholder="Enter Your Industry"
                 value={otherIndustry}
                 onChange={(e) => setOtherIndustry(e.target.value)}
                 className="w-full border mt-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
               />
             )}
           </div>
         </div>
       </div>
       
        
                  )}
                              {activeTab === "branding" && (
           <div className="hidden  md:flex flex-row gap-6  w-full items-center justify-center">
         {/* Logo Upload Section */}
<div className="flex flex-col items-center justify-center gap-4 w-[50%] max-w-sm   bg-white">
  {/* Logo Display */}
  {logo && !isUploading ? (
    <img
      src={logo}
      alt="Organization Logo"
      className="w-28 h-28 rounded-full shadow-md object-contain aspect-auto"
    />
  ) : formData.logo ? (
    <img
      src={formData.logo}
      alt="Organization Logo"
      className="w-28 h-28 rounded-full shadow-md object-contain aspect-auto"
    />
  ) : (
    <div className="w-28 h-28 rounded-full shadow-md bg-red-400 flex items-center justify-center text-white text-3xl font-bold">
      {formData.companyName?.charAt(0) || "?"}
    </div>
  )}

  {/* Upload Button */}
  <button
    className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 shadow-md
      ${isUploading 
        ? "bg-gray-400 text-white cursor-not-allowed" 
        : "bg-[#3667B2] text-white hover:bg-[#274b8a] active:scale-95"}`}
    onClick={handleButtonClick}
    disabled={isUploading}
  >
    {isUploading ? "Uploading..." : "Change Logo"}
  </button>

  {/* Hidden File Input */}
  <input
    type="file"
    id="changeLogoInput"
    accept="image/*"
    onChange={handleFileChange}
    className="hidden"
  />
</div>

         
           {/* Branding Colors Section */}
           <div className="flex flex-col items-center justify-center">
             {/* Branding Colors Display */}
             <div className="flex flex-col items-center w-full">
               <h3 className="text-lg font-semibold text-gray-700 mb-2">Branding Colors</h3>
         
               <div className="flex w-full max-w-md h-10 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md">
                 {isLoading ? (
                   <p className="text-gray-500 flex items-center justify-center w-full">
                     Loading colors...
                   </p>
                 ) : (
                   brandingColors?.map((color, index) => (
                     <div
                       key={index}
                       className="h-full flex-1 transition-transform transform hover:scale-105"
                       style={{ backgroundColor: color }}
                     />
                   ))
                 )}
               </div>
         
               <button
                 className={`mt-4 px-5 py-2 border border-[#3667B2] text-[#3667B2] 
                   hover:bg-[#3667B2] hover:text-white font-medium rounded-lg transition 
                   ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                 onClick={() => !isLoading && setIsModalOpen(true)}
                 disabled={isLoading}
               >
                 Change Branding Colors
               </button>
             </div>
           </div>
         
           {/* Branding Color Picker Modal */}
           {isModalOpen && (
             <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
               <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-md">
                 <h2 className="text-xl font-bold text-center text-[#091220] mb-4">
                   Select Branding Colors
                 </h2>
         
                 <div className="space-y-4">
                   {/* Primary Color */}
                   <div className="grid grid-cols-3 items-center gap-4">
                     <label className="font-semibold text-gray-700">Primary Color:</label>
                     <input
                       type="text"
                       value={primaryColor}
                       onChange={(e) => setPrimaryColor(e.target.value)}
                       className="w-24 p-2 border border-gray-300 rounded-lg text-center shadow-sm focus:ring-2 focus:ring-[#3667B2] outline-none"
                     />
                     <div className="relative w-12 h-12">
                       <input
                         type="color"
                         value={primaryColor}
                         onChange={(e) => setPrimaryColor(e.target.value)}
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                       />
                       <div
                         className="w-12 h-12 rounded-full border border-gray-300 shadow-md cursor-pointer transition-transform hover:scale-110"
                         style={{ backgroundColor: primaryColor }}
                       />
                     </div>
                   </div>
         
                   {/* Secondary Color */}
                   <div className="grid grid-cols-3 items-center gap-4">
                     <label className="font-semibold text-gray-700">Secondary Color:</label>
                     <input
                       type="text"
                       value={secondaryColor}
                       onChange={(e) => setSecondaryColor(e.target.value)}
                       className="w-24 p-2 border border-gray-300 rounded-lg text-center shadow-sm focus:ring-2 focus:ring-[#3667B2] outline-none"
                     />
                     <div className="relative w-12 h-12">
                       <input
                         type="color"
                         value={secondaryColor}
                         onChange={(e) => setSecondaryColor(e.target.value)}
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                       />
                       <div
                         className="w-12 h-12 rounded-full border border-gray-300 shadow-md cursor-pointer transition-transform hover:scale-110"
                         style={{ backgroundColor: secondaryColor }}
                       />
                     </div>
                   </div>
                 </div>
         
                 {/* Modal Buttons */}
                 <div className="mt-6 flex justify-end space-x-4">
                   <button
                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                     onClick={() => setIsModalOpen(false)}
                   >
                     Cancel
                   </button>
                   <button
                     className="px-4 py-2 bg-[#3667B2] text-white rounded-lg hover:bg-[#274b8a] transition shadow-md"
                     onClick={() => {
                       handleSaveColors();
                       setIsModalOpen(false);
                     }}
                   >
                     Save
                   </button>
                 </div>
               </div>
             </div>
           )}
         </div>
         
                  

                )}

                
{activeTab === "branding" && (
  <div className="md:hidden grid grid-cols-1 gap-4">
    {/* Logo Upload Section */}
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 items-center border rounded-lg p-4">
        {/* Display Logo */}
        {logo && !isUploading ? (
          <img
            src={logo}
            alt="Organization Logo"
            className="w-24 h-24 rounded-full shadow-md object-contain aspect-auto"
          />
        ) : formData.logo ? (
          <img
            src={formData.logo}
            alt="Organization Logo"
            className="w-24 h-24 rounded-full shadow-md object-contain aspect-auto"
          />
        ) : (
          <div className="w-24 h-24 rounded-full shadow-md bg-red-400 flex items-center justify-center text-white text-3xl font-bold">
            {formData.companyName?.charAt(0) || "?"}
          </div>
        )}
        
        {/* Change Logo Button */}
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

    {/* Branding Colors Section */}
    <div>
      <div className="flex items-center relative">
        <label className="font-semibold text-gray-700">Branding Colors</label>
      </div>
  
      {/* Branding Colors Display */}
      <div className="flex justify-between items-center gap-2 lg:gap-0 mt-4 w-full">
        
        {/* Rectangular Color Strip */}
        <div className="flex w-2/3 h-10 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md">
          {isLoading ? (
            <p className="text-gray-500 flex items-center justify-center w-full">Loading colors...</p>
          ) : (
            brandingColors?.map((color, index) => (
              <div
                key={index}
                className="h-full flex-1 transition-transform transform hover:scale-105"
                style={{ backgroundColor: color }}
              />
            ))
          )}
        </div>
      
        {/* Change Colors Button */}
        <button
          className={`bg-white lg:h-[2.5rem] border-[#3667B2] border text-[#3667B2] 
          hover:bg-[#3667B2] hover:text-white text-xs  font-normal lg:text-base lg:font-medium px-4 py-2
          rounded-md active:scale-95 transition transform duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => !isLoading && setIsModalOpen(true)}
          disabled={isLoading}
        >
          Change Branding Colors
        </button>
      </div>
    </div>

    {/* Color Selection Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-md relative">
          <h2 className="text-xl font-bold text-[#091220] mb-4 text-center">
            Select Branding Colors
          </h2>

          <div className="space-y-4">
            {/* Primary Color */}
            <div className="grid grid-cols-3 items-center gap-2">
              <label className="font-semibold text-gray-700">Primary Color:</label>
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-24 p-2 border border-gray-300 rounded-lg text-center shadow-sm focus:ring-2 focus:ring-[#3667B2] outline-none"
              />
              <div className="relative w-12 h-12">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="w-12 h-12 rounded-full border border-gray-300 shadow-md cursor-pointer transition-transform hover:scale-110"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="grid grid-cols-3 items-center gap-2">
              <label className="font-semibold text-gray-700">Secondary Color:</label>
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-24 p-2 border border-gray-300 rounded-lg text-center shadow-sm focus:ring-2 focus:ring-[#3667B2] outline-none"
              />
              <div className="relative w-12 h-12">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="w-12 h-12 rounded-full border border-gray-300 shadow-md cursor-pointer transition-transform hover:scale-110"
                  style={{ backgroundColor: secondaryColor }}
                />
              </div>
            </div>
          </div>

          {/* Modal Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#3667B2] text-white rounded-lg hover:bg-[#274b8a] transition-all shadow-md"
              onClick={() => { handleSaveColors(); setIsModalOpen(false); }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}

          </div>
          
          <div>
          {activeTab === "contact" && (
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
          )}
          </div>
          <div className="flex flex-col lg:flex-row justify-end mt-4 lg:gap-x-2 p-4 border-t">
            <button
              onClick={handleUpdate}
              disabled={isButtonDisabled() }
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
