import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Googleslides from './GoogleSlides'
import ParatiLogo from '../../assets/zynth-text.png'
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
  const navigate = useNavigate()
  const handleLogoClicked = () => {
    navigate('/')
  }
  return (
    <div className="main-container">
      <div className="flex flex-col items-center justify-center">
        <img
          src={ParatiLogo}
          alt="Parati Logo"
          width={150}
          className="text-center"
          onClick={handleLogoClicked}
        />
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
