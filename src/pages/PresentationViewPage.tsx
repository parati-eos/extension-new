import React from 'react'
import ViewPresentation from '../components/presentation-view/ViewPresentation'
import Navbar from '../components/shared/Navbar'

const PresentationViewPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <ViewPresentation />
    </>
  )
}

export default PresentationViewPage
