import React from 'react';
import ContactUs from '../components/landing-page/ContactUs';
import LandingPageNavbar from '../components/landing-page/LandingPageNavbar';

const ContactUsPage: React.FC = () => {
  return (
    <div className="no-scrollbar no-scrollbar::-webkit-scrollbar">
             <LandingPageNavbar />
    <div className='lg:py-8 py-12 bg-gray-50'>
        <ContactUs />
        </div>
     
    </div>
  );
};

export default ContactUsPage;