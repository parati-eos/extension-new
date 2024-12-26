import { useState, useRef, useEffect } from 'react'
import { FaPaperclip, FaPlus } from 'react-icons/fa'
import axios from 'axios'
import AttachImage from '../../presentation-view/custom-builder/shared/attachimage'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../../../types/presentationView'
import { toast } from 'react-toastify'

interface PointsProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
  outlineID: string
}

export default function Points({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
  outlineID,
}: PointsProps) {
  const [points, setPoints] = useState([''])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const handleInputChange = (value: string, index: number) => {
    const updatedPoints = [...points]
    updatedPoints[index] = value
    setPoints(updatedPoints)
  }
  const containerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [points])

  const addNewPoint = () => {
    if (points.length < 6) {
      setPoints([...points, ''])
    }
  }

  const handleFileSelect = (file: File | null) => {
    setSelectedImage(file)
  }

  const handleGenerateSlide = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/points`,
        {
          type: 'points',
          title: heading,
          documentID: documentID,
          data: {
            slideName: heading,
            image: selectedImage ? selectedImage.name : '',
            pointers: points.filter((point) => point.trim() !== ''),
          },
          outlineID: outlineID,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      if (response.status === 200) {
        toast.success('Data successfully sent to the server!')
      }
      console.log('Server response:', response.data)
      setDisplayMode('slides')
    } catch (error) {
      toast.error('Error sending data', {
        position: 'top-center',
        autoClose: 2000,
      })
      toast.error('Failed to send data.')
    } finally {
      setIsLoading(false)
    }
  }

  const onBack = () => {
    setDisplayMode('customBuilder')
  }

  const isGenerateDisabled = points.every((point) => point.trim() === '')
  const isScrollRequired = points.length >= (window.innerWidth >= 768 ? 3 : 1)

  return (
    <div className="flex flex-col lg:p-4 p-2 h-full">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Top Section: Headings */}
          <div className="flex items-center justify-between w-full">
            <h3 className="text-semibold">Points</h3>
            <BackButton onClick={onBack} />
          </div>
          <h2 className="hidden lg:block md:text-lg font-semibold text-[#091220]">
            {heading}
          </h2>
          {/* Input Section with Scrolling */}
          <div
            ref={containerRef}
            className={`flex-1 overflow-y-auto  ${
              isScrollRequired ? 'scrollbar-none' : ''
            }`}
            style={{
              maxHeight: window.innerWidth >= 768 ? '70vh' : '40vh',
            }}
          >
            {points.map((point, index) => (
              <div
                key={index}
                className={`flex flex-col items-center gap-2 mb-2 lg:mb-0 p-1 ${
                  index === 0 ? 'lg:mt-14' : 'lg:mt-2'
                }`}
              >
                <input
                  type="text"
                  value={point}
                  onChange={(e) => handleInputChange(e.target.value, index)}
                  placeholder={`Enter Point ${index + 1}`}
                  className="hidden lg:block flex-1 w-full lg:py-4 p-2   border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Mobile View Input */}
                <input
                  type="text"
                  value={point}
                  onChange={(e) => handleInputChange(e.target.value, index)}
                  placeholder={`Enter Point ${index + 1}`}
                  className="lg:hidden mb-2  w-full text-[#5D5F61] p-3 mt-2 border  border-[#8A8B8C] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Render the "Add new point" button only under the last point */}
                {/* Add New Point Button */}
                {index === points.length - 1 && points.length < 6 && (
                  <button
                    onClick={addNewPoint}
                    className={`text-[#5D5F61] md:border md:border-gray-300 md:rounded-lg self-start flex p-2 gap-2   items-center md:justify-center h-10 lg:mt-4 ${
                      point.trim() === ''
                        ? 'bg-[#E1E3E5] text-[#5D5F61] cursor-not-allowed' // Disabled state
                        : 'bg-white text-[#5D5F61] hover:bg-[#3667B2] hover:text-white' // Active state
                    }`}
                    disabled={point.trim() === ''} // Prevent adding a new point if the current input is empty
                  >
                    <FaPlus />
                    <span>Add new point</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Button container */}
          <div className="hidden mt-auto lg:flex w-full  justify-between lg:justify-end lg:w-auto lg:gap-4 gap-2">
            {/* Use AttachImage component */}
            <AttachImage onFileSelected={handleFileSelect} />

            {/* Generate Slide Button */}
            <button
              onClick={handleGenerateSlide}
              disabled={isGenerateDisabled || isLoading}
              className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md transition-all duration-200 transform  ${
                isGenerateDisabled || isLoading
                  ? 'bg-gray-200 text-gray-500'
                  : 'bg-[#3667B2] text-white'
              }`}
            >
              {isLoading ? 'Loading...' : 'Generate Slide'}
            </button>
          </div>
          {/* Attach Image and Generate Slide Buttons for Mobile */}
          <div className="flex lg:hidden mt-2 gap-2  w-full ">
            <div className="flex-1  items-center justify-center gap-2">
              <AttachImage onFileSelected={handleFileSelect} />
            </div>

            <button
              onClick={handleGenerateSlide}
              disabled={isGenerateDisabled}
              className={`flex-1 py-2 rounded-md ${
                isGenerateDisabled
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#3667B2] text-white'
              }`}
            >
              Generate Slide
            </button>
          </div>
        </>
      )}
    </div>
  )
}
