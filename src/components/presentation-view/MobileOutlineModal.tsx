import React, { useEffect, useRef, useState } from 'react'
import {
  FaTimes,
  FaPlus,
  FaChevronDown,
  FaCheck,
  FaExclamation,
} from 'react-icons/fa'
import { Outlines } from '../../types/types'
import axios from 'axios'
import { toast } from 'react-toastify'
import { PricingModal } from '../shared/PricingModal'
import GuidedTourOutlineMobile from '../onboarding/shared/GuidedTourOutlineMobile'

interface MobileOutlineDropdownProps {
  outlines: Outlines[]
  onSelectOutline: (outline: string) => void
  selectedOutline: string
  documentID: string
  fetchOutlines: () => Promise<void>
  isLoading: boolean
  subscriptionId: string
  userPlan: string // Plan types
  monthlyPlanAmount: number
  yearlyPlanAmount: number
  currency: string
  yearlyPlanId: string
  monthlyPlanId: string
  authToken: string
  orgId: string
  isNewSlideLoading: {
    [key: string]: boolean
  }
  newSlideGenerated: { [key: string]: string }
}

export default function MobileOutlineModal({
  outlines,
  onSelectOutline,
  selectedOutline,
  documentID,
  fetchOutlines,
  isLoading,
  userPlan,
  monthlyPlanAmount,
  yearlyPlanAmount,
  currency,
  yearlyPlanId,
  monthlyPlanId,
  orgId,
  newSlideGenerated,
  subscriptionId,
  isNewSlideLoading,
}: MobileOutlineDropdownProps) {
  const [isOutlinesOpen, setIsOutlinesOpen] = useState(false)
  const [isAddSlideModalOpen, setIsAddSlideModalOpen] = useState(false)
  const [newSlideTitle, setNewSlideTitle] = useState('')
  const [newSlidePosition, setNewSlidePosition] = useState('')
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const authToken = sessionStorage.getItem('authToken')
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const buttonRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDialogVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleAddSlide = async () => {
    if (newSlideTitle && newSlidePosition) {
      const outlineIndex = Number(newSlidePosition) - 1
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/outline/blocklist/insert`,
        {
          documentId: documentID,
          title: newSlideTitle,
          position: Number(outlineIndex),
          outlineID: `outlineID-${crypto.randomUUID()}`,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      const result = response.data
      if (result.type && result.title) {
        setIsAddSlideModalOpen(false)
        toast.success('Outline Added', {
          position: 'top-right',
          autoClose: 3000,
        })
        fetchOutlines()
      }
    }
  }

  return (
    <div>
      {/* Dropdown Button */}
      <div
        id="dropdown-mobile"
        className="border w-full rounded-lg p-4 bg-white flex justify-between items-center cursor-pointer"
        onClick={() => setIsOutlinesOpen(true)}
      >
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-[#091220]">
              {selectedOutline || 'Select Outline'}
            </span>
            {isNewSlideLoading[selectedOutline] && (
              <div className="flex items-center justify-center ml-2 mt-1">
                <div className="w-3 h-3 border-3 border-t-[#4b83d6] border-gray-300 rounded-full animate-spin"></div>
              </div>
            )}
            {newSlideGenerated[selectedOutline] === 'Yes' &&
              !isNewSlideLoading[selectedOutline] && (
                <div className="flex items-center justify-center ml-2 mt-1">
                  <div className="w-3 h-3">
                    <FaCheck className="text-green-600" />
                  </div>
                </div>
              )}
            {newSlideGenerated[selectedOutline] === 'No' &&
              !isNewSlideLoading[selectedOutline] && (
                <div className="flex items-center justify-center ml-2 mt-1">
                  <div className="w-3 h-3">
                    <FaExclamation className="text-red-700" />
                  </div>
                </div>
              )}
            <FaChevronDown className="text-gray-500 ml-2" />
          </div>
        )}
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
              {/* Add Slide Button with Tooltip */}
              <div ref={buttonRef} className="relative inline-block">
                <button
                  id="outline-mobile"
                  className={`text-sm border border-[#3667B2] px-2 py-2 rounded-md text-[#3667B2] hover:underline ${
                    userPlan === 'free' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => {
                    if (userPlan === 'free') {
                      setIsDialogVisible(!isDialogVisible)
                    } else {
                      setIsAddSlideModalOpen(true)
                    }
                  }}
                >
                  <FaPlus />
                </button>

                {/* Tooltip */}
                {isDialogVisible && userPlan === 'free' && (
                  <div className="absolute top-full transform -translate-x-[78%] w-[12rem] bg-gray-200 text-black p-2 rounded-2xl shadow-lg z-50">
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
          </div>

          {/* Outlines List */}
          <ul className="space-y-2">
            {outlines.map((outline, index) => (
              <li
                key={index}
                className="py-2 font-medium text-[#091220]"
                onClick={() => {
                  onSelectOutline(outline.title)
                  setIsOutlinesOpen(false)
                }}
              >
                {index + 1}. {outline.title}
                {isNewSlideLoading[outline.title] && (
                  <div className="flex items-center justify-center ml-2 mt-1">
                    <div className="w-4 h-4 border-3 border-t-[#4b83d6] border-gray-300 rounded-full animate-spin"></div>
                  </div>
                )}
                {newSlideGenerated[outline.title] === 'Yes' &&
                  !isNewSlideLoading[outline.title] && (
                    <div className="flex items-center justify-center ml-2 mt-1">
                      <div className="w-5 h-5">
                        <FaCheck className="text-green-600" />
                      </div>
                    </div>
                  )}
                {newSlideGenerated[outline.title] === 'No' &&
                  !isNewSlideLoading[outline.title] && (
                    <div className="flex items-center justify-center ml-2 mt-1">
                      <div className="w-5 h-5">
                        <FaExclamation className="text-red-700" />
                      </div>
                    </div>
                  )}
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
      {/* Pricing Modal */}
      {isPricingModalOpen && (
        <PricingModal
          closeModal={() => setIsPricingModalOpen(false)}
          heading="Subscription Plans"
          monthlyPlanAmount={monthlyPlanAmount}
          yearlyPlanAmount={yearlyPlanAmount}
          currency={currency!}
          yearlyPlanId={yearlyPlanId!}
          monthlyPlanId={monthlyPlanId!}
          authToken={authToken!}
          orgId={orgId!}
          subscriptionId={subscriptionId}
        />
      )}
      <GuidedTourOutlineMobile />
    </div>
  )
}
