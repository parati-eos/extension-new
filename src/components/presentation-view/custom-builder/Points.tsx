import { useState } from 'react'
import { FaPlus, FaPaperclip } from 'react-icons/fa'
import axios from 'axios'

interface PointsProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
}

export default function Points({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
}: PointsProps) {
  const [points, setPoints] = useState([''])
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (value: string, index: number) => {
    const updatedPoints = [...points]
    updatedPoints[index] = value
    setPoints(updatedPoints)
  }

  const addNewPoint = () => {
    if (points.length < 6) {
      setPoints([...points, ''])
    }
  }

  const handleGenerateSlide = async () => {
    setIsLoading(true)
    try {
      const response = await axios.patch('/api/points', { points }) // Replace with actual endpoint
      alert('Data successfully sent to the server!')
      console.log('Server response:', response.data)
    } catch (error) {
      console.error('Error sending data:', error)
      alert('Failed to send data.')
    } finally {
      setIsLoading(false)
    }
  }

  const isGenerateDisabled = points.every((point) => point.trim() === '')
  const isScrollRequired = points.length >= (window.innerWidth >= 768 ? 3 : 1)

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

      {/* Input Section with Scrolling */}
      <div
        className={`flex-1 overflow-y-auto px-4 ${
          isScrollRequired ? 'scrollbar' : ''
        }`}
        style={{
          maxHeight: window.innerWidth >= 768 ? '50vh' : '40vh',
        }}
      >
        {points.map((point, index) => (
          <div
            key={index}
            className={`flex flex-col items-center gap-2 mb-2 lg:mb-0 ${
              index === 0 ? 'lg:mt-14' : 'lg:mt-2'
            }`}
          >
            <input
              type="text"
              value={point}
              onChange={(e) => handleInputChange(e.target.value, index)}
              placeholder={`Enter Point ${index + 1}`}
              className="flex-1 w-full lg:py-4 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Render the "Add new point" button only under the last point */}
            {index === points.length - 1 &&
              points.length < 6 &&
              point.trim() !== '' && (
                <button
                  onClick={addNewPoint}
                  className="text-[#5D5F61] md:border md:border-gray-300 md:rounded-lg self-start flex p-2 gap-2 w-[80%] md:w-[17%] items-center md:justify-center h-10"
                >
                  <FaPlus className="text-[#000000]" />
                  <span>Add new point</span>
                </button>
              )}
          </div>
        ))}
      </div>

      {/* Button container adjustments for medium and large screens */}
      <div className="mt-auto gap-2 flex w-full px-4 justify-between lg:justify-end lg:w-auto lg:gap-4">
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
