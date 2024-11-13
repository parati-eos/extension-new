import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar.tsx'
import CompanyNameForm from './onboarding-sections/CompanyNameForm.tsx'
import ContactDetailsForm from './onboarding-sections/ContactDetailsForm.tsx'
import IndustryForm from './onboarding-sections/IndustryForm.tsx'
import LogoForm from './onboarding-sections/LogoForm.tsx'
import WebsiteLinkForm from './onboarding-sections/WebsiteLinkForm.tsx'

const OnboardingContainer: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(1)
  const [visitedSections, setVisitedSections] = useState<number[]>([1]) // Start with the first section visited
  const [isMediumOrLargerScreen, setIsMediumOrLargerScreen] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    linkedin: '',
    sector: '',
    industry: '',
    websiteLink: '',
    logo: null as File | null,
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

  // Function to handle "Continue" button
  const handleContinue = (data: Partial<typeof formData>) => {
    // TODO: TODO: ADD API CALL

    setFormData((prevData) => ({ ...prevData, ...data }))
    const nextSection = currentSection + 1
    if (nextSection <= 5) {
      setCurrentSection(nextSection)
      if (!visitedSections.includes(nextSection)) {
        setVisitedSections([...visitedSections, nextSection])
      }
    }
  }

  const handleBack = () => {
    const prevSection = currentSection - 1
    if (prevSection >= 1) {
      setCurrentSection(prevSection)
      setVisitedSections(
        visitedSections.filter((section) => section <= prevSection)
      )
    }
  }

  // Function to handle sidebar section clicks
  const handleSectionClick = (sectionId: number) => {
    setCurrentSection(sectionId)
    if (!visitedSections.includes(sectionId)) {
      setVisitedSections([...visitedSections, sectionId])
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
              email: formData.email,
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
          onSectionClick={handleSectionClick}
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
