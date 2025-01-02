import { FaDownload, FaShare } from 'react-icons/fa'
import { HeadingProps } from '../../types/types'
import { useEffect, useRef, useState } from 'react'

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
            className="absolute left-full top-[0.07rem] transform -translate-y-[60%] ml-2 w-[12rem] bg-gray-200 text-black p-2 rounded-2xl shadow-lg flex items-center justify-center"
            onMouseEnter={handleDialogMouseEnter}
            onMouseLeave={handleDialogMouseLeave}
          >
            <p className="text-sm text-center text-gray-800">
              Please{' '}
              <button
                className="text-purple-600 font-medium hover:text-purple-800 hover:scale-105 active:scale-95 transition transform"
                onClick={openPricingModal}
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
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null); // Ref for the tooltip
  const buttonRef = useRef<HTMLButtonElement | null>(null); 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside both the button and tooltip
      if (
        buttonRef.current &&
        tooltipRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsTooltipVisible(false); // Hide the tooltip if click is outside
      }
    };

    // Add event listener to document to listen for clicks outside
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


 
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
      <div className="relative">
      {/* Button */}
      <button
        ref={buttonRef}
        onClick={() => {
          if (userPlan === 'free') {
            setIsTooltipVisible((prev) => !prev); // Toggle tooltip visibility if user is on 'free' plan
          } else {
            handleDownload(); // Call handleDownload if user is not on 'free' plan
          }
        }}
        className="text-[#5D5F61] hover:text-blue-600 border border-gray-300 p-2 rounded-md active:scale-95 transition transform duration-300"
      >
        <FaDownload className="h-4 w-4" />
      </button>

      {/* Tooltip */}
      {isTooltipVisible && (
        <div
          ref={tooltipRef}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-[8rem] bg-gray-200 text-black p-3 rounded-lg shadow-lg flex items-center justify-center"
        >
          <p className="text-sm text-gray-800 text-center">
            Please{' '}
            <button
              className="text-purple-600 font-medium hover:text-purple-800 hover:scale-105 active:scale-95 transition transform"
              onClick={openPricingModal}
            >
              upgrade to Pro
            </button>{' '}
            to access this feature.
          </p>
        </div>
      )}
    </div>

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
