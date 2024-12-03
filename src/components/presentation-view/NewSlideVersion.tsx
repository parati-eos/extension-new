import CustomBuilderIcon from '../../assets/custom-builder.png'
import SlideNarrativeIcon from '../../assets/slide-narrative.png'
import QuickGenerateIcon from '../../assets/quick-generate.png'

interface ButtonProps {
  handleQuickGenerate: () => void
  handleCustomBuilderClick: () => void
}

export const MobileNewSlideVersion: React.FC<ButtonProps> = ({
  handleQuickGenerate,
  handleCustomBuilderClick,
}) => {
  return (
    <div className="flex flex-col mt-2 items-center justify-center h-full">
      <h2 className="text-xl font-semibold">Create a new slide</h2>
      <h3 className="text-base text-[#5D5F61]">
        How would you like to create a new slide?
      </h3>
      <div className="flex gap-2 mt-4">
        <div className="flex flex-col items-center border border-gray-300 p-2">
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
        <div className="flex flex-col items-center border border-gray-300 p-2">
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
        <div className="flex flex-col items-center border border-gray-300 p-2">
          <img
            src={SlideNarrativeIcon}
            alt="Slide Narrative"
            className="h-12 w-12"
          />
          <span className="text-sm">Slide Narrative</span>
        </div>
      </div>
    </div>
  )
}

export const DesktopNewSlideVersion: React.FC<ButtonProps> = ({
  handleQuickGenerate,
  handleCustomBuilderClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-xl text-[#091220] font-semibold">
        Create a new slide
      </h2>
      <h3 className="text-base text-[#5D5F61]">
        How would you like to create a new slide
      </h3>
      <div className="flex gap-4 mt-4">
        <div className="flex flex-col items-center border border-gray-300 p-4 rounded-lg">
          <button
            className="flex flex-col items-center justify-center"
            onClick={handleQuickGenerate}
          >
            <img
              src={QuickGenerateIcon}
              alt="Quick Generate"
              className="h-16 w-16"
            />
            <span>Quick Generate</span>
          </button>
        </div>
        <div className="flex flex-col items-center border border-gray-300 p-4 rounded-lg">
          <button
            className="flex flex-col items-center justify-center"
            onClick={handleCustomBuilderClick}
          >
            <img
              src={CustomBuilderIcon}
              alt="Custom Builder"
              className="h-16 w-16"
            />
            <span>Custom Builder</span>
          </button>
        </div>
        <div className="flex flex-col items-center border border-gray-300 p-4 rounded-lg">
          <img
            src={SlideNarrativeIcon}
            alt="Slide Narrative"
            className="h-16 w-16"
          />
          <span>Slide Narrative</span>
        </div>
      </div>
    </div>
  )
}
