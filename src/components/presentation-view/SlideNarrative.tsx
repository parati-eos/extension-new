import React, { useState } from 'react'
import axios from 'axios'
import { BackButton } from './custom-builder/shared/BackButton'
import { DisplayMode } from '../../types/presentationView'
import AttachImage from '../presentation-view/custom-builder/shared/attachimage'
import { toast } from 'react-toastify'
import uploadFileToS3 from '../../utils/uploadFileToS3'
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
    { value: 'Tables', label: 'Table', icon: TableIcon },
    { value: 'People', label: 'People', icon: PeopleIcon },
    { value: 'Statistics', label: 'Statistics', icon: StatisticsIcon },
    { value: 'Graphs', label: 'Graphs', icon: GraphIcon },
  ]

  const handleFileSelect = async (file: File | null) => {
    setIsLoading(true)
    if (file) {
      try {
        const url = await uploadFileToS3(file)
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
        toast.info(`Slide Generation Started for ${heading}`, {
          position: 'top-right',
          autoClose: 3000,
        })
      }
    } catch (error) {
      toast.error(`Failed to send narrative for ${heading}`, {
        position: 'top-right',
        autoClose: 3000,
      })
      setFailed()
      setDisplayMode('slides')
    } finally {
    }
  }

  const isGenerateDisabled = !narrative.trim() || !selectedOption
  const [showTooltip, setShowTooltip] = useState(false)
  const handleMouseEnter = () => {
    if (isGenerateDisabled) {
      setShowTooltip(true)
    }
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

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
            control: (provided, state) => ({
              ...provided,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer', // Hand cursor for the dropdown area
              backgroundColor: state.isFocused ? '#f9f9f9' : 'white', // Optional hover effect
            }),
            option: (provided, state) => ({
              ...provided,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer', // Hand cursor for each dropdown option
              padding: '10px',
              fontSize: '20px',
              backgroundColor: state.isFocused ? '#f0f0f0' : 'white', // Optional: highlight option on hover
            }),
            menu: (provided) => ({
              ...provided,
              cursor: 'pointer', // Ensure dropdown menu respects pointer style
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              cursor: 'pointer', // Hand cursor for dropdown indicator (arrow)
            }),
            placeholder: (provided) => ({
              ...provided,
              cursor: 'pointer', // Hand cursor for placeholder text
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
        {/* Generate Slide Button with Tooltip */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Tooltip */}
          {showTooltip && !selectedOption && (
            <span className="absolute top-[-35px] left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-10">
              Select Slide Type.
            </span>
          )}
          <button
            onClick={handleGenerateSlide}
            disabled={isGenerateDisabled || isLoading}
            className={`lg:w-[180px] py-2 px-5 justify-end rounded-md active:scale-95 transition transform duration-300 ${
              isGenerateDisabled || isLoading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#3667B2] text-white hover:bg-[#28518a]'
            }`}
          >
            Generate Slide
          </button>
        </div>
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
        {/* Generate Slide Button with Tooltip */}
        <div
          className="relative flex-1"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Tooltip */}
          {showTooltip && !selectedOption && (
            <div className="absolute top-[-35px] left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-10">
              Select Slide Type.
            </div>
          )}
          <button
            onClick={handleGenerateSlide}
            disabled={isGenerateDisabled || isLoading}
            className={`w-full py-2 rounded-md ${
              isGenerateDisabled || isLoading
                ? 'bg-gray-200 text-black cursor-not-allowed'
                : 'bg-[#3667B2] text-white hover:bg-[#28518a]'
            }`}
          >
            Generate Slide
          </button>
        </div>
      </div>
    </div>
  )
}
