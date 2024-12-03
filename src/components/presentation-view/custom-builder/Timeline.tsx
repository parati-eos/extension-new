import { useState } from 'react'
import { FaPaperclip } from 'react-icons/fa'

export default function Timeline() {
  const [title, setTitle] = useState([''])
  const [description, setDescription] = useState([''])

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
  const isAddDisabled = title[title.length - 1].trim() === '' || description[description.length - 1].trim() === ''

  const isGenerateDisabled = title.some((point, index) => point.trim() === '' || description[index].trim() === '')

  return (
    <div className="flex flex-col p-4 h-full">
         <p className="hidden lg:block font-bold break-words ml-5">Phases</p>
      {/* Content container with flex-grow */}
      <div className="flex-1 overflow-y-auto">
        {title.map((point, index) => (
          <div
            key={index}
            className={`flex flex-col gap-2 px-4 mb-2 lg:mb-0 ${
              index === 0 ? 'lg:mt-14' : 'lg:mt-2'
            }`}
          >
            <input
              type="text"
              value={title[index]}
              onChange={(e) => handleInputTitle(e.target.value, index)}
              placeholder={'Enter timeline name'}
              className="lg:ml-2 flex-1 lg:w-[65%] lg:py-5 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={description[index]}
              onChange={(e) => handleInputDescription(e.target.value, index)}
              placeholder={'Enter description of timeline'}
              className="lg:ml-2 flex-1 lg:w-[65%] lg:py-5 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        {/* Add New Timeline Button */}
        <button
          onClick={addNewPoint}
          type="button"
          disabled={title.length >= 6 || isAddDisabled}
          className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md mt-2 ml-6 hover:bg-blue-500 text-white ${
            title.length >= 6 || isAddDisabled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-[#3667B2]'
          }`}
        >
          Add New Timeline
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
