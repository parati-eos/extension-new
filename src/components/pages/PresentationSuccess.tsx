// src/components/PresentationSuccess.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PresentationSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        🎉 Presentation Generated!
      </h1>
      <p className="text-gray-700 mb-6 text-center">
        Slides are on the way! It will take a few seconds to generate your slides.
      </p>
      <p className="text-gray-700 mb-6 text-center">
        Please close the modal to start viewing your slides.
      </p>
      {/* <button
        className="px-6 py-2 bg-[#3667B2] text-white rounded-lg hover:bg-[#274b8a] transition-all"
        onClick={() => navigate('/presentation-view')}
      >
        Go to Slides
      </button> */}
    </div>
  );
};

export default PresentationSuccess;
