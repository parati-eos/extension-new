import { useState, useEffect } from 'react'
import { FaPaperclip } from 'react-icons/fa'
import axios from 'axios'

interface SlideNarrativeProps {
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
}: SlideNarrativeProps) {
  const [narrative, setNarrative] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rows, setRows] = useState(4)

  useEffect(() => {
    const updateRows = () => {
      setRows(window.innerWidth >= 768 ? 8 : 7)
    }

    updateRows() // Set initial rows value based on screen width
    window.addEventListener('resize', updateRows)

    return () => {
      window.removeEventListener('resize', updateRows)
    }
  }, [])

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

  return (
    <div className="flex flex-col p-4 h-full">
      {/* Top Section: Headings */}
      <div className="flex lg:mt-2 items-center justify-between w-full px-4">
        <h2 className="hidden md:block md:text-lg font-semibold text-[#091220]">
          {heading}
        </h2>
        <button className="hidden md:block text-sm border border-[#8A8B8C] px-3 py-1 rounded-lg text-[#5D5F61] hover:underline">
          Back
        </button>
      </div>

      {/* Input Section */}
      <div
        className="flex-1 overflow-y-auto px-1"
        style={{
          maxHeight: window.innerWidth >= 768 ? '50vh' : '40vh',
        }}
      >
        <div className="flex flex-col items-center gap-2 mb-2 lg:mb-0 lg:mt-14">
          <textarea
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder="Please provide some context and narrative to generate this slide."
            className="flex-1 w-full lg:py-4 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={rows}
          ></textarea>
        </div>
      </div>

      {/* Button container adjustments for medium and large screens */}
      <div className="mt-4 md:mt-auto gap-2 flex w-full px-4 justify-between lg:justify-end lg:w-auto lg:gap-4">
        <button className="flex w-[47%] lg:w-[180px] items-center justify-center gap-x-2 py-2 border border-gray-300 rounded-md text-gray-700 bg-white">
          <FaPaperclip />
          Attach Image
        </button>
        <button
          onClick={handleGenerateSlide}
          disabled={isGenerateDisabled || isLoading}
          className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md ${
            isGenerateDisabled || isLoading
              ? 'bg-gray-200 text-gray-500'
              : 'bg-[#3667B2] text-white'
          }`}
        >
          {isLoading ? 'Loading...' : 'Generate Slide'}
        </button>
      </div>
    </div>
  )
}
