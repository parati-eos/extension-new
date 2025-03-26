import { FaImage } from 'react-icons/fa'
import React, { useState, useRef, useEffect } from 'react'
import uploadFileToS3 from './uploadfiletoS3'
import axios from 'axios'
import { DisplayMode } from '../../@types/presentationView'
import { BackButton } from './BackButton'
import { toast } from 'react-toastify'
import AttachImage from './attachimage'

interface CoverProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
  outlineID: string
  setIsSlideLoading: () => void
  setFailed: () => void
  handleBack: () => void
}

export default function Cover({
  heading,
  slideType,
  handleBack,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
  outlineID,
  setIsSlideLoading,
  setFailed,
}: CoverProps) {
  const [logo, setLogo] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null) // Track file name
  const [uploadCompleted, setUploadCompleted] = useState(false)
  const [tagline, setTagline] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)

  const handleMouseEnter = () => {
    setIsTooltipVisible(true)
  }

  const handleMouseLeave = () => {
    setIsTooltipVisible(false)
  }
  const handleTouchStart = () => setIsTooltipVisible(true)
  const handleTouchEnd = () => setIsTooltipVisible(false)
  // Ref for file input to trigger on button click
  const logoUploadInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsImageLoading(true)
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      try {
        const uploadedFile = {
          name: file.name,
          type: file.type,
          body: file,
        }
        const url = await uploadFileToS3(uploadedFile)
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
    if (!file) {
      // If no file is provided (user removed image), reset states properly
      setIsImageLoading(false) // Ensure loading is stopped
      setSelectedImage(null)
      setUploadCompleted(false)
      setFileName(null)
      return
    }
    setIsUploading(true)
    if (file) {
      try {
        const uploadedFile = {
          name: file.name,
          type: file.type,
          body: file,
        }
        const url = await uploadFileToS3(uploadedFile)
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
    toast.info(`Request sent to a generate new version for ${heading}`, {
      position: 'top-right',
      autoClose: 3000,
    })
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
            image: selectedImage ? [selectedImage] : [],
          },
          outlineID,
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
  const fetchSlideData = async () => {
    const payload = {
      type: 'Cover',
      title: heading,
      documentID,
      outlineID,
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/fetch-document/${orgId}/cover`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      if (response.status === 200) {
        const slideData = response.data

        // Update states based on response data

        if (slideData.tagline) {
          // If tagline is "Default Tagline", pass an empty string
          const taglineToSet =
            slideData.tagline === 'Default Tagline' ? '' : slideData.tagline
          setTagline(taglineToSet) // Set tagline with empty string if it's "Default Tagline"
        }
        if (slideData.companyName) {
          setCompanyName(slideData.companyName) // Set company name
        }
        if (
          slideData.logo &&
          (slideData.logo.startsWith('https://') ||
            slideData.logo.startsWith('http://'))
        ) {
          setLogo(slideData.logo) // Set logo URL if it starts with "http://" or "https://"
        } else {
          setLogo('') // Set logo to empty string or null if the URL is invalid
        }

        // Set other properties as needed
        // Example: if there's an image, you can set it similarly
        if (slideData.image && slideData.image.length > 0) {
          setSelectedImage(slideData.image[0]) // Assume the first image
          setFileName(slideData.image[0].split('/').pop())
          
        }else {
          setSelectedImage(null) // No image if array is empty
          setFileName(null)
        }
      }
    } catch (error) {}
  }

  // Call fetchSlideType on component mount
  useEffect(() => {
    fetchSlideData()
  }, [documentID, outlineID, orgId, heading, authToken]) // Dependency array ensures re-fetch when dependencies change
  return (
    <div className="flex flex-col h-full w-full p-2 lg:p-4">
      {/* Header Section */}
      <div className="flex items-center justify-between w-full">
        <h3 className="text-semibold">Cover</h3>
        <BackButton onClick={handleBack} />
      </div>
      <div className="flex items-center "></div>
      <div className="py-2 lg:mt-8">
        <input
          type="text"
          placeholder="Enter your tagline"
          onChange={(e) => setTagline(e.target.value)}
          className=" py-1 px-2 lg:w-[50%] w-full border border-gray-300 rounded-lg "
          value={tagline}
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
                  className="w-16 h-16 lg:w-24 lg:h-24 rounded-full   object-contain aspect-auto"
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
      <div className="hidden mt-auto gap-2 lg:flex w-full  justify-between lg:justify-end lg:w-auto lg:gap-4">
        {/* Attach Image Component */}
        <AttachImage
          onFileSelected={handleFileSelect}
          isLoading={isUploading}
          fileName={fileName}
          uploadCompleted={uploadCompleted}
          selectedImage={selectedImage}
        />

        {/* Generate Slide Button */}
        <div 
  className="relative" 
  onMouseEnter={handleMouseEnter} 
  onMouseLeave={handleMouseLeave}
>
          <button
           
            disabled={!tagline.trim() || isLoading || isUploading ||isImageLoading}
            onClick={handleGenerateSlide}
            className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md transition-all duration-200 transform ${
              !tagline.trim() || isLoading || isUploading||isImageLoading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#3667B2] text-white hover:bg-[#274a89]'
            }`}
          >
            {isLoading ? 'Loading...' : 'Generate Slide'}
          </button>

          {/* Tooltip */}
{isTooltipVisible && !tagline.trim() && (
  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-max bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md">
    Please enter a tagline.
  </div>
)}

        </div>
      </div>

      {/* Attach Image and Generate Slide Buttons for Mobile */}
      <div className="flex lg:hidden mt-2 gap-2 w-full relative">
        <div className="flex-1 items-center justify-center gap-2">
          <AttachImage
            onFileSelected={handleFileSelect}
            isLoading={isUploading}
            fileName={fileName}
            uploadCompleted={uploadCompleted}
          />
        </div>

        <div className="relative flex-1"
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
        >
          <button
           
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={handleGenerateSlide}
            disabled={!tagline.trim() || isLoading || isUploading ||isImageLoading}
            className={`w-full py-2 rounded-md ${
              !tagline.trim() || isLoading || isUploading||isImageLoading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#3667B2] text-white hover:bg-[#274a89]'
            }`}
          >
            {isLoading ? 'Loading...' : 'Generate Slide'}
          </button>

          {/* Tooltip */}
     {/* Tooltip */}
{isTooltipVisible && !tagline.trim() && (
  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-max bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md">
    Please enter a tagline.
  </div>
)}

        </div>
      </div>
    </div>
  )
}
