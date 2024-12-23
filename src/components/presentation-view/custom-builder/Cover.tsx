import { FaImage } from 'react-icons/fa'
import React, { useState } from 'react'
import uploadLogoToS3 from '../../../utils/uploadLogoToS3'
import axios from 'axios'
import { DisplayMode } from '../../../types/presentationView'
import { BackButton } from './shared/BackButton'
import { toast } from 'react-toastify'
import AttachImage from './shared/attachimage'

interface CoverProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
}

export default function Cover({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
}: CoverProps) {
  const [logo, setLogo] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [images, setImages] = useState<string[]>([])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIsUploading(true)
      try {
        const url = await uploadLogoToS3(file)
        setLogo(url)
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

  const handleFileSelect = (file: File | null) => {
    setSelectedImage(file)
  }

  const handleButtonClick = () => {
    document.getElementById('logoUploadInput')?.click()
  }

  const handleGenerateSlide = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/cover`,
        {
          type: 'cover',
          title: heading,
          documentID,
          data: {
            slideName: heading,
            logo,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      toast.success('Slide generated successfully!', {
        position: 'top-center',
        autoClose: 2000,
      })
      console.log(response.data)
    } catch (error) {
      toast.error('Error while generating slide', {
        position: 'top-center',
        autoClose: 2000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onBack = () => {
    setDisplayMode('newContent')
  }

  return (
    <div className="flex flex-col h-full w-full p-2 lg:p-4">
      {/* Header Section */}
     <div className="flex items-center justify-between w-full">
                 <h3 className='text-semibold'>
                   Cover
                 </h3>
                 <BackButton onClick={onBack} />
               </div>
               <h2 className="hidden lg:block md:text-lg font-semibold text-[#091220]">{heading}</h2>

      {/* Main Content */}
      <div className="w-full h-full flex flex-col items-center justify-center">
        {/* Logo Upload Section */}
        <div className="w-full border border-gray-300 rounded-xl h-full flex flex-col justify-center items-center ">
          <input
            type="file"
            id="logoUploadInput"
            accept="image/*"
            onChange={(e) => handleFileChange(e)}
            className="hidden"
          />
          <div className="flex flex-col h-[60%] w-[60%] items-center justify-center">
            {logo ? (
              <img
                src={logo}
                alt="Uploaded Logo"
                className="h-72 w-72 object-contain rounded-md"
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
              className="px-4 py-2 mt-2 border font-semibold rounded-xl text-gray-500 hover:bg-[#3667B2] hover:border-none hover:text-white active:scale-95 transition transform duration-300"
            >
              {logo ? 'Upload Again' : 'Upload Logo'}
            </button>
          </div>
        </div>

        {/* Button Container */}
        <div className="hidden w-full lg:flex  lg:flex-row justify-end gap-2 lg:mt-8 mt-2">
          {/* Attach Image Component */}
          <AttachImage onFileSelected={handleFileSelect} />

          {/* Generate Slide Button */}
          <button
            onClick={handleGenerateSlide}
            disabled={!logo}
            className={`py-2 px-6 rounded-md transition-all duration-200 transform ${
              !logo
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#3667B2] text-white hover:bg-[#274a89]'
            }`}
          >
            {isLoading ? 'Loading...' : 'Generate Slide'}
          </button>
        </div>
        {/* Attach Image and Generate Slide Buttons for Mobile */}
        <div className="flex lg:hidden mt-2 gap-2  w-full ">
          <div className="flex-1  items-center justify-center gap-2">
            <AttachImage onFileSelected={handleFileSelect} />
          </div>

          <button
            onClick={handleGenerateSlide}
            disabled={!logo}
            className={`flex-1 py-2 rounded-md ${
              !logo
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#3667B2] text-white'
            }`}
          >
            {isLoading ? 'Loading...' : 'Generate Slide'}
          </button>
        </div>
      </div>
    </div>
  )
}
