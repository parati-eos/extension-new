import React, { useState, useEffect } from 'react'
import { Outlines, SidebarProps } from '../../types/types'

const Sidebar: React.FC<SidebarProps> = ({
  onOutlineSelect,
  selectedOutline,
  fetchedOutlines,
}) => {
  const [outlines, setOutlines] = useState<Outlines[]>([])

  useEffect(() => {
    setOutlines(fetchedOutlines)
  }, [fetchedOutlines])

  return (
    <div className="hidden lg:block w-1/8 h-fit p-4 bg-gray-50 ml-4 rounded-lg border border-gray-300 max-h-screen overflow-y-auto">
      <ul className="space-y-2">
        {outlines.map((outline) => (
          <li key={outline._id}>
            <button
              onClick={() => onOutlineSelect(outline.title)}
              className={`block w-full text-left p-2 rounded-lg ${
                selectedOutline === outline.title
                  ? 'bg-blue-50 text-[#3667B2]'
                  : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              {outline.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
