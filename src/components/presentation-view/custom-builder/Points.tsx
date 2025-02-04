import { useState, useRef, useEffect } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa'
import axios from 'axios'
import AttachImage from '../../presentation-view/custom-builder/shared/attachimage'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../../../types/presentationView'
import { toast } from 'react-toastify'
import uploadFileToS3 from '../../../utils/uploadFileToS3'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'

interface PointsProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
  outlineID: string
  setIsSlideLoading: () => void
  setFailed: () => void
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
  setFailed,
}: PointsProps) {
  const [points, setPoints] = useState([''])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null) // Track file name
  const [uploadCompleted, setUploadCompleted] = useState(false) // Track if upload is completed
  const [showTooltip, setShowTooltip] = useState(false) // Tooltip visibility state
  const [refineLoadingStates, setRefineLoadingStates] = useState<boolean[]>(
    new Array(points.length).fill(false)
  )
  const [refineLoadingSlideTitle, setRefineLoadingSlideTitle] = useState(false) // State for slideTitle loader
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isInitialDataLoad, setIsInitialDataLoad] = useState(true)
  const isScrollRequired = points.length >= (window.innerWidth >= 768 ? 3 : 1)
  const [slideTitle, setSlideTitle] = useState('') // Local state for slide title
  const isGenerateDisabled =
    points.every((point) => point.trim() === '') || !slideTitle.trim()
  const [focusedInput, setFocusedInput] = useState<number | null>(null) // Define focusedInput

  const handleInputChange = (value: string, index: number) => {
    if (value.length <= 150) {
      const updatedPoints = [...points]
      updatedPoints[index] = value
      setPoints(updatedPoints)
    }
  }

  const addNewPoint = () => {
    if (points.length < 6) {
      setIsInitialDataLoad(false) // Ensure we scroll to bottom for new points

      setPoints([...points, ''])
    }
  }

  const handleFileSelect = async (file: File | null) => {
    setIsImageLoading(true)
    if (file) {
      try {
        const uploadedFile = {
          name: file.name,
          type: file.type,
          body: file,
        }
        const url = await uploadFileToS3(uploadedFile)
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
    toast.info(`Request sent to a generate new version for ${heading}`, {
      position: 'top-right',
      autoClose: 3000,
    })
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
        toast.info(`Data submitted successfully for ${heading}`, {
          position: 'top-right',
          autoClose: 3000,
        })
      }

      setDisplayMode('slides')
    } catch (error) {
      toast.error('Error submitting data!', {
        position: 'top-right',
        autoClose: 3000,
      })
      setFailed()
    } finally {
      setIsLoading(false)
    }
  }
  const removePoint = (index: number) => {
    if (points.length > 1) {
      setIsInitialDataLoad(false) // Ensure we scroll to bottom for new points
      setPoints(points.filter((_, i) => i !== index))
    }
  }

  const refineText = async (type: string, index?: number) => {
    const newRefineLoadingStates = [...refineLoadingStates]
    newRefineLoadingStates[index!] = true // Set loading for this specific index
    setRefineLoadingStates(newRefineLoadingStates)

    let textToRefine = ''

    if (type === 'slideTitle') {
      textToRefine = slideTitle
      setRefineLoadingSlideTitle(true) // Set loader state to true when refining slideTitle
    } else if (type === 'points' && index !== undefined) {
      textToRefine = points[index]
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/refineText`,
        {
          type: type,
          textToRefine: textToRefine,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      if (response.status === 200) {
        const refinedText = response.data.refinedText

        if (type === 'slideTitle') {
          setSlideTitle(refinedText)
        } else if (type === 'points' && index !== undefined) {
          const updatedPoints = [...points]
          updatedPoints[index] = refinedText
          setPoints(updatedPoints)
        }
      }
      newRefineLoadingStates[index!] = false // Stop loading for this specific index
      setRefineLoadingStates(newRefineLoadingStates)
      setRefineLoadingSlideTitle(false) // Set slideTitle loading state back to false
    } catch (error) {
      toast.error('Error refining text!', {
        position: 'top-right',
        autoClose: 3000,
      })
      newRefineLoadingStates[index!] = false // Stop loading for this specific index
      setRefineLoadingStates(newRefineLoadingStates)
      setRefineLoadingSlideTitle(false) // Set slideTitle loading state back to false
    }
  }

  const onBack = () => {
    setDisplayMode('customBuilder')
  }

  // Modified useEffect for scroll behavior
  useEffect(() => {
    if (containerRef.current) {
      if (!isInitialDataLoad) {
        // Only scroll to bottom when adding new points
        containerRef.current.scrollTop = containerRef.current.scrollHeight
      } else {
        // For initial data load, scroll to top
        requestAnimationFrame(() => {
          containerRef.current?.scrollTo({
            top: 0,
            behavior: 'instant',
          })
        })
      }
    }
  }, [points, isInitialDataLoad])

  useEffect(() => {
    const fetchSlideData = async () => {
      const payload = {
        type: 'Points',
        title: slideTitle, // Make sure this is defined in state
        documentID,
        outlineID,
      }

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/fetch-document/${orgId}/points`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )

        if (response.status === 200) {
          const slideData = response.data

          setIsInitialDataLoad(true)

          // Update states based on response data
          if (slideData.title) setSlideTitle(slideData.title) // Set slide title

          if (Array.isArray(slideData.pointers)) {
            setPoints(slideData.pointers)
          } // Set points

          if (Array.isArray(slideData.image) && slideData.image.length > 0) {
            setSelectedImage(slideData.image[0]) // If there's an image, set the first one
          } else {
            setSelectedImage(null) // No image if array is empty
          }

          if (slideData.externalData) {
            // Optionally, store externalData for further usage (if needed)
            console.log('External data:', slideData.externalData)
          }
        }
      } catch (error) {
        setIsInitialDataLoad(false)
      }
    }

    fetchSlideData() // Fetch data on mount
  }, [documentID, outlineID, orgId, authToken]) // Dependency array ensures re-fetch when dependencies change

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
          <div className="w-full p-1">
            <div className="relative">
              <input
                type="text"
                value={slideTitle}
                onChange={(e) => setSlideTitle(e.target.value)}
                placeholder="Add Slide Title"
                maxLength={25}
                className="border w-full mt-2 text-[#091220] md:text-lg rounded-md font-semibold bg-transparent p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {refineLoadingSlideTitle ? (
                <div className="absolute top-[55%] right-2 transform -translate-y-1/2 w-full h-full flex items-center justify-end">
                  <div className="w-4 h-4 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="absolute top-[55%] right-2 transform -translate-y-1/2">
                  <div className="relative group">
                    <FontAwesomeIcon
                      icon={faWandMagicSparkles}
                      onClick={() => refineText('slideTitle')}
                      className="hover:scale-105 hover:cursor-pointer active:scale-95 text-[#3667B2]"
                    />
                    {/* Tooltip */}
                    <span className="absolute top-[-35px] right-0 bg-black w-max text-white text-xs rounded px-2 py-1 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">
                      Click to refine text.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Input Section with Scrolling */}
          <div
            ref={containerRef}
            className={`flex-1 overflow-y-auto ${
              isScrollRequired ? 'scrollbar-none' : ''
            }`}
            style={{
              maxHeight: window.innerWidth >= 768 ? '70vh' : '40vh',
            }}
          >
            {points.map((point, index) => (
              <div
                key={index}
                className={`flex flex-col items-start px-1  lg:mb-0  ${
                  index === 0 ? 'lg:mt-2' : 'lg:mt-2'
                }`}
              >
                <div className="flex flex-row gap-2 w-full items-center">
                  <div className="relative hidden lg:block w-full">
                    <input
                      type="text"
                      value={point}
                      onBlur={() => setFocusedInput(null)} // Remove focus
                      onChange={(e) => handleInputChange(e.target.value, index)}
                      onFocus={(e) => {
                        setFocusedInput(index)
                        const input = e.target as HTMLInputElement // Explicitly cast EventTarget to HTMLInputElement
                        input.scrollLeft = input.scrollWidth // Scroll to the end on focus
                      }}
                      style={{
                        textOverflow: 'ellipsis', // Truncate text with dots
                        whiteSpace: 'nowrap', // Prevent text wrapping
                        overflow: 'hidden', // Hide overflowing text
                      }}
                      placeholder={`Enter Point ${index + 1}`}
                      className="flex-1 w-full lg:py-4 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                text-ellipsis overflow-hidden whitespace-nowrap pr-10" // Ensure padding for the icon
                    />
                    {refineLoadingStates[index] ? (
                      <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                        <div className="w-4 h-4 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div className="absolute top-1/2 right-2 transform -translate-y-1/2 ">
                        <div className="relative group">
                          <FontAwesomeIcon
                            icon={faWandMagicSparkles}
                            onClick={() => refineText('points', index)}
                            className="hover:scale-105 hover:cursor-pointer active:scale-95 text-[#3667B2]"
                          />
                          {/* Tooltip */}
                          <span className="absolute w-max top-[-25px] right-0 bg-black text-white text-xs rounded px-2 py-1 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">
                            Click to refine text.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removePoint(index)}
                    disabled={points.length <= 1} // Prevents removing if only 1 point remains
                    className={`${
                      points.length <= 1
                        ? 'text-gray-400 cursor-not-allowed' // Disabled state
                        : 'text-[#3667B2] hover:bg-red-100' // Active state
                    } bg-white hidden lg:flex items-center justify-center border border-[#E1E3E5] rounded-full w-6 h-6 p-2 transition`}
                  >
                    <FaMinus />
                  </button>
                </div>

                {/* Character Counter (outside the input container) */}
                <span
                  className={`hidden lg:block text-xs mt-1 ml-1 ${
                    focusedInput === index
                      ? points[index].length > 140
                        ? 'text-red-500'
                        : 'text-gray-500'
                      : 'invisible' // Hide text but reserve space
                  }`}
                >
                  {point.length}/150 characters
                </span>
                {/* Mobile View Input */}
                <div className="flex flex-row gap-2 w-full items-center">
                  <div className="relative lg:hidden w-full">
                    <input
                      type="text"
                      value={point}
                      onFocus={() => setFocusedInput(index)} // Set focus
                      onBlur={() => setFocusedInput(null)} // Remove focus
                      onChange={(e) => handleInputChange(e.target.value, index)}
                      placeholder={`Enter Point ${index + 1}`}
                      className=" w-full text-[#5D5F61] p-3 pr-7 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {refineLoadingStates[index] ? (
                      <>
                        <div className="absolute top-[55%] right-2 transform -translate-y-1/2 w-full h-full flex items-center justify-end">
                          <div className="w-4 h-4 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                        </div>
                      </>
                    ) : (
                      <FontAwesomeIcon
                        icon={faWandMagicSparkles}
                        onClick={() => refineText('points', index)}
                        className="absolute top-1/2 right-2 hover:scale-105 hover:cursor-pointer active:scale-95 transform -translate-y-1/2 text-[#3667B2]"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => removePoint(index)}
                    disabled={points.length <= 1} // Prevents removing if only 1 point remains
                    className={`${
                      points.length <= 1
                        ? 'text-gray-400 cursor-not-allowed' // Disabled state
                        : 'text-[#3667B2] hover:bg-red-100' // Active state
                    } bg-white lg:hidden flex items-center justify-center border border-[#E1E3E5] rounded-full w-6 h-6 p-2 transition`}
                  >
                    <FaMinus />
                  </button>
                </div>
                {/* Character Counter (outside the input container) */}
                <span
                  className={`lg:hidden block text-xs ml-1  ${
                    focusedInput === index
                      ? points[index].length > 140
                        ? 'text-red-500'
                        : 'text-gray-500'
                      : 'invisible' // Hide text but reserve space
                  }`}
                >
                  {point.length}/150 characters
                </span>
                {/* Add New Point Button */}
                {index === points.length - 1 && points.length < 6 && (
                  <button
                    onClick={addNewPoint}
                    className={`text-[#5D5F61] md:border md:border-gray-300 md:rounded-lg self-start flex p-2 gap-2 items-center md:justify-center h-10 lg:mt-4 ${
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
            <div
              className="relative"
              onMouseEnter={() => setShowTooltip(isGenerateDisabled)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <button
                onClick={handleGenerateSlide}
                disabled={isGenerateDisabled || isLoading || isImageLoading}
                className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md transition-all duration-200 transform ${
                  isGenerateDisabled || isLoading || isImageLoading
                    ? 'bg-gray-200 text-gray-500'
                    : 'bg-[#3667B2] text-white'
                }`}
              >
                {isLoading ? 'Loading...' : 'Generate Slide'}
              </button>

              {/* Tooltip */}
              {showTooltip && (
                <span
                  className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 mt-2 bg-gray-700 text-white text-xs p-2 rounded-md shadow-md z-50"
                  style={{ whiteSpace: 'nowrap' }} // Prevent text wrapping
                >
                  {points.every((point) => point.trim() === '')
                    ? 'Minimum 1 point required.'
                    : 'Slide title is required.'}
                </span>
              )}
            </div>
          </div>
          {/* Attach Image and Generate Slide Buttons for Mobile */}
          <div
            className="flex lg:hidden mt-2 gap-2  w-full relative "
            onMouseEnter={() => setShowTooltip(isGenerateDisabled)}
            onMouseLeave={() => setShowTooltip(false)}
          >
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
                  ? 'bg-gray-200 text-gray-500'
                  : 'bg-[#3667B2] text-white'
              }`}
            >
              Generate Slide
            </button>

            {/* Tooltip for Slide Type */}
            {showTooltip && (
              <div className="absolute -top-12 left-[75%] w-max transform -translate-x-1/2 bg-gray-700 text-white text-xs p-2 rounded-md shadow-md">
                {points.every((point) => point.trim() === '')
                  ? 'Minimum 1 point required.'
                  : 'Slide title is required.'}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
