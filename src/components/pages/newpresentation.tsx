import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RefinePresentation() {
  const navigate = useNavigate();

  const handleCreatePresentation = () => {
    navigate('/refine-ppt'); // navigates to RefinePPT page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">New Presentation</h1>
      <button
        onClick={handleCreatePresentation}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Create Presentation
      </button>
    </div>
  );
}
