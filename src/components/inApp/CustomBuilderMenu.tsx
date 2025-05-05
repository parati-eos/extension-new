import React from 'react'
import { DisplayMode } from '../../@types/presentationView'
import { BackButton } from './BackButton'

interface ClickProps {
  onTypeClick: (typeName: DisplayMode) => void
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
}

const CustomBuilderMenu: React.FC<ClickProps> = ({
  onTypeClick,
  setDisplayMode,
}) => {
  const slideTypes: { name: DisplayMode; icon: string }[] = [
    { name: 'Points', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435466780_points.svg" },
    { name: 'Timeline', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435399743_Presentation.svg" },
    { name: 'Images', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435517252_images.svg" },
    { name: 'Table', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435575006_table.svg" },
    { name: 'People', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435517252_images.svg" },
    { name: 'Statistics', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435650523_statistics.svg" },
    { name: 'Graphs', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435703873_graphs.svg" },
    { name: 'TextandImage',icon:"https://d2zu6flr7wd65l.cloudfront.net/uploads/1742886487822_Presentation.svg"}
  ]

  const onBack = () => {
    setDisplayMode('slides')
  }

  return (
<div className="flex flex-col h-full lg:p-4 p-2 w-full ">
      {/* Top Section: Headings and Back Button */}
      <div className="flex items-center justify-between w-full  ">
        <div>
        <h3 className='text-semibold'>
        Custom Builder
                      </h3>
         
          <h2 className="hidden lg:block md:text-lg font-semibold text-[#091220]">Select the slide type you want to create.</h2>
         
        </div>
        <BackButton onClick={onBack} />
      </div>

      {/* Slide Type Grid */}
      <div className="hidden lg:grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 mt-3 md:mt-6 lg:mt-8">
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
<div className="lg:hidden h-full grid grid-cols-3 gap-4  px-2 py-4 ">
  {slideTypes.map((type) => (
    <div
      key={type.name}
      className="flex flex-col items-center cursor-pointer"
      onClick={() => onTypeClick(type.name)}
    >
      <img
        src={type.icon}
        alt={type.name}
        className="w-12 h-12 mb-2" // Icon size for mobile
      />
      <span className="text-xs font-medium text-center">{type.name}</span>
    </div>
  ))}
</div>
</div>
  )
}

export default CustomBuilderMenu