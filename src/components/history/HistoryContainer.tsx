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
import { Link } from 'react-router-dom'

const HistoryContainer: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const [historyData, setHistoryData] = useState<any[]>([])

  const userId = sessionStorage.getItem('userEmail')
  const authToken = sessionStorage.getItem('authToken')
  const historyUrl = process.env.REACT_APP_BACKEND_URL || ''

  const itemsPerPage = 10 // Number of items to display per page
  const totalPages = Math.ceil(historyData.length / itemsPerPage)

  // Function to fetch history data from the API
  const fetchHistoryData = async () => {
    if (!authToken || !userId) {
      console.error('User is not authenticated or missing credentials.')
      return
    }

    try {
      const response = await fetch(
        `${historyUrl}/api/v1/data/slidedisplay/history/67890`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }
      const result = await response.json()
      console.log(result.data)
      setHistoryData(result.data || [])
    } catch (error) {
      console.error('Error fetching history data:', error)
    }
  }

  // // Fetch history data on component mount
  useEffect(() => {
    fetchHistoryData()
  }, [userId, historyUrl])

  // Close dropdown after a timeout
  useEffect(() => {
    if (activeDropdown !== null) {
      const timer = setTimeout(() => setActiveDropdown(null), 8000)
      return () => clearTimeout(timer)
    }
  }, [activeDropdown])

  // Handle clicks and scroll to close dropdown
  useEffect(() => {
    const handleOutsideClick = () => activeDropdown !== null && setActiveDropdown(null)
    const handleScroll = () => setActiveDropdown(null)

    document.addEventListener('click', handleOutsideClick)
    window.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [activeDropdown])

  // Render dropdown menu
  const renderDropdown = (index: number) => (
    <div className="absolute right-0 top-[50%] mt-2 w-40 bg-white rounded-lg shadow-lg z-50 p-4">
      <div className="flex items-center gap-3 text-base text-[#5D5F61] mb-3 cursor-pointer">
        <FaEdit className="text-[#5D5F61]" />
        <span>Edit</span>
      </div>
      <div className="flex items-center gap-3 text-base text-[#5D5F61] mb-3 cursor-pointer">
        <FaShareAlt className="text-[#5D5F61]" />
        <span>Share</span>
      </div>
      <div className="flex items-center gap-3 text-base text-[#5D5F61] mb-3 cursor-pointer">
        <FaFilePdf className="text-[#5D5F61]" />
        <span>PDF Export</span>
      </div>
      <div className="flex items-center gap-3 text-base text-[#5D5F61] mb-2 cursor-pointer">
        <FaGoogleDrive className="text-[#5D5F61]" />
        <span>Google Slides</span>
      </div>
      <div className="flex items-center gap-3 text-base text-[#5D5F61] cursor-pointer">
        <FaTrashAlt />
        <span>Delete</span>
      </div>
    </div>
  )

  // Get the data for the current page
  const currentPageData = historyData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleNewPresentation = () => {
    console.log('Redirect to New Presentation page')
  }

  return (
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
              <select className="bg-white text-[#8A8B8C] text-sm p-2 w-fit rounded-md border border-[#E1E3E5]">
                <option value="all">Select Type</option>
                <option value="product">Product</option>
                <option value="pitch-deck">Pitch Deck</option>
                <option value="sales-deck">Sales Deck</option>
                <option value="marketing">Marketing</option>
                <option value="company-overview">Company Overview</option>
                <option value="project-proposal">Project Proposal</option>
                <option value="project-summary">Project Summary</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#5D5F61]">Sort by</span>
              <select className="bg-white p-2 w-fit text-[#8A8B8C] text-sm rounded-md border border-[#E1E3E5]">
                <option value="recent">Recent First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      
      </div>

      {/* No Presentations */}
      {historyData.length === 0 ? (
  <div className="flex flex-col items-center justify-center bg-white shadow-sm rounded-xl py-12 w-full h-full min-h-screen">
    <h2 className="text-lg font-semibold text-[#091220] mb-4">
      No presentations to see here.
    </h2>
    <p className="text-sm text-gray-600 mb-6">
      Generate your first presentation using Zynth.
    </p>
    <Link to="/new-presentation">
    <button
      className="bg-[#3667B2] text-white px-6 py-3 rounded-md hover:bg-[#2e58a0] transition duration-200"
      onClick={handleNewPresentation}
    >
      New Presentation
    </button>
    </Link>
  </div>
      ) : (
        <>
          {/* History Container */}
      <div className="bg-white mt-10 lg:mt-0 shadow-sm rounded-xl mb-2">
        {/* Mobile/Small Screen Layout */}
        <div className="block md:hidden">
          {historyData?.map((item, index) => (
            <div key={index} className="flex items-center p-4 py-6 relative">
              <iframe
                src={item.PresentationURL}
                title={item.pptName}
                className="w-16 h-16 object-cover rounded-md mr-4"
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
                      setActiveDropdown(activeDropdown === index ? null : index)
                    }}
                  />
                </div>
                <div className="flex gap-1 text-sm mt-1">
                  <div className="mr-4">
                    <span className="block mb-1 font-medium text-[#5D5F61]">
                      PPT Type
                    </span>
                    <span className="text-[#091220]">{item.ppt_type}</span>
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
                  <div className="flex items-center gap-3 text-base text-[#5D5F61] mb-3 cursor-pointer">
                    <FaEdit className="text-[#5D5F61]" />
                    <span>Edit</span>
                  </div>
                  <div className="flex items-center gap-3 text-base text-[#5D5F61] mb-3 cursor-pointer">
                    <FaShareAlt className="text-[#5D5F61]" />
                    <span>Share</span>
                  </div>
                  <div className="flex items-center gap-3 text-base text-[#5D5F61] mb-3 cursor-pointer">
                    <FaFilePdf className="text-[#5D5F61]" />
                    <span>PDF Export</span>
                  </div>
                  <div className="flex items-center gap-3 text-base text-[#5D5F61] mb-2 cursor-pointer">
                    <FaGoogleDrive className="text-[#5D5F61]" />
                    <span>Google Slides</span>
                  </div>
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
          {historyData?.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[auto,1fr,1fr,1fr,auto] items-center p-4 py-6 relative gap-x-4 lg:gap-x-6"
            >
              {/* Image */}
              <iframe
                src={item.PresentationURL}
                title={item.pptName}
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
                <span className="font-medium text-[#5D5F61] mr-2">Date:</span>
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
                    setActiveDropdown(activeDropdown === index ? null : index)
                  }}
                />
              </div>

              {/* Dropdown */}
              {activeDropdown === index && (
                <div className="absolute right-0 top-[50%] mt-2 w-40 bg-white rounded-lg shadow-lg z-50 p-4">
                  <div className="flex items-center gap-3 text-base text-[#5D5F61] mb-3 cursor-pointer">
                    <FaEdit className="text-[#5D5F61]" />
                    <span>Edit</span>
                  </div>
                  <div className="flex items-center gap-3 text-base text-[#5D5F61] mb-3 cursor-pointer">
                    <FaShareAlt className="text-[#5D5F61]" />
                    <span>Share</span>
                  </div>
                  <div className="flex items-center gap-3 text-base text-[#5D5F61] mb-3 cursor-pointer">
                    <FaFilePdf className="text-[#5D5F61]" />
                    <span>PDF Export</span>
                  </div>
                  <div className="flex items-center gap-3 text-base text-[#5D5F61] mb-2 cursor-pointer">
                    <FaGoogleDrive className="text-[#5D5F61]" />
                    <span>Google Slides</span>
                  </div>
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


          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-12 gap-4 text-gray-600">
              <button
                className="bg-white border border-[#E1E3E5] p-2 rounded-md shadow cursor-pointer"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <FaArrowLeft className="text-base text-[#5D5F61]" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`px-3 py-1 rounded-md cursor-pointer ${
                        page === currentPage
                          ? 'bg-[#3667B2] text-white'
                          : 'hover:bg-gray-300 text-gray-800'
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                className="bg-white border border-[#E1E3E5] p-2 rounded-md shadow cursor-pointer"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <FaArrowRight className="text-base text-[#5D5F61]" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default HistoryContainer
