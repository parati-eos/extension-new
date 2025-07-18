import React from 'react';
import brandingImg from '../../assets/extension.png';

const ZynthUsersSection = () => {
  return (
    <div className="w-full bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-start justify-between w-full">
          <div className="md:w-1/2 flex items-center justify-start mb-4 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Join 15,000+ Users <br /> Building Faster with Zynth
            </h2>
          </div>
          <div className="md:w-1/2 flex flex-col items-center justify-center text-sm md:text-base text-gray-700">
            <p className="mb-2">
              Over 25,000 presentations generated and counting.
            </p>
            <p className="font-semibold text-gray-800">
              The smarter, faster way to create decks that impress.
            </p>
            <p>Create slides in minutes. Focus on ideas, not formatting.</p>
          </div>
        </div>

        <div className="w-full mt-10">
          <img
            src={brandingImg}
            alt="Zynth Branding Step"
            className="w-full max-w-6xl mx-auto rounded-lg shadow-xl"
          />
        </div>

        <div className="w-full flex justify-center mt-6">
          <button 
          onClick={()=>window.open('https://workspace.google.com/marketplace/app/zynthai_%E2%80%93_ai_slide_builder_and_editor/704273243272','_blank')}
          className="bg-white border border-[#3B82F6] text-[#3B82F6] px-6 py-3 rounded-md font-semibold hover:bg-[#3B82F6] hover:text-white transition duration-300">
            Add Zynth.ai to Google Slides
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZynthUsersSection;
