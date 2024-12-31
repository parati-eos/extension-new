import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Outlines, SidebarProps } from '../../types/types'
import { toast } from 'react-toastify'
import { FaCheck, FaTimes } from 'react-icons/fa'
import './viewpresentation.css'
import { PricingModal } from '../shared/PricingModal'

const Sidebar: React.FC<SidebarProps> = ({
  onOutlineSelect,
  selectedOutline,
  fetchedOutlines,
  documentID,
  fetchOutlines,
  isLoading,
  isDisabled,
  userPlan,
  monthlyPlanAmount,
  yearlyPlanAmount,
  currency,
  yearlyPlanId,
  monthlyPlanId,
  authToken,
  orgId,
}) => {
  const [outlines, setOutlines] = useState<Outlines[]>([])
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [inputIndex, setInputIndex] = useState<number | null>(null)
  const [newOutline, setNewOutline] = useState<string>('')
  const outlineRefs = useRef<(HTMLLIElement | null)[]>([])
  const [newOutlineLoading, setNewOutlineLoading] = useState(false)
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)

  useEffect(() => {
    setOutlines(fetchedOutlines)
  }, [fetchedOutlines])

  // Scroll to the selected outline
  useEffect(() => {
    if (selectedOutline) {
      const selectedIndex = outlines.findIndex(
        (outline) => outline.title === selectedOutline
      )
      if (selectedIndex === 0) {
        outlineRefs.current[selectedIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }
  }, [selectedOutline, outlines])

  const handleAddOutline = async (index: number) => {
    setNewOutlineLoading(true)
    if (!newOutline.trim()) return
    const updatedOutline = { title: newOutline }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/outline/blocklist/insert`,
        {
          documentId: documentID,
          title: updatedOutline.title,
          position: index + 1,
          outlineID: `outlineID-${crypto.randomUUID()}`,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      const result = response.data
      if (result.title && result.type) {
        toast.success('Outline Successfully Added', {
          position: 'top-center',
          autoClose: 2000,
        })
        fetchOutlines()
        setNewOutlineLoading(false)
      }
      setInputIndex(null)
      setNewOutline('')
    } catch (error) {
      toast.error('Error adding outline', {
        position: 'top-center',
        autoClose: 2000,
      })
    }
  }

  return (
    <div className="no-scrollbar no-scrollbar::-webkit-scrollbar hidden lg:block w-[22%] h-[85%] p-4 bg-gray-50 ml-4 rounded-xl border border-gray-300 overflow-y-auto">
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      )}
      <ul className="space-y-2 relative">
        {outlines.map((outline, idx) => (
          <React.Fragment key={outline._id}>
            <li
              ref={(el) => (outlineRefs.current[idx] = el)}
              className="relative group"
              onMouseEnter={() => setHoverIndex(idx)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {/* Outline Title */}
              <button
                onClick={() => onOutlineSelect(outline.title)}
                className={`block w-full max-w-xs font-normal text-left p-2 rounded-lg ${
                  selectedOutline === outline.title
                    ? 'bg-blue-50 text-[#3667B2]'
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                {`${idx + 1}. ${outline.title}`}
              </button>

              {/* + Button Below the Title */}

              {hoverIndex === idx && inputIndex === null && (
                <div className="mt-2 flex items-center justify-center space-x-4 relative">
                  {/* Left Line */}
                  <div className="flex-grow h-px bg-gray-300"></div>

                  {/* Circular + Icon */}
                  <div
                    className="relative"
                    onMouseEnter={() => {
                      if (isDisabled && userPlan === 'free')
                        setIsDialogVisible(true)
                    }}
                    onMouseLeave={() => {
                      if (isDisabled && userPlan === 'free')
                        setIsDialogVisible(false)
                    }}
                  >
                    <button
                      className={`w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-300 border border-gray-400 disabled:opacity-20 disabled:cursor-not-allowed`}
                      onClick={() => setInputIndex(idx)}
                      disabled={isDisabled}
                    >
                      +
                    </button>

                    {/* Tooltip */}
                    {isDialogVisible && isDisabled && userPlan === 'free' && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-[12rem] bg-gray-200 text-black p-2 rounded-2xl shadow-lg z-50">
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

                  {/* Right Line */}
                  <div className="flex-grow h-px bg-gray-300"></div>
                </div>
              )}
            </li>

            {/* Input for New Outline */}

            {inputIndex === idx && (
              <div className="mt-2 flex items-center space-x-2">
                <div className="relative flex w-full max-w-xs">
                  <input
                    type="text"
                    value={newOutline}
                    onChange={(e) => setNewOutline(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="New Outline"
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center space-x-1">
                    <button
                      onClick={() => handleAddOutline(idx)}
                      disabled={!newOutline.trim() || newOutlineLoading}
                      className={`text-[#0A8568] ${
                        !newOutline.trim() || newOutlineLoading
                          ? 'opacity-20'
                          : ''
                      }`}
                    >
                      {newOutlineLoading && ''}
                      <FaCheck
                        className={`text-[#0A8568] ${
                          !newOutline.trim() || newOutlineLoading
                            ? 'opacity-20'
                            : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => {
                        setInputIndex(null)
                        setNewOutline('')
                      }}
                      className="text-[#8A8B8C] text-sm"
                    >
                      <FaTimes className="text-[#8A8B8C] text-base" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </ul>
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
        />
      )}
    </div>
  )
}

export default Sidebar
