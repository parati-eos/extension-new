import React from 'react'
import PeopleIcon from '../../assets/people.svg'
import GraphIcon from '../../assets/graphs.svg'
import StatisticsIcon from '../../assets/statistics.svg'
import PointsIcon from '../../assets/points.svg'
import TimelineIcon from '../../assets/Presentation.svg'
import TableIcon from '../../assets/table.svg'
import ImagesIcon from '../../assets/images.svg'
import { DisplayMode } from './ViewPresentation'
import { BackButton } from './custom-builder/shared/BackButton'

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
    {
      name: 'Statistics',
      icon: StatisticsIcon,
    },
    { name: 'Graphs', icon: GraphIcon },
  ]

  const onBack = () => {
    setDisplayMode('newContent')
  }

  return (
    <div className="flex flex-col h-full px-6 py-4">
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
        <BackButton onClick={onBack} />
      </div>

      {/* Slide Type Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2   sm:gap-4 mt-3 md:mt-6 lg:mt-12">
        {slideTypes.map((type) => (
          <div
            key={type.name}
            className="flex flex-col items-center border border-[#E1E3E5] rounded-lg flex-shrink-0 cursor-pointer shadow-md hover:shadow-lg transition-shadow" // Added cursor-pointer class
            style={{ width: '99%', height: '10rem' }}
            onClick={() => onTypeClick(type.name)}
          >
            <div className="flex flex-col items-center py-4">
              <img
                src={type.icon}
                alt={type.name}
                className="object-none mt-5 mb-2 "
              />
              <span className="text-xs font-medium  sm:text-base">{type.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomBuilderMenu
