import React from 'react'
import Navbar from '../components/shared/Navbar'
import SelectPresentationType from '../components/presentation-type/SelectPresentationType'

const PresentationTypePage: React.FC = () => {
  return (
    <>
      <Navbar />
      <SelectPresentationType />
    </>
  )
}

export default PresentationTypePage
