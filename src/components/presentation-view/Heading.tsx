import { FaDownload, FaShare } from 'react-icons/fa'
import { HeadingProps } from '../../types/types'

import GuidedTour from '../onboarding/shared/GuidedTour'
import GuidedTourMobile from '../onboarding/shared/GuidedTourMobile'

export const DesktopHeading: React.FC<HeadingProps> = ({
  handleShare,
  handleDownload,
  pptName,
  isLoading,
  userPlan,
  openPricingModal,
  exportPaid,
  buttonsDisabled,
}) => {
  return (
    <div className="hidden lg:flex lg:w-full lg:absolute lg:left-0 lg:pl-8 lg:pr-8 lg:pt-4">
      <div className="flex items-center gap-8 w-full">
        <h1 className="text-2xl font-semibold break-words">
          {isLoading && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
            </div>
          )}
          {pptName}
        </h1>
        <div className="flex gap-2">
          <button
            id="share"
            onClick={handleShare}
            disabled={buttonsDisabled}
            className="text-[#5D5F61] gap-2 hover:text-[#3667B2] border border-[#E1E3E5] bg-white p-2 py-1 rounded-md flex items-center active:scale-95 transition transform duration-300 disabled:cursor-not-allowed"
          >
            <FaShare className="h-3 w-3" />
            <span>Share</span>
          </button>
          <div className="relative group">
            <button
              id="export"
              onClick={() => {
                if (userPlan === 'free' && !exportPaid) {
                  openPricingModal()
                } else if (userPlan === 'free' && exportPaid) {
                  // Call handleDownload if user is not on 'free' plan
                  handleDownload()
                } else if (userPlan !== 'free') {
                  handleDownload()
                }
              }}
              disabled={buttonsDisabled}
              className={`text-[#5D5F61] gap-2 disabled:cursor-not-allowed  hover:text-[#3667B2]
              border border-[#E1E3E5] bg-white  p-2 py-1 rounded-md flex items-center active:scale-95 transition transform duration-300`}
            >
              <FaDownload className="h-3 w-3" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
      <GuidedTour />
    </div>
  )
}

export const MobileHeading: React.FC<HeadingProps> = ({
  handleDownload,
  handleShare,
  pptName,
  isLoading,
  userPlan,
  openPricingModal,
  exportPaid,
  buttonsDisabled,
}) => {
  return (
    <div className="flex items-center justify-between gap-2   lg:mt-6 lg:mb-5">
      <h1 className="text-2xl font-semibold flex-1 mr-4 break-words">
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
          </div>
        )}
        {pptName}
      </h1>
      <div className="flex gap-2">
        <div className="relative">
          {/* Button */}
          <button
            id="export-mobile"
            disabled={buttonsDisabled}
            onClick={() => {
              if (userPlan === 'free' && !exportPaid) {
                openPricingModal()
              } else if (userPlan === 'free' && exportPaid) {
                // Call handleDownload if user is on 'free' plan and payment is done
                handleDownload()
              } else if (userPlan !== 'free') {
                handleDownload()
              }
            }}
            className="text-[#5D5F61] hover:text-blue-600 border border-gray-300 p-2 rounded-md active:scale-95 transition transform duration-300 disabled:cursor-not-allowed"
          >
            <FaDownload className="h-4 w-4" />
          </button>
        </div>

        <button
          id="share-mobile"
          onClick={handleShare}
          disabled={buttonsDisabled}
          className="text-[#5D5F61] disabled:bg-gray-300  border border-gray-300 p-2 rounded-md active:scale-95 transition transform duration-300 disabled:cursor-not-allowed"
        >
          <FaShare className="h-4 w-4" />
        </button>
      </div>
      <GuidedTourMobile />
    </div>
  )
}
