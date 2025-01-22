import React from 'react'
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
  return <GooglePresentation formId={formId} />
}

export default SharedPresentation
