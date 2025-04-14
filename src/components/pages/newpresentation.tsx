import React, { useEffect, useState } from "react";
import zynthtext from "../../assets/zynth-text.png";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUser,
  FaPlus,
  FaSyncAlt,
  FaUserCircle,
  FaUserAlt,
} from "react-icons/fa";
import UserProfileModal from "./userProfile";

export default function RefinePresentation() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState<number>(1);
  const authToken = sessionStorage.getItem("authToken") || "";
  const [outlineId, setOutlineId] = useState<string>("");
  const [slideDataId, setSlideDataId] = useState<string>("");
  const [sectionName, setSectionName] = useState<string>("");
  const [formID, setFormID] = useState<string | null>(null);
  const [slideId, setSlideId] = useState<string | null>(null);
  const [showProfile, setshowProfile] = useState(false);
  const generateOutlineID = () => {
    return `outlineID-${window.crypto.randomUUID()}`;
  };

  const handleCreatePresentation = () => {
    console.log("📤 Sending message to parent to openPptModal");
    window.parent.postMessage({ type: "openPptModal" }, "*");
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
        fetch(
          "https://d2bwumaosaqsqc.cloudfront.net/api/v1/data/slidedisplay/get-slide-info",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`, // ✅ Add your token here
            },
            body: JSON.stringify({ GenSlideID: receivedSlideId }),
          }
        )
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
      documentId: formID,
      title,
      position,
      outlineID,
    };

    try {
      const response = await axios.post(
        "https://d2bwumaosaqsqc.cloudfront.net/api/v1/outline/blocklist/insert",
        payload
      );
      toast.success("Outline created successfully!");
      console.log("✅ API response:", response.data);
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error inserting outline:", error);
      toast.error("Failed to create outline.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      <div className="w-full flex flex-col items-center text-center mb-6 gap-4">
        {/* <h3>Create and edit slide with Zynth</h3> */}
        {showProfile?(
            <UserProfileModal
            isOpen={showProfile}
            onClose={() => setshowProfile(false)}
          />
        ):(
          <>
          </>
        )
        }
        <div className="flex items-center justify-between text-base w-full px-3 py-2 mb-6 mt-4">
          <img src={zynthtext} alt="Zynth Logo" className="h-5 " />

          <button 
          onClick={()=>setshowProfile(true)}
          className="flex items-center gap-1">
            <FaUser />
            <span>Profile</span>
          </button>
        </div>
        <div className="w-full flex items-center px-1 mb-8">
          <div className="w-full flex flex-col border-2 bg-gray-100  border-gray-300 rounded-md p-2 gap-4 ">
            <div className="flex items-center justify-between text-base w-full">
              <h3 className="font-semibold">Add new slide</h3>
              <button
              title="addnewslide" 
               onClick={handleAddNewSlide}
              className="group flex items-center justify-center border border-blue-500 hover:border-blue-500 hover:border-2 p-2  hover:bg-blue-500 rounded transition-colors">
                <FaPlus className="text-gray-700 group-hover:text-white"/>
              </button>
            </div>

            <div className="flex items-center justify-between text-base w-full">
              <h3 className="font-semibold">Create new version</h3>
              <button
              title="create"
              onClick={handleCreatePresentation}
               className="group flex items-center justify-center border border-blue-500 hover:border-blue-500 hover:border-2 hover:bg-blue-500 p-2 rounded transition-colors">
                <FaSyncAlt className="text-gray-700 group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full flex items-center px-1 mb-8">
          <div className="w-full flex flex-col border-2 bg-gray-100  border-gray-300 rounded-md p-2 gap-4 ">
            <h3 className="text-start font-semibold">Refine text on slide</h3>
            <div className="flex items-center justify-between text-base w-full">
              <button className="flex items-center justify-center border border-blue-500 hover:border-blue-500 hover:border-2 hover:bg-blue-500 hover:text-white  rounded px-3 py-1 w-[45%]">
                <span>Shorten</span>
              </button>

              <button className="flex items-center justify-center gap-2 border border-blue-500 hover:border-blue-500 hover:border-2 hover:bg-blue-500 hover:text-white rounded px-3 py-1 w-[45%]">
                <span>Lengthen</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-base w-full">
            <button className="flex items-center justify-center border border-blue-500 hover:border-blue-500 hover:border-2 hover:bg-blue-500 hover:text-white rounded px-1 py-1 w-[45%]">
                <span>More Structured</span>
              </button>

              <button className="flex items-center justify-center gap-2 border border-blue-500 hover:border-blue-500 hover:border-2 hover:bg-blue-500 hover:text-white rounded px-3 py-1 w-[45%]">
                <span>More Creative</span>
              </button>
            </div>
          </div>
        </div>


        <div className="w-full flex items-center px-1 mb-2">
          <div className="w-full flex flex-col border-2 bg-gray-100  border-gray-300 rounded-md p-2 gap-4 ">
            <h3 className="text-start mb-4 font-semibold">AI Image Tools</h3>
            <div className="flex items-center justify-between text-base w-full gap-2">
              <button className="flex items-center justify-center border border-blue-500 hover:border-blue-500 hover:border-2 hover:bg-blue-500 hover:text-white rounded px-1 py-3 w-[45%]">
                <span>Generate Images</span>
              </button>

              <button className="flex items-center justify-center border border-blue-500 hover:border-blue-500 hover:border-2 hover:bg-blue-500 hover:text-white rounded px-3 py-3 w-[45%]">
                <span>Search Images</span>
              </button>
            </div>
          </div>
        </div>


        {/* <img src={zynthtext} alt="Zynth Logo" className="h-5 mb-2" />
        <h3 className="text-sm text-gray-700">AI Slides and Presentation</h3> */}
      </div>
{/* 
      <button
        onClick={handleAddNewSlide}
        className="w-full py-2 bg-gray-200 text-black font-semibold rounded-md mb-4 text-sm mx-3"
      >
        ➕ Add New Slide
      </button>
      <p className="text-center p-2">
        Create a new version for the current slide.
      </p>
      <button
        onClick={handleCreatePresentation}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition  mt-2"
      >
        Create new version
      </button> */}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              New Slide Details
            </h2>

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
