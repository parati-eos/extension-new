import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Googleslides from './GoogleSlides'
import ParatiLogo from '../../Asset/parati-logo.png'
import { GooglePresentationProps } from '../../types/types.ts'

const GooglePresentation: React.FC<GooglePresentationProps> = ({ url }) => {
  return (
    <div className="PresentationContainer">
      <div>
        <Googleslides />
      </div>
    </div>
  )
}

const SharedPresentation: React.FC = () => {
  const [currentSlideKey, setCurrentSlideKey] = useState<number>(0)
  const navigate = useNavigate()
  const handleLogoClicked = () => {
    navigate('/')
  }
  return (
    <div className="main-container">
      <div className="presentationshare-viewing-container">
        <div className="presentationshare-viewing-side">
          <div className="logo-icon">
            <img
              src={ParatiLogo}
              alt="Parati Logo"
              width={150}
              className="branding-logo"
              onClick={handleLogoClicked}
            />
          </div>
        </div>
        <div className="presentationshare-viewing-center">
          <div className="presentationshare-view-slides">
            <GooglePresentation key={currentSlideKey} />
          </div>
        </div>
        <div className="presentationshare-viewing-side"></div>
      </div>
    </div>
  )
}

export default SharedPresentation
