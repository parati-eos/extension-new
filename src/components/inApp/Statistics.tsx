import axios from 'axios'
import { useState, useRef, useEffect } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa'
import AttachImage from './attachimage'
import { BackButton } from './BackButton'
import { DisplayMode } from '../../@types/presentationView'
import { toast } from 'react-toastify'
import uploadFileToS3 from './uploadfiletoS3'
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

  const [isInitialDataLoad, setIsInitialDataLoad] = useState(true)
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
 // Modified useEffect for scroll behavior
 useEffect(() => {
  if (containerRef.current) {
    if (isInitialDataLoad) {
      // For initial data load, scroll to top
      requestAnimationFrame(() => {
        containerRef.current?.scrollTo({
          top: 0,
          behavior: 'instant',
        })
      })
    }
  }
}, [title, isInitialDataLoad])
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
    if (title.length < 4) {
      
      setIsInitialDataLoad(false) // Ensure we scroll to bottom for new points
      setTitle([...title, ''])
      setDescription([...description, ''])
      setIsRowAdded(true) // Set flag to trigger scrolling
    }
  }
  const isAddDisabled =
    title.length >= 4 || // Limit to 6 points
    title[title.length - 1].trim() === '' ||
    description[description.length - 1].trim() === ''

  const isGenerateDisabled =
    title.length < 2 ||
    title.some(
      (point, index) => point.trim() === '' || description[index].trim() === ''
    ) ||
    !slideTitle.trim()
    const removePoint = (index: number) => {
      if (title.length > 2) {
        setIsInitialDataLoad(false) 
        setTitle(title.filter((_, i) => i !== index));
        setDescription(description.filter((_, i) => i !== index));
      }
    };
    
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
  const fetchSlideData = async () => {
    const payload = {
      type: 'Statistics',
      title: slideTitle,
      documentID,
      outlineID,
    };
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/fetch-document/${orgId}/statistics`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      if (response.status === 200) {
        const slideData = response.data;
        setIsInitialDataLoad(true) // Ensure we scroll to bottom for new points
  
        if (slideData.title) setSlideTitle(slideData.title);
  
        if (slideData.stats && Array.isArray(slideData.stats)) {
          const extractedTitles = slideData.stats.map((stat: { label?: string }) =>
            stat.label?.trim() || ''
          );
          const extractedValues = slideData.stats.map((stat: { value?: string }) =>
            stat.value?.trim() || ''
          );
  
          setTitle(extractedTitles.length > 0 ? extractedTitles : ['', '', '']);
          setDescription(extractedValues.length > 0 ? extractedValues : ['', '', '']);
        } else {
          setTitle(['', '', '']);
          setDescription(['', '', '']);
        }
  
        if (slideData.image) setSelectedImage(slideData.image);
        setFileName(slideData.image[0].split('/').pop())
      }
      else {
        setSelectedImage(null) // No image if array is empty
        setFileName(null)
      
      }
    } catch (error) {
      console.error('Error fetching slide data:', error);
      setIsInitialDataLoad(false) // Ensure we scroll to bottom for new points
    }
  };
  
  // Run fetchSlideData when dependencies change
  useEffect(() => {
    fetchSlideData();
  }, [documentID, outlineID, orgId]);
  
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
    if (!file) {
      // If no file is provided (user removed image), reset states properly
      setUploadCompleted(false) // Ensure loading is stopped
      setSelectedImage(null)
      setUploadCompleted(false)
      setFileName(null)
      return
    }
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
                maxLength={50}
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
                className="border w-full text-sm mt-2 text-[#091220] md:text-lg rounded-md font-semibold bg-transparent p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-ellipsis overflow-hidden whitespace-nowrap pr-10"
              />
              {refineLoadingSlideTitle ? (
                <div className="absolute top-[55%] right-2 transform -translate-y-1/2 w-full h-full flex items-center justify-end">
                  <div className="w-4 h-4 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                </div>
              ) : (
                slideTitle.length>0 &&(
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
                )
              )}
            </div>
          </div>

          {/* Content container with flex-grow */}
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 lg:w-[80%] w-full lg:p-4"
          >
            {title.map((point, index) => (
              <div
                key={index}
                className={`flex  gap-2 px-1 py-1 lg:py-1 lg:px-0 mb-2 lg:mb-0 items-center ${
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
                    className="lg:ml-1 w-full text-xs lg:px-6 lg:py-4 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={50}
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
                    className="lg:ml-2 text-xs flex-1 w-full lg:px-6 lg:py-4 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={50}
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
                <button
  onClick={() => removePoint(index)}
  disabled={title.length <= 2} // Prevents removing if only 2 points remain
  className={`${
    title.length <= 2
      ? 'text-gray-400 cursor-not-allowed' // Disabled state
      : 'text-[#3667B2] hover:bg-red-100' // Active state
  } bg-white flex items-center justify-center border border-[#E1E3E5] rounded-full w-6 h-6 p-2 ml-2 transition mb-4`}
>
  <FaMinus />
</button>

                               </div>
                              
                
            ))}
 

            {title.length < 6 && (
              <div className="flex justify-center w-full ">
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
                <FaPlus className="h-3 w-3 mr-2" />
                <span className='text-sm'>Add Data</span>
              </button>
              </div>
            )}
          </div>

          <div className="hidden  lg:flex w-full   lg:justify-end lg:w-auto lg:gap-4">
            <AttachImage
              onFileSelected={handleFileSelect}
              isLoading={isImageLoading}
              fileName={fileName}
              uploadCompleted={uploadCompleted}
              selectedImage={selectedImage} 
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
          <div className="flex flex-col lg:hidden mt-4 gap-2  w-full ">
            <div className="flex-1  items-center justify-center gap-2">
              {/* Attach Image Section */}
              <AttachImage
                onFileSelected={handleFileSelect}
                isLoading={isImageLoading}
                fileName={fileName}
                uploadCompleted={uploadCompleted}
                selectedImage={selectedImage} 
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
                className={`flex-1 py-2 rounded-md w-full text-sm ${
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
