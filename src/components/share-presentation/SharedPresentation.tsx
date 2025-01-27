import React from 'react'
import Googleslides from './GoogleSlides.tsx'

interface SharedPresentationProps {
  formId: string
}

interface GooglePresentationProps {
  formId: string
}

const GooglePresentation: React.FC<GooglePresentationProps> = ({ formId }) => {
  return <Googleslides formId={formId} />
}

const SharedPresentation = ({ formId }: SharedPresentationProps) => {
  return <GooglePresentation formId={formId} />
}

export default SharedPresentation
