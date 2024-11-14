import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar.tsx'
import CompanyNameForm from './onboarding-sections/CompanyNameForm.tsx'
import ContactDetailsForm from './onboarding-sections/ContactDetailsForm.tsx'
import IndustryForm from './onboarding-sections/IndustryForm.tsx'
import LogoForm from './onboarding-sections/LogoForm.tsx'
import WebsiteLinkForm from './onboarding-sections/WebsiteLinkForm.tsx'
import axios from 'axios'

interface FormData {
  companyName: string
  contactEmail: string
  phone: string
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
    phone: '',
    linkedin: '',
    sector: '',
    industry: '',
    websiteLink: '',
    logo: null,
  })

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
  const orgId = generateOrgId()

  // State to store the document ID returned by the API
  const [documentId, setDocumentId] = useState<string | null>('')

  // Function to handle API calls (POST for first section, PATCH for others)
  const submitFormData = async (data: Partial<typeof formData>) => {
    console.log('Submitting form data:', data)

    try {
      if (currentSection === 1) {
        const response = await axios.post(
          `${process.env.REACT_APP_ORG_URL}/organizationcreate-patch`,
          {
            ...data,
            orgId,
            userId: 'TEst123213',
          }
        )
        setDocumentId(response.data.orgId)
      } else {
        await axios.patch(
          `${process.env.REACT_APP_ORG_URL}/organizationedit/${documentId}`,
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
              phone: formData.phone,
              linkedin: formData.linkedin,
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      {isMediumOrLargerScreen && (
        <Sidebar
          lastVisitedSection={currentSection}
          visitedSections={visitedSections}
        />
      )}

      {/* Onboarding Content */}
      <div className="flex-1 flex items-center justify-center min-h-screen bg-white">
        {renderSectionContent()}
      </div>
    </div>
  )
}

export default OnboardingContainer
