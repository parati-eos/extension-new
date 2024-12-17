import axios from 'axios'
import { useState, useRef, useEffect } from 'react'
import { FaPaperclip, FaPlus } from 'react-icons/fa'
import AttachImage from './shared/attachimage'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../../../types/presentationView'
import { toast } from 'react-toastify'

interface StatisticProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
}

export default function Statistics({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
}: StatisticProps) {
  const [title, setTitle] = useState([''])
  const [description, setDescription] = useState([''])
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isRowAdded, setIsRowAdded] = useState(false) // Flag to track new row addition

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

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isRowAdded && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight // Scroll only when a new row is added
      setIsRowAdded(false) // Reset the flag to prevent further scrolling
    }
  }, [isRowAdded]) // Dependency only on isRowAdded

  const addNewPoint = () => {
    if (title.length < 6) {
      setTitle([...title, ''])
      setDescription([...description, ''])
      setIsRowAdded(true) // Set flag to trigger scrolling
    }
  }

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
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/statistics`,
        {
          type: 'statistics',
          title: heading,
          documentID: documentID,
          data: {
            slideName: heading,
            stats: title.slice(1).map((label, index) => ({
              label,
              value: Number(description[index + 1] || 0),
            })),
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
      toast.error('Error generating slide', {
        position: 'top-center',
        autoClose: 2000,
      })
      alert('Failed to generate slide.')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (file: File | null) => {
    setSelectedImage(file)
  }

  const onBack = () => {
    setDisplayMode('customBuilder')
  }

  return (
    <div className="flex flex-col  p-2 lg:p-4 w-full h-full">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Top Section: Headings */}
          <div className="flex lg:mt-2 items-center justify-between  md:px-4">
            <h2 className="hidden md:block md:text-lg font-semibold text-[#091220]">
              {heading}
            </h2>
            <BackButton onClick={onBack} />
          </div>

          {/* Content container with flex-grow */}
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto  lg:w-[65%]"
          >
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
                  placeholder={`Enter Data label ${index + 1}`}
                  className="lg:ml-1 flex-1 lg:w-[65%] w-1/2 lg:px-6  lg:py-4 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={description[index]}
                  onChange={(e) =>
                    handleInputDescription(e.target.value, index)
                  }
                  placeholder={`Enter value ${index + 1}`}
                  className="lg:ml-2 flex-1 lg:w-[65%] w-1/2 lg:px-6   lg:py-4 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            {title.length < 6 && (
              <button
                onClick={addNewPoint}
                type="button"
                disabled={isAddDisabled}
                className={`flex items-center justify-center py-2 px-4 rounded-md mt-4 ml-4 md:border md:border-gray-300 md:rounded-lg  text-[#5D5F61] ${
                  title.length >= 6 || isAddDisabled
                    ? 'bg-[#E1E3E5] text-[#5D5F61] cursor-not-allowed'
                    : 'bg-white text-[#5D5F61] hover:bg-[#3667B2] hover:text-white'
                } `}
              >
                <FaPlus className="h-4 w-4 mr-2" />
                <span>Add Data</span>
              </button>
            )}
          </div>

          <div className="hidden mt-auto gap-2 lg:flex w-full px-2 justify-between lg:justify-end lg:w-auto lg:gap-4">
            <AttachImage onFileSelected={handleFileSelect} />
            <button
              onClick={handleGenerateSlide}
              disabled={isGenerateDisabled || loading}
              className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md transition-all duration-200 transform active:scale-95 ${
                isGenerateDisabled || loading
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#3667B2] text-white hover:bg-[#2c56a0] hover:shadow-lg'
              }`}
            >
              {loading ? 'Generating...' : 'Generate Slide'}
            </button>
          </div>

          <div className="flex lg:hidden mt-4 gap-2 w-full justify-center">
            <div className="flex-1 flex items-center justify-evenly text-[#5D5F61] p-1 border border-gray-300 rounded-md focus:outline-none cursor-pointer">
              <FaPaperclip />
              <label htmlFor="fileInput" className="cursor-pointer">
                Attach Image
              </label>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              />
            </div>

            <button
              onClick={handleGenerateSlide}
              disabled={isGenerateDisabled}
              className={`flex-1 py-2 rounded-md text-sm font-medium ${
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
