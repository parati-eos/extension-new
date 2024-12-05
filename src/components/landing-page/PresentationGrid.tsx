import React from 'react'
import productIcon from '../../assets/product.png'
import pitchIcon from '../../assets/pitch.png'
import salesIcon from '../../assets/sales.png'
import marketingIcon from '../../assets/marketing.png'
import boardIcon from '../../assets/board.png'
import proposalIcon from '../../assets/proposal.png'
import docIcon from '../../assets/doc.png'
import engageIcon from '../../assets/engage.png'

const presentationTypes = [
  { id: 1, label: 'Product', iconUrl: productIcon },
  { id: 2, label: 'Pitch Deck', iconUrl: pitchIcon },
  { id: 3, label: 'Sales Deck', iconUrl: salesIcon },
  { id: 4, label: 'Marketing', iconUrl: marketingIcon },
  { id: 5, label: 'Board Presentation', iconUrl: boardIcon },
  { id: 6, label: 'Project Proposal', iconUrl: proposalIcon },
  { id: 7, label: 'Project Documentation', iconUrl: docIcon },
  { id: 8, label: 'Employee Engagement', iconUrl: engageIcon },
]

const PresentationGrid: React.FC = () => {
  return (
    <div className="relative z-20 bg-gray-100 bg-opacity-50  p-8 w-full">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Presentation Builder for Every Team
      </h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-10">
        {presentationTypes.map((type) => (
          <div
            key={type.id}
            className="relative flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg cursor-default lg:h-40 lg:w-52"
          >
            <img
              src={type.iconUrl}
              alt={`${type.label} icon`}
              className="w-12 h-12 mb-4"
            />
            <p className="mt-4 text-sm font-semibold text-gray-700">
              {type.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PresentationGrid
