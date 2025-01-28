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
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setUserPlan } from '../../redux/slices/userSlice'
import uploadFileToS3 from '../../utils/uploadFileToS3'
import GuidedTour from '../onboarding/shared/GuidedTour'
import GuidedTourMobile from '../onboarding/shared/GuidedTourMobile'
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
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [pdfLink, setPdfLink] = useState('')
  const [pdfUploading, setPDFUploading] = useState(false)
  const [selectedType, setSelectedType] = useState<number | null>(null)
  const [customTypeInput, setCustomTypeInput] = useState<string>('')
  const navigate = useNavigate()
  const [selectedTypeName, setSelectedTypeName] = useState<string | null>('')
  const authToken = sessionStorage.getItem('authToken')
  const orgId = sessionStorage.getItem('orgId')
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const pricingModalHeading = 'Refine PPT'
  const userPlan = useSelector((state: any) => state.user.userPlan)
  const [monthlyPlan, setMonthlyPlan] = useState<Plan>()
  const [yearlyPlan, setYearlyPlan] = useState<Plan>()
  const [currency, setCurrency] = useState('')
  const [subId, setSubId] = useState('')
  const dispatch = useDispatch()
  const [eligibleForGeneration, setEligibleForGeneration] = useState(false)
  const [generateinput, setGenerateInput] = useState('')
  const [pptCount, setPptCount] = useState(0)
  const [pptCountMonthly, setPptCountMonthly] = useState(0)

  const generateDocumentID = () => {
    return 'Document-' + Date.now()
  }
  const generatedDocumentID = generateDocumentID()

  const MAX_FILE_SIZE_MB = 20 // Limit file size to 20MB

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPDFUploading(true)

    if (event.target.files && event.target.files[0]) {
      const uploadedFile = event.target.files[0]

      // Check file size
      const fileSizeMB = uploadedFile.size / (1024 * 1024)
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        toast.error(
          `File size exceeds ${MAX_FILE_SIZE_MB}MB. Please upload a smaller file.`,
          {
            position: 'top-right',
            autoClose: 3000,
          }
        )
        setPDFUploading(false)
        return
      }

      setFile(uploadedFile)

      try {
        const pdfUploaded = {
          name: uploadedFile.name,
          type: uploadedFile.type,
          body: uploadedFile, // Pass the File object directly
        }
        // Handle upload
        const pdfLink = await uploadFileToS3(pdfUploaded)
        setPdfLink(pdfLink)
      } catch (error) {
        console.error('Error uploading file:', error)
        toast.error('Failed to upload file. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        })
      } finally {
        setPDFUploading(false)
      }
    } else {
      setPDFUploading(false)
    }
  }

  const handleGenerate = () => {
    navigate(
      `/presentation-view?documentID=${generatedDocumentID}&slideType=${selectedTypeName}`
    )

    const quickGenerate = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/generate-document/${orgId}/${selectedTypeName}/${generatedDocumentID}`,
          {
            pptInput: generateinput,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )

        await response.data
      } catch (error: any) {
        if (error.response?.status === 404) {
          toast.error('Error generating ppt', {
            position: 'top-right',
            autoClose: 3000,
          })
        }
      }
    }

    const updatePptCount = async () => {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organizationedit/${orgId}`,
        {
          pptcount: pptCount + 1,
          pptcount_monthly: pptCountMonthly + 1,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
    }

    quickGenerate()
    updatePptCount()
  }

  const handleRefinePPT = () => {
    const refinePPT = async () => {
      if (!file) {
        toast.info('Please upload a PDF to refine', {
          position: 'top-right',
          autoClose: 3000,
        })
        return
      }

      navigate(
        `/presentation-view?documentID=${generatedDocumentID}&slideType=${selectedTypeName}`
      )

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/generate-document/refineppt/${orgId}/${selectedTypeName}/${generatedDocumentID}`,
          {
            pdfLink: pdfLink,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )

        await response.data
      } catch (error: any) {
        if (error.response?.status === 404) {
          toast.error('Error generating ppt', {
            position: 'top-right',
            autoClose: 3000,
          })
        }
      }
    }

    const updatePptCount = async () => {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organizationedit/${orgId}`,
        {
          pptcount: pptCount + 1,
          pptcount_monthly: pptCountMonthly + 1,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
    }
    refinePPT()
    updatePptCount()
  }

  const isButtonDisabled =
    selectedType === 8 ? !customTypeInput.trim() : !selectedType

  // API CALL TO GET PRICING DATA FOR MODAL AND USER PLAN
  useEffect(() => {
    const getPricingData = async () => {
      const ipInfoResponse = await fetch(
        'https://ipinfo.io/json?token=f0e9cf876d422e'
      )
      const ipInfoData: IpInfoResponse = await ipInfoResponse.json()

      await axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/appscripts/razorpay/plans`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then((response) => {
          const country = ipInfoData!.country!
          if (country !== 'IN' && country !== 'India' && country !== 'In') {
            setMonthlyPlan(response.data.items[4])
            setYearlyPlan(response.data.items[2])
            // setMonthlyPlan(response.data.items[1])
            // setYearlyPlan(response.data.items[0])
            setCurrency('USD')
          } else if (
            country === 'IN' ||
            country === 'India' ||
            country === 'In'
          ) {
            setMonthlyPlan(response.data.items[5])
            setYearlyPlan(response.data.items[3])
            // setMonthlyPlan(response.data.items[1])
            // setYearlyPlan(response.data.items[0])
            setCurrency('INR')
          }
        })
    }

    const fetchUserPlan = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/${orgId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        const planName = response.data.plan.plan_name
        const subscriptionId = response.data.plan.subscriptionId
        setPptCount(response.data.pptcount)
        setPptCountMonthly(response.data.pptcount_monthly)
        if (response.data.is_eligible === true) {
          setEligibleForGeneration(true)
        } else {
          setEligibleForGeneration(false)
        }
        dispatch(setUserPlan(planName))
        setSubId(subscriptionId)
      } catch (error) {
        console.error('Error fetching user plan:', error)
      }
    }

    fetchUserPlan()
    getPricingData()
  }, [])
  const monthlyPlanAmount = monthlyPlan?.item.amount! / 100
  const monthlyPlanId = monthlyPlan?.id
  const yearlyPlanAmount = yearlyPlan?.item.amount! / 100
  const yearlyPlanId = yearlyPlan?.id
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null)

  const handleMouseEnterGenerate = () => {
    setVisibleTooltip('generate')
  }

  const handleMouseLeaveGenerate = () => {
    if (visibleTooltip === 'generate') setVisibleTooltip(null)
  }

  const isGenerateVisible = visibleTooltip === 'generate'
  return (
    <div className="p-6 bg-[#F5F7FA] min-h-screen">
      {/* Heading */}
      <h1 className="text-2xl mt-2 font-semibold text-[#091220]">
        Create new or refine presentation
      </h1>
      {/* Subheading */}
      <p className="text-[#5D5F61] font-semibold text-left mt-2">
        Select presentation type to generate or refine your presentation
      </p>

      {/* Grid of Presentation Types */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 sm:gap-6 lg:ml-16 mt-10">
        {presentationTypes.map((type) => (
          <div
            key={type.id}
            className="relative flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg cursor-pointer lg:h-40 lg:w-52"
            onClick={() => {
              setSelectedType(type.id)
              if (type.id !== 8) setSelectedTypeName(type.label)
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
                    const value = e.target.value
                    // Allow only alphabets and spaces
                    const textOnly = value.replace(/[^a-zA-Z\s]/g, '')
                    setCustomTypeInput(textOnly)
                    setSelectedTypeName(textOnly)
                  }}
                  placeholder="Enter Custom type"
                  className="mt-2 p-2 border rounded w-full"
                />
                <button
                  onClick={() => setIsRefineModalOpen(true)}
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
      {/* Grid of Presentation Types Mobile */}
      <div className="lg:hidden grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 sm:gap-6 lg:ml-16 mt-10">
        {presentationTypes.map((type) => (
          <div
            key={type.id}
            className=" relative flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg cursor-pointer lg:h-40 lg:w-52"
            onClick={() => {
              setSelectedType(type.id)
              if (type.id !== 8) setIsRefineModalOpen(true)
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
                    const value = e.target.value
                    // Allow only alphabets and spaces
                    const textOnly = value.replace(/[^a-zA-Z\s]/g, '')
                    setCustomTypeInput(textOnly)
                    setSelectedTypeName(textOnly)
                  }}
                  placeholder="Enter Custom type"
                  className="mt-2 p-2 border rounded w-full"
                />
                <button
                  onClick={() => setIsRefineModalOpen(true)}
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
      <div className="hidden relative group lg:flex w-max justify-center mt-4 ml-16">
        <div
          className="relative group"
          onMouseEnter={handleMouseEnterGenerate}
          onMouseLeave={handleMouseLeaveGenerate}
        >
          <button
            id="generate-presentation"
            onClick={() => setIsRefineModalOpen(true)}
            disabled={
              !selectedType || isButtonDisabled || !eligibleForGeneration
            }
            className={`h-[3.1rem] text-white px-4 rounded-lg font-semibold active:scale-95 transition transform duration-300 mr-4 flex items-center ${
              !selectedType || isButtonDisabled || !eligibleForGeneration
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#3667B2] hover:bg-[#0A8568]'
            }`}
          >
            Generate Presentation
          </button>
          {isButtonDisabled && isGenerateVisible && (
            <div
              className="absolute top-full mt-2 w-[12rem] bg-gray-200 text-black p-2 rounded-2xl shadow-lg flex items-center justify-center"
              onMouseEnter={handleMouseEnterGenerate}
              onMouseLeave={handleMouseLeaveGenerate}
            >
              <p className="text-sm text-center text-gray-800">
                Please select a presentation type.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Modal */}
      {isPricingModalOpen && userPlan === 'free' ? (
        <PricingModal
          closeModal={() => {
            setIsPricingModalOpen(false)
          }}
          heading={pricingModalHeading}
          subscriptionId={subId}
          monthlyPlanAmount={monthlyPlanAmount}
          yearlyPlanAmount={yearlyPlanAmount}
          currency={currency}
          monthlyPlanId={monthlyPlanId!}
          yearlyPlanId={yearlyPlanId!}
          authToken={authToken!}
          orgId={orgId!}
        />
      ) : (
        <></>
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
          <div className="relative bg-white  w-11/12 md:w-1/2 lg:w-[40] rounded-lg md:rounded-3xl shadow-lg p-6">
            {/* Close Icon */}
            <div
              className="absolute top-4 right-4 md:top-5 bg-gray-200 rounded-full p-2 cursor-pointer"
              onClick={() => setIsRefineModalOpen(false)}
            >
              <FaTimes className="text-[#888a8f] text-lg" />
            </div>
            {/* Heading */}
            <h2 className="text-xl text-center font-semibold text-[#091220]">
              Generate Presentation
            </h2>
            {/* Subheading */}
            <p className="text-[#4A4B4D] text-center text-600 mt-2">
              Upload a document or provide context to generate a presentation
            </p>
            {/* Upload Button */}
            <div className="mt-4 md:mt-8">
              {pdfUploading && (
                <div className="flex items-center justify-center h-[3.1rem] mt-2 bg-white border border-[#5D5F61] text-[#091220] py-2 px-4 rounded-xl">
                  <span>Uploading...</span>
                </div>
              )}
              {file && !pdfUploading && (
                <div className="flex items-center justify-center h-[3.1rem] bg-white border border-[#5D5F61] text-[#091220] py-2 px-4 rounded-xl">
                  <span className="text-[#5D5F61] truncate">{file.name}</span>
                  <button
                    className="text-[#8A8B8C] ml-2"
                    onClick={() => {
                      setFile(null)
                      setPdfLink('')
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
              {!file && (
                <label className="flex items-center justify-center h-[3.1rem] bg-white border border-[#5D5F61] text-[#091220] py-2 px-4 rounded-xl cursor-pointer">
                  <FaUpload className="mr-2 text-[#5D5F61]" />
                  <span>Upload a Document</span>
                  <input
                    type="file"
                    accept=".pdf, .doc, .docx, .ppt, .pptx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
              {/* Add "or" */}
              <div className="flex justify-center items-center mt-3 text-[#091220]  text-sm font-medium">
                <span>or</span>
              </div>

              {/* Input for Context */}
              <div className="mt-4">
                <textarea
                  className="w-full h-[7rem] bg-white border border-[#5D5F61] text-[#091220] py-2 px-4 rounded-xl scrollbar-none"
                  placeholder="Please provide any context around the presentation you want to create or drop content in the text box below which may be relevant to the required presentation"
                  value={generateinput || ''}
                  onChange={(e) => setGenerateInput(e.target.value)}
                  maxLength={10000}
                ></textarea>
              </div>
            </div>

            {/* Refine Button */}
            <div className="items-center justify-center">
              <button
                onClick={pdfLink ? handleRefinePPT : handleGenerate}
                className="flex items-center justify-center bg-[#3667B2] w-full mt-4 h-[3.1rem] border border-[#5D5F61] text-white py-2 px-4 rounded-xl disabled:cursor-not-allowed active:scale-95 transition transform duration-300"
                disabled={pdfUploading || !eligibleForGeneration}
              >
                <span>Generate Presentation</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <GuidedTour />
      <GuidedTourMobile />
    </div>
  )
}

export default SelectPresentationType
