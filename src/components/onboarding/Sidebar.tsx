import React, { useState } from 'react'
import {
  FaBuilding,
  FaBullseye,
  FaGlobe,
  FaCity,
  FaPhone,
  FaCheckCircle,
  FaBars,
  FaTimes,
} from 'react-icons/fa'
import ZynthLogo from '../../assets/zynth-icon.png'
import ZynthLogoText from '../../assets/zynth-text.png'
import { Section } from '../../types/onboardingTypes'

const sections: Section[] = [
  {
    id: 1,
    title: 'Company Name',
    subheading: 'Provide company details',
    icon: <FaBuilding />,
  },
  {
    id: 2,
    title: 'Logo',
    subheading: 'Upload your logo',
    icon: <FaBullseye />,
  },
  {
    id: 3,
    title: 'Website Link',
    subheading: 'Provide your website link',
    icon: <FaGlobe />,
  },
  {
    id: 4,
    title: 'Industry',
    subheading: 'Provide industry Details',
    icon: <FaCity />,
  },
  {
    id: 5,
    title: 'Contact Details',
    subheading: 'Provide contact details',
    icon: <FaPhone />,
  },
]

interface SidebarProps {
  lastVisitedSection: number
  visitedSections: number[]
}

const Sidebar: React.FC<SidebarProps> = ({
  lastVisitedSection,
  visitedSections,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <>
      <div className="lg:hidden p-4">
        <FaBars className="text-2xl cursor-pointer" onClick={toggleSidebar} />
      </div>

      <div
        className={`fixed lg:relative lg:w-64 h-screen bg-gray-100 transition-transform transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {isSidebarOpen && (
          <FaTimes
            className="absolute top-4 right-4 text-2xl cursor-pointer"
            onClick={toggleSidebar}
          />
        )}
        <div className="flex items-center mb-8 mt-8 ml-4 md:ml-2">
          <img src={ZynthLogo} alt="Zynth Logo" className="w-12 h-12 mr-2" />
          <img src={ZynthLogoText} alt="Zynth Logo Text" className="w-24 h-6" />
        </div>

        <div className="relative">
          {sections.map((section, index) => {
            const isActive = section.id === lastVisitedSection
            const isVisited = visitedSections.includes(section.id)

            return (
              <div
                key={section.id}
                className={`relative w-full ${isActive ? 'bg-white' : ''}`}
              >
                {/* Section Item */}
                <div
                  className={`flex items-center py-1 mb-3 space-x-4 pl-4 transition-colors duration-300 h-full ${
                    isActive
                      ? 'border-l-4 border-[#3667B2]'
                      : 'border-l-4 border-transparent'
                  }`}
                >
                  {/* Icon and Progress Bar Container */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`text-2xl ${
                        isActive || isVisited
                          ? 'text-[#3667B2]'
                          : 'text-gray-400'
                      }`}
                    >
                      {isVisited && !isActive ? (
                        <FaCheckCircle />
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
                      className={`font-semibold text-base lg:text-sm ${
                        isActive || isVisited
                          ? 'text-[#3667B2]'
                          : 'text-gray-700'
                      }`}
                    >
                      {section.title}
                    </h2>
                    <p className="text-xs lg:text-xs text-gray-500">
                      {section.subheading}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Sidebar
