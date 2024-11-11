import React from 'react'
import {
  FaHome,
  FaUser,
  FaCog,
  FaChartLine,
  FaInfoCircle,
} from 'react-icons/fa'
import ZynthLogo from '../../assets/zynth-icon.png'
import ZynthLogoText from '../../assets/zynth-text.png'
import CompletedIcon from '../../assets/completed-sidebar-section.png'

interface Section {
  id: number
  title: string
  subheading: string
  icon: React.ReactElement
}

const sections: Section[] = [
  {
    id: 1,
    title: 'Company Name',
    subheading: 'Provide company details',
    icon: <FaHome />,
  },
  { id: 2, title: 'Logo', subheading: 'Upload your logo', icon: <FaUser /> },
  {
    id: 3,
    title: 'Website Link',
    subheading: 'Provide your website link',
    icon: <FaCog />,
  },
  {
    id: 4,
    title: 'Industry',
    subheading: 'Provide Industry Details',
    icon: <FaChartLine />,
  },
  {
    id: 5,
    title: 'Contact Details',
    subheading: 'Provide contact details',
    icon: <FaInfoCircle />,
  },
]

interface SidebarProps {
  lastVisitedSection: number
  visitedSections: number[]
  onSectionClick: (id: number) => void
}

const Sidebar: React.FC<SidebarProps> = ({
  lastVisitedSection,
  visitedSections,
  onSectionClick,
}) => {
  return (
    <div className="w-64 h-screen bg-gray-100 p-6">
      <div className="flex items-center mb-8 mt-[30px] ml-[15px]">
        <img
          src={ZynthLogo}
          alt="Zynth Logo"
          className="w-[48.82px] h-[48.82px] mr-2"
        />
        <img
          src={ZynthLogoText}
          alt="Zynth Logo Text"
          className="w-[92.09px] h-[22.21px]"
        />
      </div>

      <div className="relative">
        {sections.map((section, index) => {
          const isActive = section.id === lastVisitedSection
          const isVisited = visitedSections.includes(section.id)

          return (
            <div
              key={section.id}
              className={`relative w-full ${isActive && 'bg-gray-50'}`}
            >
              {/* Section Item */}
              <div
                // onClick={() => onSectionClick(section.id)}
                className={`flex items-center mb-4 space-x-4 pl-4 transition-colors duration-300 h-full ${
                  isActive || isVisited
                    ? 'border-l-4 border-[#0A8568]'
                    : 'border-l-4 border-transparent'
                }`}
              >
                {/* Icon and Progress Bar Container */}
                <div className="flex flex-col items-center">
                  <div
                    className={`text-2xl ${
                      isActive || isVisited ? 'text-[#0A8568]' : 'text-gray-400'
                    }`}
                  >
                    {isVisited && !isActive ? (
                      <img
                        src={CompletedIcon}
                        alt="Completed Icon"
                        className="w-6 h-6"
                      />
                    ) : (
                      section.icon
                    )}
                  </div>
                  {/* Dotted Progress Bar */}
                  {index < sections.length - 1 &&
                    visitedSections.includes(sections[index + 1].id) && (
                      <div className="w-0.5 h-4 border-l-2 border-dotted border-gray-300 mt-2"></div>
                    )}
                </div>

                {/* Heading & Subheading */}
                <div>
                  <h2
                    className={`font-semibold text-base ${
                      isActive || isVisited ? 'text-[#0A8568]' : 'text-gray-700'
                    }`}
                  >
                    {section.title}
                  </h2>
                  <p className="text-xs text-gray-500">{section.subheading}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar
