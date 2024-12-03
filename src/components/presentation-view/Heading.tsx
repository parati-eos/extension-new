import { FaDownload, FaShare } from 'react-icons/fa'
import { ButtonProps } from '../../types/types'

export const DesktopHeading: React.FC<ButtonProps> = ({
  handleShare,
  handleDownload,
}) => {
  return (
    <div className="hidden lg:flex lg:w-full lg:absolute lg:left-0 lg:pl-8 lg:pr-8 lg:pt-4">
      <div className="flex items-center gap-8 w-full">
        <h1 className="text-2xl font-semibold break-words">
          The Evolution of Our Path
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="text-[#5D5F61] gap-2 hover:text-blue-600 border border-[#E1E3E5] bg-white p-2 py-1 rounded-md flex items-center"
          >
            <FaShare className="h-3 w-3" />
            <span>Share</span>
          </button>
          <button
            onClick={handleDownload}
            className="text-[#5D5F61] gap-2 hover:text-blue-600 border border-[#E1E3E5] bg-white p-2 py-1 rounded-md flex items-center"
          >
            <FaDownload className="h-3 w-3" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export const MobileHeading: React.FC<ButtonProps> = ({
  handleDownload,
  handleShare,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 mt-6 mb-5">
      <h1 className="text-2xl font-semibold flex-1 mr-4 break-words">
        The Evolution of Our Path
      </h1>
      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="text-[#5D5F61] hover:text-blue-600 border border-gray-300 p-2 rounded-md"
        >
          <FaDownload className="h-4 w-4" />
        </button>
        <button
          onClick={handleShare}
          className="text-[#5D5F61] hover:text-blue-600 border border-gray-300 p-2 rounded-md"
        >
          <FaShare className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
