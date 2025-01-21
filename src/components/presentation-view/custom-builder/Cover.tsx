import { FaImage } from 'react-icons/fa'
import React, { useState, useRef, useEffect } from 'react'
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
  outlineID: string
  setIsSlideLoading: () => void
}

export default function Cover({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
  outlineID,
  setIsSlideLoading,
}: CoverProps) {
  const [logo, setLogo] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const [uploadCompleted, setUploadCompleted] = useState(false)
  const [tagline, setTagline] = useState('')
  const [companyName, setCompanyName] = useState('')

  // Ref for file input to trigger on button click
  const logoUploadInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsImageLoading(true)
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      try {
        const url = await uploadLogoToS3(file)
        setLogo(url)
      } catch (error) {
        toast.error('Error uploading logo', {
          position: 'top-right',
          autoClose: 3000,
        })
      } finally {
        setIsImageLoading(false)
      }
    }
  }

  const handleFileSelect = async (file: File | null) => {
    setIsUploading(true)
    if (file) {
      try {
        const url = await uploadLogoToS3(file)
        setSelectedImage(url)
        setUploadCompleted(true)
        setFileName(file.name)
      } catch (error) {
        toast.error('Error uploading image', {
          position: 'top-right',
          autoClose: 3000,
        })
      } finally {
        setIsUploading(false)
      }
    }
  }
  const handleButtonClick = () => {
    if (logoUploadInputRef.current) {
      logoUploadInputRef.current.value = '' // Reset the file input
      logoUploadInputRef.current.click() // Trigger the file input click programmatically
    }
  }

  const handleGenerateSlide = async () => {
    setIsSlideLoading()
    setIsLoading(true)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/Cover`,
        {
          type: 'Cover',
          title: heading,
          documentID,
          data: {
            slideName: heading,
            logo,
            tagline: tagline,
            companyName: companyName,
            ...(selectedImage && { image: selectedImage }),
          },
          outlineID,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      toast.info('Slide generation started', {
        position: 'top-right',
        autoClose: 3000,
      })
      console.log(response.data)
    } catch (error) {
      toast.error('Error while generating slide', {
        position: 'top-right',
        autoClose: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onBack = () => {
    setDisplayMode('slides')
  }

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/${orgId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setCompanyName(response.data.companyName)
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="flex flex-col h-full w-full p-2 lg:p-4">
      {/* Header Section */}
      <div className="flex items-center justify-between w-full">
        <h3 className="text-semibold">Cover</h3>
        <BackButton onClick={onBack} />
      </div>
      <div className="flex items-center "></div>
      <div className="py-2 lg:mt-8">
        <input
          type="text"
          placeholder="Enter your tagline"
          onChange={(e) => setTagline(e.target.value)}
          className=" py-1 px-2 lg:w-[50%] w-full border border-gray-300 rounded-lg "
        />
      </div>
      {/* Main Content */}
      <div className="lg:w-[50%] w-full h-full   flex flex-col flex-grow items-center">
        {/* Logo Upload Section */}
        <div></div>
        <div className="border border-gray-300 rounded-xl w-full lg:h-[60%] h-[95%] flex flex-col  justify-center items-center ">
          <input
            type="file"
            ref={logoUploadInputRef}
            accept="image/*"
            onChange={(e) => handleFileChange(e)}
            className="hidden"
          />
          <div className="flex flex-col h-full w-full lg:h-[80%] lg:w-[60%]  items-center justify-center">
            {logo ? (
              <div className="relative">
                <img
                  src={logo}
                  alt="Uploaded Logo"
                  className="w-16 h-16 lg:w-24 lg:h-24 object-fit mb-2"
                />
                {isImageLoading && (
                  <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-500">
                    <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <FaImage className="text-gray-500 text-4xl  mb-4" />
                <p className="text-gray-500 lg:mb-4">
                  {isImageLoading ? 'Uploading...' : 'Upload Your Logo'}
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
      </div>
      {/* Button Container */}
      <div className="hidden w-full lg:flex  lg:flex-row justify-end gap-2  lg:mt-8 mt-2">
        {/* Attach Image Component */}
        <AttachImage
          onFileSelected={handleFileSelect}
          isLoading={isUploading}
          fileName={fileName}
          uploadCompleted={uploadCompleted}
        />

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
          <AttachImage
            onFileSelected={handleFileSelect}
            isLoading={isUploading}
            fileName={fileName}
            uploadCompleted={uploadCompleted}
          />
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
  )
}
