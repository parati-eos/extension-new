import React, { useState } from 'react'
import axios from 'axios'
import { FaImage } from 'react-icons/fa'
import uploadLogoToS3 from '../../../utils/uploadLogoToS3'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../../../types/presentationView'

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)

    if (images.length + files.length > 4) {
      alert('You can upload a maximum of 4 images.')
      return
    }

    setIsUploading(true)
    try {
      const uploadedImages = await Promise.all(
        files.map((file) => uploadLogoToS3(file))
      )
      setImages((prevImages) => [...prevImages, ...uploadedImages])
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/images`,
        {
          type: 'images',
          title: heading,
          documentID: documentID,
          data: {
            slideName: heading,
            imageurl: images,
          },
        }
      )
      alert('Images submitted successfully!')
    } catch (error) {
      console.error('Submit failed:', error)
      alert('Failed to submit images.')
    }
  }

  const onBack = () => {
    setDisplayMode('customBuilder')
  }

  return (
    <div className="flex flex-col h-full w-full p-4">
      {/* Heading */}
      <div className="flex items-center justify-between w-full mb-4">
        <h2 className="hidden md:block md:text-lg font-semibold text-[#091220]">
          {heading}
        </h2>
        <BackButton onClick={onBack} />
      </div>

      {/* Image Input Section */}
      <div className="flex justify-center w-full md:mt-4 lg:mt-8 xl:mt-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {images.map((image, index) => (
            <div key={index} className="w-full aspect-square">
              <img
                src={image}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}

          {images.length < 4 && (
            <div className="flex items-center justify-center w-full h-[30%] md:h-full aspect-square border border-gray-300 rounded-lg">
              <button
                onClick={() => document.getElementById('imageInput')?.click()}
                className="flex md:flex-col gap-2 md:gap-0 items-center justify-center w-full h-full"
              >
                <FaImage className="text-2xl text-gray-500" />
                <p className="text-gray-500 text-sm md:mt-2">
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </p>
              </button>
              <input
                type="file"
                id="imageInput"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Generate Slide Button */}
      <button
        onClick={handleSubmit}
        disabled={!images}
        className={`absolute bottom-4 right-4 py-2 px-4 rounded-md active:scale-95 duration-300 transition-all transform ${
          images
            ? 'bg-[#3667B2] text-white hover:bg-[#2c56a0] hover:shadow-lg active:scale-95'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
        }`}
      >
        Generate Slide
      </button>
    </div>
  )
}
