import axios from 'axios'
import { useState } from 'react'
import { FaPaperclip, FaPlus } from 'react-icons/fa'

interface StatisticProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
}

export default function Statistics({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
}: StatisticProps) {
  const [title, setTitle] = useState([''])
  const [description, setDescription] = useState([''])
  const [loading, setLoading] = useState(false)

  const handleInputTitle = (value: string, index: number) => {
    const updatedPoints = [...title]
    updatedPoints[index] = value
    setTitle(updatedPoints)
  }

  const handleInputDescription = (value: string, index: number) => {
    const updatedPoints = [...description]
    updatedPoints[index] = value
    setDescription(updatedPoints)
  }

  const addNewPoint = () => {
    if (title.length < 6) {
      setTitle([...title, ''])
      setDescription([...description, ''])
    }
  }

  // Disable "Add New Timeline" button if the last title or description is empty
  const isAddDisabled =
    title[title.length - 1].trim() === '' ||
    description[description.length - 1].trim() === ''

  const isGenerateDisabled = title.some(
    (point, index) => point.trim() === '' || description[index].trim() === ''
  )

  const handleGenerateSlide = async () => {
    setLoading(true)
    try {
      const payload = title.map((t, index) => ({
        title: title,
        description: description,
      }))

      // Dummy PATCH request
      const response = await axios.patch(
        'https://jsonplaceholder.typicode.com/posts/1', // Dummy URL
        { timelineData: payload }
      )

      console.log('PATCH Response:', response.data)
      alert('Slide generated successfully!')
    } catch (error) {
      console.error('Error generating slide:', error)
      alert('Failed to generate slide.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col p-4 h-full">
      <div className="flex lg:mt-2 items-center justify-between w-full px-4">
        <h2 className="hidden md:block md:text-lg font-semibold text-[#091220]">
          {heading}
        </h2>
        <button
          className="hidden md:block text-sm border border-[#8A8B8C] px-3 py-1 rounded-lg text-[#5D5F61] hover:underline"
          // onClick={handleBackClick}
        >
          Back
        </button>
      </div>
      {/* Content container with flex-grow */}
      <div className="flex-1 overflow-y-auto lg:w-[65%]">
        {title.map((point, index) => (
          <div
            key={index}
            className={`flex  gap-2 px-3 mb-2 lg:mb-0 ${
              index === 0 ? 'lg:mt-14' : 'lg:mt-2'
            }`}
          >
            <input
              type="text"
              value={title[index]}
              onChange={(e) => handleInputTitle(e.target.value, index)}
              placeholder={'Enter Data label'}
              className="lg:ml-1 flex-1 lg:w-[65%] lg:px-6 lg:py-4 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={description[index]}
              onChange={(e) => handleInputDescription(e.target.value, index)}
              placeholder={'Enter value'}
              className="lg:ml-2 flex-1 lg:w-[65%] lg:px-6 lg:py-5 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        {/* Add New Timeline Button */}

        <button
          onClick={addNewPoint}
          type="button"
          disabled={title.length >= 6 || isAddDisabled}
          className={`flex items-center justify-center py-2 px-4 rounded-md mt-4 ml-4 border border-gray-300 ${
            title.length >= 6 || isAddDisabled
              ? 'bg-white cursor-not-allowed'
              : 'bg-white hover:bg-gray-100'
          } lg:w-[149px] lg:h-[48px]`}
        >
          <FaPlus className="h-4 w-4 mr-2 text-black" />
          <span className="text-[#5D5F61] font-medium">Add Data</span>
        </button>
      </div>

      {/* Button container at the bottom */}
      <div className="mt-auto gap-2 flex w-full px-4 justify-between lg:justify-end lg:w-auto lg:gap-4">
        <button className="flex w-[47%] lg:w-[180px] items-center justify-center gap-x-2 py-2 border border-gray-300 rounded-md text-gray-700 bg-white">
          <FaPaperclip />
          Attach Image
        </button>
        <button
          disabled={isGenerateDisabled}
          onClick={handleGenerateSlide}
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
