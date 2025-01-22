import React, { useEffect, useState } from 'react'
import Googleslides from './GoogleSlides.tsx'
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
  const authToken = sessionStorage.getItem('authToken')
  const [companyLogo, setCompanyLogo] = useState('')
  const [companyLink, setCompanyLink] = useState('')

  useEffect(() => {
    const fetchSlidesData = async () => {
      try {
        const serverurl = process.env.REACT_APP_BACKEND_URL
        const url = `${serverurl}/api/v1/data/appscripts/genSlideIDs/${formId}`
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch slides data')
        }
        const data = await response.json()
        setCompanyLink(data.websiteLink)
        setCompanyLogo(data.companyLogo)
      } catch (error: any) {
        console.error('Error fetching slides data:', error.message)
      }
    }
    fetchSlidesData()
  }, [formId, authToken])

  return (
    <div className="w-full h-screen no-scrollbar no-scrollbar::-webkit-scrollbar">
      <div className="flex flex-col items-center justify-center py-2 bg-gray-50">
        <a
          href={companyLink}
          target="_blank"
          className="transition-all duration-300 transform hover:scale-110 active:scale-95 active:opacity-80"
        >
          <img
            src={companyLogo}
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
