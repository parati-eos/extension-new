import { useState, useEffect } from 'react'
import { BackButton } from './BackButton'
import { DisplayMode } from './presentationView'
import { toast } from 'react-toastify'
import axios from 'axios'
import AttachImage from './attachimage'
import uploadFileToS3 from './uploadfiletoS3'
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

interface ContactProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
  outlineID: string
  setIsSlideLoading: () => void
  setFailed: () => void
  handleBack: () => void
}

interface PhoneChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

interface EmailChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

export default function Contact({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
  outlineID,
  setIsSlideLoading,
  setFailed,
  handleBack,
}: ContactProps) {
  const [websiteLink, setWebsiteLink] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null) // Track file name
  const [uploadCompleted, setUploadCompleted] = useState(false) // Track if upload is completed
  const [showTooltip, setShowTooltip] = useState(false)
  const inputStyles: React.CSSProperties = {
    width: "100%", // Default width for mobile
    height: "60px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    paddingLeft: "58px", // Space for flag
    outline: "none",
    backgroundColor: "white",
  };
    // Adjust width for larger screens
    const desktopStyles: React.CSSProperties = {
      ...inputStyles,
      width: "100%", // Increase width for desktop
    };
  const buttonStyle: React.CSSProperties = {
    border: "0.8px solid #ddd",
    backgroundColor: "white",
  };


  const [errors, setErrors] = useState({
    websiteLink: '',
    email: '',
    phone: '',
    linkedin: '',
  })

  const handleEmailChange = (e: EmailChangeEvent) => {
    const value = e.target.value
    setEmail(value)
    validateEmail() // Validate on every change
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!websiteLink) {
      setWebsiteLink('https://') // Pre-fill "https://" if empty
    }
  }
 
  
  
  
 

  const handleLinkedinFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!linkedin) {
      setLinkedin('https://') // Pre-fill "https://" if empty
    }
  }

  const handleLinkedinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.value

    // Allow backspace to completely clear the input
    if (updatedValue === '') {
      setLinkedin('') // Allow clearing the field
      validateLinkedin() // Validate empty value
      return
    }

    setLinkedin(updatedValue) // Update LinkedIn link state
    validateLinkedin() // Call validation
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.value

    // Allow backspace to completely clear the input
    if (updatedValue === '') {
      setWebsiteLink('') // Allow clearing the field
      validateWebsiteLink('') // Validate empty value
      return
    }

    setWebsiteLink(updatedValue) // Update website link state
    validateWebsiteLink(updatedValue) // Call validation
  }

  const validateWebsiteLink = (link: string) => {
    const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/
    if (link && !regex.test(link)) {
      setErrors((prev) => ({
        ...prev,
        websiteLink: 'Enter a valid website URL',
      }))
    } else {
      setErrors((prev) => ({ ...prev, websiteLink: '' }))
    }
  }

  const validateEmail = (value: string = email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (value && !regex.test(value)) {
      setErrors((prev) => ({ ...prev, email: 'Enter a valid email address' }))
    } else {
      setErrors((prev) => ({ ...prev, email: '' }))
    }
  }

  const validateLinkedin = (value: string = linkedin) => {
    const regex =
      /^https:\/\/(www\.)?linkedin\.com\/(in|company|pub)\/[a-zA-Z0-9_-]+(\/)?(\?.*)?$/
    if (value && !regex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        linkedin: 'Enter a valid LinkedIn profile URL',
      }))
    } else {
      setErrors((prev) => ({ ...prev, linkedin: '' }))
    }
  }

  const isButtonDisabled =
    !email || // Ensure email is mandatory
    Object.values(errors).some((error) => error !== '') // Check for validation errors

  const handleSubmit = async () => {
    toast.info(`Request sent to a generate new version for ${heading}`, {
      position: 'top-right',
      autoClose: 3000,
    })

    setIsSlideLoading()
    validateWebsiteLink(websiteLink)
    validateEmail()
    setPhone(phone)
    validateLinkedin()

    if (isButtonDisabled) {
      return
    }
    setIsLoading(true)
    const payload = {
      type: 'Contact',
      title: heading,
      documentID: documentID,
      data: {
        slideName: heading,
        websiteLink,
        contactEmail: email,
        contactPhone: phone,
        linkedinLink: linkedin,
        image: selectedImage ? [selectedImage] : [],
      },
      outlineID: outlineID,
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/Contact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to submit contact details')
      }

      toast.success(`Data submitted successfully for ${heading}`, {
        position: 'top-right',
        autoClose: 3000,
      })
    } catch (error) {
      toast.error('Error submitting data!', {
        position: 'top-right',
        autoClose: 3000,
      })
      setFailed()
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (file: File | null) => {
    if (!file) {
      // If no file is provided (user removed image), reset states properly
      setIsImageLoading(false) // Ensure loading is stopped
      setSelectedImage(null)
      setUploadCompleted(false)
      setFileName(null)
      return
    }
    setIsImageLoading(true)
    if (file) {
      try {
        const uploadedFile = {
          name: file.name,
          type: file.type,
          body: file,
        }

        const url = await uploadFileToS3(uploadedFile)
        setSelectedImage(url)
        setFileName(file.name)
        setUploadCompleted(true)
      } catch (error) {
        toast.error('Error uploading image', {
          position: 'top-right',
          autoClose: 3000,
        })
      } finally {
        setIsImageLoading(false)
      }
    }
  }

  const handleMouseEnter = () => {
    if (isButtonDisabled) {
      setShowTooltip(true)
    }
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

  const fetchContactData = async () => {
    const payload = {
      type: 'Contact',
      title: heading,
      documentID,
      outlineID,
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/fetch-document/${orgId}/contact`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      if (response.status === 200) {
        const contactData = response.data

        // Set state based on the response data
        setWebsiteLink(contactData.websiteLink || '') // Ensure it handles missing data
        setEmail(contactData.contactEmail || '') // Ensure it handles missing data
        setPhone(contactData.contactPhone || '') // Ensure it handles missing data
        setLinkedin(contactData.linkedinLink || '') // Ensure it handles missing data

        // If there is an image array and it's not empty, set the first image
        if (contactData.image && contactData.image.length > 0) {
          setSelectedImage(contactData.image[0]) // Set first image from the array

        setFileName(contactData.image[0].split('/').pop())
          } else {
            setSelectedImage(null) // No image if array is empty
            setFileName(null)
          }

        // Run validations after fetching data
        validateWebsiteLink(contactData.websiteLink || '') // Validate fetched website link
        validateEmail(contactData.contactEmail || '') // Validate fetched email
        setPhone(contactData.contactPhone || '') // Validate fetched phone
        validateLinkedin(contactData.linkedinLink || '') // Validate fetched LinkedIn URL
      }
    } catch (error) {
      console.error('Error fetching contact data:', error)
    }
  }

  useEffect(() => {
    fetchContactData()
  }, [documentID, outlineID, orgId, heading, authToken]) // Dependency array ensures re-fetch when dependencies change
  return (
    <div className="flex flex-col p-4 h-full w-full">
      {/* Heading */}
      <div className="flex items-center justify-between w-full">
        <h3 className="text-semibold">Contact</h3>
        <BackButton onClick={handleBack} />
      </div>
      <h2 className="hidden lg:block md:text-lg font-semibold text-[#091220]">
        {heading}
      </h2>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto lg:w-[65%] scrollbar-none ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
          {/* Website Link */}
          <div>
            <input
              type="text"
              value={websiteLink}
              onFocus={handleInputFocus}
              onChange={handleInputChange}
              onBlur={() => validateWebsiteLink(websiteLink)} // Call with current value
              placeholder="Enter Website Link"
              className="p-4 border w-full font-medium border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.websiteLink && websiteLink.length !== 0 && (
              <p className="text-red-500 text-sm mt-1 lg:mt-0">
                {errors.websiteLink}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={(e) => validateEmail(e.target.value)} // Call with current value
              placeholder="Enter Email"
              className="p-4 border w-full font-medium border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
      
          </div>

          {/* Phone */}
          <div>
          <PhoneInput
  country={"in"}
  value={phone}
  onChange={setPhone}
  inputProps={{
    name: "phone",
    id: "phone",
    required: true,
  }}
  containerStyle={{
    width: "100%",
  }}
  inputStyle={window.innerWidth >= 1024 ? desktopStyles : inputStyles} // Adjust for responsive width
  buttonStyle={buttonStyle} // Apply button styles
  placeholder="Enter Company Phone" // ✅ Added placeholder
/>
            
          </div>

          {/* LinkedIn */}
          <div>
            <input
              type="url"
              value={linkedin}
              onChange={handleLinkedinChange}
              onFocus={handleLinkedinFocus}
              onBlur={(e) => validateLinkedin(e.target.value)}
              placeholder="LinkedIn Profile Link"
              className="p-4 border w-full font-medium border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.linkedin && linkedin.length !== 0 && (
              <p className="text-red-500 text-sm">{errors.linkedin}</p>
            )}
          </div>
        </div>

        {/* Attach Image Button */}
      </div>

      {/* Button container */}
      <div className="hidden mt-auto lg:flex w-full  justify-between lg:justify-end lg:w-auto lg:gap-4 gap-2">
        {/* Use AttachImage component */}
        <AttachImage
          onFileSelected={handleFileSelect}
          isLoading={isImageLoading}
          fileName={fileName}
          uploadCompleted={uploadCompleted}
          selectedImage={selectedImage}
        />
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Generate Slide Button */}
          <button
            onClick={handleSubmit}
            disabled={isButtonDisabled || isImageLoading}
            className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md transition-all duration-200 transform flex items-center justify-center ${
              isButtonDisabled || isImageLoading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#3667B2] text-white'
            }`}
          >
            {isLoading ? 'Loading...' : 'Generate Slide'}
          </button>
          {/* Tooltip for Desktop */}
          {showTooltip && !email && (
            <div className="absolute top-[-35px] left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-10">
              Please enter email address
            </div>
          )}
        </div>
      </div>
      {/* Attach Image and Generate Slide Buttons for Mobile */}
      <div
        className="flex lg:hidden mt-2 gap-2 w-full relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex-1 items-center justify-center gap-2">
          <AttachImage
            onFileSelected={handleFileSelect}
            isLoading={isImageLoading}
            fileName={fileName}
            uploadCompleted={uploadCompleted}
            selectedImage={selectedImage}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isButtonDisabled}
          className={`flex items-center justify-center flex-1 py-2 rounded-md transition-all duration-200 ${
            isButtonDisabled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-[#3667B2] text-white'
          }`}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div> // Spinner here
          ) : (
            'Generate Slide'
          )}
        </button>

        {/* Tooltip: Only show when email is not entered and tooltip is triggered */}
        {showTooltip && !email && (
          <span className="absolute  left-[52%] bottom-full mb-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-20">
            Please enter email address
          </span>
        )}
      </div>
    </div>
  )
}
