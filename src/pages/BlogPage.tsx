import React from 'react';
import LandingPageNavbar from '../components/landing-page/LandingPageNavbar';
import Footer from '../components/landing-page/Footer';
import BlogList from '../components/landing-page/Blogs';

const BlogPage: React.FC = () => {
  return (
    <div className="no-scrollbar no-scrollbar::-webkit-scrollbar">
      <LandingPageNavbar />
    <div className='bg-gray-50'>
        <BlogList />
        </div>
     
    </div>
  );
};

export default BlogPage;
