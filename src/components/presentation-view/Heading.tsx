import { FaDownload, FaShare } from 'react-icons/fa'
import { HeadingProps } from '../../types/types'

export const DesktopHeading: React.FC<HeadingProps> = ({
  handleShare,
  handleDownload,
  pptName,
  isLoading,
  userPlan,
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
            onClick={handleShare}
            className="text-[#5D5F61] gap-2 hover:text-[#3667B2] border border-[#E1E3E5] bg-white p-2 py-1 rounded-md flex items-center active:scale-95 transition transform duration-300"
          >
            <FaShare className="h-3 w-3" />
            <span>Share</span>
          </button>
          <button
            onClick={handleDownload}
            // disabled={userPlan === 'free'}
            className={`text-[#5D5F61] gap-2 hover:text-[#3667B2] border border-[#E1E3E5] bg-white disabled:bg-gray-300 p-2 py-1 rounded-md flex items-center active:scale-95 transition transform duration-300`}
          >
            <FaDownload className="h-3 w-3" />
            <span>Export</span>
          </button>
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
          onClick={handleDownload}
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
