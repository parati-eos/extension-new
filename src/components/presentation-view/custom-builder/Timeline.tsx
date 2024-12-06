import { useState } from 'react'
import { FaPaperclip } from 'react-icons/fa'
import axios from 'axios'
import AttachImage from '../../presentation-view/custom-builder/shared/attachimage' // Import AttachImage component

interface TimelineProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
}

export default function Timeline({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
}: TimelineProps) {
  const [title, setTitle] = useState([''])
  const [description, setDescription] = useState([''])
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null) // Add selected image state

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
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/phases`,
        {
          type: 'phases',
          title: heading,
          documentID: documentID,
          data: {
            slideName: heading,
            image: selectedImage ? selectedImage.name : '', // Pass image name if selected
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
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

  const handleFileSelect = (file: File | null) => {
    setSelectedImage(file)
  }

  return (
    <div className="flex flex-col p-4 h-full">
      <p className="hidden lg:block font-bold break-words ml-5">{heading}</p>
      {/* Content container with flex-grow */}
      <div className="flex-1 overflow-y-auto">
        {title.map((point, index) => (
          <div
            key={index}
            className={`flex flex-row gap-4 px-4 mb-2 lg:mb-0 ${
              index === 0 ? 'lg:mt-14' : 'lg:mt-2'
            }`}
          >
            <input
              type="text"
              value={title[index]}
              onChange={(e) => handleInputTitle(e.target.value, index)}
              placeholder={`Enter Timeline ${index + 1}`}
              className="lg:ml-2 flex-1 lg:w-[45%] lg:py-5 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={description[index]}
              onChange={(e) => handleInputDescription(e.target.value, index)}
              placeholder={`Enter Description ${index + 1}`}
              className="lg:ml-2 flex-1 lg:w-[45%] lg:py-5 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        {/* Conditionally render the "Add New Timeline" button only if less than 6 points */}
        {title.length < 6 && title[title.length - 1].trim() !== '' && (
          <button
            onClick={addNewPoint}
            type="button"
            disabled={isAddDisabled}
            className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md mt-2 ml-6 hover:bg-[#3667B2] text-white ${
              title.length >= 6 || isAddDisabled
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#3667B2]'
            }`}
          >
            Add New Timeline
          </button>
        )}
      </div>

      {/* Attach Image and Generate Slide Buttons */}
      <div className="mt-auto gap-2 flex w-full px-4 justify-between lg:justify-end lg:w-auto lg:gap-4">
        {/* Attach Image Section */}
        <AttachImage onFileSelected={handleFileSelect} />

        {/* Generate Slide Button */}
        <button
          onClick={handleGenerateSlide}
          disabled={isGenerateDisabled || loading}
          className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md ${
            isGenerateDisabled || loading
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-[#3667B2] text-white'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Slide'}
        </button>
      </div>
    </div>
  )
}
