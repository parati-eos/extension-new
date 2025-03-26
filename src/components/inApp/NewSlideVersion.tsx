
import { useState } from 'react'
import { BackButton } from './BackButton'
import { DisplayMode } from '../../@types/presentationView'
//import { PricingModal } from '../shared/PricingModal'

interface ButtonProps {
  backDisabled: boolean
  handleQuickGenerate: () => void
  handleCustomBuilderClick: () => void
  handleSlideNarrative: () => void
  handleBack?: () => void
  userPlan: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
  isLoading: boolean
  customBuilderDisabled: boolean
  // openPricingModal: () => void
  monthlyPlanAmount: number
  yearlyPlanAmount: number
  currency: string
  yearlyPlanId: string
  monthlyPlanId: string
  authToken: string
  orgId: string
  subscriptionId: string
}

export const MobileNewSlideVersion: React.FC<ButtonProps> = ({
  handleQuickGenerate,
  handleCustomBuilderClick,
  handleSlideNarrative,
  userPlan,
  isLoading,
  monthlyPlanAmount,
  yearlyPlanAmount,
  currency,
  yearlyPlanId,
  monthlyPlanId,
  authToken,
  orgId,
  subscriptionId,
}) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  // const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const [isDialogVisibleQuick, setIsDialogVisibleQuick] = useState(false)
  const [isDialogVisibleNarrative, setIsDialogVisibleNarrative] =
    useState(false)
  const handleMouseEnterNarrative = () => {
    setIsDialogVisibleNarrative(true)
  }
  const handleMouseLeaveNarrative = () => {
    setIsDialogVisibleNarrative(false)
  }

  const handleMouseEnterQuick = () => {
    setIsDialogVisibleQuick(true)
  }
  const handleMouseLeaveQuick = () => {
    setIsDialogVisibleQuick(false)
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
            <div className="relative flex flex-col items-center rounded-md border border-gray-300 p-4 flex-shrink-0 w-[33%]">
              <button
                className="flex flex-col items-center justify-center"
                onClick={handleQuickGenerate}
              >
                <img
                  src="https://d2zu6flr7wd65l.cloudfront.net/uploads/1739431010012_quick%20generate.svg"
                  alt="Quick Generate"
                  className="h-12 w-12"
                />
                <span className="text-xs lg:text-sm">Quick Generate</span>
              </button>

              {/* Info Button */}
              <div className="absolute top-2 right-2">
                <button
                  className="w-4 h-4 flex items-center justify-center bg-[#3667B2] text-white font-bold rounded-full hover:bg-blue-600 shadow-md transition duration-200 focus:outline-none"
                  onMouseEnter={handleMouseEnterQuick}
                  onMouseLeave={handleMouseLeaveQuick}
                >
                  i
                </button>

                {/* Tooltip */}
                {isDialogVisibleQuick && (
                  <div className="absolute top-full left-[1.2rem] transform -translate-x-1/2 mt-2 w-[16rem] bg-gray-200 text-black p-3 rounded-lg shadow-lg z-50">
                    <p className="text-xs text-center text-gray-800">
                      Generate a new version without providing any input. Useful
                      when you need slide ideas for a section.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="relative flex flex-col items-center rounded-md border border-gray-300 p-4 flex-shrink-0 w-[33%]">
              <button
                className="flex flex-col items-center justify-center "
                onClick={handleSlideNarrative}
              >
                <img
                  src="https://d2zu6flr7wd65l.cloudfront.net/uploads/1739431178626_Slide%20narrative.svg"
                  alt="Slide Narrative"
                  className="h-12 w-12"
                />
                <span className="text-xs lg:text-sm">Slide Narrative</span>
              </button>
              {/* Info Button */}
              <div className="absolute top-2 right-2">
                <button
                  className="w-4 h-4 flex items-center justify-center bg-[#3667B2] text-white font-bold rounded-full hover:bg-blue-600 shadow-md transition duration-200 focus:outline-none"
                  onMouseEnter={handleMouseEnterNarrative}
                  onMouseLeave={handleMouseLeaveNarrative}
                >
                  i
                </button>

                {/* Tooltip */}
                {isDialogVisibleNarrative && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[16rem] bg-gray-200 text-black p-3 rounded-lg shadow-lg z-50">
                    <p className="text-xs text-center text-gray-800">
                      Provide more context around the slide to generate a new
                      version.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div
              className={`relative flex flex-col items-center rounded-md border border-gray-300 p-4 flex-shrink-0 w-[33%]`}
              onMouseEnter={() => {
                if (userPlan === 'free' || userPlan !== 'free')
                  setIsDialogVisible(true)
              }}
              onMouseLeave={() => {
                if (userPlan === 'free' || userPlan !== 'free')
                  setIsDialogVisible(false)
              }}
            >
              <button
                className="flex flex-col items-center justify-center "
                onClick={handleCustomBuilderClick}
              >
                <img
                  src="https://d2zu6flr7wd65l.cloudfront.net/uploads/1739431230230_custom-builder.svg"
                  alt="Custom Builder"
                  className="h-12 w-12"
                />
                <span className="text-xs lg:text-sm">Custom Builder</span>
              </button>
              {isDialogVisible && userPlan === 'free' && (
                <div className="absolute  left-[0.1rem] transform -translate-x-1/2 w-[16rem] bg-gray-200 text-black p-3 rounded-lg shadow-lg flex items-center justify-center">
                  <p className="text-xs text-center text-gray-800">
                    <p>
                      Choose a slide type and provide information in a
                      structured format to get more control over the final
                      output.
                    </p>
                  </p>
                </div>
              )}
              {/* Info Button */}
              <div className="absolute top-2 right-2">
                <button
                  className="w-4 h-4 flex items-center justify-center bg-[#3667B2] text-white font-bold rounded-full hover:bg-blue-600 shadow-md transition duration-200 focus:outline-none"
                  onMouseEnter={() => {
                    if (userPlan === 'free' || userPlan !== 'free')
                      setIsDialogVisible(true)
                  }}
                  onMouseLeave={() => {
                    if (userPlan === 'free' || userPlan !== 'free')
                      setIsDialogVisible(false)
                  }}
                >
                  i
                </button>

                {/* Tooltip */}
                {isDialogVisible && userPlan !== 'free' && (
                  <div className="absolute   transform -translate-x-[85%] w-[16rem] bg-gray-200 text-black p-3 rounded-lg shadow-lg flex items-center justify-center">
                    <p className="text-xs text-center text-gray-800">
                      Choose a slide type and provide information in a
                      structured format to get more control over the final
                      output.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Pricing Modal */}
      {/* {isPricingModalOpen && (
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
          subscriptionId={subscriptionId}
        />
      )} */}
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
  subscriptionId,
  handleBack,
}) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [isDialogVisibleQuick, setIsDialogVisibleQuick] = useState(false)
  const [isDialogVisibleNarrative, setIsDialogVisibleNarrative] =
    useState(false)
  //const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)

  const handleMouseEnterQuick = () => {
    setIsDialogVisibleQuick(true)
  }
  const handleMouseLeaveQuick = () => {
    setIsDialogVisibleQuick(false)
  }
  const handleMouseEnterNarrative = () => {
    setIsDialogVisibleNarrative(true)
  }
  const handleMouseLeaveNarrative = () => {
    setIsDialogVisibleNarrative(false)
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
            <BackButton onClick={handleBack!} disabled={backDisabled} />
          </div>
          <div className="text-center">
            <h2 className="text-xl text-[#091220] font-semibold mb-3">
              Create a new slide
            </h2>
            <h3 className="text-base text-[#5D5F61]">
              How would you like to create a new slide?
            </h3>
          </div>
          <div className="relative flex   justify-between mt-8 w-full  p-4">
            <div
              className="relative flex flex-col items-center border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow flex-shrink-0"
              style={{ width: '30%', height: '12rem' }}
              onMouseEnter={handleMouseEnterQuick}
              onMouseLeave={handleMouseLeaveQuick}
            >
              <button
                className="flex flex-col items-center justify-center w-full h-full"
                onClick={handleQuickGenerate}
              >
                <img
                 src="https://d2zu6flr7wd65l.cloudfront.net/uploads/1739431010012_quick%20generate.svg"
                  alt="Quick Generate"
                  className="object-none mb-4 mt-4"
                />
                <span className="text-base font-medium">Quick Generate</span>
              </button>
              {isDialogVisibleQuick && (
                <div className="absolute top-[10rem]   w-[16rem] bg-gray-200 text-black p-3 rounded-lg shadow-lg flex items-center justify-center">
                  <p className="text-sm text-center text-gray-800">
                    Generate a new version without providing any input. Useful
                    when you need slide ideas for a section.
                  </p>
                </div>
              )}
            </div>
            <div
              className="relative flex flex-col items-center border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow flex-shrink-0"
              style={{ width: '30%', height: '12rem' }}
              onMouseEnter={handleMouseEnterNarrative}
              onMouseLeave={handleMouseLeaveNarrative}
            >
              <button
                className="flex flex-col items-center justify-center w-full h-full"
                onClick={handleSlideNarrative}
              >
                <img
                   src="https://d2zu6flr7wd65l.cloudfront.net/uploads/1739431178626_Slide%20narrative.svg"
                  alt="Slide Narrative"
                  className="object-none mb-4 mt-4"
                />
                <span className="text-base font-medium">Slide Narrative</span>
              </button>
              {isDialogVisibleNarrative && (
                <div className="absolute top-[10rem]   w-[16rem] bg-gray-200 text-black p-3 rounded-lg shadow-lg flex items-center justify-center">
                  <p className="text-sm text-center text-gray-800">
                    Provide more context around the slide to generate a new
                    version.
                  </p>
                </div>
              )}
            </div>
            <div
              className={`relative flex flex-col items-center border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow flex-shrink-0`}
              style={{ width: '30%', height: '12rem' }}
              onMouseEnter={() => {
                if (userPlan === 'free' || userPlan !== 'free')
                  setIsDialogVisible(true)
              }}
              onMouseLeave={() => {
                if (userPlan === 'free' || userPlan !== 'free')
                  setIsDialogVisible(false)
              }}
            >
              <button
                className="flex flex-col items-center justify-center w-full h-full"
                onClick={handleCustomBuilderClick}
              >
                <img
                  src="https://d2zu6flr7wd65l.cloudfront.net/uploads/1739431230230_custom-builder.svg"
                  alt="Custom Builder"
                  className="object-none mb-4 mt-4"
                />
                <span className="text-base font-medium">Custom Builder</span>
              </button>
              {isDialogVisible && userPlan === 'free' && (
                <div className="absolute top-[10rem]   w-[16rem] bg-gray-200 text-black p-3 rounded-lg shadow-lg flex items-center justify-center">
                  <p className="text-sm text-center text-gray-800">
                    <p>
                      Choose a slide type and provide information in a
                      structured format to get more control over the final
                      output.
                    </p>
                  </p>
                </div>
              )}
              {/* Tooltip */}
              {isDialogVisible && userPlan !== 'free' && (
                <div className="absolute top-[10rem]   w-[16rem] bg-gray-200 text-black p-3 rounded-lg shadow-lg flex items-center justify-center">
                  <p className="text-sm text-center text-gray-800">
                    Choose a slide type and provide information in a structured
                    format to get more control over the final output.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {/* Pricing Modal */}
      {/* {isPricingModalOpen && (
        <PricingModal
          subscriptionId={subscriptionId}
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
      )} */}
    </div>
  )
}
