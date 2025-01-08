import CustomBuilderIcon from '../../assets/custom-builder.svg'
import { useState } from 'react'
import SlideNarrativeIcon from '../../assets/Slide narrative.svg'
import QuickGenerateIcon from '../../assets/quick generate.svg'
import { BackButton } from './custom-builder/shared/BackButton'
import { DisplayMode } from '@/src/types/presentationView'
import { PricingModal } from '../shared/PricingModal'

interface ButtonProps {
  backDisabled: boolean
  handleQuickGenerate: () => void
  handleCustomBuilderClick: () => void
  handleSlideNarrative: () => void
  userPlan: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
  isLoading: boolean
  customBuilderDisabled: boolean
  openPricingModal: () => void
  monthlyPlanAmount: number
  yearlyPlanAmount: number
  currency: string
  yearlyPlanId: string
  monthlyPlanId: string
  authToken: string
  orgId: string
}

export const MobileNewSlideVersion: React.FC<ButtonProps> = ({
  handleQuickGenerate,
  handleCustomBuilderClick,
  handleSlideNarrative,
  backDisabled,
  userPlan,
  isLoading,
  monthlyPlanAmount,
  yearlyPlanAmount,
  currency,
  yearlyPlanId,
  monthlyPlanId,
  authToken,
  orgId,
}) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)

  const handleMouseEnter = () => {
    if (userPlan === 'free') setIsDialogVisible(true)
  }

  const handleMouseLeave = () => {
    setIsDialogVisible(false)
  }
  return (
    <div className="flex flex-col  w-full h-full p-2 ">
      {isLoading ? (
        <div className="w-full h-full flex flex-col gap-y-3 items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
          <h1>Generating Slide Please Wait...</h1>
        </div>
      ) : (
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
            <div
              className={`relative flex flex-col items-center rounded-md border border-gray-300 ${
                userPlan === 'free' ? 'bg-gray-200' : ''
              } p-4 flex-shrink-0 w-[33%]`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="flex flex-col items-center justify-center "
                onClick={handleCustomBuilderClick}
                disabled={userPlan === 'free'}
              >
                <img
                  src={CustomBuilderIcon}
                  alt="Custom Builder"
                  className="h-12 w-12"
                />
                <span className="text-xs lg:text-sm">Custom Builder</span>
              </button>
              {isDialogVisible && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-[8rem] bg-gray-200 text-black p-3 rounded-lg shadow-lg flex items-center justify-center">
                  <p className="text-xs text-center text-gray-800">
                    Please{' '}
                    <button
                      className="text-purple-600 font-medium hover:text-purple-800 hover:scale-105 active:scale-95 transition transform"
                      onClick={() => setIsPricingModalOpen(true)}
                    >
                      upgrade to Pro
                    </button>{' '}
                    plan to access this feature.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Pricing Modal */}
      {isPricingModalOpen && (
        <PricingModal
          closeModal={() => setIsPricingModalOpen(false)}
          heading="Subscription Plans"
          monthlyPlanAmount={monthlyPlanAmount}
          yearlyPlanAmount={yearlyPlanAmount}
          currency={currency!}
          yearlyPlanId={yearlyPlanId!}
          monthlyPlanId={monthlyPlanId!}
          authToken={authToken!}
          orgId={orgId!}
        />
      )}
    </div>
  )
}

export const DesktopNewSlideVersion: React.FC<ButtonProps> = ({
  handleQuickGenerate,
  handleCustomBuilderClick,
  handleSlideNarrative,
  backDisabled,
  userPlan,
  setDisplayMode,
  isLoading,
  monthlyPlanAmount,
  yearlyPlanAmount,
  currency,
  yearlyPlanId,
  monthlyPlanId,
  authToken,
  orgId,
}) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const handleMouseEnter = () => {
    if (userPlan === 'free') setIsDialogVisible(true)
  }

  const handleMouseLeave = () => {
    setIsDialogVisible(false)
  }

  const onBack = () => {
    setDisplayMode('slides')
  }

  return (
    <div className="relative flex flex-col h-full w-full items-center justify-center p-4">
      {isLoading ? (
        <div className="w-full h-full flex flex-col gap-y-3 items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
          <h1>Generating Slide Please Wait...</h1>
        </div>
      ) : (
        <>
          {/* Back Button */}
          <div className="hidden lg:block absolute top-4 right-4 ">
            <BackButton onClick={onBack} disabled={backDisabled} />
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
              className={`relative flex flex-col items-center border border-gray-300 ${
                userPlan === 'free' ? 'bg-gray-200' : ''
              } rounded-lg shadow-md hover:shadow-lg transition-shadow flex-shrink-0`}
              style={{ width: '30%', height: '12rem' }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="flex flex-col items-center justify-center w-full h-full"
                onClick={handleCustomBuilderClick}
                disabled={userPlan === 'free'}
              >
                <img
                  src={CustomBuilderIcon}
                  alt="Custom Builder"
                  className="object-none mb-4 mt-4"
                />
                <span className="text-base font-medium">Custom Builder</span>
              </button>
              {isDialogVisible && (
                <div className="absolute    w-[15rem] bg-gray-200 text-black p-3 rounded-lg shadow-lg flex items-center justify-center">
                  <p className="text-sm text-center text-gray-800">
                    Please{' '}
                    <button
                      className="text-purple-600 font-medium hover:text-purple-800 hover:scale-105 active:scale-95 transition transform"
                      onClick={() => setIsPricingModalOpen(true)}
                    >
                      upgrade to Pro
                    </button>{' '}
                    plan to access this feature.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {/* Pricing Modal */}
      {isPricingModalOpen && (
        <PricingModal
          closeModal={() => setIsPricingModalOpen(false)}
          heading="Subscription Plans"
          monthlyPlanAmount={monthlyPlanAmount}
          yearlyPlanAmount={yearlyPlanAmount}
          currency={currency!}
          yearlyPlanId={yearlyPlanId!}
          monthlyPlanId={monthlyPlanId!}
          authToken={authToken!}
          orgId={orgId!}
        />
      )}
    </div>
  )
}
