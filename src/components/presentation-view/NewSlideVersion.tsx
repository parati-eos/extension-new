import CustomBuilderIcon from '../../assets/custom-builder.svg'
import SlideNarrativeIcon from '../../assets/Slide narrative.svg'
import QuickGenerateIcon from '../../assets/quick generate.svg'
import { BackButton } from './custom-builder/shared/BackButton'
import { DisplayMode } from '@/src/types/presentationView'

interface ButtonProps {
  handleQuickGenerate: () => void
  handleCustomBuilderClick: () => void
  handleSlideNarrative: () => void
  userPlan: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
}

export const MobileNewSlideVersion: React.FC<ButtonProps> = ({
  handleQuickGenerate,
  handleCustomBuilderClick,
  handleSlideNarrative,
  setDisplayMode,
  userPlan,
}) => {
  return (
    <div className="flex flex-col  w-full h-full p-2 ">

     <div className="flex flex-col w-full h-full items-center justify-center  text-center ">
  <h2 className="text-xl font-semibold">Create a new slide</h2>
  <h3 className="text-base text-[#5D5F61] mt-2">
    How would you like to create a new slide?
  </h3>

      <div className="w-full flex justify-between  mt-8   ">
        <div className="flex flex-col items-center rounded-md border  border-gray-300 p-4 flex-shrink-0 w-[33%]">
          <button
            className="flex flex-col items-center justify-center "
            onClick={handleQuickGenerate}
          >
            <img
              src={QuickGenerateIcon}
              alt="Quick Generate"
              className="h-12 w-12"
            />
            <span className="text-xs lg:text-sm">Quick Generate</span>
          </button>
        </div>
        <div className="flex flex-col items-center rounded-md border border-gray-300 p-4 flex-shrink-0 w-[33%]">
          <button
            className="flex flex-col items-center justify-center "
            onClick={handleSlideNarrative}
          >
            <img
              src={SlideNarrativeIcon}
              alt="Slide Narrative"
              className="h-12 w-12"
            />
            <span className="text-xs lg:text-sm">Slide Narrative</span>
          </button>
        </div>
        <div className="flex flex-col items-center rounded-md border border-gray-300 p-4 flex-shrink-0 w-[33%]">
          <button
            className="flex flex-col items-center justify-center "
            onClick={handleCustomBuilderClick}
            // disabled={userPlan === 'free'}
          >
            <img
              src={CustomBuilderIcon}
              alt="Custom Builder"
              className="h-12 w-12"
            />
            <span className="text-xs lg:text-sm">Custom Builder</span>
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}

export const DesktopNewSlideVersion: React.FC<ButtonProps> = ({
  handleQuickGenerate,
  handleCustomBuilderClick,
  handleSlideNarrative,
  userPlan,
  setDisplayMode,
}) => {
  const onBack = () => {
    setDisplayMode('slides')
  }

  return (
  
    <div className="relative flex flex-col h-full w-full items-center justify-center p-4">
  {/* Back Button */}
  <div className="hidden lg:block absolute top-4 right-4 ">
    <BackButton onClick={onBack} />
  </div>
      <div className="text-center">
        <h2 className="text-xl text-[#091220] font-semibold mb-3">
          Create a new slide
        </h2>
        <h3 className="text-base text-[#5D5F61]">
          How would you like to create a new slide?
        </h3>
      </div>
      <div className="flex   justify-between mt-8 w-full overflow-hidden p-4">
        <div
          className="flex flex-col items-center border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow flex-shrink-0"
          style={{ width: '30%', height: '12rem' }}
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
        <div
          className="flex flex-col items-center border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow flex-shrink-0"
          style={{ width: '30%', height: '12rem' }}
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
        <div
          className="flex flex-col items-center border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow flex-shrink-0"
          style={{ width: '30%', height: '12rem' }}
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

   
