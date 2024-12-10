import React from 'react'
import SharedPresentation from '../components/share-presentation/SharedPresentation'
import { useLocation } from 'react-router-dom'

const PresentationShare: React.FC = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const documentId = searchParams.get('formId')!.split('/')[0]

  return (
    <>
      <SharedPresentation formId={documentId} />
    </>
  )
}

export default PresentationShare
