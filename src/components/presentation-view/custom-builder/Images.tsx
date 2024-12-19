import React, { useState } from 'react'
import axios from 'axios'
import { FaImage } from 'react-icons/fa'
import uploadLogoToS3 from '../../../utils/uploadLogoToS3'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../../../types/presentationView'
import { toast } from 'react-toastify'

interface ImagesProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
}

export default function Images({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
}: ImagesProps) {
  const [images, setImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
        files.map((file) => uploadLogoToS3(file))
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
        position: 'top-center',
        autoClose: 2000,
      })
    } finally {
      setIsUploading(false)
      setReplacingIndex(null)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/images`,
          {
            type: 'images',
            title: heading,
            documentID: documentID,
            data: {
              slideName: heading,
              imageurl: images,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then((response) => {
          alert('Images submitted successfully!')
          setIsLoading(false)
          setDisplayMode('slides')
        })
    } catch (error) {
      toast.error('Submit failed', {
        position: 'top-center',
        autoClose: 2000,
      })
      alert('Failed to submit images.')
    }
  }

  const onBack = () => {
    setDisplayMode('customBuilder')
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
          <div className="flex items-center justify-between w-full mb-4">
            <h2 className="hidden lg:block md:text-lg font-semibold text-[#091220]">
              {slideType}
            </h2>
            <BackButton onClick={onBack} />
          </div>
          <h3>{heading}</h3>

          {/* Mobile Images Input and Display Section */}
          <div className="flex flex-col lg:hidden w-full h-full md:mt-4">
            <div className="flex items-center border justify-between border-gray-300 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <FaImage className="text-4xl text-gray-500" />
                <p className="text-gray-500 text-sm text-center">
                  {isUploading && replacingIndex === null
                    ? 'Uploading... Please wait'
                    : 'Upload Image(s)'}
                </p>
              </div>
              <button
                onClick={() =>
                  document.getElementById('mobileImageInput')?.click()
                }
                className="text-[#3667B2] px-4 py-2 rounded-md "
              >
                Upload
              </button>
              <input
                type="file"
                id="mobileImageInput"
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
                  {/* Display uploaded image */}
                  <img
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />

                  {/* Reupload button */}
                  <button
                    onClick={() =>
                      document
                        .getElementById(`replaceInputMobile${index}`)
                        ?.click()
                    }
                    className="absolute top-1 right-1 bg-gray-800 text-white text-xs py-1 px-2 rounded-md hover:bg-gray-600"
                  >
                    Re-upload
                  </button>

                  {/* Hidden input for replacing the image */}
                  <input
                    type="file"
                    id={`replaceInputMobile${index}`}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Large Screens Images Input and Display Section */}
          <div className="hidden lg:flex justify-center w-full md:mt-4 lg:mt-12">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
              {images.map((image, index) => (
                <div key={index} className="w-full aspect-square relative">
                  {replacingIndex === index ? (
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
                      <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                    </div>
                  ) : null}
                  <img
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() =>
                      document.getElementById(`replaceInput${index}`)?.click()
                    }
                    className="absolute top-2 right-2 bg-gray-800 text-white text-xs py-1 px-2 rounded-lg hover:bg-gray-600"
                  >
                    Re-upload
                  </button>
                  <input
                    type="file"
                    id={`replaceInput${index}`}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, index)}
                  />
                </div>
              ))}

              {images.length < 4 && (
                <div className="flex flex-col items-center justify-center w-full h-[30%] md:h-full aspect-square border border-gray-300 rounded-lg">
                  <button
                    onClick={() =>
                      document.getElementById('imageInput')?.click()
                    }
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
                    id="imageInput"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Genereate Slide Button for Large Screens */}
          <div className="hidden mt-auto lg:flex w-full  justify-between lg:justify-end lg:w-auto ">
            <button
              onClick={handleSubmit}
              disabled={images.length === 0}
              className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md transition-all duration-200 transform ${
                images.length
                  ? 'bg-[#3667B2] text-white hover:bg-[#2c56a0] hover:shadow-lg active:scale-95'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Generate Slide
            </button>
          </div>

          {/* Generate Slide Buttons for Mobile */}
          <div className="flex lg:hidden  mt-4 gap-2  justify-end">
            <div className="justify-end">
              <button
                onClick={handleSubmit}
                disabled={images.length === 0}
                className={`flex-1 py-2 px-5 rounded-md duration-200 transform active:scale-95 ${
                  images.length
                    ? 'bg-[#3667B2] text-white hover:bg-[#2c56a0] hover:shadow-lg active:scale-95'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Generate Slide
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
