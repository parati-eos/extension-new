import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar.tsx'
import CompanyNameForm from './onboarding-sections/CompanyNameForm.tsx'
import ContactDetailsForm from './onboarding-sections/ContactDetailsForm.tsx'
import IndustryForm from './onboarding-sections/IndustryForm.tsx'
import LogoForm from './onboarding-sections/LogoForm.tsx'
import WebsiteLinkForm from './onboarding-sections/WebsiteLinkForm.tsx'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

interface FormData {
  companyName: string
  contactEmail: string
  contactPhone: string
  linkedin: string
  sector: string
  industry: string
  websiteLink: string
  logo: string | null
}

const OnboardingContainer: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(1)
  const [visitedSections, setVisitedSections] = useState<number[]>([1]) // Start with the first section visited
  const [isMediumOrLargerScreen, setIsMediumOrLargerScreen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    linkedin: '',
    sector: '',
    industry: '',
    websiteLink: '',
    logo: null,
  })
  const [orgId, setOrgId] = useState('')
  const navigate = useNavigate()
  const userId = localStorage.getItem('userEmail')

  // Check if screen size is medium or larger to show sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsMediumOrLargerScreen(window.innerWidth >= 768)
    }

    handleResize() // Set initial value
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Function to generate a unique organization ID
  const generateOrgId = () => {
    return 'Parati-' + Date.now()
  }
  const generatedOrgId = generateOrgId()

  // Function to handle API calls (POST for first section, PATCH for others)
  const submitFormData = async (data: Partial<typeof formData>) => {
    try {
      if (currentSection === 1) {
        const response = await axios.post(
          `${process.env.REACT_APP_ORG_URL}/organizationcreate-patch`,
          {
            ...data,
            orgId: generatedOrgId,
            userId: userId,
          }
        )
        setOrgId(response.data.orgId)
        localStorage.setItem('orgId', response.data.orgId)
      } else {
        await axios.patch(
          `${process.env.REACT_APP_ORG_URL}/organizationedit/${orgId}`,
          data
        )
      }
    } catch (error) {
      console.error('Error submitting form data:', error)
    }
  }

  // Function to handle "Continue" button
  const handleContinue = async (data: Partial<typeof formData>) => {
    setFormData((prevData) => ({ ...prevData, ...data }))

    //ADD API CALL
    await submitFormData(data)

    const nextSection = currentSection + 1
    if (nextSection <= 5) {
      setCurrentSection(nextSection)
      if (!visitedSections.includes(nextSection)) {
        setVisitedSections([...visitedSections, nextSection])
      }
    } else {
      navigate('/organization-profile')
    }
  }

  // Function to handle "Back" button
  const handleBack = () => {
    const prevSection = currentSection - 1
    if (prevSection >= 1) {
      setCurrentSection(prevSection)
      setVisitedSections(
        visitedSections.filter((section) => section <= prevSection)
      )
    }
  }

  // Function to render the appropriate form component
  const renderSectionContent = () => {
    switch (currentSection) {
      case 1:
        return (
          <CompanyNameForm
            onContinue={handleContinue}
            initialData={formData.companyName}
          />
        )
      case 2:
        return (
          <LogoForm
            onContinue={handleContinue}
            onBack={handleBack}
            initialData={formData.logo}
          />
        )
      case 3:
        return (
          <WebsiteLinkForm
            onContinue={handleContinue}
            onBack={handleBack}
            initialData={formData.websiteLink}
          />
        )
      case 4:
        return (
          <IndustryForm
            onContinue={handleContinue}
            onBack={handleBack}
            initialData={{
              sector: formData.sector,
              industry: formData.industry,
            }}
          />
        )
      case 5:
        return (
          <ContactDetailsForm
            onContinue={handleContinue}
            onBack={handleBack}
            initialData={{
              contactEmail: formData.contactEmail,
              contactPhone: formData.contactPhone,
              linkedinLink: formData.linkedin,
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      {/* Progress Bar for Small and Medium Screens */}
      {!isMediumOrLargerScreen && (
        <div className="flex mt-[3rem] lg:mt-0 justify-between p-4">
          {[1, 2, 3, 4, 5].map((section) => (
            <div
              key={section}
              className={`h-1 flex-1 mx-1 ${
                currentSection >= section ? 'bg-[#3667B2]' : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar for Medium and Larger Screens */}
        {isMediumOrLargerScreen && (
          <Sidebar
            lastVisitedSection={currentSection}
            visitedSections={visitedSections}
          />
        )}

        {/* Onboarding Content */}
        <div className="flex-1 flex items-start justify-center w-full bg-white">
          {renderSectionContent()}
        </div>
      </div>
    </>
  )
}

export default OnboardingContainer
