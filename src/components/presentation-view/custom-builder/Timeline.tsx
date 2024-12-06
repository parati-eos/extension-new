import { useState } from 'react'
import { FaPaperclip } from 'react-icons/fa'
import axios from 'axios'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../ViewPresentation'

interface TimelineProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
}

export default function Timeline({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
}: TimelineProps) {
  const [timeline, setTimeline] = useState([''])
  const [description, setDescription] = useState([''])
  const [loading, setLoading] = useState(false)

  const handleInputTitle = (value: string, index: number) => {
    const updatedPoints = [...timeline]
    updatedPoints[index] = value
    setTimeline(updatedPoints)
  }

  const handleInputDescription = (value: string, index: number) => {
    const updatedPoints = [...description]
    updatedPoints[index] = value
    setDescription(updatedPoints)
  }

  const addNewPoint = () => {
    if (timeline.length < 6) {
      setTimeline([...timeline, ''])
      setDescription([...description, ''])
    }
  }

  // Disable "Add New Timeline" button if the last title or description is empty
  const isAddDisabled =
    timeline[timeline.length - 1].trim() === '' ||
    description[description.length - 1].trim() === ''

  const isGenerateDisabled = timeline.some(
    (point, index) => point.trim() === '' || description[index].trim() === ''
  )

  const handleGenerateSlide = async () => {
    setLoading(true)
    try {
      const phases = timeline.map((point, index) => ({
        timeline: point,
        description: description[index],
      }))

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/phases`,
        {
          type: 'phases',
          title: heading,
          documentID: documentID,
          data: {
            slideName: heading,
            phases: phases,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      console.log('PATCH Response:', response.data)
      alert('Slide generated successfully!')
    } catch (error) {
      console.error('Error generating slide:', error)
      alert('Failed to generate slide.')
    } finally {
      setLoading(false)
    }
  }

  const onBack = () => {
    setDisplayMode('customBuilder')
  }

  return (
    <div className="flex flex-col p-4 h-full">
      {/* Top Section: Headings */}
      <div className="flex lg:mt-2 items-center justify-between w-full px-4">
        <h2 className="hidden md:block md:text-lg font-semibold text-[#091220]">
          {heading}
        </h2>
        <BackButton onClick={onBack} />
      </div>
      {/* Content container with flex-grow */}
      <div className="flex-1 overflow-y-auto">
        {timeline.map((point, index) => (
          <div
            key={index}
            className={`flex flex-col gap-2 px-4 mb-2 lg:mb-0 ${
              index === 0 ? 'lg:mt-14' : 'lg:mt-2'
            }`}
          >
            <input
              type="text"
              value={timeline[index]}
              onChange={(e) => handleInputTitle(e.target.value, index)}
              placeholder={'Enter timeline name'}
              className="lg:ml-2 flex-1 lg:w-[65%] lg:py-5 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={description[index]}
              onChange={(e) => handleInputDescription(e.target.value, index)}
              placeholder={'Enter description of timeline'}
              className="lg:ml-2 flex-1 lg:w-[65%] lg:py-5 p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        {/* Add New Timeline Button */}
        <button
          onClick={addNewPoint}
          type="button"
          disabled={timeline.length >= 6 || isAddDisabled}
          className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md mt-2 ml-6 hover:bg-[#3667B2] text-white ${
            timeline.length >= 6 || isAddDisabled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-[#3667B2]'
          }`}
        >
          Add New Timeline
        </button>
      </div>

      {/* Button container at the bottom */}
      <div className="mt-auto gap-2 flex w-full px-4 justify-between lg:justify-end lg:w-auto lg:gap-4">
        <button className="flex w-[47%] lg:w-[180px] items-center justify-center gap-x-2 py-2 border border-gray-300 rounded-md text-gray-700 bg-white">
          <FaPaperclip />
          Attach Image
        </button>
        <button
          onClick={handleGenerateSlide}
          disabled={isGenerateDisabled || loading}
          className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md ${
            isGenerateDisabled || loading
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-[#3667B2] text-white'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Slide'}
        </button>
      </div>
    </div>
  )
}
