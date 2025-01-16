import React, { useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

interface MobileShareOutlineModalProps {
  onOutlineSelect: (option: string) => void
  selectedOutline: string
  isLoading: boolean
  outlines: string[]
}

export default function ShareOutlineModal({
  outlines,
  onOutlineSelect,
  selectedOutline,
  isLoading,
}: MobileShareOutlineModalProps) {
  const [isOutlinesOpen, setIsOutlinesOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {}

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div>
      {/* Dropdown Button */}
      <div
        id="dropdown-mobile"
        className="border w-full rounded-lg p-4 bg-white cursor-pointer"
        onClick={() => setIsOutlinesOpen(true)}
      >
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-[#091220] flex items-center">
              <span> {selectedOutline || 'Select Outline'}</span>
            </span>
            <span>
              {' '}
              <FaChevronDown className="text-gray-500 ml-2" />
            </span>
          </div>
        )}
      </div>

      {/* Full-Screen Outlines List */}
      {isOutlinesOpen && (
        <div className="fixed inset-0 z-50 bg-white p-4">
          {/* Header */}
          <div className="flex justify-between items-center mt-5 mb-5">
            <h2 className="text-lg font-semibold text-[#091220]">Outlines</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsOutlinesOpen(false)}
                className="text-sm border border-[#8A8B8C] px-3 py-1 rounded-md text-[#5D5F61] hover:underline"
              >
                Back
              </button>
            </div>
          </div>

          {/* Outlines List */}
          <ul className="space-y-2">
            {outlines.map((outline, index) => (
              <li
                key={index}
                className="py-2 font-medium text-[#091220] flex items-center justify-between"
                onClick={() => {
                  onOutlineSelect(outline)
                  setIsOutlinesOpen(false)
                }}
              >
                <span>
                  {index + 1}. {outline}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
