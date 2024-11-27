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

interface HistoryItem {
  imgSrc: string
  title: string
  type: string
  date: string
}

const HistoryContainer: React.FC = () => {
  const historyItems: HistoryItem[] = [
    {
      imgSrc:
        'https://next-images.123rf.com/index/_next/image/?url=https://assets-cdn.123rf.com/index/static/assets/top-section-bg.jpeg&w=3840&q=75',
      title: 'The Evolution of Our Path',
      type: 'Pitch Deck',
      date: 'Nov 08, 2024',
    },
    {
      imgSrc:
        'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630',
      title: 'Transformations in Our Journey',
      type: 'Pitch Deck',
      date: 'Nov 08, 2024',
    },
    {
      imgSrc:
        'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
      title: 'Milestones in Our Adventure',
      type: 'Pitch Deck',
      date: 'Nov 08, 2024',
    },
    {
      imgSrc:
        'https://i0.wp.com/picjumbo.com/wp-content/uploads/amazing-stone-path-in-forest-free-image.jpg?w=600&quality=80',
      title: 'The Shifts in Our Experience',
      type: 'Pitch Deck',
      date: 'Nov 08, 2024',
    },
    {
      imgSrc: 'https://fps.cdnpk.net/images/home/subhome-ai.webp?w=649&h=649',
      title: 'Progression of Our Story',
      type: 'Pitch Deck',
      date: 'Nov 08, 2024',
    },
  ]

  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const userId = sessionStorage.getItem('userEmail')
  const historyUrl = process.env.REACT_APP_BACKEND_URL || ''
  const [historyData, setHistoryData] = useState<any[]>([])
  const authToken = sessionStorage.getItem('authToken')

  useEffect(() => {
    if (activeDropdown !== null) {
      const timer = setTimeout(() => setActiveDropdown(null), 8000)
      return () => clearTimeout(timer)
    }
  }, [activeDropdown])

  const closeDropdown = () => setActiveDropdown(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (activeDropdown !== null) closeDropdown()
    }
    const handleScroll = () => closeDropdown()

    document.addEventListener('click', handleOutsideClick)
    window.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [activeDropdown])

  // API CALL TO GET HISTORY DATA
  useEffect(() => {
    const fetchHistoryData = async () => {
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
        const result = await response.json()
        setHistoryData(result.data)
      } catch (error) {
        console.error('Error fetching history data:', error)
      }
    }
    fetchHistoryData()
  }, [userId, historyUrl])

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

      {/* History Container */}
      <div className="bg-white mt-10 lg:mt-0 shadow-sm rounded-xl mb-2">
        {/* Mobile/Small Screen Layout */}
        <div className="block md:hidden">
          {historyData?.map((item, index) => (
            <div key={index} className="flex items-center p-4 py-6 relative">
              {/* <img
                src={item.PresentationURL}
                alt={item.pptName}
                className="w-16 h-16 object-cover rounded-md mr-4"
              /> */}
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
              <img
                src={item.PresentationURL}
                alt={item.pptName}
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
      <div className="flex justify-between items-center mt-12 gap-4 text-gray-600">
        <div className="bg-white border border-[#E1E3E5] p-2 rounded-md shadow cursor-pointer">
          <FaArrowLeft className="text-base text-[#5D5F61]" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((page) => (
            <span
              key={page}
              className={`px-3 py-1 rounded-md cursor-pointer ${
                page === currentPage
                  ? 'bg-[#3667B2] text-white'
                  : ' hover:bg-gray-300 text-gray-800'
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </span>
          ))}
        </div>
        <div className="bg-white border border-[#E1E3E5] p-2 rounded-md shadow cursor-pointer">
          <FaArrowRight className="text-base text-[#091220]" />
        </div>
      </div>

      {/* Modal */}
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
              <p className="text-[#091220] text-lg">Pitch Deck</p>
              <p className="text-[#091220] text-lg">Product</p>
              <p className="text-[#091220] text-lg">Sales Deck</p>
              <p className="text-[#091220] text-lg">Marketing</p>
              <p className="text-[#091220] text-lg">Company Overview</p>
              <p className="text-[#091220] text-lg">Project Proposal</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryContainer
