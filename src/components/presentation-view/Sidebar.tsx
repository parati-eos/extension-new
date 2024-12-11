import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Outlines, SidebarProps } from '../../types/types'
import { toast } from 'react-toastify'
import './viewpresentation.css'

const Sidebar: React.FC<SidebarProps> = ({
  onOutlineSelect,
  selectedOutline,
  fetchedOutlines,
  documentID,
  authToken,
  fetchOutlines,
  isLoading,
}) => {
  const [outlines, setOutlines] = useState<Outlines[]>([])
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [inputIndex, setInputIndex] = useState<number | null>(null)
  const [newOutline, setNewOutline] = useState<string>('')
  const outlineRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    setOutlines(fetchedOutlines)
  }, [fetchedOutlines])

  // Scroll to the selected outline
  useEffect(() => {
    const selectedIndex = outlines.findIndex(
      (outline) => outline.title === selectedOutline
    )
    if (
      selectedIndex !== -1 &&
      outlineRefs.current[selectedIndex] // Ensure the ref exists
    ) {
      outlineRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }
  }, [selectedOutline, outlines])

  const handleAddOutline = async (index: number) => {
    if (!newOutline.trim()) return
    const updatedOutline = { title: newOutline }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/outline/blocklist/insert`,
        {
          documentId: documentID,
          title: updatedOutline.title,
          position: index + 1,
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
      }
      setInputIndex(null)
      setNewOutline('')
    } catch (error) {
      console.error('Error adding outline:', error)
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
                className={`block w-full max-w-xs text-left p-2 rounded-lg ${
                  selectedOutline === outline.title
                    ? 'bg-blue-50 text-[#3667B2]'
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                {`${idx + 1}. ${outline.title}`}
              </button>

              {/* + Button Below the Title */}
              {hoverIndex === idx && inputIndex === null && (
                <div className="mt-2 flex items-center justify-center space-x-4">
                  {/* Left Line */}
                  <div className="flex-grow h-px bg-gray-300"></div>

                  {/* Circular + Icon */}
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-300 border border-gray-400"
                    onClick={() => setInputIndex(idx)}
                  >
                    +
                  </button>

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
                      disabled={!newOutline.trim()}
                      className={`text-green-600 ${
                        !newOutline.trim()
                          ? 'opacity-20 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      ✔️
                    </button>
                    <button
                      onClick={() => {
                        setInputIndex(null)
                        setNewOutline('')
                      }}
                      className="text-red-500 text-sm"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
