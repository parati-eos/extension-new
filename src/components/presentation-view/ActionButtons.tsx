import React, { useState } from 'react'
import { FaTrash, FaCheck, FaPlus } from 'react-icons/fa'
import GuidedTour from '../onboarding/shared/GuidedTour'
import GuidedTourMobile from '../onboarding/shared/GuidedTourMobile'

type DesktopActionButtonsProps = {
  onDelete: () => void
  onFinalize: () => void
  onNewVersion: () => void
  finalized: boolean
  currentSlideId?: string
  userPlan: string
  deleteFinalizeDisabled: boolean
  newVersionDisabled: boolean
  isQuickGenerating: boolean
}

export const DesktopButtonSection: React.FC<DesktopActionButtonsProps> = ({
  onDelete,
  onFinalize,
  onNewVersion,
  finalized,
  currentSlideId,
  userPlan,
  deleteFinalizeDisabled,
  newVersionDisabled,
  isQuickGenerating,
}) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [isDialogVisibledelete, setIsDialogVisibledelete] = useState(false)
  const [isDialogVisibleNew, setIsDialogVisibleNew] = useState(false)

  if (isQuickGenerating) return null;

  return (
    <div className="flex gap-2">
      {/* Delete Button */}
      <button
        id="delete"
        onClick={onDelete}
        disabled={deleteFinalizeDisabled}
        className="hover:text-red-600 border border-gray-300 p-2 rounded-md flex items-center active:scale-95 transition transform duration-300 disabled:cursor-not-allowed"
        onMouseEnter={() => setIsDialogVisibledelete(true)}
        onMouseLeave={() => setIsDialogVisibledelete(false)}
      >
        <FaTrash className="h-4 w-4 text-[#5D5F61] mr-1" />
        <span className="hidden text-[#5D5F61] lg:block">Delete Version</span>
      </button>

      {/* Finalize Button */}
      <button
        id="finalize"
        onClick={onFinalize}
        disabled={deleteFinalizeDisabled}
        className={`p-2 rounded-md flex items-center border active:scale-95 transition transform duration-300 disabled:cursor-not-allowed ${
          currentSlideId && finalized ? 'border-[#0A8568] bg-[#36fa810a]' : 'border-gray-300'
        }`}
        onMouseEnter={() => setIsDialogVisible(true)}
        onMouseLeave={() => setIsDialogVisible(false)}
      >
        <FaCheck className={`h-4 w-4 mr-1 ${finalized ? 'text-[#0A8568]' : 'text-[#5D5F61]'}`} />
        <span className="hidden text-[#5D5F61] lg:block">Finalize Version</span>
      </button>

      {/* New Version Button */}
      <button
        onClick={onNewVersion}
        id="new-version"
        disabled={newVersionDisabled}
        className="hover:text-blue-600 border border-[#3667B2] p-2 rounded-md flex items-center active:scale-95 transition transform duration-300 disabled:cursor-not-allowed"
        onMouseEnter={() => setIsDialogVisibleNew(true)}
        onMouseLeave={() => setIsDialogVisibleNew(false)}
      >
        <FaPlus className="h-4 w-4 mr-1 text-[#3667B2]" />
        <span className="hidden text-[#3667B2] lg:block">New Version</span>
      </button>
    </div>
  )
}

type MobileActionButtonsProps = {
  onDelete: () => void
  onFinalize: () => void
  onNewVersion: () => void
  finalized: boolean
  currentSlideId?: string
  displayMode: string
  deleteFinalizeDisabled: boolean
  newVersionDisabled: boolean
  isQuickGenerating: boolean
}

export const MobileButtonSection: React.FC<MobileActionButtonsProps> = ({
  onDelete,
  onFinalize,
  onNewVersion,
  finalized,
  currentSlideId,
  displayMode,
  deleteFinalizeDisabled,
  newVersionDisabled,
  isQuickGenerating,
}) => {
  if (isQuickGenerating) return null;

  return (
    <div className="flex gap-4">
      {/* Delete Button */}
      <button
        id="delete-mobile"
        disabled={deleteFinalizeDisabled}
        onClick={onDelete}
        className="hover:text-red-600 border border-gray-300 p-2 rounded-md flex items-center disabled:cursor-not-allowed"
      >
        <FaTrash className="h-4 w-4 text-[#5D5F61]" />
      </button>

      {/* Finalize Button */}
      <button
        id="finalize-mobile"
        onClick={onFinalize}
        disabled={deleteFinalizeDisabled}
        className={`border disabled:cursor-not-allowed ${
          currentSlideId && finalized ? 'border-[#0A8568] bg-[#36fa810a]' : 'border-gray-300'
        } p-2 rounded-md flex items-center`}
      >
        <FaCheck className={`h-4 w-4 ${finalized ? 'text-[#0A8568]' : 'text-[#5D5F61]'}`} />
      </button>

      {/* New Version Button */}
      <button
        id="new-version-mobile"
        onClick={onNewVersion}
        disabled={newVersionDisabled}
        className={`hover:text-blue-600 border disabled:cursor-not-allowed ${
          displayMode === 'newContent' ? 'border-gray-300' : 'border-[#3667B2]'
        } p-2 rounded-md flex items-center`}
      >
        <FaPlus className={`h-4 w-4 ${displayMode === 'newContent' ? 'text-[#5D5F61]' : 'text-[#3667B2]'}`} />
      </button>
      <GuidedTour />
      <GuidedTourMobile />
    </div>
  )
}
