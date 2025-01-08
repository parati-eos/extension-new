import React from 'react'
import { FaTrash, FaCheck, FaPlus } from 'react-icons/fa'
import GuidedTour from '../onboarding/shared/GuidedTour'

type ButtonSectionProps = {
  onDelete: () => void
  onFinalize: () => void
  onNewVersion: () => void
  finalized: boolean
  currentSlideId?: string
}

export const DesktopButtonSection: React.FC<ButtonSectionProps> = ({
  onDelete,
  onFinalize,
  onNewVersion,
  finalized,
  currentSlideId,
}) => {
  return (
    <div className="flex gap-2">
      {/* Delete Button */}
      <button
            id='delete'
        onClick={onDelete}
        className="hover:text-red-600 border border-gray-300 p-2 rounded-md flex items-center active:scale-95 transition transform duration-300"
      >
        <FaTrash className="h-4 w-4 text-[#5D5F61] mr-1" />
        <span className="hidden text-[#5D5F61] lg:block">Delete Version</span>
      </button>

      {/* Finalize Button */}
      <button
      id='finalize'
        onClick={onFinalize}
        className={`p-2 rounded-md flex items-center border active:scale-95 transition transform duration-300 ${
          currentSlideId && finalized
            ? 'border-[#0A8568] bg-[#36fa810a]'
            : 'border-gray-300'
        }`}
      >
        <FaCheck
          className={`h-4 w-4 mr-1 ${
            finalized ? 'text-[#0A8568]' : 'text-[#5D5F61]'
          }`}
        />
        <span className="hidden text-[#5D5F61] lg:block">Finalize Version</span>
      </button>

      {/* New Version Button */}
      <button
        onClick={onNewVersion}
        id='new-version'
        className="hover:text-blue-600 border border-[#3667B2] p-2 rounded-md flex items-center active:scale-95 transition transform duration-300"
      >
        <FaPlus className="h-4 w-4 mr-1 text-[#3667B2]" />
        <span className="hidden text-[#3667B2] lg:block">New Version</span>
      </button>
    </div>
  )
}

type IconButtonGroupProps = {
  onDelete: () => void
  onFinalize: () => void
  onNewVersion: () => void
  finalized: boolean
  currentSlideId?: string
  displayMode: string
}

export const MobileButtonSection: React.FC<IconButtonGroupProps> = ({
  onDelete,
  onFinalize,
  onNewVersion,
  finalized,
  currentSlideId,
  displayMode,
}) => {
  return (
    <div className="flex gap-4">
      {/* Delete Button */}
      <button

        onClick={onDelete}
        className="hover:text-red-600 border border-gray-300 p-2 rounded-md flex items-center"
      >
        <FaTrash className="h-4 w-4 text-[#5D5F61]" />
      </button>

      {/* Finalize Button */}
      <button
        onClick={onFinalize}
        className={`border ${
          currentSlideId && finalized
            ? 'border-[#0A8568] bg-[#36fa810a]'
            : 'border-gray-300'
        } p-2 rounded-md flex items-center`}
      >
        <FaCheck
          className={`h-4 w-4 ${
            finalized ? 'text-[#0A8568]' : 'text-[#5D5F61]'
          }`}
        />
      </button>

      {/* New Version Button */}
      <button
        onClick={onNewVersion}
        className={`hover:text-blue-600 border ${
          displayMode === 'newContent' ? 'border-gray-300' : 'border-[#3667B2]'
        } p-2 rounded-md flex items-center`}
      >
        <FaPlus
          className={`h-4 w-4 ${
            displayMode === 'newContent' ? 'text-[#5D5F61]' : 'text-[#3667B2]'
          }`}
        />
      </button>
      <GuidedTour/>
    </div>
  )
}
