import { FaPaperclip, FaImage } from 'react-icons/fa'
import React, { useState } from 'react'
import uploadLogoToS3 from '../../../utils/uploadLogoToS3'
import axios from 'axios'
import { DisplayMode } from '../../../types/presentationView'
import { BackButton } from './shared/BackButton'

export default function Cover(
  heading: string,
  documentID: string,
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
) {
  const [logo, setLogo] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const authToken = sessionStorage.getItem('authToken')
  const orgId = sessionStorage.getItem('orgId')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIsUploading(true)
      try {
        const url = await uploadLogoToS3(file)
        setLogo(url)
      } catch (error) {
        console.error('Error uploading logo:', error)
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleButtonClick = () => {
    document.getElementById('logoUploadInput')?.click()
  }

  const handleGenerateSlide = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/cover`,
        {
          type: 'cover',
          title: heading,
          documentID: documentID,
          data: {
            slideName: heading,
            logo: logo,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const onBack = () => {
    setDisplayMode('customBuilder')
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="hidden lg:flex lg:w-full lg:absolute lg:left-0 lg:pl-8 lg:pr-8 lg:pt-4">
        <div className="flex items-center gap-8 w-full">
          <div className="flex gap-2"></div>
        </div>
      </div>

      <div className="w-full lg:flex lg:flex-col lg:justify-center lg:items-center lg:p-4 lg:sm:p-8">
        {/* Top Section: Headings */}
        <div className="flex lg:mt-2 items-center justify-between w-full px-4">
          <h2 className="hidden md:block md:text-lg font-semibold text-[#091220]">
            {heading}
          </h2>
          <BackButton onClick={onBack} />
        </div>

        <div className="w-[95%] mt-[0.5rem] lg:mt-0 border border-gray-300 rounded-xl p-4 h-72 flex flex-col justify-center items-center md:transition-transform md:transform md:hover:scale-105 mb-16">
          <input
            type="file"
            id="logoUploadInput"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center">
            {logo ? (
              <img
                src={logo}
                alt="Uploaded Logo"
                className="w-24 h-24 lg:w-48 lg:h-48 object-contain mb-4"
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
              className="px-4 py-2 border font-semibold rounded-xl text-gray-500 hover:bg-[#3667B2] hover:border-none hover:text-white active:scale-95 transition transform duration-300"
            >
              {logo ? 'Upload Again' : 'Upload Logo'}
            </button>
          </div>
        </div>

        <div className="flex gap-3 justify-end lg:justify-end w-full">
          <button
            type="button"
            className="flex items-center px-6 py-2 h-[3.3rem] lg:h-[2.7rem] border border-[#8A8B8C] hover:bg-[#3667B2] hover:border-[#2d599c] hover:text-white rounded-md active:scale-95 transition transform duration-300 text-[#797C81]"
          >
            <FaPaperclip className="h-4 w-4" />
            <span>Attach Image</span>
          </button>
          <button
            onClick={handleGenerateSlide}
            type="button"
            className="px-6 py-2 h-[3.3rem] lg:h-[2.7rem] border border-[#8A8B8C] bg-[#3667B2] hover:bg-white hover:border-[#797C81] hover:text-[#797C81] rounded-md active:scale-95 transition transform duration-300 text-white"
          >
            Generate Slide
          </button>
        </div>
      </div>
    </div>
  )
}
