import React, { useEffect, useRef, useState } from 'react';
import LandingpageImage from '../../assets/tailwind.config.png';
import { useNavigate } from 'react-router-dom';

const Heading: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Detect screen size and set the appropriate video source
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setVideoSrc('https://d2zu6flr7wd65l.cloudfront.net/uploads/Copy+of+17th+Feb+New+Zynth+Demo+Mobile+Video.mp4');
      } else {
        setVideoSrc('');
      }
    };

    handleResize(); // Run on mount
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isModalOpen && videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error('Video play failed:', error);
      });
    }
  }, [isModalOpen]);

  const closeModal = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event bubbling
    setIsModalOpen(false);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click events on the modal from closing it
  };

  return (
    <div className="w-full h-full text-center bg-gradient-to-br from-[#f1f1f3] via-[#aec2e6] to-[#fafafa] relative">
      {/* Header Section */}
      <div className="relative flex flex-col items-center justify-start pt-32 mb-14 md:mb-20">
        <h1 className="hidden md:block text-4xl font-bold text-gray-900 z-10">
          Effortlessly <span className="text-[#3667B2]">Turn Ideas</span> into
          Slides with Your
        </h1>
        <h1 className="hidden md:block mt-2 text-4xl font-bold text-[#3667B2] z-10">
          AI Presentation Generator
        </h1>
        <h1 className="md:hidden text-3xl font-bold text-gray-900 z-10">
          Effortlessly <span className="text-[#3667B2]">Turn Ideas</span> into
        </h1>
        <h1 className="md:hidden text-3xl font-bold text-gray-900 z-10">
          Slides with Your
        </h1>
        <h1 className="md:hidden text-3xl font-bold text-[#3667B2] z-10">
          AI Presentation Generator
        </h1>
        <p className="mt-4 font-medium text-black w-[90%] md:max-w-lg z-10">
          From startup pitch decks to corporate proposals, Zynth’s AI
          presentation maker helps you craft visually compelling,
          professional-grade slides in minutes—no design skills required.
        </p>
        <div className="mt-6 flex flex-col md:justify-center w-[90%] md:flex-row gap-4 z-10">
          <button
            onClick={() => navigate('/auth')}
            className="px-11 py-3 font-semibold text-white bg-[#3667B2] rounded-md hover:bg-white hover:text-[#3667B2] hover:border hover:border-[#3667B2] active:scale-95 transition transform duration-300"
          >
            Get Started for Free
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-11 py-3 font-semibold text-[#091220] border border-[#5D5F61] rounded-md hover:bg-blue-50 active:scale-95 active:bg-blue-100 transition transform duration-300"
          >
            Watch Demo
          </button>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative z-20">
        {/* Gradient Overlay */}
        <div
          className="absolute top-0 left-0 w-full"
          style={{
            height: 'calc(100% + 20%)',
            background:
              'linear-gradient(to bottom, #EAF2FF00 0%, #99C1FF1F 12%, rgba(0,0,0,0))',
            zIndex: -1,
          }}
        />
        <div className="relative max-w-6xl mx-auto">
          <img
            src={LandingpageImage}
            alt="Zynth Slide Example"
            className="w-full object-cover"
            style={{
              backgroundColor: '#EAF2FF00', // Transparent background
            }}
          />
        </div>
      </div>
{/* Modal */}
{isModalOpen && (
  <div
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    onClick={() => setIsModalOpen(false)} // Close modal on outside click
  >
    <div
      className="bg-white rounded-lg shadow-lg w-[90%] md:w-[60%] lg:w-[80%] lg:h-[80%] xl:w-[90%] xl:h-[85%] relative flex items-center justify-center"
      onClick={stopPropagation} // Prevent event bubbling to the backdrop
    >
      <button
        onClick={(e) => closeModal(e)} // Ensure the event is passed properly
        className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-2xl font-bold z-50"
      >
        &times;
      </button>
      <video
        ref={videoRef}
        controls
        className="w-full h-full rounded-md object-contain z-10"
      >
        <source
          src={videoSrc || 'https://d2zu6flr7wd65l.cloudfront.net/uploads/13th+Feb+Zynth+Demo+Web+Video.mp4'}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
)}

    </div>
  );
};

export default Heading;
