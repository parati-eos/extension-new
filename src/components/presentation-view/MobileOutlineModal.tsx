import React, { useState } from 'react'
import { FaTimes, FaPlus } from 'react-icons/fa'
import { Outlines } from '../../types/types'
import axios from 'axios'

interface MobileOutlineDropdownProps {
  outlines: Outlines[]
  onSelectOutline: (outline: string) => void
  selectedOutline: string
  documentID: string
  fetchOutlines: () => Promise<void>
}

export default function MobileOutlineModal({
  outlines,
  onSelectOutline,
  selectedOutline,
  documentID,
  fetchOutlines,
}: MobileOutlineDropdownProps) {
  const [isOutlinesOpen, setIsOutlinesOpen] = useState(false)
  const [isAddSlideModalOpen, setIsAddSlideModalOpen] = useState(false)
  const [newSlideTitle, setNewSlideTitle] = useState('')
  const [newSlidePosition, setNewSlidePosition] = useState('')
  const authToken = sessionStorage.getItem('authToken')

  const handleAddSlide = async () => {
    if (newSlideTitle && newSlidePosition) {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/outline/blocklist/insert`,
        {
          documentId: documentID,
          title: newSlideTitle,
          position: Number(newSlidePosition),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      const result = response.data
      if (result.type && result.title) {
        alert('Success')
        fetchOutlines()
      }
    }
  }

  return (
    <div>
      {/* Dropdown Button */}
      <div
        className="border w-full rounded-lg p-4 bg-white"
        onClick={() => setIsOutlinesOpen(true)}
      >
        {selectedOutline}
      </div>

      {/* Full-Screen Outlines List */}
      {isOutlinesOpen && (
        <div className="fixed inset-0 z-50 bg-white p-4">
          {/* Header */}
          <div className="flex justify-between items-center mt-5 mb-5">
            <h2 className="text-lg font-semibold text-[#091220]">Outline</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsOutlinesOpen(false)}
                className="text-sm border border-[#8A8B8C] px-3 py-1 rounded-md text-[#5D5F61] hover:underline"
              >
                Back
              </button>
              <button
                onClick={() => setIsAddSlideModalOpen(true)}
                className="text-sm border border-[#3667B2] px-2 py-2 rounded-md text-[#3667B2] hover:underline"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          {/* Outlines List */}
          <ul className="space-y-2">
            {outlines.map((outline, index) => (
              <li
                key={index}
                className="py-2 text-[#091220]"
                onClick={() => {
                  onSelectOutline(outline.title)
                  setIsOutlinesOpen(false)
                }}
              >
                {index + 1}. {outline.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add Slide Modal */}
      {isAddSlideModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          {/* Background */}
          <div
            className="absolute inset-0 bg-gray-900 bg-opacity-50"
            onClick={() => setIsAddSlideModalOpen(false)}
          ></div>
          {/* Modal Content */}
          <div className="relative bg-white w-11/12 md:w-1/2 lg:w-1/3 rounded-3xl shadow-lg p-6">
            {/* Close Icon */}
            <div
              className="absolute top-4 right-4 bg-gray-200 rounded-full p-2 cursor-pointer"
              onClick={() => setIsAddSlideModalOpen(false)}
            >
              <FaTimes className="text-[#5D5F61]" />
            </div>
            {/* Heading */}
            <h2 className="text-xl text-center font-semibold text-[#091220]">
              Add Slide
            </h2>
            {/* Input Fields */}
            <input
              type="text"
              placeholder="Enter Slide Title"
              className="w-full border rounded-lg p-3 mt-4"
              value={newSlideTitle}
              onChange={(e) => setNewSlideTitle(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter Position Number"
              className="w-full border rounded-lg p-3 mt-4"
              value={newSlidePosition}
              onChange={(e) => setNewSlidePosition(e.target.value)}
            />
            {/* Action Buttons */}
            <button
              onClick={handleAddSlide}
              className="w-full bg-[#3667B2] text-white p-4 rounded-lg mt-4"
            >
              Add Slide
            </button>
            <button
              onClick={() => setIsAddSlideModalOpen(false)}
              className="w-full text-[#5D5F61] p-3 mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
