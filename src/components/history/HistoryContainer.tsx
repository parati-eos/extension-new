import React, { useState } from 'react'
import {
  FaFilter,
  FaSort,
  FaEllipsisV,
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
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

  return (
    <div className="p-4 py-7 bg-[#F5F7FA] min-h-screen relative">
      {/* Heading Section */}
      <div className="flex justify-between items-center mb-7">
        <h1 className="text-2xl font-bold text-[#091220]">History</h1>
        <div className="flex gap-4">
          {/* Filter Icon */}
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
      </div>

      {/* History Container */}
      <div className="bg-white mt-11 shadow-sm rounded-xl mb-2">
        {historyItems.map((item, index) => (
          <div key={index} className="flex items-center p-4 py-6">
            <img
              src={item.imgSrc}
              alt={item.title}
              className="w-16 h-16 object-cover rounded-md mr-4"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-[#091220]">
                  {item.title}
                </h2>
                <FaEllipsisV className="text-[#8A8B8C] cursor-pointer" />
              </div>
              <div className="flex gap-1 text-sm mt-1">
                <div className="mr-4">
                  <span className="block mb-1 font-medium text-[#5D5F61]">
                    PPT Type
                  </span>
                  <span className="text-[#091220]">{item.type}</span>
                </div>
                <div>
                  <span className="block mb-1 font-medium text-[#5D5F61]">
                    Date
                  </span>
                  <span className="text-[#091220]">{item.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-12 gap-4 text-gray-600">
        <div className="bg-white border border-[#E1E3E5] p-2 rounded-md shadow cursor-pointer">
          <FaArrowLeft className="text-base text-[#091220]" />
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
              <a href="#" className="text-[#091220] text-lg">
                Pitch Deck
              </a>
              <a href="#" className="text-[#091220] text-lg">
                Product
              </a>
              <a href="#" className="text-[#091220] text-lg">
                Sales Deck
              </a>
              <a href="#" className="text-[#091220] text-lg">
                Marketing
              </a>
              <a href="#" className="text-[#091220] text-lg">
                Company Overview
              </a>
              <a href="#" className="text-[#091220] text-lg">
                Project Proposal
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryContainer
