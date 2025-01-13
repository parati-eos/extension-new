import { useState } from 'react'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../../../types/presentationView'
import { toast } from 'react-toastify'
import AttachImage from './shared/attachimage'
import uploadLogoToS3 from '../../../utils/uploadLogoToS3'

interface ContactProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
  outlineID: string
  setIsSlideLoading: () => void
}

export default function Contact({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
  outlineID,
  setIsSlideLoading,
}: ContactProps) {
  const [websiteLink, setWebsiteLink] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const [uploadCompleted, setUploadCompleted] = useState(false) // Track if upload is completed
  const [errors, setErrors] = useState({
    websiteLink: '',
    email: '',
    phone: '',
    linkedin: '',
  })

  const validateWebsiteLink = () => {
    const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/
    if (websiteLink && !regex.test(websiteLink)) {
      setErrors((prev) => ({
        ...prev,
        websiteLink: 'Enter a valid website URL',
      }))
    } else {
      setErrors((prev) => ({ ...prev, websiteLink: '' }))
    }
  }

  const validateEmail = () => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (email && !regex.test(email)) {
      setErrors((prev) => ({ ...prev, email: 'Enter a valid email address' }))
    } else {
      setErrors((prev) => ({ ...prev, email: '' }))
    }
  }

  const validatePhone = () => {
    const regex = /^[1-9]\d{9}$/
    if (phone && !regex.test(phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: 'Enter a valid phone number (10 digits)',
      }))
    } else {
      setErrors((prev) => ({ ...prev, phone: '' }))
    }
  }

  const validateLinkedin = () => {
    const regex =
      /^https:\/\/(www\.)?linkedin\.com\/(in|company|pub)\/[a-zA-Z0-9_-]+(\/)?(\?.*)?$/
    if (linkedin && !regex.test(linkedin)) {
      setErrors((prev) => ({
        ...prev,
        linkedin: 'Enter a valid LinkedIn profile URL',
      }))
    } else {
      setErrors((prev) => ({ ...prev, linkedin: '' }))
    }
  }

  const isButtonDisabled =
    !(websiteLink || email || phone || linkedin) ||
    Object.values(errors).some((error) => error !== '')

  const handleSubmit = async () => {
    setIsSlideLoading()
    validateWebsiteLink()
    validateEmail()
    validatePhone()
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
        email,
        phone,
        linkedin,
        image: selectedImage || '',
      },
      outlineID: outlineID,
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/contact`,
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

      toast.success('Contact details submitted successfully', {
        position: 'top-right',
        autoClose: 3000,
      })
    } catch (error) {
      toast.error('Error while submitting data', {
        position: 'top-right',
        autoClose: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (file: File | null) => {
    setIsImageLoading(true)
    if (file) {
      try {
        const url = await uploadLogoToS3(file)
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

  const onBack = () => {
    setDisplayMode('newContent')
  }

  return (
    <div className="flex flex-col p-4 h-full w-full">
      {/* Heading */}
      <div className="flex items-center justify-between w-full">
        <h3 className="text-semibold">Contact</h3>
        <BackButton onClick={onBack} />
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
              onChange={(e) => setWebsiteLink(e.target.value)}
              onBlur={validateWebsiteLink}
              placeholder="Enter Website Link"
              className="p-4 border font-medium border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.websiteLink && (
              <p className="text-red-500 text-sm">{errors.websiteLink}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail}
              placeholder="Enter Email"
              className="p-4 border font-medium border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={validatePhone}
              placeholder="Enter Phone"
              className="p-4 border font-medium border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              onBlur={validateLinkedin}
              placeholder="LinkedIn Profile Link"
              className="p-4 border font-medium border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.linkedin && (
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
        />

        {/* Generate Slide Button */}
        <button
          onClick={handleSubmit}
          disabled={isButtonDisabled}
          className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md transition-all duration-200 transform flex items-center justify-center ${
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
      </div>
      {/* Attach Image and Generate Slide Buttons for Mobile */}
      <div className="flex lg:hidden mt-2 gap-2  w-full ">
        <div className="flex-1  items-center justify-center gap-2">
          <AttachImage
            onFileSelected={handleFileSelect}
            isLoading={isImageLoading}
            fileName={fileName}
            uploadCompleted={uploadCompleted}
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
      </div>
    </div>
  )
}
