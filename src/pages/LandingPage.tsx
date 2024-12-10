import React from 'react'
import LandingPageNavbar from '../components/landing-page/LandingPageNavbar'
import Heading from '../components/landing-page/Heading'
import HowWorks from '../components/landing-page/HowWorks'
import { Hero } from '../components/landing-page/Hero'
import AboutSection from '../components/landing-page/AboutSection'
import PartnersTestimonials from '../components/landing-page/PartnersTestimonials'
import Footer from '../components/landing-page/Footer'
import Pricing from '../components/landing-page/Pricing'

const LandingPage: React.FC = () => {
  return (
    <>
      <LandingPageNavbar />
      <Heading />
      <AboutSection />
      <HowWorks />
      <Hero />
      <PartnersTestimonials />
     
      <Pricing/>
      <Footer />
    </>
  )
}

export default LandingPage
