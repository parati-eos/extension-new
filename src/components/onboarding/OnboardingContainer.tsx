import React, { useState } from 'react'
import Sidebar from './Sidebar.tsx'
import CompanyNameForm from './onboarding-sections/CompanyNameForm.tsx'
import ContactDetailsForm from './onboarding-sections/ContactDetailsForm.tsx'
import IndustryForm from './onboarding-sections/IndustryForm.tsx'
import LogoForm from './onboarding-sections/LogoForm.tsx'
import WebsiteLinkForm from './onboarding-sections/WebsiteLinkForm.tsx'

const OnboardingContainer: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(1)
  const [visitedSections, setVisitedSections] = useState<number[]>([1]) // Start with the first section visited

  // Function to handle "Continue" button
  const handleContinue = () => {
    const nextSection = currentSection + 1
    if (nextSection <= 5) {
      // Assuming there are 5 sections
      setCurrentSection(nextSection)
      if (!visitedSections.includes(nextSection)) {
        setVisitedSections([...visitedSections, nextSection])
      }
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
        return <CompanyNameForm onContinue={handleContinue} />
      case 2:
        return <LogoForm onContinue={handleContinue} />
      case 3:
        return <WebsiteLinkForm onContinue={handleContinue} />
      case 4:
        return <IndustryForm onContinue={handleContinue} />
      case 5:
        return <ContactDetailsForm onContinue={handleContinue} />
      default:
        return null
    }
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar
        lastVisitedSection={currentSection}
        visitedSections={visitedSections}
        onSectionClick={handleSectionClick}
      />

      {/* Onboarding Content */}
      <div className="flex-1 flex items-center justify-center h-screen bg-white">
        {renderSectionContent()}
      </div>
    </div>
  )
}

export default OnboardingContainer
