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
}

export default function Images({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
  outlineID,
}: ImagesProps) {
  const [images, setImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIsUploading(true) // Indicate uploading

      try {
        // Upload file to S3 and get the URL
        console.log('File selected:', file)
        const url = await uploadLogoToS3(file)
        console.log('Uploaded URL:', url)
        setImages((prevImages) => {
          const newImages = [...prevImages, url]
          console.log('Updated images state:', newImages)
          return newImages
        })
      } catch (error) {
        toast.error('Error uploading logo', {
          position: 'top-center',
          autoClose: 2000,
        })
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleButtonClick = () => {
    document.getElementById('companyLogo')?.click()
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

          <div
            className={`w-[90%] md:w-full border border-gray-200 mt-4 md:mt-6 ${
              images[0] !== '' ? 'md:mt-0' : ''
            } p-7 rounded-lg hover:scale-105`}
          >
            <input
              type="file"
              id="companyLogo"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center">
              {images[0] ? (
                <img
                  src={images[0]}
                  alt="Uploaded Logo"
                  className="w-16 h-16 lg:w-24 lg:h-24 object-fit mb-2"
                />
              ) : (
                <>
                  <FaImage className="text-gray-500 text-4xl mb-4" />
                  <p className="text-gray-500 mb-4">
                    {isUploading ? 'Uploading...' : 'Upload Your Logo'}
                  </p>
                </>
              )}
              <button
                type="button"
                onClick={handleButtonClick}
                className="px-4 py-2 border font-semibold rounded-xl text-gray-500 hover:bg-[#3667B2] hover:border-none hover:text-white transition"
              >
                {images[0] ? 'Upload Again' : 'Upload Logo'}
              </button>
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
