import { useState, useEffect } from 'react'
import { FaPaperclip } from 'react-icons/fa'
import axios from 'axios'
import { BackButton } from './custom-builder/shared/BackButton'
import { DisplayMode } from './ViewPresentation'
import { useState, useEffect } from 'react'
import axios from 'axios'
import AttachImage from '../presentation-view/custom-builder/shared/attachimage' // Import AttachImage component

interface SlideNarrativeProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
}

export default function SlideNarrative({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
}: SlideNarrativeProps) {
  const [narrative, setNarrative] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null) // Track the attached image
  const handleFileSelect = (file: File | null) => {
    setSelectedImage(file)
  }

  const handleGenerateSlide = async () => {
    if (!narrative.trim()) return
    setIsLoading(true)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidenarrative/generate-document/${orgId}/${slideType}`,
        {
          type: slideType,
          title: heading,
          documentID: documentID,
          input: narrative,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      console.log('Server response:', response.data)
      if (response.data === 'ok') {
        setNarrative('')
        alert('Success')
      }
    } catch (error) {
      console.error('Error sending narrative:', error)
      alert('Failed to send narrative.')
    } finally {
      setIsLoading(false)
    }
  }

  const isGenerateDisabled = narrative.trim() === ''

  const onBack = () => {
    setDisplayMode('newContent')
  }
  const isGenerateDisabled = narrative.trim() === ''

  return (
    <div className="flex flex-col p-4 h-full">
      {/* Top Section: Headings */}
      <div className="flex lg:mt-2 items-center justify-between w-full px-4">
        <h2 className="hidden md:block md:text-lg font-semibold text-[#091220]">
          {heading}
        </h2>
        <BackButton onClick={onBack} />
      </div>

      {/* Input Section */}
      <div className="flex-1 overflow-y-auto px-1">
        <div className="flex flex-col items-center gap-2 mb-2 lg:mb-0 lg:mt-14">
          <textarea
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder="Please provide some context and narrative to generate this slide."
            className="w-full max-w-full p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              height: window.innerWidth >= 1024 ? '380px' : 'auto', // Larger height for large screens
              maxWidth: window.innerWidth >= 1024 ? '970px' : '100%', // Larger width for large screens
              resize: 'vertical', // Allow manual resizing vertically
            }}
          ></textarea>
        </div>
      </div>

      {/* Button container adjustments for medium and large screens */}
      {/* Attach Image and Generate Slide Buttons */}
      <div className="mt-auto gap-2 flex w-full px-4 justify-between lg:justify-end lg:w-auto lg:gap-4">
        {/* Attach Image Section */}
        <AttachImage onFileSelected={handleFileSelect} />

        {/* Generate Slide Button */}
        <button
          onClick={handleGenerateSlide}
          disabled={isGenerateDisabled}
          className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md ${
            isGenerateDisabled
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
