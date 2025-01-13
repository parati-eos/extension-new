import { useState, useRef, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import axios from 'axios'
import AttachImage from '../../presentation-view/custom-builder/shared/attachimage' // Import AttachImage component
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../../../types/presentationView'
import { toast } from 'react-toastify'
import uploadLogoToS3 from '../../../utils/uploadLogoToS3'

interface TimelineProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
  outlineID: string
  setIsSlideLoading: () => void
}

export default function Timeline({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
  outlineID,
  setIsSlideLoading,
}: TimelineProps) {
  const [timeline, setTimeline] = useState([''])
  const [description, setDescription] = useState([''])
  const [loading, setLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null) // Add selected image state
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null) // Track file name
  const [uploadCompleted, setUploadCompleted] = useState(false) // Track if upload is completed

  const handleInputTitle = (value: string, index: number) => {
    const updatedPoints = [...timeline]
    updatedPoints[index] = value
    setTimeline(updatedPoints)
  }
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [timeline])

  const handleInputDescription = (value: string, index: number) => {
    const updatedPoints = [...description]
    updatedPoints[index] = value
    setDescription(updatedPoints)
  }

  const addNewPoint = () => {
    if (timeline.length < 6) {
      setTimeline([...timeline, ''])
      setDescription([...description, ''])
    }
  }

  // Disable "Add New Timeline" button if the last title or description is empty
  const isAddDisabled =
    timeline[timeline.length - 1].trim() === '' ||
    description[description.length - 1].trim() === ''

  const isGenerateDisabled =
    timeline.filter(
      (point, index) => point.trim() !== '' && description[index].trim() !== ''
    ).length < 3

  const handleGenerateSlide = async () => {
    setIsSlideLoading()
    setLoading(true)
    try {
      const phases = timeline.map((point, index) => ({
        timeline: point,
        description: description[index],
      }))

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/phases`,
        {
          type: 'Phases',
          title: heading,
          documentID: documentID,
          data: {
            slideName: heading,
            ...(selectedImage && { image: selectedImage }),
            phases: phases,
          },
          outlineID: outlineID,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      console.log('PATCH Response:', response.data)
      toast.info('Data submitted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      })
      setDisplayMode('slides')
    } catch (error) {
      toast.error('Error generating slide', {
        position: 'top-right',
        autoClose: 3000,
      })
      toast.error('Failed to generate slide.', {
        position: 'top-right',
        autoClose: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (file: File | null) => {
    setIsLoading(true)
    if (file) {
      try {
        const url = await uploadLogoToS3(file)
        setSelectedImage(url)
        setUploadCompleted(true) // Mark upload as complete
        setFileName(file.name) // Set file name only after upload is completed
      } catch (error) {
        toast.error('Error uploading image', {
          position: 'top-right',
          autoClose: 3000,
        })
        setUploadCompleted(false) // Mark upload as failed
      } finally {
        setIsLoading(false)
      }
    }
  }

  const onBack = () => {
    setDisplayMode('customBuilder')
  }

  return (
    <div className="flex flex-col lg:p-4 p-2 h-full">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Top Section: Headings */}
          <div className="flex items-center justify-between w-full">
            <h3 className="text-semibold">Timeline</h3>
            <BackButton onClick={onBack} />
          </div>
          <h2 className="hidden lg:block md:text-lg font-semibold text-[#091220]">
            {heading}
          </h2>
          {/* Content container with flex-grow */}
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto scrollbar-none"
          >
            {timeline.map((point, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row gap-2 lg:gap-4 lg:px-2 py-2 lg:py-0 p-1 mb-2 lg:mb-0 ${
                  index === 0 ? 'lg:mt-14' : 'lg:mt-2'
                }`}
              >
                <input
                  type="text"
                  value={timeline[index]}
                  onChange={(e) => handleInputTitle(e.target.value, index)}
                  placeholder={`Enter Timeline ${index + 1}`}
                  className="flex-1 lg:ml-2 w-full lg:w-[25%] lg:py-5 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={description[index]}
                  onChange={(e) =>
                    handleInputDescription(e.target.value, index)
                  }
                  placeholder={`Enter Description ${index + 1}`}
                  className="lg:ml-2 w-full lg:w-[75%] lg:py-5 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            {/* Conditionally render the "Add New Timeline" button only if less than 6 points */}
            {timeline.length < 6 && (
              <button
                onClick={addNewPoint}
                type="button"
                disabled={isAddDisabled}
                className={`flex items-center p-2 gap-2 w-48 py-2 lg:rounded-md mt-4  ml-1 lg:ml-4 md:border md:border-gray-300 md:rounded-lg  text-[#5D5F61] ${
                  timeline.length >= 6 || isAddDisabled
                    ? 'bg-[#E1E3E5] text-[#5D5F61] cursor-not-allowed' // Disabled state
                    : 'bg-white text-[#5D5F61] hover:bg-[#3667B2] hover:text-white' // Active state
                }`}
              >
                <FaPlus />
                Add New Timeline
              </button>
            )}
          </div>

          {/* Attach Image and Generate Slide Large Screen Buttons */}
          <div className="hidden mt-auto gap-2 lg:flex w-full  justify-between lg:justify-end lg:w-auto lg:gap-4">
            {/* Attach Image Section */}
            <AttachImage
              onFileSelected={handleFileSelect}
              isLoading={isLoading}
              fileName={fileName}
              uploadCompleted={uploadCompleted}
            />
            <button
              onClick={(e) => {
                if (!isGenerateDisabled&&!isLoading) {
                  handleGenerateSlide()
                } else {
                  e.preventDefault() // Block click when disabled
                }
              }}
              onMouseEnter={() => isGenerateDisabled && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md transition-all duration-200 transform active:scale-95 ${
                isGenerateDisabled || loading||isLoading
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#3667B2] text-white hover:bg-[#2c56a0] hover:shadow-lg'
              }`}
            >
              {loading ? 'Generating...' : 'Generate Slide'}

              {/* Tooltip */}
              {isGenerateDisabled && showTooltip && (
                <span className="absolute top-[-35px] left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-10">
                  Minimum 3 timelines required
                </span>
              )}
            </button>
          </div>
          {/* Attach Image and Generate Slide Buttons for Mobile */}
          <div className="flex lg:hidden mt-2 gap-2  w-full">
            <div className="flex-1  items-center justify-center gap-2">
              {/* Attach Image Section */}
              <AttachImage
                onFileSelected={handleFileSelect}
                isLoading={isLoading}
                fileName={fileName}
                uploadCompleted={uploadCompleted}
              />
            </div>

            <button
              onClick={(e) => {
                if (!isGenerateDisabled&&!isLoading) {
                  handleGenerateSlide()
                } else {
                  e.preventDefault() // Prevent action when disabled
                }
              }}
              onMouseEnter={() => isGenerateDisabled && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className={`relative flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md duration-200 transform active:scale-95 ${
                isGenerateDisabled || loading || isLoading
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' // Disabled styles
                  : 'bg-[#3667B2] text-white hover:bg-[#2c56a0] hover:shadow-lg' // Enabled styles
              }`}
            >
              {loading ? 'Generating...' : 'Generate Slide'}

              {/* Tooltip */}
              {isGenerateDisabled && showTooltip && (
                <span className="absolute top-[-35px] left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-10">
                  Minimum 3 timelines required
                </span>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
