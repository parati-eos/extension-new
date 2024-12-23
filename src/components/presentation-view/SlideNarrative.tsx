import React, { useState } from 'react'
import axios from 'axios'
import { BackButton } from './custom-builder/shared/BackButton'
import { DisplayMode } from '../../types/presentationView'
import AttachImage from '../presentation-view/custom-builder/shared/attachimage' // Import AttachImage component
import { toast } from 'react-toastify'

interface SlideNarrativeProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
}

export default function SlideNarrative({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
}: SlideNarrativeProps) {
  const [narrative, setNarrative] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null) // Track the attached image

  const handleFileSelect = (file: File | null) => {
    setSelectedImage(file)
  }

  const handleGenerateSlide = async () => {
    if (!narrative.trim()) return
    setIsLoading(true)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidenarrative/generate-document/${orgId}/${slideType}`,
        {
          type: slideType,
          title: heading,
          documentID: documentID,
          userId: sessionStorage.getItem('userEmail'),
          input: narrative,
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

        setIsLoading(false)
        setDisplayMode('slides')
      }
    } catch (error) {
      toast.error('Error generating slide', {
        position: 'top-center',
        autoClose: 2000,
      })
      toast.error('Failed to send narrative.')
      setDisplayMode('slides')
    } finally {
      setIsLoading(false)
    }
  }

  const isGenerateDisabled = narrative.trim() === ''

  const onBack = () => {
    setDisplayMode('newContent')
  }

  return (
    <div className="flex flex-col p-2 lg:p-4 h-full">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
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
          <div className="hidden  lg:flex w-full   lg:justify-end lg:w-auto lg:gap-4">
            {/* Attach Image Section */}
            <AttachImage onFileSelected={handleFileSelect} />

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
              <AttachImage onFileSelected={handleFileSelect} />
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
        </>
      )}
    </div>
  )
}
