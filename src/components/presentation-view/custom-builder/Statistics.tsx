import axios from 'axios'
import { useState, useRef, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import AttachImage from './shared/attachimage'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../../../types/presentationView'
import { toast } from 'react-toastify'
import uploadLogoToS3 from '../../../utils/uploadLogoToS3'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'

interface StatisticProps {
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

export default function Statistics({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
  outlineID,
  setIsSlideLoading,
  setFailed,
}: StatisticProps) {
  const [title, setTitle] = useState(['', '', '']) // Initialize with 3 empty strings
  const [description, setDescription] = useState(['', '', '']) // Initialize with 3 empty strings
  const [showTooltip, setShowTooltip] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isRowAdded, setIsRowAdded] = useState(false) // Flag to track new row addition
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null) // Track file name
  const [uploadCompleted, setUploadCompleted] = useState(false) // Track if upload is completed
  const [slideTitle, setSlideTitle] = useState('') // Local state for slide title
  const [refineLoadingSlideTitle, setRefineLoadingSlideTitle] = useState(false) // State for slideTitle loader
  const [focusedInput, setFocusedInput] = useState<number | null>(null) // Define focusedInput

  const handleInputTitle = (value: string, index: number) => {
    if (value.length <= 25) {
      const updatedPoints = [...title]
      updatedPoints[index] = value
      setTitle(updatedPoints)
    }
  }

  const handleInputDescription = (value: string, index: number) => {
    if (value.length <= 25) {
      const updatedPoints = [...description]
      updatedPoints[index] = value
      setDescription(updatedPoints)
    }
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
    title.length >= 6 || // Limit to 6 points
    title[title.length - 1].trim() === '' ||
    description[description.length - 1].trim() === ''

  const isGenerateDisabled =
    title.length < 3 ||
    title.some(
      (point, index) => point.trim() === '' || description[index].trim() === ''
    ) ||
    !slideTitle.trim()

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

    setLoading(true)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/statistics`,
        {
          type: 'Statistics',
          title: slideTitle,
          documentID: documentID,
          data: {
            slideName: heading,
            ...(selectedImage && { image: selectedImage }),
            stats: title.map((label, index) => ({
              label,
              value: description[index] || 0, // Adjusted to include all rows
            })),
          },
          outlineID: outlineID,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      toast.info(`Data submitted successfully for ${heading}`, {
        position: 'top-right',
        autoClose: 3000,
      })
      setDisplayMode('slides')
    } catch (error) {
      toast.error('Error submitting data!', {
        position: 'top-right',
        autoClose: 3000,
      })
      setFailed()
    } finally {
      setLoading(false)
    }
  }

  const refineText = async (type: string, text: string) => {
    setRefineLoadingSlideTitle(true) // Set loader state to true when refining slideTitle

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/refineText`,
        {
          type: type,
          textToRefine: text,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      if (response.status === 200) {
        const refinedText = response.data.refinedText

        setSlideTitle(refinedText)
      }
      setRefineLoadingSlideTitle(false) // Set slideTitle loading state back to false
    } catch (error) {
      toast.error('Error refining text!', {
        position: 'top-right',
        autoClose: 3000,
      })
      setRefineLoadingSlideTitle(false) // Set slideTitle loading state back to false
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

  const onBack = () => {
    setDisplayMode('customBuilder')
  }

  return (
    <div className="flex flex-col p-2 lg:p-4 w-full h-full">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Top Section: Headings */}
          <div className="flex items-center justify-between w-full">
            <h3 className="text-semibold">Statistics</h3>
            <BackButton onClick={onBack} />
          </div>
          {/* Editable Slide Title */}
          <div className="w-full p-1">
            <div className="relative">
              <input
                type="text"
                value={slideTitle}
                maxLength={25}
                onChange={(e) => setSlideTitle(e.target.value)}
                onFocus={(e) => {
                  const input = e.target as HTMLInputElement // Explicitly cast EventTarget to HTMLInputElement
                  input.scrollLeft = input.scrollWidth // Scroll to the end on focus
                }}
                style={{
                  textOverflow: 'ellipsis', // Truncate text with dots
                  whiteSpace: 'nowrap', // Prevent text wrapping
                  overflow: 'hidden', // Hide overflowing text
                }}
                placeholder="Add Slide Title"
                className="border w-full mt-2 text-[#091220] md:text-lg rounded-md font-semibold bg-transparent p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-ellipsis overflow-hidden whitespace-nowrap pr-10"
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
                      onClick={() => refineText('slideTitle', slideTitle)}
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

          {/* Content container with flex-grow */}
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto scrollbar-none lg:w-[80%] w-full lg:p-4"
          >
            {title.map((point, index) => (
              <div
                key={index}
                className={`flex  gap-2 px-1 py-1 lg:py-1 lg:px-0 mb-2 lg:mb-0 ${
                  index === 0 ? 'lg:mt-2' : 'lg:mt-2'
                }`}
              >
                <div className="flex flex-col ">
                  <input
                    type="text"
                    value={title[index]}
                    onFocus={() => setFocusedInput(index)} // Set focus
                    onBlur={() => setFocusedInput(null)} // Remove focus
                    onChange={(e) => handleInputTitle(e.target.value, index)}
                    placeholder={`Enter Data Label ${index + 1}`}
                    className="lg:ml-1 w-full lg:px-6 lg:py-4 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={25}
                  />
                  <span
                    className={`text-xs mt-1 ml-1 ${
                      focusedInput === index
                        ? title[index].length > 20
                          ? 'text-red-500'
                          : 'text-gray-500'
                        : 'invisible' // Hide text but reserve space
                    }`}
                  >
                    {title[index].length}/25 characters
                  </span>
                </div>
                <div className="flex flex-col">
                  <input
                    type="text"
                    value={description[index]}
                    onFocus={() => setFocusedInput(index + 100)} // Set focus
                    onBlur={() => setFocusedInput(null)} // Remove focus
                    onChange={(e) =>
                      handleInputDescription(e.target.value, index)
                    }
                    placeholder={`Enter Value ${index + 1}`}
                    className="lg:ml-2 flex-1 w-full lg:px-6 lg:py-4 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={25}
                  />
                  <span
                    className={`text-xs mt-1 ml-1 ${
                      focusedInput === index + 100
                        ? description[index].length > 20
                          ? 'text-red-500'
                          : 'text-gray-500'
                        : 'invisible' // Hide text but reserve space
                    }`}
                  >
                    {description[index].length}/25 characters
                  </span>
                </div>
              </div>
            ))}

            {title.length < 6 && (
              <button
                onClick={addNewPoint}
                type="button"
                disabled={isAddDisabled}
                className={`flex items-center justify-center py-2 px-3  mt-4  ml-1 md:border md:border-gray-300 md:rounded-lg  text-[#5D5F61] ${
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

          <div className="hidden  lg:flex w-full   lg:justify-end lg:w-auto lg:gap-4">
            <AttachImage
              onFileSelected={handleFileSelect}
              isLoading={isImageLoading}
              fileName={fileName}
              uploadCompleted={uploadCompleted}
            />
            <div className="hidden lg:flex w-full lg:justify-end lg:w-auto lg:gap-4">
              <div className="flex-1 relative">
                <button
                  onClick={(e) => {
                    if (!isGenerateDisabled && !isImageLoading) {
                      handleGenerateSlide()
                    } else {
                      e.preventDefault() // Prevent action when disabled
                    }
                  }}
                  onMouseEnter={() =>
                    isGenerateDisabled && setShowTooltip(true)
                  }
                  onMouseLeave={() => setShowTooltip(false)}
                  className={`lg:w-[180px] py-2 px-5 justify-end rounded-md active:scale-95 transition transform duration-300 ${
                    isGenerateDisabled || isImageLoading
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-[#3667B2] text-white hover:bg-[#28518a]'
                  }`}
                >
                  Generate Slide
                </button>

                {/* Tooltip */}
                {isGenerateDisabled && showTooltip && (
                  <span
                    className="absolute top-[-45px] left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-20"
                    dangerouslySetInnerHTML={{
                      __html:
                        title.length < 3 ||
                        title.some(
                          (point, index) =>
                            point.trim() === '' ||
                            description[index].trim() === ''
                        )
                          ? 'Minimum 3 data points required.<br>Please fill all cells.'
                          : 'Slide title is required.',
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          {/* {Mobile View} */}
          <div className="flex lg:hidden mt-4 gap-2  w-full ">
            <div className="flex-1  items-center justify-center gap-2">
              {/* Attach Image Section */}
              <AttachImage
                onFileSelected={handleFileSelect}
                isLoading={isImageLoading}
                fileName={fileName}
                uploadCompleted={uploadCompleted}
              />
            </div>

            <div className="flex-1 relative">
              <button
                onClick={(e) => {
                  if (!isGenerateDisabled && !isImageLoading) {
                    handleGenerateSlide()
                  } else {
                    e.preventDefault() // Prevent action when disabled
                  }
                }}
                onMouseEnter={() => isGenerateDisabled && setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`flex-1 py-2 rounded-md w-full ${
                  isGenerateDisabled || isImageLoading
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-[#3667B2] text-white'
                }`}
              >
                Generate Slide
              </button>

              {/* Tooltip */}
              {isGenerateDisabled && showTooltip && (
                <span
                  className="absolute top-[-45px] left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-20"
                  dangerouslySetInnerHTML={{
                    __html:
                      title.length < 3 ||
                      title.some(
                        (point, index) =>
                          point.trim() === '' ||
                          description[index].trim() === ''
                      )
                        ? 'Minimum 3 data points required.<br>Please fill all cells.'
                        : 'Slide title is required.',
                  }}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
