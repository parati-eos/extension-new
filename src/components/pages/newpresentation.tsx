import React, { useEffect, useState } from "react";
import zynthtext from "../../assets/zynth-text.png";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUser,
  FaPlus,
  FaSyncAlt,
} from "react-icons/fa";
import UserProfileModal from "./userProfile";
import { useNavigate } from "react-router-dom";

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
  const [planName, setPlanName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [pptCountMonthly, setPptCountMonthly] = useState<number>(0);
  const navigate = useNavigate();
  const orgId = sessionStorage.getItem("orgId");

  const fetchOrganizationData = async () => {
    if (!orgId) {
      console.error("Error: Organization ID is missing.");
      return;
    }

    setLoading(true);
    const requestUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/${orgId}`;

    try {
      const response = await axios.get(requestUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch organization data");
      }

      const data = response.data;
      if (data?.plan?.plan_name) {
        setPlanName(data.plan.plan_name);
      }
      if (data?.pptcount_monthly !== undefined) {
        setPptCountMonthly(data.pptcount_monthly);
      }
    } catch (error) {
      console.error("Error fetching organization data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const generateOutlineID = () => `outlineID-${window.crypto.randomUUID()}`;

  const handleUpgrade = () => navigate("/pricing", { state: { planName } });

  const handleCreatePresentation = () => {
    window.parent.postMessage({ type: "openPptModal" }, "*");
  };

  const handleAddNewSlide = () => {
    setShowModal(true);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "slideId") {
        const receivedSlideId = event.data.slideId;
        setSlideId(receivedSlideId);

        fetch("https://d2bwumaosaqsqc.cloudfront.net/api/v1/data/slidedisplay/get-slide-info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
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
          .catch((error) => console.error("Error fetching slide info:", error));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleSubmit = async () => {
    const outlineID = generateOutlineID();
    const payload = { documentId: formID, title, position, outlineID };

    try {
      await axios.post(
        "https://d2bwumaosaqsqc.cloudfront.net/api/v1/outline/blocklist/insert",
        payload,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast.success("Outline created successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error inserting outline:", error);
      toast.error("Failed to create outline.");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen">
      {showProfile && (
        <UserProfileModal
          isOpen={showProfile}
          onClose={() => setshowProfile(false)}
        />
      )}

      <div className="flex items-center justify-between text-base w-full px-3 py-2 mb-6 mt-4">
        <img src={zynthtext} alt="Zynth Logo" className="h-5" />
        <button onClick={() => setshowProfile(true)} className="flex items-center gap-1">
          <FaUser />
          <span>Profile</span>
        </button>
      </div>

      <div className="w-full flex items-center px-1 mb-8">
        <div className="w-full flex flex-col border-2 bg-gray-100 border-gray-300 rounded-md p-2 gap-4">
          <div className="flex items-center justify-between text-base w-full">
            <h3 className="font-semibold">Add new slide</h3>
            <button
              title="addnewslide"
              onClick={handleAddNewSlide}
              className="group flex items-center justify-center border border-blue-500 hover:border-blue-500 hover:border-2 p-2 hover:bg-blue-500 rounded transition-colors"
            >
              <FaPlus className="text-gray-700 group-hover:text-white" />
            </button>
          </div>

          <div className="flex items-center justify-between text-base w-full">
            <h3 className="font-semibold">Create new version</h3>
            <button
              title="create"
              onClick={handleCreatePresentation}
              className="group flex items-center justify-center border border-blue-500 hover:border-blue-500 hover:border-2 hover:bg-blue-500 p-2 rounded transition-colors"
            >
              <FaSyncAlt className="text-gray-700 group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Refine text on slide */}
      <div className="w-full flex items-center px-1 mb-8 relative">
        <div className="w-full flex flex-col border-2 bg-gray-100 border-gray-300 rounded-md p-2 gap-4">
        <div className="flex justify-between items-center">
      <h3 className="text-start font-semibold">Refine text on slide</h3>

      {/* Show upgrade if plan is free AND ppt count is >= 1 */}
      {planName === "free" && pptCountMonthly >= 1 && (
        <button
          onClick={handleUpgrade}
          className="bg-blue-600 text-white text-sm px-3 py-1 rounded"
        >
          Upgrade to Unlock
        </button>
      )}
    </div>
          <div className="flex items-center justify-between text-base w-full">
            <button disabled={planName === "free"} className="flex items-center justify-center border border-blue-500 bg-gray-200 text-gray-500 rounded px-3 py-1 w-[45%]">
              <span>Shorten</span>
            </button>
            <button disabled={planName === "free"} className="flex items-center justify-center border border-blue-500 bg-gray-200 text-gray-500 rounded px-3 py-1 w-[45%]">
              <span>Lengthen</span>
            </button>
          </div>
          <div className="flex items-center justify-between text-base w-full">
            <button disabled={planName === "free"} className="flex items-center justify-center border border-blue-500 bg-gray-200 text-gray-500 rounded px-1 py-1 w-[45%]">
              <span>More Structured</span>
            </button>
            <button disabled={planName === "free"} className="flex items-center justify-center border border-blue-500 bg-gray-200 text-gray-500 rounded px-3 py-1 w-[45%]">
              <span>More Creative</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Image Tools */}
      <div className="w-full flex items-center px-1 mb-2 relative">
        <div className="w-full flex flex-col border-2 bg-gray-100 border-gray-300 rounded-md p-2 gap-4">
        <div className="flex justify-between items-center">
  <h3 className="text-start font-semibold mb-2">AI Image Tools</h3>
  {planName === "free" && pptCountMonthly >= 1 && (
    <button
      onClick={handleUpgrade}
      className="bg-blue-600 text-white text-sm px-3 py-1 rounded"
    >
      Upgrade to Unlock
    </button>
  )}
</div>

          <div className="flex items-center justify-between text-base w-full gap-2">
            <button disabled={planName === "free"} className="flex items-center justify-center border border-blue-500 bg-gray-200 text-gray-500 rounded px-1 py-3 w-[45%]">
              <span>Generate Images</span>
            </button>
            <button disabled={planName === "free"} className="flex items-center justify-center border border-blue-500 bg-gray-200 text-gray-500 rounded px-3 py-3 w-[45%]">
              <span>Search Images</span>
            </button>
          </div>
        </div>
      </div>

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
