import React from 'react'
import Landingpageimage from '../../assets/tailwind.config.png'

const Heading: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-[#EAF2FF00] to-[#99C1FF1F] min-h-screen text-center">
      {/* Header Section */}
      <div className="relative flex flex-col items-center justify-start pt-32 mb-20">
        <h1 className="text-4xl font-bold text-gray-900 z-10">
          Effortlessly <span className="text-[#3667B2]">Turn Ideas</span> into
          Slides with Your
        </h1>
        <h1 className="mt-2 text-4xl font-bold text-[#3667B2] z-10">
          AI Presentation Generator
        </h1>
        <p className="mt-4 text-gray-700 max-w-lg z-10">
          From startup pitch decks to corporate proposals, Zynth’s AI
          presentation maker helps you craft visually compelling,
          professional-grade slides in minutes—no design skills required.
        </p>
        <div className="mt-6 flex gap-4 z-10">
          <button className="px-11 py-3 text-white bg-[#3667B2] rounded-md hover:bg-blue-700 transition">
            Get Started for Free
          </button>
          <button className="px-11 py-3 text-[#091220] border border-[#5D5F61] rounded-md hover:bg-blue-50 transition">
            Watch Demo
          </button>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative  z-20  ">
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
            src={Landingpageimage}
            alt="Zynth Slide Example"
            className="w-full object-cover"
            style={{
              backgroundColor: '#EAF2FF00', // Transparent background
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Heading
