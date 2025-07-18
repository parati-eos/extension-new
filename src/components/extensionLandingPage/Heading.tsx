import React, { useEffect, useRef, useState } from 'react';
import rightImage  from '../../assets/tailwind.config.png';
import banner from '../../assets/Banner.png'
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import ZynthWorks, { Slide } from './ZynthWorks';

const Heading: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setVideoSrc('https://d2zu6flr7wd65l.cloudfront.net/uploads/Copy+of+17th+Feb+New+Zynth+Demo+Mobile+Video.mp4');
      } else {
        setVideoSrc('');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isModalOpen && videoRef.current) {
      videoRef.current.play().catch((error) => console.error('Video play failed:', error));
    }
  }, [isModalOpen]);

  const closeModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="w-full bg-gradient-to-r from-green-600 via-teal-500 to-blue-600 py-20 px-6 md:px-16 ">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10 mt-10">
      
        <div className="w-full md:w-[40%] text-left space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Turn Simple Text Into <br />
            <span className="text-white">Stunning Google Slides</span> <br />
            in Seconds
          </h1>
          <p className="text-white font-medium text-base md:text-lg">
            An AI presentation maker built for professionals. From project reports and proposals to pitch decks, create powerpoint presentations instantly with branded design and storytelling.
          </p>

          <ul className="text-white space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-white" />
              No design skills needed
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-white" />
              Save hours every week
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-white" />
              Works directly inside Google Slides™
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => window.open('https://workspace.google.com/marketplace/app/zynthai_%E2%80%93_ai_slide_builder_and_editor/704273243272','_blank')}
              className="px-6 py-3 bg-white text-[#3667B2] font-semibold rounded-md hover:bg-blue-600 hover:text-white transition duration-300 active:scale-95"
            >
              Install Zynth.ai for Google Slides
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 border border-white text-white font-semibold rounded-md hover:bg-white hover:text-[#3667B2] transition duration-300 active:scale-95"
            >
              Watch Demo
            </button>
          </div>
        </div>

        
        <div className="w-full md:w-[55%] h-[60vh]">
          <img
            src={banner}
            alt="Zynth Google Slides"
            className="w-full h-[90%] rounded-lg shadow-xl object-contain"
          />
          {/* <ZynthWorks slides={slides1}  bgColor="bg-[#3667B2]"/> */}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-[90%] md:w-[60%] lg:w-[80%] lg:h-[80%] xl:w-[90%] xl:h-[85%] relative flex items-center justify-center"
            onClick={stopPropagation}
          >
            <button
              onClick={(e) => closeModal(e)}
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
                src={
                  videoSrc ||
                  'https://d2zu6flr7wd65l.cloudfront.net/uploads/13th+Feb+Zynth+Demo+Web+Video.mp4'
                }
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
