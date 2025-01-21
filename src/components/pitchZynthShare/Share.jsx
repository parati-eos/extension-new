import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './presentationshare.css'
import GoogleslidesShare from './googlepresentationShare-helper.jsx'
import ParatiLogo from '../../assets/zynth-text.png'

const GooglePresentation = ({ url }) => {
  return (
    <div className="pitch-PresentationContainer">
      <div>
        <GoogleslidesShare />
      </div>
    </div>
  )
}

const PitchDeckShare = () => {
  const [currentSlideKey, setCurrentSlideKey] = useState(0)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const formId = searchParams.get('submissionId')

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = `https://zynth.ai/api/slides/url?formId=${formId}`
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  }, [formId])

  const handleLogoClicked = () => {
    window.open('https://zynth.ai', '_blank')
  }

  return (
    <div className="pitch-main-container">
      <div className="pitch-presentationshare-viewing-container">
        <div className="pitch-presentationshare-viewing-side">
          <div
            onClick={handleLogoClicked}
            className="pitch-logo-icon hover:scale-105 hover:cursor-pointer transition transform"
          >
            <img
              src={ParatiLogo}
              alt="Parati Logo"
              width={150}
              className="pitch-branding-logo"
            ></img>
          </div>
        </div>
        <div className="pitch-presentationshare-viewing-center">
          <div className="pitch-presentationshare-view-slides">
            <GooglePresentation key={currentSlideKey} />
          </div>
        </div>
        <div className="pitch-presentationshare-viewing-side"></div>
      </div>
    </div>
  )
}

export default PitchDeckShare
