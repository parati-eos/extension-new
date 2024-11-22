import React from 'react'
import { FaPlus } from 'react-icons/fa'

interface SidebarProps {
  onOutlineSelect: (option: string) => void
  selectedOutline: string
}

const Sidebar: React.FC<SidebarProps> = ({
  onOutlineSelect,
  selectedOutline,
}) => {
  const slideOptions = ['cover', 'introduction', 'content', 'conclusion']

  return (
    <div className="hidden lg:block w-1/6 p-4 bg-gray-50 ml-4 rounded-lg border border-gray-300">
      <ul className="space-y-2">
        {slideOptions.map((option, index) => (
          <React.Fragment key={option}>
            <li>
              <button
                onClick={() => onOutlineSelect(option)}
                className={`block w-full text-left p-2 rounded-lg ${
                  selectedOutline === option
                    ? 'bg-blue-50 text-[#3667B2]'
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            </li>
            {index === 1 && (
              <li className="flex items-center justify-center space-x-2">
                <hr className="flex-grow border-gray-300" />
                <div className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-full">
                  <FaPlus className="text-gray-400" />
                </div>
                <hr className="flex-grow border-gray-300" />
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
