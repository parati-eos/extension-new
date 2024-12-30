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
  outlineID: string
  setIsSlideLoading: () => void
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
}: ImagesProps) {
  const [images, setImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
            outlineID: outlineID,
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIsUploading(true) // Indicate uploading

      try {
        // Upload file to S3 and get the URL (assuming you have a function for this)
        const url = await uploadLogoToS3(file)
        setImages((prevImages) => [...prevImages, url])
      } catch (error) {
        toast.error('Error uploading image', {
          position: 'top-center',
          autoClose: 2000,
        })
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleButtonClick = () => {
    document.getElementById('imageUploader')?.click()
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
          <h2 className="hidden lg:block md:text-lg font-semibold text-[#091220]">
            {heading}
          </h2>

          {/* Image Upload Section */}
          <div className="flex flex-wrap gap-4 mt-4">
            {images.map((image, index) => (
              <div key={index} className="w-1/4 sm:w-full">
                <img
                  src={image}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-auto"
                />
              </div>
            ))}
            {images.length < 4 && (
              <div className="w-1/4 sm:w-full flex items-center justify-center border border-gray-300 p-4 rounded-lg">
                <input
                  type="file"
                  id="imageUploader"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="px-4 py-2 border font-semibold rounded-xl text-gray-500 hover:bg-blue-500 hover:border-none hover:text-white transition"
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            )}
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
