import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      <h1 className="text-3xl font-bold mb-6">Welcome to Google Slides Extension</h1>
      
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