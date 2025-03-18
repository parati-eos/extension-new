import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome to Google Slides Extension</h1>
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={() => navigate("/login")}
      >
        Create Presentation
      </button>
    </div>
  );
};

export default Home;
