import React, { useState } from 'react'
import Googleslides from './GoogleSlides'
import ZynthLogo from '../../assets/zynth-text.png'
import { GooglePresentationProps } from '../../types/types.ts'
import './presentationshare.css'

interface SharedPresentationProps {
  formId: string
}

const GooglePresentation: React.FC<GooglePresentationProps> = ({ formId }) => {
  return (
    <div className="PresentationContainer">
      <div>
        <Googleslides formId={formId} />
      </div>
    </div>
  )
}

const SharedPresentation = ({ formId }: SharedPresentationProps) => {
  const [currentSlideKey, setCurrentSlideKey] = useState<number>(0)
  return (
    <div className="main-container h-screen overflow-hidden ">
      <div className="flex flex-col items-center justify-center">
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
      <div className="presentationshare-viewing-container">
        <div className="presentationshare-viewing-center">
          <div className="presentationshare-view-slides">
            <GooglePresentation key={currentSlideKey} formId={formId} />
          </div>
        </div>
        <div className="presentationshare-viewing-side"></div>
      </div>
    </div>
  )
}

export default SharedPresentation
