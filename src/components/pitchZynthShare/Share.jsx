import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './presentationshare.css'
import './HistoryOverlay.css'
import GoogleslidesShare from './googlepresentationShare-helper.jsx'
import ZynthLogo from '../../assets/zynth-text.png'

const GooglePresentation = ({ url }) => {
  return (
    <div className="PresentationContainer">
      <div>
        <GoogleslidesShare />
      </div>
    </div>
  )
}

const PitchZynthShare = () => {
  const historyTimeout = useRef(null)
  const [currentSlideKey, setCurrentSlideKey] = useState(0)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const formId = searchParams.get('submissionId')
  const navigate = useNavigate()
  // Company Name--------------->>

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
    navigate('/')
  }

  return (
    <div className="pitch-main-container">
      <div className="pitch-presentationshare-viewing-container">
        <div className="lpitch-ogo-icon">
          <img
            src={ZynthLogo}
            alt="Parati Logo"
            width={150}
            className="pitch-branding-logo"
            onClick={handleLogoClicked}
          ></img>
        </div>
        <div className="pitch-presentationshare-viewing-center">
          <div className="pitch-presentationshare-view-slides">
            <GooglePresentation key={currentSlideKey} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PitchZynthShare
