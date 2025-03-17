import React from 'react'
import NewNavbar from '../components/landing-page-1/NewNavbar'
import NewBanner from '../components/landing-page-1/NewBanner'
import PresentationBuilder from '../components/landing-page-1/PresentationBuilder'
import HowItWorks from '../components/landing-page-1/HowitWorks'
import WhoCanBenefit from '../components/landing-page-1/WhoCanBenefit'
import WhyZynthStandsOut from '../components/landing-page-1/WhyZynthStandsOut'
import HeroBanner from '../components/landing-page-1/HeroBanner'


const NewLandingPage: React.FC = () => {
  return (
    <div className="no-scrollbar no-scrollbar::-webkit-scrollbar">

      <NewNavbar/>

      <NewBanner/>
      <PresentationBuilder/>
      <HowItWorks/>
      <WhoCanBenefit/>
      <WhyZynthStandsOut/>
      <HeroBanner/>
 
    
    </div>
  )
}

export default NewLandingPage
