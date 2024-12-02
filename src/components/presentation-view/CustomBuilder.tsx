import React from 'react'
import PeopleIcon from '../../assets/people-icon.png'
import GraphIcon from '../../assets/graph-icon.png'
import StatisticsIcon from '../../assets/statistics-icon.png'
import PointsIcon from '../../assets/points-icon.png'
import TimelineIcon from '../../assets/timeline-icon.png'
import TableIcon from '../../assets/table-icon.png'
import ImagesIcon from '../../assets/images-icon.png'
import { DisplayMode } from './ViewPresentation'

interface ClickProps {
  onTypeClick: (typeName: DisplayMode) => void
}

const CustomBuilder: React.FC<ClickProps> = ({ onTypeClick }) => {
  const slideTypes: { name: DisplayMode; icon: string }[] = [
    { name: 'Points', icon: PointsIcon },
    { name: 'Timeline', icon: TimelineIcon },
    { name: 'Images', icon: ImagesIcon },
    { name: 'Table', icon: TableIcon },
    { name: 'People', icon: PeopleIcon },
    {
      name: 'Statistics',
      icon: StatisticsIcon,
    },
    { name: 'Graphs', icon: GraphIcon },
  ]

  return (
    <div className="flex flex-col h-full p-4">
      {/* Top Section: Headings and Back Button */}
      <div className="flex lg:mt-2 items-center justify-between w-full">
        <div>
          <h2 className="hidden md:block md:text-lg font-semibold text-[#091220]">
            Custom Builder
          </h2>
          <h3 className="text-sm sm:text-base text-[#5D5F61]">
            Select your slide type
          </h3>
        </div>
        <button
          className="hidden md:block text-sm border border-[#8A8B8C] px-3 py-1 rounded-lg text-[#5D5F61] hover:underline"
          //   onClick={handleBackClick}
        >
          Back
        </button>
      </div>

      {/* Slide Type Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 mt-3 md:mt-5 lg:mt-6">
        {slideTypes.map((type) => (
          <div
            key={type.name}
            className="flex flex-col items-center md:border md:border-gray-300 md:p-2 lg:py-3 rounded-lg"
          >
            <button
              className="flex flex-col items-center justify-center"
              onClick={() => onTypeClick(type.name)}
            >
              <img
                src={type.icon}
                alt={type.name}
                className="h-12 w-12 sm:h-16 sm:w-16"
              />
              <span className="text-xs sm:text-sm">{type.name}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomBuilder
