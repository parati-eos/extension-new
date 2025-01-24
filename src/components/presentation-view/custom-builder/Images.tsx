import React, { useState, useRef } from 'react'
import axios from 'axios'
import { FaImage } from 'react-icons/fa'
import uploadFileToS3 from '../../../utils/uploadFileToS3'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../../../types/presentationView'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'

interface ImagesProps {
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

export default function Images({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
  outlineID,
  setIsSlideLoading,
  setFailed,
}: ImagesProps) {
  const [images, setImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [refineLoadingSlideTitle, setRefineLoadingSlideTitle] = useState(false) // State for slideTitle loader
  // Refs for file inputs
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const replaceInputRefs = useRef<HTMLInputElement[]>([])
  const [slideTitle, setSlideTitle] = useState('') // Local state for slide title

  const transformData = (imageUrls: string[]) => {
    const headers: Record<string, string> = {} // Initialize an empty object for dynamic headers

    // Loop through the image URLs and extract filenames to use as headers
    imageUrls.forEach((url, index) => {
      const parts = url.split('/') // Split the URL by '/'
      const filenameWithExtension = parts[parts.length - 1] // Get the last part (filename.extension)

      // Remove the number prefix (if present) and get the filename without extension
      const filenameWithoutNumber = filenameWithExtension
        .replace(/^\d+_/, '')
        .split('.')[0] // Remove leading number followed by underscore

      headers[`header${index + 1}`] = filenameWithoutNumber // Dynamically create header keys (header1, header2, etc.)
    })

    // Return the headers along with the original image URLs
    return {
      ...headers, // Spread the dynamically created headers
      imageurl: imageUrls, // Keep the original URLs in 'imageurl'
    }
  }

  const handleMouseEnter = () => {
    if (images.length === 0 || slideTitle.trim() === '') {
      setShowTooltip(true)
    }
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    replaceIndex?: number
  ) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)

    if (replaceIndex === undefined && images.length + files.length > 4) {
      alert('You can upload a maximum of 4 images.')
      return
    }

    if (replaceIndex !== undefined) setReplacingIndex(replaceIndex)
    else setIsUploading(true)

    try {
      const uploadedImages = await Promise.all(
        files.map((file) => uploadFileToS3(file))
      )

      if (replaceIndex !== undefined) {
        setImages((prevImages) => {
          const updatedImages = [...prevImages]
          updatedImages[replaceIndex] = uploadedImages[0]
          return updatedImages
        })
      } else {
        setImages((prevImages) => [...prevImages, ...uploadedImages])
      }
    } catch (error) {
      toast.error('Upload failed', {
        position: 'top-right',
        autoClose: 3000,
      })
    } finally {
      setIsUploading(false)
      setReplacingIndex(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = async () => {
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
      // Create the transformed payload
      const transformedHeaders = transformData(images) // Assuming images are the URLs
      const payload = {
        type: 'Images',
        documentID: documentID,
        data: {
          slideName: heading,
          ...transformedHeaders, // Spread the dynamic headers here
          title: slideTitle,
          imageurl: images, // Pass the original image URLs
        },
        outlineID: outlineID,
      }

      // Send the request
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/images`,
        payload,
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
      setIsLoading(false)
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

  const onBack = () => {
    setDisplayMode('customBuilder')
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const triggerReplaceInput = (index: number) => {
    replaceInputRefs.current[index]?.click()
  }

  return (
    <div className="flex flex-col h-full w-full p-2 lg:p-4">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Heading */}
          <div className="flex items-center justify-between w-full">
            <h3 className="text-semibold">Images</h3>
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
                <div className="absolute top-[55%] right-2 transform -translate-y-1/2  w-full h-full flex items-center justify-end">
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

          {/* Mobile Images Input and Display Section */}
          <div className="flex flex-col lg:hidden w-full h-full md:mt-4 p-1">
            <div className="flex items-center border justify-between border-gray-300 rounded-lg mt-2 lg:mt-0 p-4">
              <div className="flex items-center gap-4">
                <FaImage className="text-4xl text-gray-500" />
                <p className="text-gray-500 text-sm text-center">
                  {isUploading && replacingIndex === null
                    ? 'Uploading... Please wait'
                    : 'Upload Image(s)'}
                </p>
              </div>
              <button
                onClick={triggerFileInput}
                className="text-[#3667B2] px-4 py-2 rounded-md "
              >
                Upload
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e)}
              />
            </div>

            {/* Display Uploaded Images for Mobile */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative w-full h-24">
                  {replacingIndex === index && (
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
                      <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    onClick={() => triggerReplaceInput(index)}
                    className="absolute top-1 right-1 bg-gray-800 text-white text-xs py-1 px-2 rounded-md hover:bg-gray-600"
                  >
                    Re-upload
                  </button>
                  <input
                    type="file"
                    ref={(el) => (replaceInputRefs.current[index] = el!)}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Large Screens Images Input and Display Section */}
          <div className="hidden ml-1 lg:flex justify-start w-full md:mt-4 lg:mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
              {images.map((image, index) => (
                <div key={index} className="w-full aspect-square relative">
                  {replacingIndex === index && (
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
                      <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => triggerReplaceInput(index)}
                    className="absolute top-2 right-2 bg-gray-800 text-white text-xs py-1 px-2 rounded-lg hover:bg-gray-600"
                  >
                    Re-upload
                  </button>
                  <input
                    type="file"
                    ref={(el) => (replaceInputRefs.current[index] = el!)}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, index)}
                  />
                </div>
              ))}
              {images.length < 4 && (
                <div className="flex flex-col items-center justify-center w-full h-[30%] md:h-full aspect-square border border-gray-300 rounded-lg">
                  <button
                    onClick={triggerFileInput}
                    className="flex md:flex-col gap-2 md:gap-0 items-center justify-center w-full h-full"
                  >
                    <FaImage className="text-2xl text-gray-500" />
                    <p className="text-gray-500 text-sm md:mt-2">
                      {isUploading && replacingIndex === null ? (
                        <>
                          Uploading...
                          <br />
                          Please wait
                        </>
                      ) : (
                        <>
                          Upload Image
                          <br />
                          Up to 4 images can be added
                        </>
                      )}
                    </p>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Generate Slide Buttons for Desktop */}
          <div className="hidden mt-auto lg:flex w-full justify-between lg:justify-end lg:w-auto">
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={handleSubmit}
                disabled={images.length === 0 || !slideTitle}
                className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md transition-all duration-200 transform ${
                  images.length > 0 && slideTitle
                    ? 'bg-[#3667B2] text-white hover:bg-[#2c56a0] hover:shadow-lg active:scale-95'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Generate Slide
              </button>
              {/* Tooltip */}
              {showTooltip && (
                <div className="absolute top-[-35px] left-1/2 transform -translate-x-1/2 w-max bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md">
                  {images.length === 0
                    ? 'Please upload an image.'
                    : slideTitle.trim() === ''
                    ? 'Slide title is required.'
                    : ''}
                </div>
              )}
            </div>
          </div>

          {/* Generate Slide Buttons for Mobile */}
          <div className="flex lg:hidden gap-2 justify-end">
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={handleSubmit}
                disabled={images.length === 0 || !slideTitle}
                className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
                  images.length > 0 && slideTitle
                    ? 'bg-[#3667B2] text-white hover:bg-[#2c56a0] hover:shadow-lg active:scale-95' // Enabled styles
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed' // Disabled styles
                }`}
              >
                Generate Slide
              </button>
              {/* Tooltip */}
              {showTooltip && (
                <div className="absolute top-[-35px] w-max left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md">
                  {images.length === 0
                    ? 'Please upload an image.'
                    : 'Slide title is required.'}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
