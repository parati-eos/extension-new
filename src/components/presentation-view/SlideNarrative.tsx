import React, { useState } from 'react'
import axios from 'axios'
import { BackButton } from './custom-builder/shared/BackButton'
import { DisplayMode } from '../../types/presentationView'
import AttachImage from '../presentation-view/custom-builder/shared/attachimage'
import { toast } from 'react-toastify'
import uploadLogoToS3 from '../../utils/uploadLogoToS3'
import Select, { components } from 'react-select'
import PointsIcon from '../../assets/points.svg'
import TimelineIcon from '../../assets/Presentation.svg'
import ImagesIcon from '../../assets/images.svg'
import TableIcon from '../../assets/table.svg'
import PeopleIcon from '../../assets/people.svg'
import StatisticsIcon from '../../assets/statistics.svg'
import GraphIcon from '../../assets/graphs.svg'

interface SlideNarrativeProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
  setIsSlideLoading: () => void
  outlineID: string
  setFailed: () => void
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
  setFailed,
}: SlideNarrativeProps) {
  const [narrative, setNarrative] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploadCompleted, setUploadCompleted] = useState(false)
  const [selectedOption, setSelectedOption] = useState<{
    value: string
    label: string
    icon: string
  } | null>(null)

  const CustomOption = (props: any) => {
    const { data, innerRef, innerProps } = props
    return (
      <div
        ref={innerRef}
        {...innerProps}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px',
        }}
      >
        <img
          src={data.icon}
          alt={data.label}
          style={{
            width: '30px',
            height: '30px',
            marginRight: '4px',
          }}
        />
        <span className="ml-2">{data.label}</span>
      </div>
    )
  }

  const options = [
    { value: 'Points', label: 'Points', icon: PointsIcon },
    { value: 'Phases', label: 'Timeline', icon: TimelineIcon },
    { value: 'Images', label: 'Images', icon: ImagesIcon },
    { value: 'Table', label: 'Table', icon: TableIcon },
    { value: 'People', label: 'People', icon: PeopleIcon },
    { value: 'Statistics', label: 'Statistics', icon: StatisticsIcon },
    { value: 'Graphs', label: 'Graphs', icon: GraphIcon },
  ]

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
    const storedOutlineIDs = sessionStorage.getItem('outlineIDs')
    if (storedOutlineIDs) {
      const outlineIDs = JSON.parse(storedOutlineIDs)

      // Check if currentOutlineID exists in the array
      if (outlineIDs.includes(outlineID)) {
        // Remove currentOutlineID from the array
        const updatedOutlineIDs = outlineIDs.filter(
          (id: string) => id !== outlineID
        )

        // Update the sessionStorage with the modified array
        sessionStorage.setItem('outlineIDs', JSON.stringify(updatedOutlineIDs))
      }
    }
    setIsSlideLoading()
    if (!narrative.trim()) return
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidenarrative/generate-document/${orgId}`,
        {
          type: selectedOption?.value,
          title: heading,
          documentID: documentID,
          input: narrative,
          outlineID: outlineID,
          data: {
            image: selectedImage || '',
          },
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
      setFailed()
      setDisplayMode('slides')
    } finally {
    }
  }

  const isGenerateDisabled = narrative.trim() === '' && !slideType

  const onBack = () => {
    setDisplayMode('newContent')
  }

  const handleSelectChange = (
    selected: { value: string; label: string; icon: string } | null
  ) => {
    setSelectedOption(selected)
  }

  return (
    <div className="flex flex-col p-2 lg:p-4 h-full">
      {/* Top Section: Headings */}
      <div className="hidden lg:flex  items-center justify-between  ">
        <h2 className="font-semibold text-[#091220]">Slide Narrative</h2>
        <BackButton onClick={onBack} />
      </div>

      {/* Slide Type Dropdown */}
      <div className="py-2">
        <Select
          options={options}
          getOptionLabel={(e) => (e ? e.label : '')}
          components={{ Option: CustomOption }}
          placeholder="Select Slide Type"
          value={selectedOption}
          onChange={handleSelectChange}
          className="w-full lg:w-[25%] items-center"
          isSearchable={false} // Disable search to prevent keypad
          styles={{
            control: (provided) => ({
              ...provided,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer', // Make cursor a pointer
            }),
            option: (provided) => ({
              ...provided,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer', // Make options clickable
              padding: '10px', // Increase padding
              fontSize: '20px', // Increase text size
            }),
            singleValue: (provided) => ({
              ...provided,
              display: 'flex',
              alignItems: 'center',
              fontSize: '15px', // Match text size with options
            }),
          }}
        />
      </div>
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
          disabled={(isGenerateDisabled && !slideType) || isLoading}
          className={`lg:w-[180px] py-2 px-5 justify-end rounded-md active:scale-95 transition transform duration-300 ${
            (isGenerateDisabled && !slideType) || isLoading
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
          disabled={(isGenerateDisabled && !slideType) || isLoading}
          className={`flex-1 py-2 rounded-md   ${
            (isGenerateDisabled && !slideType) || isLoading
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
