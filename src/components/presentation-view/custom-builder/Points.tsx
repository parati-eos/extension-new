import { useState, useRef, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import axios from 'axios'
import AttachImage from '../../presentation-view/custom-builder/shared/attachimage'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../../../types/presentationView'
import { toast } from 'react-toastify'
import uploadLogoToS3 from '../../../utils/uploadLogoToS3'

interface PointsProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
  outlineID: string
  setIsSlideLoading: () => void
}

export default function Points({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
  outlineID,
  setIsSlideLoading,
}: PointsProps) {
  const [points, setPoints] = useState([''])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null) // Track file name
  const [uploadCompleted, setUploadCompleted] = useState(false) // Track if upload is completed

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

  const handleFileSelect = async (file: File | null) => {
    setIsImageLoading(true)
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
        setIsImageLoading(false)
      }
    }
  }

  const handleGenerateSlide = async () => {
    const storedOutlineIDs = sessionStorage.getItem('outlineIDs')
    if (storedOutlineIDs) {
      const outlineIDs = JSON.parse(storedOutlineIDs)

      // Check if currentOutlineID exists in the array
      if (outlineIDs.includes(outlineID)) {
        // Remove currentOutlineID from the array
        const updatedOutlineIDs = outlineIDs.filter(
          (id: string) => id !== outlineID
        )

        // Update the sessionStorage with the modified array
        sessionStorage.setItem('outlineIDs', JSON.stringify(updatedOutlineIDs))
      }
    }
    setIsSlideLoading()
    setIsLoading(true)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/points`,
        {
          type: 'Points',
          title: slideTitle,
          documentID: documentID,
          data: {
            slideName: heading,
            ...(selectedImage && { image: selectedImage }),
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
        toast.info('Data submitted successfully!', {
          position: 'top-right',
          autoClose: 3000,
        })
      }
      console.log('Server response:', response.data)
      setDisplayMode('slides')
    } catch (error) {
      toast.error('Error sending data', {
        position: 'top-right',
        autoClose: 3000,
      })
      toast.error('Failed to send data.', {
        position: 'top-right',
        autoClose: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onBack = () => {
    setDisplayMode('customBuilder')
  }


  const isScrollRequired = points.length >= (window.innerWidth >= 768 ? 3 : 1)
  const [slideTitle, setSlideTitle] = useState(''); // Local state for slide title
  const isGenerateDisabled = points.every((point) => point.trim() === '') || !slideTitle.trim();

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
            {/* Editable Slide Title */}
            <div >
            <input
              type="text"
              value={slideTitle}
              onChange={(e) => setSlideTitle(e.target.value)}
              placeholder="Add Slide Title"
              className="md:text-lg font-semibold text-[#091220] w-full bg-transparent focus:outline-none focus:ring-0 placeholder-gray-400"
            />
          </div>
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
            <AttachImage
              onFileSelected={handleFileSelect}
              isLoading={isImageLoading}
              fileName={fileName}
              uploadCompleted={uploadCompleted}
            />

            {/* Generate Slide Button */}
            <button
              onClick={handleGenerateSlide}
              disabled={isGenerateDisabled || isLoading || isImageLoading}
              className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md transition-all duration-200 transform  ${
                isGenerateDisabled || isLoading || isImageLoading
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
              <AttachImage
                onFileSelected={handleFileSelect}
                isLoading={isImageLoading}
                fileName={fileName}
                uploadCompleted={uploadCompleted}
              />
            </div>

            <button
              onClick={handleGenerateSlide}
              disabled={isGenerateDisabled || isLoading || isImageLoading}
              className={`flex-1 py-2 rounded-md ${
                isGenerateDisabled || isLoading || isImageLoading
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
