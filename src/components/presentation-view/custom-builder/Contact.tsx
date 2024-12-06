import { useState } from 'react'
import { FaPaperclip } from 'react-icons/fa'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../ViewPresentation'

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

  const isButtonDisabled = !(websiteLink || email || phone || linkedin)

  const handleSubmit = async () => {
    const payload = {
      websiteLink,
      email,
      phone,
      linkedin,
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to submit contact details')
      }

      console.log('Contact details submitted successfully')
    } catch (error) {
      console.error(error)
    }
  }

  const onBack = () => {
    setDisplayMode('customBuilder')
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
      <div className="flex-1 overflow-y-auto lg:w-[65%] space-y-4 mt-6">
        {/* Input fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={websiteLink}
            onChange={(e) => setWebsiteLink(e.target.value)}
            placeholder="Website link"
            className="p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone"
            className="p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="Linkedin profile link"
            className="p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Attach Image Button */}
        <button className="p-3 flex items-center lg:w-[49%] border border-gray-300 rounded-lg">
          <div className="flex items-center ml-1">
            <FaPaperclip className="mr-2" />
            <span>Attach Image</span>
          </div>
        </button>
      </div>

      {/* Generate Slide Button */}
      <button
        onClick={handleSubmit}
        disabled={isButtonDisabled}
        className={`absolute bottom-4 right-4 py-2 px-4 rounded-md ${
          isButtonDisabled
            ? 'bg-gray-400 text-gray-200'
            : 'bg-[#3667B2] text-white'
        }`}
      >
        Generate Slide
      </button>
    </div>
  )
}
