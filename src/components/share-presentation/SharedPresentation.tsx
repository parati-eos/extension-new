import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import '../css/presentationshare.css'
import '../css/HistoryOverlay.css'
import Googleslides from './GoogleSlides'

import ParatiLogo from '../../Asset/parati-logo.png'

interface GooglePresentationProps {
  url?: string
}

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
  const historyTimeout = useRef<NodeJS.Timeout | null>(null)
  const [currentSlideKey, setCurrentSlideKey] = useState<number>(0)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const formId = searchParams.get('submissionId')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      if (!formId) return

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
        // Use the fetched data as needed
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [formId])

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
