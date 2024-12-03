import { useState } from 'react'
import { FaPlus, FaPaperclip } from 'react-icons/fa'

export default function Points() {
  const [points, setPoints] = useState([''])

  const handleInputChange = (value: string, index: number) => {
    const updatedPoints = [...points]
    updatedPoints[index] = value
    setPoints(updatedPoints)
  }

  const addNewPoint = () => {
    setPoints([...points, ''])
  }

  const isGenerateDisabled = points.every((point) => point.trim() === '')

  return (
    <div className="flex flex-col p-4 h-full">
      {/* Top Section: Headings */}
      <div className="flex lg:mt-2 items-center justify-between w-full px-4">
        <h2 className="hidden md:block md:text-lg font-semibold text-[#091220]">
          Points
        </h2>
        <button
          className="hidden md:block text-sm border border-[#8A8B8C] px-3 py-1 rounded-lg text-[#5D5F61] hover:underline"
          // onClick={handleBackClick}
        >
          Back
        </button>
      </div>

      {points.map((point, index) => (
        <div
          key={index}
          className={`flex flex-col items-center gap-2 px-4 mb-2 lg:mb-0 ${
            index === 0 ? 'lg:mt-14' : 'lg:mt-2'
          }`}
        >
          <input
            type="text"
            value={point}
            onChange={(e) => handleInputChange(e.target.value, index)}
            placeholder={`Enter Point ${index + 1}`}
            className="flex-1 w-full lg:py-5 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Render the "Add new point" button only under the last point */}
          {index === points.length - 1 && point.trim() !== '' && (
            <button
              onClick={addNewPoint}
              className="text-blue-500 flex gap-2 w-full items-center h-8 border border-gray-300 rounded-full"
            >
              <FaPlus />
              <span>Add new point</span>
            </button>
          )}
        </div>
      ))}

      {/* Button container adjustments for medium and large screens */}
      <div className="mt-auto gap-2 flex w-full px-4 justify-between lg:justify-end lg:w-auto lg:gap-4">
        <button className="flex w-[47%] lg:w-[180px] items-center justify-center gap-x-2 py-2 border border-gray-300 rounded-md text-gray-700 bg-white">
          <FaPaperclip />
          Attach Image
        </button>
        <button
          disabled={isGenerateDisabled}
          className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md ${
            isGenerateDisabled
              ? 'bg-gray-200 text-gray-500'
              : 'bg-[#3667B2] text-white'
          }`}
        >
          Generate Slide
        </button>
      </div>
    </div>
  )
}