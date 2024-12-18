import { useState } from 'react'
import { FaPaperclip } from 'react-icons/fa'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../../../types/presentationView'
import { toast } from 'react-toastify'
import AttachImage from './shared/attachimage'

interface ContactProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
}

export default function Contact({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
}: ContactProps) {
  const [websiteLink, setWebsiteLink] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const isButtonDisabled = !(websiteLink || email || phone || linkedin)

  const handleSubmit = async () => {
    const payload = {
      type: 'contact',
      title: heading,
      documentID: documentID,
      data: {
        slideName: heading,
        websiteLink,
        email,
        phone,
        linkedin,
      },
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

      console.log('Contact details submitted successfully')
    } catch (error) {
      toast.error('Error while submitting data', {
        position: 'top-center',
        autoClose: 2000,
      })
    }
  }

  const handleFileSelect = (file: File | null) => {
    setSelectedImage(file)
  }
  const onBack = () => {
    setDisplayMode('newContent')
  }

  return (
    <div className="flex flex-col p-4 h-full w-full">
      {/* Heading */}
      <div className="flex items-center justify-between w-full mb-4">
        <h2 className="hidden md:block md:text-lg font-semibold text-[#091220]">
          {heading}
        </h2>
        <BackButton onClick={onBack} />
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto lg:w-[65%] scrollbar-none ">
        {/* Input fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
          <input
            type="text"
            value={websiteLink}
            onChange={(e) => setWebsiteLink(e.target.value)}
            placeholder="Website link"
            className="p-4 border font-medium  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="p-4 border font-medium border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone"
            className="p-4 border font-medium border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="Linkedin profile link"
            className="p-4 border font-medium border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Attach Image Button */}
        <div className="hidden  lg:flex w-full  justify-between lg:justify-start mt-2 lg:w-auto lg:gap-4 gap-2">
            {/* Use AttachImage component */}
            <AttachImage onFileSelected={handleFileSelect} />
            </div>
      </div>

      {/* Generate Slide Button */}
      <div className="hidden mt-auto lg:flex w-full  justify-between lg:justify-end lg:w-auto ">
            <button
              onClick={handleSubmit}
              disabled={isButtonDisabled}
              className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md transition-all duration-200 transform ${
                isButtonDisabled
                 ? 'bg-gray-200 text-gray-500'
                  : 'bg-[#3667B2] text-white'
              }`}
            >
              Generate Slide
            </button>
          </div>
           {/* Attach Image and Generate Slide Buttons for Mobile */}
           <div className="flex lg:hidden mt-2 gap-2  w-full ">
            <div className="flex-1  items-center justify-center gap-2">
            <AttachImage onFileSelected={handleFileSelect} />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isButtonDisabled}
              className={`flex-1 py-2 rounded-md ${
                isButtonDisabled
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#3667B2] text-white'
              }`}
            >
              Generate Slide
            </button>
          </div>
    </div>
  )
}
