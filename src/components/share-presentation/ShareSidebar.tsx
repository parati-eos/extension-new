import React, { useEffect, useRef } from 'react'
import '../presentation-view/viewpresentation.css'

interface ShareSidebarProps {
  onOutlineSelect: (option: string) => void
  selectedOutline: string
  outlines: string[]
}

const ShareSidebar: React.FC<ShareSidebarProps> = ({
  onOutlineSelect,
  selectedOutline,
  outlines,
}) => {
  const outlineRefs = useRef<(HTMLLIElement | null)[]>([])

  // Scroll to the selected outline and ensure it is visible in the shareSidebar
  useEffect(() => {
    if (selectedOutline) {
      const selectedIndex = outlines.findIndex(
        (outline: any) => outline === selectedOutline
      )
      const selectedRef = outlineRefs.current[selectedIndex]

      if (selectedRef) {
        selectedRef.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        })
      }
    }
  }, [selectedOutline, outlines])
  return (
    <div className="no-scrollbar no-scrollbar::-webkit-scrollbar hidden lg:block w-[22%] h-[85%] p-4 bg-gray-50 ml-4 rounded-xl border border-gray-300 overflow-y-auto">
      <ul className="space-y-2 relative">
        {outlines.map((outline: string, idx: any) => (
          <React.Fragment key={idx}>
            <li
              ref={(el) => (outlineRefs.current[idx] = el)}
              className="relative group"
            >
              {/* Outline Title */}
              <button
                onClick={() => onOutlineSelect(outline)}
                className={`w-full max-w-xs font-normal text-left p-2 rounded-lg flex justify-between ${
                  selectedOutline === outline
                    ? 'bg-blue-50 text-[#3667B2]'
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                <span>{`${idx + 1}. ${outline}`}</span>
              </button>
            </li>
          </React.Fragment>
        ))}
      </ul>
    </div>
  )
}

export default ShareSidebar
