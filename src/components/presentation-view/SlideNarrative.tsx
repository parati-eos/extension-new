import React, { useState } from 'react'
import axios from 'axios'
import { BackButton } from './custom-builder/shared/BackButton'
import { DisplayMode } from '../../types/presentationView'
import AttachImage from '../presentation-view/custom-builder/shared/attachimage' // Import AttachImage component
import { toast } from 'react-toastify'
import uploadLogoToS3 from '../../utils/uploadLogoToS3'

interface SlideNarrativeProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
  setIsSlideLoading: () => void
  outlineID: string
}

export default function SlideNarrative({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
  setIsSlideLoading,
  outlineID,
}: SlideNarrativeProps) {
  const [narrative, setNarrative] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null) // Track the attached image
  const [fileName, setFileName] = useState<string | null>(null) // Track file name
  const [uploadCompleted, setUploadCompleted] = useState(false) // Track if upload is completed

  const handleFileSelect = async (file: File | null) => {
    setIsLoading(true)
    if (file) {
      try {
        const url = await uploadLogoToS3(file)
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
        setIsLoading(false)
      }
    }
  }

  const handleGenerateSlide = async () => {
    setIsSlideLoading()
    if (!narrative.trim()) return
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidenarrative/generate-document/${orgId}`,
        {
          type: slideType.charAt(0).toUpperCase() + slideType.slice(1),
          title: heading,
          documentID: documentID,
          input: narrative,
          outlineID: outlineID,
          image: selectedImage || '',
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      console.log('Server response:', response.data)
      if (response.data === 'ok') {
        setNarrative('')
        setDisplayMode('slides')
      }
      if (response) {
        toast.info('Slide Generation Started', {
          position: 'top-right',
          autoClose: 3000,
        })
      }
    } catch (error) {
      toast.error('Failed to send narrative.', {
        position: 'top-right',
        autoClose: 3000,
      })
      setDisplayMode('slides')
    } finally {
    }
  }

  const isGenerateDisabled = narrative.trim() === ''

  const onBack = () => {
    setDisplayMode('newContent')
  }

  return (
    <div className="flex flex-col p-2 lg:p-4 h-full">
      {/* Top Section: Headings */}
      <div className="hidden lg:flex  items-center justify-between  ">
        <h2 className="font-semibold text-[#091220]">Slide Narrative</h2>
        <BackButton onClick={onBack} />
      </div>
      <h3>{heading}</h3>

      {/* Input Section for Desktop */}
      <div className="hidden h-full w-full md:block flex-1 p-2 ">
        <div className="flex flex-col items-center justify-center h-full w-full ">
          <textarea
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder="Please provide some context and narrative to generate this slide."
            className="w-full resize-none h-full p-2 border overflow-y-auto scrollbar-none rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
      </div>

      {/* Input Section for Mobile */}
      <div className="flex w-full h-full lg:hidden md:hidden flex-1  ">
        <div className="p-2 flex flex-col h-full w-full items-center justify-center  ">
          <textarea
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder="Please provide some context and narrative to generate this slide."
            className="p-2  w-full h-full border border-gray-300 overflow-y-auto scrollbar-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
      </div>

      {/* Attach Image and Generate Slide Buttons for Desktop */}
      <div className="hidden  lg:flex w-full  lg:justify-end lg:w-auto lg:gap-4">
        {/* Attach Image Section */}
        <AttachImage
          onFileSelected={handleFileSelect}
          isLoading={isLoading}
          fileName={fileName}
          uploadCompleted={uploadCompleted}
        />
        {/* Generate Slide Button */}
        <button
          onClick={handleGenerateSlide}
          disabled={isGenerateDisabled}
          className={`lg:w-[180px] py-2 px-5 justify-end rounded-md active:scale-95 transition transform duration-300 ${
            isGenerateDisabled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-[#3667B2] text-white hover:bg-[#28518a]'
          }`}
        >
          Generate Slide
        </button>
      </div>

      {/* Attach Image and Generate Slide Buttons for Mobile */}
      <div className="flex lg:hidden p-2 gap-2  w-full ">
        <div className="flex-1  items-center justify-center gap-2">
          {/* Attach Image Section */}
          <AttachImage
            onFileSelected={handleFileSelect}
            isLoading={isLoading}
            fileName={fileName}
            uploadCompleted={uploadCompleted}
          />
        </div>
        <button
          onClick={handleGenerateSlide}
          disabled={isGenerateDisabled}
          className={`flex-1 py-2 rounded-md   ${
            isGenerateDisabled
              ? 'bg-gray-200 text-black cursor-not-allowed'
              : 'bg-[#3667B2] text-white'
          }`}
        >
          Generate Slide
        </button>
      </div>
    </div>
  )
}
