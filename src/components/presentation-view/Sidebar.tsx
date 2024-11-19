// Sidebar.tsx
import React from 'react'

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
    <div className="hidden lg:block w-1/4 p-4 bg-gray-100 border-r border-gray-300">
      <h2 className="text-lg font-semibold mb-4">Slide Outline</h2>
      <ul className="space-y-2">
        {slideOptions.map((option) => (
          <li key={option}>
            <button
              onClick={() => onOutlineSelect(option)}
              className={`block w-full text-left p-2 rounded-lg ${
                selectedOutline === option
                  ? 'bg-blue-100 text-blue-600 font-bold'
                  : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
