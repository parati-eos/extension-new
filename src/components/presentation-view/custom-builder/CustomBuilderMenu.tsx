import React from 'react'
import PeopleIcon from '../../../assets/people-icon.png'
import GraphIcon from '../../../assets/graph-icon.png'
import StatisticsIcon from '../../../assets/statistics-icon.png'
import PointsIcon from '../../../assets/points-icon.png'
import TimelineIcon from '../../../assets/timeline-icon.png'
import TableIcon from '../../../assets/table-icon.png'
import ImagesIcon from '../../../assets/images-icon.png'
import { DisplayMode } from '../../../types/presentationView'
import { BackButton } from './shared/BackButton'

interface ClickProps {
  onTypeClick: (typeName: DisplayMode) => void
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
}

const CustomBuilderMenu: React.FC<ClickProps> = ({
  onTypeClick,
  setDisplayMode,
}) => {
  const slideTypes: { name: DisplayMode; icon: string }[] = [
    { name: 'Points', icon: PointsIcon },
    { name: 'Timeline', icon: TimelineIcon },
    { name: 'Images', icon: ImagesIcon },
    { name: 'Table', icon: TableIcon },
    { name: 'People', icon: PeopleIcon },
    { name: 'Statistics', icon: StatisticsIcon },
    { name: 'Graphs', icon: GraphIcon },
  ]

  const onBack = () => {
    setDisplayMode('newContent')
  }

  return (
    <div className="flex flex-col h-full lg:px-4 lg:py-3">
      {/* Top Section: Headings and Back Button */}
      <div className="flex items-center justify-between w-full mt-2 ml-6 lg:ml-0  lg:mt-0 lg:mb-4">
        <div>
          <h2 className="hidden md:block md:text-lg font-semibold text-[#091220]">
            Custom Builder
          </h2>
          <h3 className="text-sm sm:text-base text-[#5D5F61]">
            Select your slide type
          </h3>
        </div>
        <BackButton onClick={onBack} />
      </div>

      {/* Slide Type Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 mt-3 md:mt-6 lg:mt-8">
        {slideTypes.map((type) => (
          <div
            key={type.name}
            className="flex flex-col items-center border border-[#E1E3E5] rounded-lg flex-shrink-0 cursor-pointer shadow-md hover:shadow-lg transition-shadow" // Added cursor-pointer class
            onClick={() => onTypeClick(type.name)}
          >
            <div className="flex flex-col items-center py-4">
              <img
                src={type.icon}
                alt={type.name}
                className="object-none mt-5 mb-2"
              />
              <span className="text-xs font-medium  sm:text-base">
                {type.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden  flex flex-wrap justify-start  ">
        {slideTypes.map((type) => (
          <div
            key={type.name}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer"
            style={{
              width: '30%', // Adjust width to allow 3 divs in a row
              margin: '5px 0', // Add vertical margin for spacing
            }}
            onClick={() => onTypeClick(type.name)}
          >
            <img
              src={type.icon}
              alt={type.name}
              className="w-12 h-12 mb-2" // Icon size for mobile
            />
            <span className="text-xs font-medium">{type.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomBuilderMenu
