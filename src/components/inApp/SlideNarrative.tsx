
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BackButton } from './BackButton'
import { DisplayMode } from '../../@types/presentationView'
import AttachImage from './attachimage'
import { toast } from 'react-toastify'
import uploadFileToS3 from '../../utils/uploadFileToS3'
import Select from 'react-select'
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
  } | null>({
    value: "Points",
    label: "Points",
    icon: PointsIcon, // Replace with the appropriate icon
  })
  


  

  const options = [
    { value: 'TextandImage', label: 'Text + Image', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1742886487822_Presentation.svg" },
    { value: 'Points', label: 'Points', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435466780_points.svg" },
    { value: 'Phases', label: 'Timeline', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435399743_Presentation.svg"  },
    { value: 'Images', label: 'Images', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435517252_images.svg"},
    { value: 'Tables', label: 'Table', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435575006_table.svg"},
    { value: 'People', label: 'People',icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435517252_images.svg"},
    { value: 'Statistics', label: 'Statistics', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435650523_statistics.svg" },
    { value: 'Graphs', label: 'Graphs', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435703873_graphs.svg" },
  ]

  const handleFileSelect = async (file: File | null) => {
      if (!file) {
      // If no file is provided (user removed image), reset states properly
      setUploadCompleted(false) // Ensure loading is stopped
      setSelectedImage(null)
      setUploadCompleted(false)
      setFileName(null)
      return
    }
    setIsLoading(true)
    if (file) {
      try {
        const uploadedFile = {
          name: file.name,
          type: file.type,
          body: file,
        }

        const url = await uploadFileToS3(uploadedFile)
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
    toast.info(`Request sent to a generate new version for ${heading}`, {
      position: 'top-right',
      autoClose: 3000,
    })
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

  useEffect(() => {
    const fetchData = async () => {
        // Clear all states first
    setNarrative('');
    setSelectedImage(null);
    setFileName(null);
      let slideTypeToBePassed = selectedOption ? selectedOption.value : slideType;
  
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidenarrative/fetch-input/${orgId}`,
          {
            type: slideTypeToBePassed,
            documentID: documentID,
            outlineID: outlineID,
            title: heading,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
          // Handle error response
      if (response.data?.error) {
        setNarrative('');
        setSelectedImage(null);
        setFileName(null);
        return;
      }
  
        if (response.data) {
          setNarrative(
            response.data.input && response.data.input !== "null" ? response.data.input : ""
          );
  
          const imageData = response.data.image;
          // Handle all image cases explicitly
          if (Array.isArray(imageData)) {
            // Empty array case
            if (imageData.length > 0) {
              setSelectedImage(imageData[0]);
              setFileName(imageData[0].split("/").pop());
            } else {
              setSelectedImage(null);
              setFileName(null);
            }
          } else if (typeof imageData === "string") {
            // Empty string case
            if (imageData.trim()) {
              setSelectedImage(imageData);
              setFileName(response.data.image.split("/").pop());
            } else {
              setSelectedImage(null);
              setFileName(null);
            }
          } else {
            // Null/undefined case
            setSelectedImage(null);
            setFileName(null);
          }
        }
      }  catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [selectedOption, outlineID, documentID, orgId, authToken, heading, slideType]); // Removed selectedImage from dependencies
  
  
  
  
  
  

  return (
    <div className="flex flex-col p-2 h-full w-full">
      {/* Top Section: Headings */}
      <div className="flex flex-row items-center justify-between  ">
        <h2 className="font-semibold text-[#091220]">Slide Narrative</h2>
        <BackButton onClick={onBack} />
      </div>

      {/* Slide Type Dropdown */}
      <div className="py-2">
      <Select
  options={options}
  getOptionLabel={(e) => e.label}
  placeholder="Select Slide Type"
  value={selectedOption}
  onChange={handleSelectChange}
  className="w-full lg:w-[25%] items-center"
  isSearchable={false} // Disable search
  formatOptionLabel={(data) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={data.icon}
        alt={data.label}
        style={{
          width: '24px',
          height: '24px',
          marginRight: '8px',
        }}
      />
      <span>{data.label}</span>
    </div>
  )}
  styles={{
    control: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
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
            className="w-full resize-none  h-[50vh] p-2 border overflow-y-auto scrollbar-none rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="p-2  w-full h-[50vh] border border-gray-300 overflow-y-auto scrollbar-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
      </div>

  {/* Attach Image and Generate Slide Buttons for Desktop */}
<div className="hidden lg:flex w-full lg:justify-end lg:w-auto lg:gap-4">
  {/* Attach Image Section (only for Images and Text + Image slides) */}
  {selectedOption?.value === "Images" || selectedOption?.value === "TextandImage" ? (
    <AttachImage
      onFileSelected={handleFileSelect}
      isLoading={isLoading}
      fileName={fileName}
      uploadCompleted={uploadCompleted}
      selectedImage={selectedImage}
    />
  ) : null}

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
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : "bg-[#3667B2] text-white hover:bg-[#28518a]"
      }`}
    >
      Generate Slide
    </button>
  </div>
</div>

{/* Attach Image and Generate Slide Buttons for Mobile */}
<div className="flex lg:hidden p-2 gap-2 w-full">
  {/* Attach Image Section (Only for Images and Text + Image slides) */}
  {selectedOption?.value === "Images" || selectedOption?.value === "TextandImage" ? (
    <div className="flex-1 items-center justify-center gap-2">
      <AttachImage
        onFileSelected={handleFileSelect}
        isLoading={isLoading}
        fileName={fileName}
        uploadCompleted={uploadCompleted}
        selectedImage={selectedImage}
      />
    </div>
  ) : null}

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
          ? "bg-gray-200 text-black cursor-not-allowed"
          : "bg-[#3667B2] text-white hover:bg-[#28518a]"
      }`}
    >
      Generate Slide
    </button>
  </div>
</div>

    </div>
  )
}