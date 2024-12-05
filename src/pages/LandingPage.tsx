import React from 'react';
import Navbar from '../components/landing-page/LandingPageNavbar';
import Heading from '../components/landing-page/Heading';
import SecondPage from '../components/landing-page/SecondPage';
import Footer from '../components/landing-page/FirstFooter';
import { HeroParallax } from '../components/landing-page/FramerMotion';
import FirstFooter from '../components/landing-page/FirstFooter';
import SecondFooter from '../components/landing-page/SecondFooter';
import FinalPage from '../components/landing-page/FinalPage';

const LandingPage: React.FC = () => {
 

  return (
    <>
      <Navbar />
      <Heading />
      <SecondPage />
      <FirstFooter />
      <HeroParallax/>
      <SecondFooter/>
      <FinalPage/>
    </>
  );
};

export default LandingPage;
