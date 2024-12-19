import { FaDownload, FaShare } from 'react-icons/fa'
import { HeadingProps } from '../../types/types'
import { useRef, useState } from 'react'

export const DesktopHeading: React.FC<HeadingProps> = ({
  handleShare,
  handleDownload,
  pptName,
  isLoading,
  userPlan,
  openPricingModal,
}) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const dialogTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    // Clear any existing timeout to avoid premature hiding
    if (dialogTimeoutRef.current) {
      clearTimeout(dialogTimeoutRef.current)
    }

    // Show the dialog box
    setIsDialogVisible(true)
  }

  const handleMouseLeave = () => {
    // Start a timer to hide the dialog box after 6 seconds
    dialogTimeoutRef.current = setTimeout(() => {
      setIsDialogVisible(false)
    }, 1000)
  }

  const handleDialogMouseEnter = () => {
    // Clear the timeout to keep the dialog visible while hovered
    if (dialogTimeoutRef.current) {
      clearTimeout(dialogTimeoutRef.current)
    }
  }

  const handleDialogMouseLeave = () => {
    // Restart the timer when the cursor leaves the dialog
    dialogTimeoutRef.current = setTimeout(() => {
      setIsDialogVisible(false)
    }, 6000)
  }

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
            onClick={handleShare}
            className="text-[#5D5F61] gap-2 hover:text-[#3667B2] border border-[#E1E3E5] bg-white p-2 py-1 rounded-md flex items-center active:scale-95 transition transform duration-300"
          >
            <FaShare className="h-3 w-3" />
            <span>Share</span>
          </button>
          <div
            className="relative group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={handleDownload}
              disabled={userPlan === 'free'}
              className={`text-[#5D5F61] gap-2 ${
                userPlan !== 'free' && 'hover:text-[#3667B2]'
              } border border-[#E1E3E5] bg-white disabled:bg-gray-300 p-2 py-1 rounded-md flex items-center active:scale-95 transition transform duration-300`}
            >
              <FaDownload className="h-3 w-3" />
              <span>Export</span>
            </button>

            {userPlan === 'free' && isDialogVisible && (
              <div
                className="absolute left-full top-[0.07rem] transform -translate-y-[60%] ml-2 h-[6rem] w-[10rem] bg-gray-200 text-[#3667B2] px-3 py-1 rounded-2xl shadow-lg"
                onMouseEnter={handleDialogMouseEnter}
                onMouseLeave={handleDialogMouseLeave}
              >
                <p>
                  Please 
                  <span>
                    <button
                      className="text-purple-600 hover:text-purple-800 hover:scale-110 active:scale-95 transition transform"
                      onClick={openPricingModal}
                    >
                      upgrade to Pro
                    </button>
                  </span>{' '}
                  plan to access this feature.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
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
}) => {
  return (
    <div className="flex items-center justify-between gap-2 mt-6 mb-5">
      <h1 className="text-2xl font-semibold flex-1 mr-4 break-words">
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
          </div>
        )}
        {pptName}
      </h1>
      <div className="flex gap-2">
        <button
          onClick={openPricingModal}
          className="text-[#5D5F61] hover:text-blue-600 border border-gray-300 p-2 rounded-md active:scale-95 transition transform duration-300"
        >
          <FaDownload className="h-4 w-4" />
        </button>
        <button
          onClick={handleShare}
          disabled={userPlan === 'free'}
          className="text-[#5D5F61] disabled:bg-gray-300 hover:text-blue-600 border border-gray-300 p-2 rounded-md active:scale-95 transition transform duration-300"
        >
          <FaShare className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
