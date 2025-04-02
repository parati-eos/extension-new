import React, { useEffect, useState } from 'react';
import zynthtext from '../../assets/zynth-text.png';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function RefinePresentation() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [position, setPosition] = useState<number>(1);
  const authToken = sessionStorage.getItem('authToken') || '';
 const [outlineId, setOutlineId] = useState<string>('');
  const [slideDataId, setSlideDataId] = useState<string>('');
  const [sectionName, setSectionName] = useState<string>('');
  const [formID, setFormID] = useState<string | null>(null);
  const [slideId, setSlideId] = useState<string | null>(null);
  const generateOutlineID = () => {
    return `outlineID-${window.crypto.randomUUID()}`;
  };

  const handleCreatePresentation = () => {
    console.log("📤 Sending message to parent to openPptModal");
    window.parent.postMessage({ type: 'openPptModal' }, '*');
  };

  const handleAddNewSlide = () => {
    setShowModal(true);
  };


  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "slideId") {
        const receivedSlideId = event.data.slideId;
        console.log("Received Slide ID:", receivedSlideId);
        setSlideId(receivedSlideId);

        // Fetch additional data from backend
        fetch("https://d2bwumaosaqsqc.cloudfront.net/api/v1/data/slidedisplay/get-slide-info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`, // ✅ Add your token here
          },
          body: JSON.stringify({ GenSlideID: receivedSlideId }),
        })
          .then((response) => response.json())
          .then((data) => {
            setFormID(data.FormID);
            setOutlineId(data.outline_id);
            setSlideDataId(data.slideData_id);
            setSectionName(data.SectionName);
          })
          .catch((error) => {
            console.error("Error fetching slide info:", error);
          });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  

  const handleSubmit = async () => {
    const outlineID = generateOutlineID();

    const payload = {
      documentId:formID,
      title,
      position,
      outlineID,
    };

    try {
      const response = await axios.post("https://d2bwumaosaqsqc.cloudfront.net/api/v1/outline/blocklist/insert", payload);
      toast.success("Outline created successfully!");
      console.log("✅ API response:", response.data);
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error inserting outline:", error);
      toast.error("Failed to create outline.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full flex flex-col items-center text-center mb-6">
        <img src={zynthtext} alt="Zynth Logo" className="h-5 mb-2" />
        <h3 className="text-sm text-gray-700">AI Slides and Presentation</h3>
      </div>

      <button
        onClick={handleAddNewSlide}
        className="w-full py-2 bg-gray-200 text-black font-semibold rounded-md mb-4 text-sm mx-3"
      >
        ➕ Add New Slide
      </button>

      <button
        onClick={handleCreatePresentation}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Create Presentation
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">New Slide Details</h2>

            <input
              type="text"
              placeholder="Enter Slide Title"
              className="w-full border px-3 py-2 rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="number"
              placeholder="Enter Position"
              className="w-full border px-3 py-2 rounded-md"
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
            />

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Slide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
