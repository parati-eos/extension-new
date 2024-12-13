import axios from 'axios'
import React, { useEffect, useState } from 'react'
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
  FaCheck,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { IpInfoResponse } from '../../types/authTypes'
import { Plan } from '../../types/pricingTypes'
import { PricingModal } from '../shared/PricingModal'

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
  const [customTypeInput, setCustomTypeInput] = useState<string>('')
  const navigate = useNavigate()
  const [selectedTypeName, setSelectedTypeName] = useState<string | null>('')
  const authToken = sessionStorage.getItem('authToken')
  const orgId = sessionStorage.getItem('orgId')
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const pricingModalHeading = 'Refine PPT'
  const userPlan = sessionStorage.getItem('userPlan')
  const [monthlyPlan, setMonthlyPlan] = useState<Plan>()
  const [yearlyPlan, setYearlyPlan] = useState<Plan>()
  const [currency, setCurrency] = useState('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const uploadedFile = event.target.files[0]
      if (uploadedFile.type === 'application/pdf') {
        setFile(uploadedFile)
      } else {
        alert('Please upload a valid PDF file.')
      }
    }
  }

  const handleGenerate = () => {
    // Navigate immediately with initial placeholders
    navigate(
      `/presentation-view?documentID=loading&slideType=${selectedTypeName}`
    )

    const quickGenerate = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/generate-document/${orgId}/${selectedTypeName}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )

        const result = await response.data

        if (result.documentID && result.documentID !== '') {
          // Update the URL with actual query parameters
          navigate(
            `/presentation-view?documentID=${result.documentID}&slideType=${selectedTypeName}`,
            { replace: true }
          )
        }
      } catch (error) {
        console.error('Error generating document:', error)
      }
    }

    quickGenerate()
  }

  const handleRefinePPT = () => {
    const refinePPT = async () => {
      if (!file) {
        alert('Please upload a PDF file to refine the presentation.')
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', selectedTypeName || '')
      formData.append('orgId', orgId || '')

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/generate-document/${orgId}/${selectedTypeName}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        const result = await response.data
        if (result.documentID && result.documentID !== '') {
          navigate(
            `/presentation-view/?documentID=${result.documentID}/?presentationName=${result.presentationName}/?slideType=${selectedTypeName}`
          )
          console.log(result)
        }
      } catch (error) {
        console.error('Error refining presentation:', error)
        alert('Failed to refine the presentation. Please try again.')
      }
    }

    refinePPT()
  }

  const isButtonDisabled =
    selectedType === 8 ? !customTypeInput.trim() : !selectedType

  const refineButtonDisabled =
    userPlan === 'free'
      ? true
      : selectedType === 8
      ? !customTypeInput.trim()
      : !selectedType

  // API CALL TO GET PRICING DATA FOR MODAL
  useEffect(() => {
    const getPricingData = async () => {
      const ipInfoResponse = await fetch('https://ipapi.co/json/')
      const ipInfoData: IpInfoResponse = await ipInfoResponse.json()

      await axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/payments/razorpay/plans`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then((response) => {
          if (ipInfoData.country_name === 'IN' || 'India') {
            setMonthlyPlan(response.data.items[3])
            setYearlyPlan(response.data.items[1])
            setCurrency('INR')
          } else {
            setMonthlyPlan(response.data.items[2])
            setYearlyPlan(response.data.items[0])
            setCurrency('USD')
          }
        })
    }

    getPricingData()
  }, [])
  const monthlyPlanAmount = monthlyPlan?.item.amount! / 100
  const yearlyPlanAmount = yearlyPlan?.item.amount! / 100

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
              if (type.id !== 8) setIsModalOpen(true)
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
            {type.id === 8 && selectedType === 8 && (
              <div>
                <input
                  type="text"
                  value={customTypeInput}
                  onChange={(e) => {
                    setCustomTypeInput(e.target.value)
                    setSelectedTypeName(e.target.value)
                  }}
                  placeholder="Enter Custom type"
                  className="mt-2 p-2 border rounded w-full"
                />
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={!customTypeInput.trim()}
                  className={`absolute bottom-9 right-1 text-[#091220] md:hidden ${
                    customTypeInput.trim()
                      ? 'cursor-pointer'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FaCheck />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Generate Buttons for medium and large screens */}
      {selectedType && (
        <div className="hidden lg:flex w-max justify-center mt-4 ml-16">
          <button
            onClick={handleGenerate}
            disabled={isButtonDisabled}
            className={`h-[3.1rem] text-white px-4 rounded-lg active:scale-95 transition transform duration-300 mr-4 flex items-center ${
              isButtonDisabled
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#3667B2] hover:bg-[#0A8568]'
            }`}
          >
            Generate Presentation
          </button>
          <button
            onClick={() => {
              // setIsRefineModalOpen(true)
              setIsPricingModalOpen(true)
            }}
            // disabled={refineButtonDisabled}
            className={`h-[3.1rem] border px-4 rounded-lg active:scale-95 transition transform duration-300 ${
              refineButtonDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white text-[#091220] border-[#bcbdbe] hover:bg-[#3667B2] hover:text-white hover:border-none'
            }`}
          >
            Refine Presentation
          </button>
        </div>
      )}

      {/* Pricing Modal */}
      {isPricingModalOpen && userPlan === 'free' ? (
        <PricingModal
          closeModal={() => {
            setIsPricingModalOpen(false)
          }}
          heading={pricingModalHeading}
          monthlyPlanAmount={monthlyPlanAmount}
          yearlyPlanAmount={yearlyPlanAmount}
          currency={currency}
        />
      ) : (
        <></>
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
                className="bg-[#3667B2] h-[3.1rem] text-white py-2 px-4 rounded-lg active:scale-95 transition transform duration-300"
              >
                Generate Presentation
              </button>
              <button
                onClick={() => {
                  setIsRefineModalOpen(true)
                }}
                className="bg-white text-[#5D5F61] h-[3.1rem] border border-[#5D5F61] py-2 px-4 rounded-lg active:scale-95 transition transform duration-300"
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
          <div className="relative bg-white w-11/12 md:w-1/2 lg:w-1/3 rounded-lg md:rounded-3xl shadow-lg p-6">
            {/* Close Icon */}
            <div
              className="absolute top-4 right-4 md:top-5 bg-gray-200 rounded-full p-2 cursor-pointer"
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
            <div className="mt-4 md:mt-8">
              {file ? (
                <div className="flex items-center justify-between h-[3.1rem] bg-white border border-[#5D5F61] text-[#091220] py-2 px-4 rounded-xl">
                  <span className="text-[#5D5F61] truncate">{file.name}</span>
                  <button
                    className="text-[#8A8B8C] ml-2"
                    onClick={() => setFile(null)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
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
              )}
            </div>
            {/* Refine Button */}
            <button
              onClick={handleRefinePPT}
              className={`mt-4 md:mt-8 h-[3.1rem] w-full py-2 px-4 rounded-xl active:scale-95 transition transform duration-300${
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
