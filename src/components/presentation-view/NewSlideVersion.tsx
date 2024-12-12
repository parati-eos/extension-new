import CustomBuilderIcon from '../../assets/custom-builder.svg'
import SlideNarrativeIcon from '../../assets/Slide narrative.svg'
import QuickGenerateIcon from '../../assets/quick generate.svg'

interface ButtonProps {
  handleQuickGenerate: () => void
  handleCustomBuilderClick: () => void
  handleSlideNarrative: () => void
}

export const MobileNewSlideVersion: React.FC<ButtonProps> = ({
  handleQuickGenerate,
  handleCustomBuilderClick,
  handleSlideNarrative,
}) => {
  return (
    <div className="flex flex-col mt-2 items-center justify-center h-full">
      <h2 className="text-xl font-semibold">Create a new slide</h2>
      <h3 className="text-base text-[#5D5F61]">
        How would you like to create a new slide?
      </h3>
      <div className="flex gap-2 mt-4 ml-4 lg:ml-0  lg:px-4  overflow-hidden">
        <div className="flex flex-col items-center rounded-md border border-gray-300 p-2 flex-shrink-0 w-[30%]">
          <button
            className="flex flex-col items-center justify-center"
            onClick={handleQuickGenerate}
          >
            <img
              src={QuickGenerateIcon}
              alt="Quick Generate"
              className="h-12 w-12"
            />
            <span className="text-sm">Quick Generate</span>
          </button>
        </div>
        <div className="flex flex-col items-center rounded-md border border-gray-300 p-2 flex-shrink-0 w-[30%]">
          <button
            className="flex flex-col items-center justify-center"
            onClick={handleSlideNarrative}
          >
            <img
              src={SlideNarrativeIcon}
              alt="Slide Narrative"
              className="h-12 w-12"
            />
            <span className="text-sm">Slide Narrative</span>
          </button>
        </div>
        <div className="flex flex-col items-center rounded-md border border-gray-300 p-2 flex-shrink-0 w-[30%]">
          <button
            className="flex flex-col items-center justify-center"
            onClick={handleCustomBuilderClick}
          >
            <img
              src={CustomBuilderIcon}
              alt="Custom Builder"
              className="h-12 w-12"
            />
            <span className="text-sm">Custom Builder</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export const DesktopNewSlideVersion: React.FC<ButtonProps> = ({
  handleQuickGenerate,
  handleCustomBuilderClick,
  handleSlideNarrative,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-xl text-[#091220] font-semibold mb-3">
        Create a new slide
      </h2>
      <h3 className="text-base text-[#5D5F61] mb-8">
        How would you like to create a new slide?
      </h3>
      <div className="flex gap-8 px-8 md:px-16 w-full overflow-hidden">
        {/* Quick Generate */}
        <div
          className="flex flex-col items-center border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow flex-shrink-0"
          style={{ width: '30%', height: '12rem' }} // Replaced pixels with % and rem
        >
          <button
            className="flex flex-col items-center justify-center w-full h-full"
            onClick={handleQuickGenerate}
          >
            <img
              src={QuickGenerateIcon}
              alt="Quick Generate"
              className="object-none mb-4 mt-4"
            />
            <span className="text-base font-medium">Quick Generate</span>
          </button>
        </div>
        {/* Custom Builder */}
        <div
          className="flex flex-col items-center border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow flex-shrink-0"
          style={{ width: '30%', height: '12rem' }} // Replaced pixels with % and rem
        >
          <button
            className="flex flex-col items-center justify-center w-full h-full"
            onClick={handleSlideNarrative}
          >
            <img
              src={SlideNarrativeIcon}
              alt="Slide Narrative"
               className="object-none mb-4 mt-4"
            />
            <span className="text-base font-medium">Slide Narrative</span>
          </button>
        </div>
        {/* Slide Narrative */}
        <div
          className="flex flex-col items-center border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow flex-shrink-0"
          style={{ width: '30%', height: '12rem' }} // Replaced pixels with % and rem
        >
          <button
            className="flex flex-col items-center justify-center w-full h-full"
            onClick={handleCustomBuilderClick}
          >
            <img
              src={CustomBuilderIcon}
              alt="Custom Builder"
                className="object-none mb-4 mt-4"
            />
            <span className="text-base font-medium">Custom Builder</span>
          </button>
        </div>
      </div>
    </div>
  )
}
