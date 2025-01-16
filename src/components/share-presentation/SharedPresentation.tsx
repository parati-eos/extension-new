import React from 'react'
import Googleslides from './GoogleSlides'
import ZynthLogo from '../../assets/zynth-text.png'
import { GooglePresentationProps } from '../../types/types.ts'
import '../presentation-view/viewpresentation.css'

interface SharedPresentationProps {
  formId: string
}

const GooglePresentation: React.FC<GooglePresentationProps> = ({ formId }) => {
  return <Googleslides formId={formId} />
}

const SharedPresentation = ({ formId }: SharedPresentationProps) => {
  return (
    <div className="w-full h-screen no-scrollbar no-scrollbar::-webkit-scrollbar">
      <div className="flex flex-col items-center justify-center py-2 bg-gray-50">
        <a
          href="/"
          target="_blank"
          className="transition-all duration-300 transform hover:scale-110 active:scale-95 active:opacity-80"
        >
          <img
            src={ZynthLogo}
            alt="Parati Logo"
            width={150}
            className="text-center"
          />
        </a>
      </div>
      <GooglePresentation formId={formId} />
    </div>
  )
}

export default SharedPresentation
