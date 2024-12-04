import React from 'react'
import Navbar from '../components/landing-page/Navbar'
import Heading from '../components/landing-page/Heading'
import SecondPage from '../components/landing-page/SecondPage'
import Footer from '../components/landing-page/Footer'




const LandingPage: React.FC = () => {
  return (
    <>
      <Navbar/>
      <Heading/>
      <Footer/>
      <SecondPage/>
     
    </>
  )
}

export default LandingPage
