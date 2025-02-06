import React from 'react';
import LandingPageNavbar from '../components/landing-page/LandingPageNavbar';
import ReferralPage from '../components/landing-page/Refer';

const ReferPage: React.FC = () => {
  return (
    <div className=" h-dvh bg-gray-100 no-scrollbar no-scrollbar::-webkit-scrollbar ">
      <LandingPageNavbar />
    <div className='bg-gray-50 pt-20'>
        <ReferralPage />
        </div>
     
    </div>
  );
};

export default ReferPage;