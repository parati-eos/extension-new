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
  onSlideGenerated: (slideDataId: string) => void; // ✅ FIXED

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
  onSlideGenerated, // ✅ add this prop
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
    { value: 'Points', label: 'Points', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435466780_points.svg" },
    { value: 'Phases', label: 'Timeline', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435399743_Presentation.svg"  },
    { value: 'Images', label: 'Images', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435517252_images.svg"},
    { value: 'Tables', label: 'Table', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435575006_table.svg"},
    { value: 'People', label: 'People',icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435517252_images.svg"},
    { value: 'Statistics', label: 'Statistics', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435650523_statistics.svg" },
    { value: 'Graphs', label: 'Graphs', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435703873_graphs.svg" },
    { value:"TextandImage",label:'TextandImage',icon:"https://d2zu6flr7wd65l.cloudfront.net/uploads/1742886487822_Presentation.svg"}
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
  if (!narrative.trim()) return;

  toast.info(`Request sent to generate a new version for ${heading}`, {
    position: 'top-right',
    autoClose: 3000,
  });

  setIsSlideLoading(); // trigger parent loading (progress modal will appear shortly)
  setIsLoading(true);  // show local loader in this component

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidenarrative/generate-document/${orgId}`,
      {
        type: selectedOption?.value,
        title: heading,
        documentID,
        input: narrative,
        outlineID,
        data: {
          image: selectedImage || '',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const slideDataId = response?.data?.data?.slideData_id;

    if (slideDataId) {
      onSlideGenerated(slideDataId); // ✅ Call progress start here
    } else {
      toast.error("Missing slideData_id in response.");
      return;
    }

    toast.success(`Slide Generation Started for ${heading}`, {
      position: 'top-right',
      autoClose: 3000,
    });

    setNarrative('');
    setDisplayMode('slides');
  } catch (error) {
    toast.error(`Failed to send narrative for ${heading}`, {
      position: 'top-right',
      autoClose: 3000,
    });
    setFailed();
    setDisplayMode('slides');
  } finally {
    setIsLoading(false); // ✅ Stop internal loader
  }
};

  




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
    setDisplayMode('slides')
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
    <div className="flex flex-col p-1 lg:p-2 h-full w-full">
      {/* Top Section: Headings */}
      <div className="hidden lg:flex  items-center justify-between  ">
        <h2 className="font-semibold text-[#091220]">Slide Narrative</h2>
        <BackButton onClick={onBack} />
      </div>

      {/* Slide Type Dropdown */}
      <div className="py-2 w-9/10 m-2">
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
          width: '22px',
          height: '22px',
          marginRight: '8px',
        }}
      />
      <span className='text-xs'>{data.label}</span>
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
        <div className="flex flex-col items-center justify-center h-full w-full text-xm">
          <textarea
        value={narrative}
        onChange={(e) => setNarrative(e.target.value)}
        placeholder="Please provide some context and narrative to generate this slide."
        className="w-full resize-none h-[300px] min-h-[300px] max-h-[500px] p-2 border overflow-y-auto scrollbar-none rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
          ></textarea>
        </div>
      </div>

      {/* Input Section for Mobile */}
      <div className="flex w-full h-[30vh] lg:hidden md:hidden flex-1  ">
        <div className="p-2 flex flex-col h-full w-full items-center justify-center  ">
          <textarea
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder="Please provide some context and narrative to generate this slide."
            className="p-2  w-full h-full border border-gray-300 overflow-y-auto scrollbar-none text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          selectedImage={selectedImage}
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
  disabled={isGenerateDisabled || isLoading} // <--- This line is already correct
  className={`lg:w-[180px] py-2 px-5 justify-end rounded-md active:scale-95 transition transform duration-300 ${
    isGenerateDisabled || isLoading
      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
      : 'bg-[#3667B2] text-white hover:bg-[#28518a]'
  }`}
>
  {isLoading ? 'Generating...' : 'Generate Slide'}
</button>

        </div>
      </div>

      {/* Attach Image and Generate Slide Buttons for Mobile */}
      <div className="flex flex-col  lg:hidden p-2 gap-2  w-full ">
        <div className="flex-1  items-center justify-center gap-2">
          {/* Attach Image Section */}
          <AttachImage
            onFileSelected={handleFileSelect}
            isLoading={isLoading}
            fileName={fileName}
            uploadCompleted={uploadCompleted}
            selectedImage={selectedImage}
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
  className={`w-full py-2 rounded-md text-sm ${
    isGenerateDisabled || isLoading
      ? 'bg-gray-200 text-black cursor-not-allowed'
      : 'bg-[#3667B2] text-white hover:bg-[#28518a]'
  }`}
>
  {isLoading ? 'Generating...' : 'Generate Slide'}
</button>

         
        </div>
        <BackButton onClick={onBack} />
      </div>
      {isLoading && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-b-4" />
  </div>
)}

    </div>
  )
}
