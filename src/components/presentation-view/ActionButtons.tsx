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
}) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [isDialogVisibledelete, setIsDialogVisibledelete] = useState(false)
  const [isDialogVisibleNew, setIsDialogVisibleNew] = useState(false)

  return (
    <div className="flex gap-2">
      {/* Delete Button */}
      <button
        id="delete"
        onClick={onDelete}
        disabled={deleteFinalizeDisabled}
        className="hover:text-red-600 border border-gray-300 p-2 rounded-md flex items-center active:scale-95 transition transform duration-300"
        onMouseEnter={() => {
          if (userPlan === 'free' || userPlan !== 'free')
            setIsDialogVisibledelete(true)
        }}
        onMouseLeave={() => {
          if (userPlan === 'free' || userPlan !== 'free')
            setIsDialogVisibledelete(false)
        }}
      >
        <FaTrash className="h-4 w-4 text-[#5D5F61] mr-1" />
        <span className="hidden text-[#5D5F61] lg:block">Delete Version</span>
      </button>
      {isDialogVisibledelete && (
        <div className="absolute  transform -translate-x-[20%] -translate-y-full w-[15rem] bg-gray-200 text-black p-3 rounded-lg shadow-lg flex items-center justify-center">
          <p className="text-sm text-center text-gray-800">
            Delete the selected slide version from the presentation.
          </p>
        </div>
      )}

      {/* Finalize Button */}
      <button
        id="finalize"
        onClick={onFinalize}
        disabled={deleteFinalizeDisabled}
        className={`p-2 rounded-md flex items-center border active:scale-95 transition transform duration-300 ${
          currentSlideId && finalized
            ? 'border-[#0A8568] bg-[#36fa810a]'
            : 'border-gray-300'
        }`}
        onMouseEnter={() => {
          if (userPlan === 'free' || userPlan !== 'free')
            setIsDialogVisible(true)
        }}
        onMouseLeave={() => {
          if (userPlan === 'free' || userPlan !== 'free')
            setIsDialogVisible(false)
        }}
      >
        <FaCheck
          className={`h-4 w-4 mr-1 ${
            finalized ? 'text-[#0A8568]' : 'text-[#5D5F61]'
          }`}
        />
        <span className="hidden text-[#5D5F61] lg:block">Finalize Version</span>
      </button>
      {isDialogVisible && (
        <div className="absolute transform translate-x-1/2 -translate-y-full w-[15rem] bg-gray-200 text-black p-3 rounded-lg shadow-lg flex items-center justify-center">
          <p className="text-sm text-center text-gray-800">
            Finalize the selected slide version to add it to the final
            presentation.
          </p>
        </div>
      )}

      {/* New Version Button */}
      <button
        onClick={onNewVersion}
        id="new-version"
        disabled={newVersionDisabled}
        className="hover:text-blue-600 border border-[#3667B2] p-2 rounded-md flex items-center active:scale-95 transition transform duration-300"
        onMouseEnter={() => {
          if (userPlan === 'free' || userPlan !== 'free')
            setIsDialogVisibleNew(true)
        }}
        onMouseLeave={() => {
          if (userPlan === 'free' || userPlan !== 'free')
            setIsDialogVisibleNew(false)
        }}
      >
        <FaPlus className="h-4 w-4 mr-1 text-[#3667B2]" />
        <span className="hidden text-[#3667B2] lg:block">New Version</span>
      </button>
      {isDialogVisibleNew && (
        <div className="absolute  left-1/2 -translate-x-[40%] -translate-y-full w-[15rem] bg-gray-200 text-black p-3 rounded-lg shadow-lg flex items-center justify-center">
          <p className="text-sm text-center text-gray-800">
            Generate a new slide version for the selected section in the
            outline.
          </p>
        </div>
      )}
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
}) => {
  return (
    <div className="flex gap-4">
      {/* Delete Button */}
      <button
        id="delete-mobile"
        disabled={deleteFinalizeDisabled}
        onClick={onDelete}
        className="hover:text-red-600 border border-gray-300 p-2 rounded-md flex items-center"
      >
        <FaTrash className="h-4 w-4 text-[#5D5F61]" />
      </button>

      {/* Finalize Button */}
      <button
        id="finalize-mobile"
        onClick={onFinalize}
        disabled={deleteFinalizeDisabled}
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
        id="new-version-mobile"
        onClick={onNewVersion}
        disabled={newVersionDisabled}
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
      <GuidedTour />
      <GuidedTourMobile />
    </div>
  )
}
