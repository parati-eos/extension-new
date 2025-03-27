import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/zynth-icon.png'; // Import your logo
const Home = () => {
  const navigate = useNavigate();
  const [presentationId, setPresentationId] = useState<string | null>(null);

  useEffect(() => {
    // Extract presentationId from the URL if running inside Google Slides
    const queryParams = new URLSearchParams(window.location.search);
    const presId = queryParams.get("presentationId");

    if (presId) {
      setPresentationId(presId);
      sessionStorage.setItem("presentationId", presId); // Store in localStorage
    } else {
      const storedId = sessionStorage.getItem("presentationId");
      if (storedId) {
        setPresentationId(storedId); // Retrieve stored ID if available
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1
        className="text-3xl font-bold mb-6 cursor-pointer transition-transform duration-300 hover:scale-105"
        onClick={() => alert("Welcome to Google Slides Extension!")}
      >
        Welcome to Google Slides Extension
      </h1>
      <p className="text-lg mb-4 text-gray-700">
        Create your presentations within 2 mins
      </p>
            {/* Logo */}
            <img
        src={logo} // Replace with the actual path to your logo
        alt="Logo"
        className="mb-4 w-24 h-24" // Adjust size and spacing as needed
      />
      {presentationId ? (
        <p className="text-lg mb-4 font-semibold text-green-700">
          ✅ Presentation ID: {presentationId}
        </p>
      ) : (
        <p className="text-lg mb-4 text-red-500 font-medium">
          ❌ No Presentation ID Found
        </p>
      )}

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