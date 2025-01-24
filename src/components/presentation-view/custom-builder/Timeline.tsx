import { useState, useRef, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import axios from 'axios'
import AttachImage from '../../presentation-view/custom-builder/shared/attachimage' // Import AttachImage component
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../../../types/presentationView'
import { toast } from 'react-toastify'
import uploadFileToS3 from '../../../utils/uploadFileToS3'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'

interface TimelineProps {
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

export default function Timeline({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
  outlineID,
  setIsSlideLoading,
  setFailed,
}: TimelineProps) {
  const [timeline, setTimeline] = useState([''])
  const [description, setDescription] = useState([''])
  const [loading, setLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null) // Add selected image state
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null) // Track file name
  const [uploadCompleted, setUploadCompleted] = useState(false) // Track if upload is completed
  const [slideTitle, setSlideTitle] = useState('') // Local state for slide title
  const [refineLoadingStates, setRefineLoadingStates] = useState<boolean[]>(
    new Array(description.length).fill(false)
  )
  const [refineLoadingSlideTitle, setRefineLoadingSlideTitle] = useState(false) // State for slideTitle loader

  const [focusedInput, setFocusedInput] = useState<number | null>(null) // Define focusedInput

  const handleInputTitle = (value: string, index: number) => {
    if (value.length <= 25) {
      const updatedPoints = [...timeline]
      updatedPoints[index] = value
      setTimeline(updatedPoints)
    }
  }

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [timeline])

  const handleInputDescription = (value: string, index: number) => {
    if (value.length <= 150) {
      const updatedPoints = [...description]
      updatedPoints[index] = value
      setDescription(updatedPoints)
    }
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
    ).length < 3 || !slideTitle.trim()

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
      const phases = timeline.map((point, index) => ({
        timeline: point,
        description: description[index],
      }))

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/phases`,
        {
          type: 'Phases',
          title: slideTitle,
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

  const refineText = async (type: string, index?: number) => {
    const newRefineLoadingStates = [...refineLoadingStates]
    newRefineLoadingStates[index!] = true // Set loading for this specific index
    setRefineLoadingStates(newRefineLoadingStates)

    let textToRefine = ''

    if (type === 'slideTitle') {
      textToRefine = slideTitle
      setRefineLoadingSlideTitle(true) // Set loader state to true when refining slideTitle
    } else if (type === 'timeLineDescription' && index !== undefined) {
      textToRefine = description[index]
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
        } else if (type === 'timeLineDescription' && index !== undefined) {
          const updatedDescriptions = [...description]
          updatedDescriptions[index] = refinedText
          setDescription(updatedDescriptions)
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

  const handleFileSelect = async (file: File | null) => {
    setIsLoading(true)
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
          {/* Editable Slide Title */}
          <div className="w-full p-1">
            <div className="relative">
              <input
                type="text"
                value={slideTitle}
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
                maxLength={25}
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
          {/* Content container with flex-grow */}
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto scrollbar-none"
          >
            {timeline.map((point, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row  lg:gap-4 lg:px-0 py-2 lg:py-0 p-1  lg:mb-0 ${
                  index === 0 ? 'lg:mt-2' : 'lg:mt-2'
                }`}
              >
                <div className="flex flex-col lg:w-[25%]">
                  <input
                    type="text"
                    value={timeline[index]}
                    onChange={(e) => handleInputTitle(e.target.value, index)}
                    onFocus={() => setFocusedInput(index)} // Set focus
                    onBlur={() => setFocusedInput(null)} // Remove focus
                    placeholder={`Enter Timeline ${index + 1}`}
                    className="flex-1  lg:ml-1 w-full lg:py-5 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span
                    className={`block text-xs mt-1 ml-1 ${
                      focusedInput === index
                        ? timeline[index].length > 20
                          ? 'text-red-500'
                          : 'text-gray-500'
                        : 'invisible' // Hide text but reserve space
                    }`}
                  >
                    {timeline[index].length}/25 characters
                  </span>
                </div>
                {/* Description Input with Icons */}
                <div className="relative lg:ml-2 lg:mr-1 w-full flex flex-col lg:w-[75%]">
                  <>
                    <input
                      type="text"
                      value={description[index]}
                      onBlur={() => setFocusedInput(null)}
                      onChange={(e) =>
                        handleInputDescription(e.target.value, index)
                      }
                      onFocus={(e) => {
                        setFocusedInput(index + 100)
                        const input = e.target as HTMLInputElement // Explicitly cast EventTarget to HTMLInputElement
                        input.scrollLeft = input.scrollWidth // Scroll to the end on focus
                      }}
                      style={{
                        textOverflow: 'ellipsis', // Truncate text with dots
                        whiteSpace: 'nowrap', // Prevent text wrapping
                        overflow: 'hidden', // Hide overflowing text
                      }}
                      placeholder={`Enter Description ${index + 1}`}
                      className="w-full lg:py-5 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-ellipsis overflow-hidden whitespace-nowrap pr-10"
                    />
                    {refineLoadingStates[index] ? (
                      <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                        <div className="w-4 h-4 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div className="absolute top-[35%] right-2 transform -translate-y-1/2">
                        <div className="relative group">
                          <FontAwesomeIcon
                            icon={faWandMagicSparkles}
                            onClick={() =>
                              refineText('timeLineDescription', index)
                            }
                            className="hover:scale-105 hover:cursor-pointer active:scale-95 text-[#3667B2]"
                          />
                          {/* Tooltip */}
                          <span className="absolute w-max top-[-35px] right-0 bg-black text-white text-xs rounded px-2 py-1 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">
                            Click to refine text.
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                  <span
                    className={`block text-xs mt-1 ml-1 ${
                      focusedInput === index + 100
                        ? description[index].length > 140
                          ? 'text-red-500'
                          : 'text-gray-500'
                        : 'invisible' // Hide text but reserve space
                    }`}
                  >
                    {description[index].length}/150 characters
                  </span>
                </div>
              </div>
            ))}

            {/* Conditionally render the "Add New Timeline" button only if less than 6 points */}
            {timeline.length < 6 && (
              <button
                onClick={addNewPoint}
                type="button"
                disabled={isAddDisabled}
                className={`flex items-center p-2 gap-2 w-48 py-2 lg:rounded-md mt-4  ml-1  md:border md:border-gray-300 md:rounded-lg  text-[#5D5F61] ${
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
                if (!isGenerateDisabled && !isLoading) {
                  handleGenerateSlide()
                } else {
                  e.preventDefault() // Prevent action when disabled
                }
              }}
              onMouseEnter={() => {
                if (isGenerateDisabled) {
                  setShowTooltip(true)
                }
              }}
              onMouseLeave={() => setShowTooltip(false)}
              className={`relative flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md duration-200 transform active:scale-95 ${
                isGenerateDisabled || loading || isLoading
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' // Disabled styles
                  : 'bg-[#3667B2] text-white hover:bg-[#2c56a0] hover:shadow-lg' // Enabled styles
              }`}
            >
              {loading ? 'Generating...' : 'Generate Slide'}

              {/* Tooltip */}
              {showTooltip && (
                <span className="absolute top-[-40px] left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-10">
                  {timeline.filter(
                    (point, index) =>
                      point.trim() !== '' && description[index].trim() !== ''
                  ).length < 3
                    ? 'Minimum 3 timelines are required.'
                    : 'Slide title is required.'}
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
                if (!isGenerateDisabled && !isLoading) {
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
                  {timeline.filter(
                    (point, index) =>
                      point.trim() !== '' && description[index].trim() !== ''
                  ).length < 3
                    ? 'Minimum 3 timelines are required.'
                    : 'Slide title is required.'}
                </span>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
