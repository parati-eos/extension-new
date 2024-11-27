import React, { useState } from 'react'
import {
  FaBox,
  FaDesktop,
  FaChartLine,
  FaBullhorn,
  FaBuilding,
  FaFileAlt,
  FaFileInvoice,
  FaEllipsisH,
  FaTimes,
  FaUpload,
  FaChevronUp,
  FaChevronDown,
  FaCheck,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const SelectPresentationType: React.FC = () => {
  const presentationTypes = [
    { id: 1, label: 'Product', icon: <FaBox className="text-[#3667B2]" /> },
    {
      id: 2,
      label: 'Pitch Deck',
      icon: <FaDesktop className="text-[#3667B2]" />,
    },
    {
      id: 3,
      label: 'Sales Deck',
      icon: <FaChartLine className="text-[#3667B2]" />,
    },
    {
      id: 4,
      label: 'Marketing',
      icon: <FaBullhorn className="text-[#3667B2]" />,
    },
    {
      id: 5,
      label: 'Company Overview',
      icon: <FaBuilding className="text-[#3667B2]" />,
    },
    {
      id: 6,
      label: 'Project Proposal',
      icon: <FaFileInvoice className="text-[#3667B2]" />,
    },
    {
      id: 7,
      label: 'Project Summary',
      icon: <FaFileAlt className="text-[#3667B2]" />,
    },
    {
      id: 8,
      label: 'Others',
      icon: <FaEllipsisH className="text-[#3667B2]" />,
    },
  ]

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [selectedType, setSelectedType] = useState<number | null>(null)
  const [generateDropdownOpen, setGenerateDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const [selectedTypeName, setSelectedTypeName] = useState<string | null>('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
    }
  }

  const handleGenerate = () => {
    navigate(`/presentation-view/?slideType=${selectedTypeName}`)
  }

  return (
    <div className="p-6 bg-[#F5F7FA] min-h-screen">
      {/* Heading */}
      <h1 className="text-2xl mt-2 font-semibold text-[#091220]">
        Create new or refine presentation
      </h1>
      {/* Subheading */}
      <p className="text-[#5D5F61] text-left mt-2">
        Select presentation type to generate or refine your presentation
      </p>

      {/* Grid of Presentation Types */}
      <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 sm:gap-6 lg:ml-16 mt-10">
        {presentationTypes.map((type) => (
          <div
            key={type.id}
            className="relative flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg cursor-pointer lg:h-40 lg:w-52"
            onClick={() => {
              setSelectedType(type.id)
              setIsModalOpen(true)
              setSelectedTypeName(type.label)
            }}
          >
            {/* Check Icon for Medium and Large Screens */}
            {selectedType === type.id && (
              <div className="hidden lg:block absolute top-2 right-2 bg-[#3667B2] text-white rounded-full p-1">
                <FaCheck />
              </div>
            )}
            {/* Icon */}
            <div className="text-3xl mb-4">{type.icon}</div>
            {/* Label */}
            <p className="text-gray-800 text-center font-medium">
              {type.label}
            </p>
          </div>
        ))}
      </div>

      {/* Generate Buttons for medium and large screens */}
      {selectedType && (
        <div className="hidden lg:flex flex-col w-max justify-center mt-4 ml-16">
          <button
            onClick={handleGenerate}
            className="bg-[#3667B2] h-[3.1rem] text-white px-4 rounded-lg mr-4 flex items-center"
          >
            Generate Presentation
            <span className="mx-2 w-px h-full bg-[#4883db]"></span>
            <span
              onClick={(e) => {
                e.stopPropagation() // Prevents triggering the parent button's onClick
                setGenerateDropdownOpen(!generateDropdownOpen)
              }}
            >
              {generateDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </button>
          {generateDropdownOpen && (
            <button
              onClick={() => {
                setIsRefineModalOpen(true)
                setGenerateDropdownOpen(false)
              }}
              className="bg-white text-[#091220] h-[3.1rem] border border-[#bcbdbe] py-2 px-4 rounded-lg mr-4 mt-2"
            >
              Refine Presentation
            </button>
          )}
        </div>
      )}

      {/* Generate Modal*/}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-end lg:hidden">
          {/* Dimmed Background */}
          <div
            className="absolute inset-0 bg-gray-900 bg-opacity-50"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full rounded-t-lg shadow-lg px-4 pb-4 pt-[5.5rem]">
            {/* Close Icon */}
            <div
              className="absolute top-5 right-4 bg-gray-200 rounded-full p-2 cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes className="text-[#888a8f] text-lg" />
            </div>
            {/* Buttons */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleGenerate}
                className="bg-[#3667B2] h-[3.1rem] text-white py-2 px-4 rounded-lg"
              >
                Generate Presentation
              </button>
              <button
                onClick={() => {
                  setIsRefineModalOpen(true)
                }}
                className="bg-white text-[#5D5F61] h-[3.1rem] border border-[#5D5F61] py-2 px-4 rounded-lg"
              >
                Refine Presentation
              </button>
              <button
                className=" text-[#5D5F61] py-2 px-4 rounded-lg"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refine Modal */}
      {isRefineModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          {/* Dimmed Background */}
          <div
            className="absolute inset-0 bg-gray-900 bg-opacity-50"
            onClick={() => setIsRefineModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-11/12 md:w-1/2 lg:w-1/3 rounded-lg shadow-lg p-6">
            {/* Close Icon */}
            <div
              className="absolute top-4 right-4 bg-gray-200 rounded-full p-2 cursor-pointer"
              onClick={() => setIsRefineModalOpen(false)}
            >
              <FaTimes className="text-[#888a8f] text-lg" />
            </div>
            {/* Heading */}
            <h2 className="text-xl text-center font-semibold text-[#091220]">
              Refine Presentation
            </h2>
            {/* Subheading */}
            <p className="text-[#4A4B4D] text-center text-600 mt-2">
              Upload your presentation to refine it
            </p>
            {/* Upload Button */}
            <div className="mt-4">
              <label className="flex items-center justify-center h-[3.1rem] bg-white border border-[#5D5F61] text-[#091220] py-2 px-4 rounded-xl cursor-pointer">
                <FaUpload className="mr-2 text-[#5D5F61]" />
                <span>Upload Presentation</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {/* Refine Button */}
            <button
              className={`mt-4 h-[3.1rem] w-full py-2 px-4 rounded-xl ${
                file
                  ? 'bg-[#3667B2] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!file}
            >
              Refine Presentation
            </button>
            {/* Cancel Button */}
            <button
              className="mt-4 w-full py-2 px-4 rounded-lg text-[#5D5F61]"
              onClick={() => setIsRefineModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectPresentationType
