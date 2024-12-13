import axios from 'axios'
import React, { useState, useEffect } from 'react'
import {
  FaFilter,
  FaSort,
  FaEllipsisV,
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
  FaEdit,
  FaShareAlt,
  FaFilePdf,
  FaGoogleDrive,
  FaTrashAlt,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { PricingModal } from '../shared/PricingModal'
import { IpInfoResponse } from '../../types/authTypes'
import { Plan } from '../../types/pricingTypes'

const HistoryContainer: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const [historyData, setHistoryData] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([]) // Holds filtered data
  const [selectedFilter, setSelectedFilter] = useState<string>('all') // Filter state
  const [selectedSort, setSelectedSort] = useState<string>('recent') // Sort state
  const [isLoading, setIsLoading] = useState(false)
  const userId = sessionStorage.getItem('userEmail')
  const historyUrl = process.env.REACT_APP_BACKEND_URL || ''
  const authToken = sessionStorage.getItem('authToken')
  const orgId = sessionStorage.getItem('orgId')
  const navigate = useNavigate()
  const userPlan = sessionStorage.getItem('userPlan')
  const [pricingModalHeading, setPricingModalHeading] = useState('')
  const [monthlyPlan, setMonthlyPlan] = useState<Plan>()
  const [yearlyPlan, setYearlyPlan] = useState<Plan>()
  const [currency, setCurrency] = useState('')

  const presentationsToShow = filteredData?.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  )

  const handleShare = (documentID: string) => {
    const uniqueShareableUrl = `/share?formId=${documentID}`

    if (navigator.share) {
      navigator
        .share({
          title: 'Share Presentation',
          text: 'Check out this presentation',
          url: uniqueShareableUrl,
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.error('Share failed: ', error))
    } else if (navigator.clipboard && navigator.platform.includes('Mac')) {
      navigator.clipboard
        .writeText(uniqueShareableUrl)
        .then(() => alert('URL copied to clipboard'))
        .catch((error) => console.error('Copy failed: ', error))
    } else {
      alert('Sharing is not supported on this device/browser.')
    }
  }

  const handleEdit = (documentID: string, name: string) => {
    navigate(
      `/presentation-view?documentID=${documentID}&presentationName=${name}`
    )
  }

  // History Item Dropdown
  useEffect(() => {
    if (activeDropdown !== null) {
      const timer = setTimeout(() => setActiveDropdown(null), 8000)
      return () => clearTimeout(timer)
    }
  }, [activeDropdown])

  // Handle clicks and scroll to close dropdown
  useEffect(() => {
    const handleOutsideClick = () =>
      activeDropdown !== null && setActiveDropdown(null)
    const handleScroll = () => setActiveDropdown(null)

    document.addEventListener('click', handleOutsideClick)
    window.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [activeDropdown])

  // API CALL TO GET HISTORY DATA
  useEffect(() => {
    setIsLoading(true)
    const fetchHistoryData = async () => {
      try {
        const response = await fetch(
          `${historyUrl}/api/v1/data/slidedisplay/history/${orgId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        const result = await response.json()
        console.log('History Result: ', result.data)

        // Handle empty response
        if (Array.isArray(result.data) && result.data.length === 0) {
          console.warn('No history data found.')
        }

        // Set history data or an empty array to ensure consistency
        setHistoryData(result.data || [])
        setFilteredData(result.data || []) // Ensure filteredData is also set
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching history data:', error)
        setIsLoading(false) // Stop loading in case of an error
      }
    }
    fetchHistoryData()
  }, [userId, historyUrl, authToken])

  // Apply Filter and Sort Logic
  useEffect(() => {
    let updatedData = [...historyData]

    if (selectedFilter !== 'all') {
      updatedData = updatedData.filter(
        (item) => item.ppt_type === selectedFilter
      )
    }

    if (selectedSort === 'recent') {
      updatedData.sort(
        (a, b) =>
          new Date(b.currentTime).getTime() - new Date(a.currentTime).getTime()
      )
    } else if (selectedSort === 'oldest') {
      updatedData.sort(
        (a, b) =>
          new Date(a.currentTime).getTime() - new Date(b.currentTime).getTime()
      )
    }

    setFilteredData(updatedData)
  }, [selectedFilter, selectedSort, historyData])

  // API CALL TO GET PRICING DATA FOR MODAL
  useEffect(() => {
    const getPricingData = async () => {
      const ipInfoResponse = await fetch(
        'https://ipinfo.io/json?token=f0e9cf876d422e'
      )
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
          if (ipInfoData.country === 'IN' || 'India') {
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

    const timer = setTimeout(() => {
      getPricingData()
    }, 3000) // delay

    // Cleanup the timer in case the component unmounts
    return () => clearTimeout(timer)
  }, [])
  const monthlyPlanAmount = monthlyPlan?.item.amount! / 100
  const yearlyPlanAmount = yearlyPlan?.item.amount! / 100

  return (
    <>
      {isLoading ? (
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="p-4 py-7 bg-[#F5F7FA] min-h-screen relative">
          {/* Heading Section */}
          <div className="flex justify-between items-center mb-7">
            <h1 className="text-2xl font-bold text-[#091220]">History</h1>
            <div className="flex gap-4">
              {/* Filter and Sort for Small Screens */}
              <div className="flex gap-4 lg:hidden">
                <div
                  className="bg-white p-2 rounded-md shadow cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <FaFilter className="text-[#5D5F61] text-xl" />
                </div>
                <div className="bg-white p-2 rounded-md shadow cursor-pointer">
                  <FaSort className="text-[#5D5F61] text-xl" />
                </div>
              </div>

              {/* Filter and Sort for Large Screens */}
              <div className="hidden lg:flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[#5D5F61]">View by PPT Type</span>
                  <select
                    className="bg-white text-[#8A8B8C] text-sm p-2 w-fit rounded-md border border-[#E1E3E5]"
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                  >
                    <option value="all">Select Type</option>
                    <option value="Product">Product</option>
                    <option value="Pitch Deck">Pitch Deck</option>
                    <option value="Sales Deck">Sales Deck</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Business">Business</option>
                    <option value="Company Overview">Company Overview</option>
                    <option value="Project Proposal">Project Proposal</option>
                    <option value="Project Summary">Project Summary</option>
                    <option value="others">Others</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#5D5F61]">Sort by</span>
                  <select
                    className="bg-white p-2 w-fit text-[#8A8B8C] text-sm rounded-md border border-[#E1E3E5]"
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                  >
                    <option value="recent">Recent First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* History Container */}
          {filteredData?.length === 0 && !isLoading ? (
            <div className="text-center relative top-24 flex flex-col items-center justify-center py-10">
              <p className="text-lg text-[#091220] font-semibold">
                No presentations to see here. Generate your first presentation
                using Zynth.
              </p>
              <button
                className="mt-4 bg-[#3667B2] hover:bg-white hover:text-[#3667B2] hover:border hover:border-[#3667B2] active:scale-95 transition transform duration-300 text-white px-4 py-2 rounded-md"
                onClick={() => navigate('/new-presentation')}
              >
                Generate Presentation
              </button>
            </div>
          ) : (
            <div className="bg-white mt-10 lg:mt-0 shadow-sm rounded-xl mb-2">
              {/* Mobile/Small Screen Layout */}
              <div className="block md:hidden">
                {presentationsToShow?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 py-6 relative"
                  >
                    <iframe
                      src={item.PresentationURL}
                      title={item.pptName}
                      onClick={() => handleEdit(item.FormID, item.pptName)}
                      className="w-16 h-16 object-cover hover:cursor-pointer rounded-md mr-4"
                      sandbox="allow-same-origin allow-scripts"
                      scrolling="no"
                      style={{ overflow: 'hidden' }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-medium text-[#091220]">
                          {item.pptName}
                        </h2>
                        {/* Ellipsis Icon */}
                        <FaEllipsisV
                          className="text-[#8A8B8C] cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveDropdown(
                              activeDropdown === index ? null : index
                            )
                          }}
                        />
                      </div>
                      <div className="flex gap-1 text-sm mt-1">
                        <div className="mr-4">
                          <span className="block mb-1 font-medium text-[#5D5F61]">
                            PPT Type
                          </span>
                          <span className="text-[#091220]">
                            {item.ppt_type}
                          </span>
                        </div>
                        <div>
                          <span className="block mb-1 font-medium text-[#5D5F61]">
                            Date
                          </span>
                          <span className="text-[#091220]">
                            {new Date(item.currentTime).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Dropdown */}
                    {activeDropdown === index && (
                      <div className="absolute right-0 top-[50%] mt-2 w-40 bg-white rounded-lg shadow-lg z-50 p-4">
                        <button
                          onClick={() => handleEdit(item.FormID, item.pptName)}
                          className="flex items-center gap-3 text-base text-[#5D5F61] mb-3 cursor-pointer"
                        >
                          <FaEdit className="text-[#5D5F61]" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleShare(item.FormID)}
                          className="flex items-center gap-3 text-base text-[#5D5F61] mb-3 cursor-pointer"
                        >
                          <FaShareAlt className="text-[#5D5F61]" />
                          <span>Share</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsPricingModalOpen(true)
                            setPricingModalHeading('PDF Export')
                          }}
                          className="flex items-center gap-3 text-base text-[#5D5F61] mb-3 cursor-pointer"
                        >
                          <FaFilePdf className="text-[#5D5F61]" />
                          <span>PDF Export</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsPricingModalOpen(true)
                            setPricingModalHeading('Google Slides')
                          }}
                          className="flex items-center gap-3 text-base text-[#5D5F61] mb-2 cursor-pointer"
                        >
                          <FaGoogleDrive className="text-[#5D5F61]" />
                          <span>Google Slides</span>
                        </button>
                        <div className="flex items-center gap-3 text-base text-[#5D5F61] cursor-pointer">
                          <FaTrashAlt />
                          <span>Delete</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Medium/Large Screen Layout */}
              <div className="hidden min-h-full md:block">
                {presentationsToShow?.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[auto,1fr,1fr,1fr,auto] items-center p-4 py-6 relative gap-x-4 lg:gap-x-6"
                  >
                    {/* Image */}
                    <iframe
                      src={item.PresentationURL}
                      title={item.pptName}
                      onClick={() => handleEdit(item.FormID, item.pptName)}
                      sandbox="allow-same-origin allow-scripts"
                      scrolling="no"
                      style={{ overflow: 'hidden' }}
                      className="w-24 h-16 object-cover rounded-md"
                    />

                    {/* Title */}
                    <div className="text-lg font-medium text-[#091220]">
                      {item.pptName}
                    </div>

                    {/* PPT Type */}
                    <div className="text-sm flex flex-col">
                      <span className="font-medium text-[#5D5F61] mr-2">
                        PPT Type:
                      </span>
                      <span className="text-[#091220]">{item.ppt_type}</span>
                    </div>

                    {/* Date */}
                    <div className="text-sm flex flex-col">
                      <span className="font-medium text-[#5D5F61] mr-2">
                        Date:
                      </span>
                      <span className="text-[#091220]">
                        {new Date(item.currentTime).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Ellipsis Icon */}
                    <div className="flex justify-end">
                      <FaEllipsisV
                        className="text-[#8A8B8C] cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveDropdown(
                            activeDropdown === index ? null : index
                          )
                        }}
                      />
                    </div>

                    {/* Dropdown */}
                    {activeDropdown === index && (
                      <div className="absolute right-0 top-[50%] mt-2 w-40 bg-white rounded-lg shadow-lg z-50 p-4">
                        <button
                          onClick={() => handleEdit(item.FormID, item.pptName)}
                          className="flex items-center gap-3 text-base text-[#5D5F61] mb-3 cursor-pointer"
                        >
                          <FaEdit className="text-[#5D5F61]" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleShare(item.FormID)}
                          className="flex items-center gap-3 text-base text-[#5D5F61] mb-3 cursor-pointer"
                        >
                          <FaShareAlt className="text-[#5D5F61]" />
                          <span>Share</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsPricingModalOpen(true)
                            setPricingModalHeading('PDF Export')
                          }}
                          className="flex items-center gap-3 text-base text-[#5D5F61] mb-3 cursor-pointer"
                        >
                          <FaFilePdf className="text-[#5D5F61]" />
                          <span>PDF Export</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsPricingModalOpen(true)
                            setPricingModalHeading('Google Slides')
                          }}
                          className="flex items-center gap-3 text-base text-[#5D5F61] mb-2 cursor-pointer"
                        >
                          <FaGoogleDrive className="text-[#5D5F61]" />
                          <span>Google Slides</span>
                        </button>
                        <div className="flex items-center gap-3 text-base text-[#5D5F61] cursor-pointer">
                          <FaTrashAlt />
                          <span>Delete</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isPricingModalOpen && userPlan === 'free' ? (
            <PricingModal
              closeModal={() => {
                setIsPricingModalOpen(false)
                setPricingModalHeading('')
              }}
              heading={pricingModalHeading}
              monthlyPlanAmount={monthlyPlanAmount}
              yearlyPlanAmount={yearlyPlanAmount}
              currency={currency}
            />
          ) : (
            <></>
          )}

          {/* Pagination */}
          {filteredData?.length > 10 && (
            <div className="flex justify-between items-center mt-6">
              <button
                className="flex gap-2 items-center bg-[#F3F4F6] px-4 py-2 active:scale-95 transition transform duration-300 rounded-md disabled:bg-[#E4E7EB]"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                <FaArrowLeft />
                <span>Previous</span>
              </button>
              <span>
                Page {currentPage} of {Math.ceil(filteredData?.length / 10)}
              </span>
              <button
                className="flex gap-2 items-center bg-[#F3F4F6] active:scale-95 transition transform duration-300 px-4 py-2 rounded-md disabled:bg-[#E4E7EB]"
                disabled={currentPage === Math.ceil(filteredData?.length / 10)}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                <span>Next</span>
                <FaArrowRight />
              </button>
            </div>
          )}

          {/* Mobile Filter Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex justify-center items-end lg:hidden">
              {/* Dimmed Background */}
              <div
                className="absolute inset-0 bg-gray-900 bg-opacity-50"
                onClick={() => setIsModalOpen(false)}
              ></div>

              {/* Modal Content */}
              <div className="relative bg-white w-full rounded-t-lg shadow-lg px-4 pb-4 pt-6 h-[30vh]">
                {/* Close Icon */}
                <div
                  className="absolute top-5 right-4 bg-gray-200 rounded-full p-2 cursor-pointer"
                  onClick={() => setIsModalOpen(false)}
                >
                  <FaTimes className="text-[#888a8f] text-lg" />
                </div>
                {/* Links */}
                <div className="flex flex-col gap-4">
                  <p
                    className="text-[#091220] text-lg"
                    onClick={() => {
                      setSelectedFilter('Pitch Deck')
                      setIsModalOpen(false)
                    }}
                  >
                    Pitch Deck
                  </p>
                  <p
                    className="text-[#091220] text-lg"
                    onClick={() => {
                      setSelectedFilter('Product')
                      setIsModalOpen(false)
                    }}
                  >
                    Product
                  </p>
                  <p
                    className="text-[#091220] text-lg"
                    onClick={() => {
                      setSelectedFilter('Sales Deck')
                      setIsModalOpen(false)
                    }}
                  >
                    Sales Deck
                  </p>
                  <p
                    className="text-[#091220] text-lg"
                    onClick={() => {
                      setSelectedFilter('Marketing')
                      setIsModalOpen(false)
                    }}
                  >
                    Marketing
                  </p>
                  <p
                    className="text-[#091220] text-lg"
                    onClick={() => {
                      setSelectedFilter('Business')
                      setIsModalOpen(false)
                    }}
                  >
                    Business
                  </p>
                  <p
                    className="text-[#091220] text-lg"
                    onClick={() => {
                      setSelectedFilter('Company Overview')
                      setIsModalOpen(false)
                    }}
                  >
                    Company Overview
                  </p>
                  <p
                    className="text-[#091220] text-lg"
                    onClick={() => {
                      setSelectedFilter('Project Proposal')
                      setIsModalOpen(false)
                    }}
                  >
                    Project Proposal
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default HistoryContainer
