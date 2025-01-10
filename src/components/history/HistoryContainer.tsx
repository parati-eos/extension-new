import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import {
  FaFilter,
  FaSort,
  FaEllipsisV,
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
  FaEdit,
  FaShareAlt,
  FaGoogleDrive,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { PricingModal } from '../shared/PricingModal'
import { IpInfoResponse } from '../../types/authTypes'
import { Plan } from '../../types/pricingTypes'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import PaymentGateway from '../payment/PaymentGateway'
import { useDispatch } from 'react-redux'
import { setUserPlan } from '../../redux/slices/userSlice'

function getSheetIdFromUrl(url: string) {
  const match = url.match(/\/d\/(.+?)\/|\/open\?id=(.+?)(?:&|$)/)
  return match ? match[1] || match[2] : null
}

const HistoryContainer: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [isSortModalOpen, setIsSortModalOpen] = useState(false) // State for sort modal
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
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
  const userPlan = useSelector((state: any) => state.user.userPlan)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [pricingModalHeading, setPricingModalHeading] = useState('')
  const [monthlyPlan, setMonthlyPlan] = useState<Plan>()
  const [yearlyPlan, setYearlyPlan] = useState<Plan>()
  const [currency, setCurrency] = useState('')
  const [documentID, setDocumentID] = useState<string | null>(null)
  const [paid, setIsPaid] = useState(false)
  const [subId, setSubId] = useState('')
  const dispatch = useDispatch()

  // Handle Download Button Click
  const handleDownload = async () => {
    try {
      const formId = documentID
      if (!formId) {
        throw new Error('Form ID not found in localStorage')
      }

      if (!paid) {
        // 1. First, update the payment status
        const updatePaymentStatus = async () => {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidedisplay/finalsheet/${documentID}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({ paymentStatus: 1 }),
            }
          )

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const result = await response.json()
          console.log('Payment status updated:', result)
        }

        // Call payment status update
        await updatePaymentStatus()

        // 2. Then, call the additional API to get presentationID
        const callAdditionalApi = async () => {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/slides/presentation?formId=${formId}`
          )
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const result = await response.json()
          console.log('Additional API response:', result)

          const presentationID = result.PresentationID // Extract PresentationID from response

          if (presentationID) {
            // Call the second API with the extracted presentationID
            const secondApiResponse = await fetch(
              `https://script.google.com/macros/s/AKfycbyUR5SWxE4IHJ6uVr1eVTS7WhJywnbCNBs2zlJsUFbafyCsaNWiGxg7HQbyB3zx7R6z/exec?presentationID=${presentationID}`
            )
            const secondApiText = await secondApiResponse.text()
            console.log('Raw second API response:', secondApiText)

            try {
              const secondApiResult = JSON.parse(secondApiText)
              console.log('Second API parsed response:', secondApiResult)
            } catch (jsonError) {
              console.error(
                'Error parsing second API response as JSON:',
                jsonError
              )
            }
          } else {
            throw new Error('PresentationID not found in the response')
          }
        }

        // Call additional API
        await callAdditionalApi()
      }

      // 3. Finally, call the original slides URL API
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidedisplay/statuscheck/${documentID}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('Result:', result)

      const url = result.data.PresentationURL
      console.log('URL:', url)

      if (!url || typeof url !== 'string') {
        throw new Error('Invalid URL in response')
      }
      window.open(url, '_blank')
    } catch (error) {
      console.error('Error exporting presentation:', error)
      alert(
        "Oops! It seems like the pitch deck presentation is missing. Click 'Generate Presentation' to begin your journey to success!"
      )
    }
  }

  // Function to check payment status and proceed
  const checkPaymentStatusAndProceed = async () => {
    // try {
    //   const response = await fetch(
    //     `${process.env.REACT_APP_BACKEND_URL}/slides/url?formId=${documentID}`
    //   )

    //   if (!response.ok) {
    //     throw new Error(`HTTP error! Status: ${response.status}`)
    //   }

    //   const data = await response.json()
    //   console.log('API response data:', data) // Debugging line

    //   if (data && data.paymentStatus === 1) {
    //     // Payment has already been made, run handleDownload
    //     handleDownload()
    //   } else if (data && data.paymentStatus === 0) {
    // Payment is not made, open the payment gateway
    const paymentButton = document.getElementById('payment-button')
    if (paymentButton) {
      paymentButton.click()
    } else {
      console.error('Payment button not found')
    }
    //   } else {
    //     alert('Unable to determine payment status.')
    //   }
    // } catch (error) {
    //   console.error('Error checking payment status:', error)
    //   alert('Error checking payment status. Please try again.')
    // }
  }

  const presentationsToShow = filteredData?.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  )

  // Handle Share Button Click
  const handleShare = async () => {
    const url = `/share?formId=${documentID}`
    window.open(url, '_blank') // Opens the URL in a new tab
  }

  const handleEdit = (documentID: string, name: string) => {
    navigate(
      `/presentation-view?documentID=${documentID}&presentationName=${name}`
    )
  }

  // Handle clicks and scroll to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      // Close the dropdown if the click is outside of both the dropdown and tooltip
      if (
        activeDropdown !== null &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null) // Close dropdown if click is outside both
        setIsTooltipVisible(false) // Hide tooltip when dropdown closes
      }
    }

    const handleScroll = () => setActiveDropdown(null)
    setIsTooltipVisible(false) // Hide tooltip on scroll

    document.addEventListener('click', handleOutsideClick)
    window.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [activeDropdown]) // Effect runs when activeDropdown changes

  // API CALL TO GET HISTORY DATA
  useEffect(() => {
    setIsLoading(true)
    const fetchHistoryData = async () => {
      try {
        const response = await fetch(
          `${historyUrl}/api/v1/data/slidedisplay/history/${userId}`,
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
        toast.error('Error fetching history data', {
          position: 'top-right',
          autoClose: 3000,
        })
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
          console.log('Country:', country)

          if (country !== 'IN' && country !== 'India' && country !== 'In') {
            console.log('Reached If')
            setMonthlyPlan(response.data.items[1])
            setYearlyPlan(response.data.items[0])
            setCurrency('USD')
          } else if (
            country === 'IN' ||
            country === 'India' ||
            country === 'In'
          ) {
            console.log('Reached Else')
            setMonthlyPlan(response.data.items[1])
            setYearlyPlan(response.data.items[0])
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

  // Reset the tooltip when a different dropdown is opened
  useEffect(() => {
    setIsDialogVisible(false)
  }, [activeDropdown])

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
              <div className="flex gap-4 lg:hidden">
                <div
                  className="bg-white p-2 rounded-md shadow cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <FaFilter className="text-[#5D5F61] text-xl" />
                </div>
                <div
                  className="bg-white p-2 rounded-md shadow cursor-pointer"
                  onClick={() => setIsSortModalOpen(true)}
                >
                  <FaSort className="text-[#5D5F61] text-xl" />
                </div>
              </div>

              {/* Mobile Sort Modal */}
              {isSortModalOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-end lg:hidden">
                  {/* Dimmed Background */}
                  <div
                    className="absolute inset-0 bg-gray-900 bg-opacity-50"
                    onClick={() => setIsSortModalOpen(false)}
                  ></div>

                  {/* Modal Content */}
                  <div className="relative bg-white w-full rounded-t-lg shadow-lg px-4 pb-4 pt-6 h-[30vh] overflow-y-auto scrollbar-none">
                    {/* Close Icon */}
                    <div
                      className="absolute top-5 right-4 bg-gray-200 rounded-full p-2 cursor-pointer"
                      onClick={() => setIsSortModalOpen(false)}
                    >
                      <FaTimes className="text-[#888a8f] text-lg" />
                    </div>
                    {/* Sort Options */}
                    <div className="flex flex-col gap-4">
                      <p
                        className={`text-[#091220] text-lg cursor-pointer ${
                          selectedSort === 'recent' ? 'font-semibold' : ''
                        }`}
                        onClick={() => {
                          setSelectedSort('recent')
                          setIsSortModalOpen(false)
                        }}
                      >
                        Recent First
                      </p>
                      <p
                        className={`text-[#091220] text-lg cursor-pointer ${
                          selectedSort === 'oldest' ? 'font-semibold' : ''
                        }`}
                        onClick={() => {
                          setSelectedSort('oldest')
                          setIsSortModalOpen(false)
                        }}
                      >
                        Oldest First
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {presentationsToShow?.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[auto,1fr] items-center p-4 relative gap-8"
                  >
                    {/* Thumbnail Container */}
                    <div className="relative w-[8rem] h-[6rem]">
                      {/* Invisible clickable overlay */}
                      <div
                        onClick={() => handleEdit(item.FormID, item.pptName)}
                        className="absolute top-0 left-0 w-full h-full z-10 cursor-pointer"
                      ></div>
                      {/* Embedded Google Slides iframe */}
                      <iframe
                        src={`https://docs.google.com/presentation/d/${getSheetIdFromUrl(
                          item.PresentationURL
                        )}/embed?rm=minimal&start=false`}
                        title={item.pptName}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        style={{ border: 'none', pointerEvents: 'none' }} // Disable pointer events on the iframe
                      />
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col justify-between w-full">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-medium text-[#091220]">
                          {item.pptName}
                        </h2>
                        {/* Ellipsis Icon */}
                        <FaEllipsisV
                          className="text-[#8A8B8C] cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveDropdown((prev) =>
                              prev === index ? null : index
                            )
                            if (item.paymentStatus !== 0) {
                              setIsPaid(true)
                            }
                            setDocumentID(item.FormID)
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                        <div>
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
                      <div
                        ref={dropdownRef} // Attach the ref here
                        className="absolute right-0 top-[50%] transform -translate-y-1/2 mt-2 w-40 bg-white rounded-lg shadow-lg z-50 p-4"
                      >
                        <button
                          onClick={() => handleEdit(item.FormID, item.pptName)}
                          className="flex items-center gap-3 text-base text-[#5D5F61] mb-3 cursor-pointer"
                        >
                          <FaEdit className="text-[#5D5F61]" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleShare()}
                          className="flex items-center gap-3 text-base text-[#5D5F61] mb-3 cursor-pointer"
                        >
                          <FaShareAlt className="text-[#5D5F61]" />
                          <span>Share</span>
                        </button>
                        <div className={`relative`}>
                          <button
                            className={`flex items-center gap-3 text-base text-[#5D5F61] mb-2 cursor-pointer ${
                              userPlan === 'free' && item.paymentStatus === 0
                                ? 'cursor-not-allowed opacity-50'
                                : ''
                            }`}
                            onClick={() => {
                              // Only show the tooltip if the button is disabled
                              if (
                                userPlan === 'free' &&
                                item.paymentStatus === 0
                              ) {
                                setIsTooltipVisible(true)
                              } else {
                                handleDownload() // Your regular function for non-free users
                              }
                            }}
                          >
                            <FaGoogleDrive className="text-[#5D5F61]" />
                            <span>Google Slides</span>
                          </button>

                          {/* Tooltip */}
                          {isTooltipVisible && (
                            <div className="absolute bg-gray-200 text-black p-3 rounded-lg shadow-lg flex items-center justify-center ">
                              <p className="text-sm text-gray-800 text-center ">
                                Please{' '}
                                <button
                                  className="text-purple-600 font-medium hover:text-purple-800 hover:scale-105 active:scale-95 transition transform"
                                  onClick={() => setIsPricingModalOpen(true)}
                                >
                                  upgrade to Pro
                                </button>{' '}
                                to access this feature.
                              </p>
                            </div>
                          )}
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
                    {/* Thumbnail Container */}
                    <div className="relative w-[12rem] h-[7rem] overflow-hidden">
                      {/* Invisible clickable overlay */}
                      <div
                        onClick={() => handleEdit(item.FormID, item.pptName)}
                        className="absolute top-0 left-0 w-full h-full z-10 cursor-pointer"
                      ></div>

                      {/* Embedded Google Slides iframe */}
                      <iframe
                        src={`https://docs.google.com/presentation/d/${getSheetIdFromUrl(
                          item.PresentationURL
                        )}/embed?rm=minimal&slide=id.p&start=false`}
                        title={item.pptName}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        style={{ border: 'none', pointerEvents: 'none' }} // Disable pointer events on the iframe
                      />
                    </div>

                    {/* Title */}
                    <div className="text-lg font-bold pl-6 text-[#091220]">
                      {item.pptName}
                    </div>

                    {/* PPT Type */}
                    <div className="text-sm flex flex-col">
                      <span className="font-medium text-[#5D5F61] mr-2">
                        PPT Type:
                      </span>
                      <span className="text-[#091220] font-medium">
                        {item.ppt_type}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="text-sm flex flex-col">
                      <span className="font-medium text-[#5D5F61] mr-2">
                        Date:
                      </span>
                      <span className="text-[#091220] font-medium">
                        {new Date(item.currentTime).toLocaleDateString(
                          'en-GB',
                          {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </span>
                    </div>

                    {/* Ellipsis Icon */}
                    <div className="flex justify-end">
                      <FaEllipsisV
                        className="text-[#8A8B8C] cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveDropdown((prev) =>
                            prev === index ? null : index
                          )
                          if (item.paymentStatus !== 0) {
                            setIsPaid(true)
                          }
                          setDocumentID(item.FormID)
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
                          onClick={() => handleShare()}
                          className="flex items-center gap-3 text-base text-[#5D5F61] mb-3 cursor-pointer"
                        >
                          <FaShareAlt className="text-[#5D5F61]" />
                          <span>Share</span>
                        </button>
                        <div
                          className="relative"
                          onMouseEnter={() =>
                            userPlan === 'free' &&
                            item.paymentStatus === 0 &&
                            setIsDialogVisible(true)
                          }
                          onMouseLeave={() => setIsDialogVisible(false)}
                        >
                          <button
                            onClick={() => {
                              if (
                                userPlan === 'free' &&
                                item.paymentStatus === 0
                              ) {
                                setIsPricingModalOpen(true)
                                setPricingModalHeading('Google Slides')
                              } else if (
                                userPlan === 'free' &&
                                item.paymentStatus === 1
                              ) {
                                handleDownload()
                              } else {
                                handleDownload()
                              }
                            }}
                            className={`flex items-center gap-3 text-base text-[#5D5F61] mb-2 cursor-pointer ${
                              userPlan === 'free' && item.paymentStatus === 0
                                ? 'cursor-not-allowed opacity-50'
                                : ''
                            }`}
                          >
                            <FaGoogleDrive className="text-[#5D5F61]" />
                            <span>Google Slides</span>
                          </button>
                          {isDialogVisible && userPlan === 'free' && (
                            <div className="absolute bottom-full left-[45%] transform -translate-x-1/2 w-[12rem] bg-gray-200 text-black p-2 rounded-2xl shadow-lg z-50">
                              <p className="text-sm text-center text-gray-800">
                                Please{' '}
                                <button
                                  className="text-purple-600 font-medium hover:text-purple-800 hover:scale-105 active:scale-95 transition transform"
                                  onClick={() => setIsPricingModalOpen(true)}
                                >
                                  upgrade to Pro
                                </button>{' '}
                                plan to access this feature.
                              </p>
                            </div>
                          )}
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
              subscriptionId={subId}
              monthlyPlanAmount={monthlyPlanAmount}
              yearlyPlanAmount={yearlyPlanAmount}
              currency={currency}
              monthlyPlanId={monthlyPlanId!}
              yearlyPlanId={yearlyPlanId!}
              authToken={authToken!}
              orgId={orgId!}
              exportButtonText={`Export For ${currency === 'INR' ? '₹' : '$'}${
                currency === 'INR' ? '499' : '9'
              }`}
              exportHandler={checkPaymentStatusAndProceed}
              isButtonDisabled={true}
            />
          ) : (
            <></>
          )}
          <PaymentGateway
            productinfo="Presentation Export"
            onSuccess={handleDownload}
            formId={documentID!}
            authToken={authToken!}
          />
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
              <div className="relative bg-white w-full rounded-t-lg shadow-lg px-4 pb-4 pt-6 h-[30vh] overflow-y-auto scrollbar-none">
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
