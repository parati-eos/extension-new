import React, { useEffect, useState } from "react";
import zynthtext from "../../assets/zynth-text.png";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import {
  FaUser,
  FaPlus,
  FaSyncAlt,
} from "react-icons/fa";
import UserProfileModal from "./userProfile";
import { useNavigate } from "react-router-dom";
import RewriteRefinePanel from "./RewriteRefinePanel";
import ToneAudiencePanel from "./ToneAudiencePanel";
import ImageGeneratorPanel from "./Imagegeneratorpanel";
import ImageSearchPanel from "./imagesearchpanel";
import { FaEdit } from "react-icons/fa";

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
  const [credits, setCredits] = useState<number>(0);

  const navigate = useNavigate();
  const orgId = sessionStorage.getItem("orgId");
const [isGenSlideValid, setIsGenSlideValid] = useState(false);
const [presentationExists, setPresentationExists] = useState<boolean | null>(null);
const [fallbackFormID, setFallbackFormID] = useState<string | null>(null);
const [submitLoading, setSubmitLoading] = useState(false);
const [activeRefineMode, setActiveRefineMode] = useState<"rewrite" | "tone" | "image-generate" | "image-search" | null>(null);

useEffect(() => {
  if (!authToken) {
    navigate("/");
  }
}, [authToken, navigate]);

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
      if (data?.credits !== undefined) {
  setCredits(data.credits);
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

const handleUpgrade = () => {
  const authToken = sessionStorage.getItem("authToken");
  const userEmail = sessionStorage.getItem("userEmail");
  const orgId = sessionStorage.getItem("orgId");

  const query = new URLSearchParams({
    authToken: authToken || "",
    userEmail: userEmail || "",
    orgId: orgId || "",
  });

  window.open(`/pricing?${query.toString()}`, "_blank", "noopener,noreferrer");
};


  const handleCreatePresentation = () => {
    window.parent.postMessage({ type: "openPptModal" }, "*");
  };

  const handleAddNewSlide = () => {
    setShowModal(true);
  };

  // useEffect(() => {
  //   const handleMessage = (event: MessageEvent) => {
  //     if (event.data?.type === "slideId") {
  //       const receivedSlideId = event.data.slideId;
  //       setSlideId(receivedSlideId);

  //       fetch("https://d2bwumaosaqsqc.cloudfront.net/api/v1/data/slidedisplay/get-slide-info", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${authToken}`,
  //         },
  //         body: JSON.stringify({ GenSlideID: receivedSlideId }),
  //       })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (data?.FormID && data?.outline_id) {
  //           setFormID(data.FormID);
  //           setOutlineId(data.outline_id);
  //           setSlideDataId(data.slideData_id);
  //           setSectionName(data.SectionName);
  //           setIsGenSlideValid(true);  // ✅ valid GenSlideID
  //         } else {
  //           setIsGenSlideValid(false); // ❌ invalid GenSlideID
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching slide info:", error);
  //         setIsGenSlideValid(false);
  //       });

          
  //     }
  //   };

  //   window.addEventListener("message", handleMessage);
  //   return () => window.removeEventListener("message", handleMessage);
  // }, []);
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data?.type === "slideId") {
      const receivedSlideId = event.data.slideId;
      if (!receivedSlideId) return;

      setSlideId(receivedSlideId); // always update

      // 🔁 Always re-fetch for every slideId received
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
          if (data?.FormID && data?.outline_id) {
            setFormID(data.FormID);
            setOutlineId(data.outline_id);
            setSlideDataId(data.slideData_id);
            setSectionName(data.SectionName);
            setIsGenSlideValid(true);
          } else {
            setIsGenSlideValid(false); // invalid if blank slide or not in DB
          }
        })
        .catch((error) => {
          console.error("Error fetching slide info:", error);
          setIsGenSlideValid(false);
        });
    }
  };

  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
}, [authToken]);


  useEffect(() => {
  const fetchFormIdByPresentationId = async () => {
    const presentationId = sessionStorage.getItem("presentationId");
    if (!presentationId) {
      console.warn("No presentationId found in sessionStorage.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidedisplay/getFormIdByPresentationId`,
        { PresentationID: presentationId },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.data?.success && response.data?.FormID) {
        setFallbackFormID(response.data.FormID);
        console.log("✅ Fallback FormID loaded:", response.data.FormID);
      } else {
        console.warn("⚠️ No FormID found for the given PresentationID");
      }
    } catch (error) {
      console.error("❌ Error fetching fallback FormID:", error);
    }
  };

  fetchFormIdByPresentationId();
}, [authToken]);


  const handleSubmit = async () => {
    const outlineID = generateOutlineID();
    const finalFormID = formID || fallbackFormID;

    const payload = { documentId: finalFormID, title, outlineID };
    setSubmitLoading(true); // 🔄 Start loader

    try {
      await axios.post(
        "https://d2bwumaosaqsqc.cloudfront.net/api/v1/outline/blocklist/insertbottom",
        payload,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast.success("Outline created successfully!");
      setShowModal(false);
      // Pass data to RefinePPT via postMessage
sessionStorage.setItem("outlineId", outlineID);
sessionStorage.setItem("sectionName", title);
window.parent.postMessage({
  type: "openPptModal",
  outlineId: outlineID,
  sectionName: title,
}, "*");

    } catch (error: any) {
      console.error("Error inserting outline:", error);
  
      const errorMessage = error?.response?.data?.message || "";
  
      if (
        errorMessage.includes("invalid document") || 
        errorMessage.includes("Document not found")
      ) {
        toast.error("This is not a Zynth generated slide. Please use Add new slide");
      } else {
        toast.error("Failed to create outline.");
      }
    }
    finally {
    setSubmitLoading(false); // ✅ End loader
  }
  };
  
  const [selectedText, setSelectedText] = useState<string>("");

useEffect(() => {
  const handleSelectedText = (event: MessageEvent) => {
    if (event.data?.type === "selectedText") {
      setSelectedText(event.data.text || "");
      console.log("✅ Received selected text:", event.data.text);
    }
  };

  window.addEventListener("message", handleSelectedText);
  return () => window.removeEventListener("message", handleSelectedText);
}, []);


  useEffect(() => {
   
    // if (!presentationId) {
    //   console.error("No presentationId found in session.");
    //   setPresentationExists(false);
    //   return;
    // }

    const checkPresentation = async () => {
    const presentationId = sessionStorage.getItem("presentationId");
    console.log("Checking Presentation ID:", presentationId);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidedisplay/checkPresentationIdExists`,
          { PresentationID: presentationId },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        setPresentationExists(response.data.exists);
      } catch (error) {
        console.error("Error checking presentation ID:", error);
        setPresentationExists(false);
      }
    };

    const timer = setTimeout(() => {
      checkPresentation();
    }, 5000); // Changed to 3 seconds

    return () => clearTimeout(timer);
  }, [authToken]);
if (activeRefineMode === "rewrite") {
  return (
    <RewriteRefinePanel
      selectedText={selectedText}
      onBack={() => setActiveRefineMode(null)}
    />
  );
}

if (activeRefineMode === "tone") {
  return (
    <ToneAudiencePanel
      selectedText={selectedText}
      onBack={() => setActiveRefineMode(null)}
    />
  );
}

if (activeRefineMode === "image-generate") {
  return <ImageGeneratorPanel onBack={() => setActiveRefineMode(null)} />;
}

if (activeRefineMode === "image-search") {
  return <ImageSearchPanel onBack={() => setActiveRefineMode(null)} />;
}
return (
  <div className="relative flex flex-col items-center justify-start min-h-screen">

    {/* Show only "Create Presentation" button if presentation doesn't exist */}
{presentationExists === false && (
  <>
    <div className="flex flex-col items-center justify-center mt-10">
      <p className="text-lg font-semibold text-gray-700 mb-4">
        Start a new presentation.
      </p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        onClick={() => {
          window.parent.postMessage({ type: "triggerOpenModal" }, "*");
        }}
      >
        Create Presentation
      </button>
    </div>
<div className="w-full flex items-center px-1 mb-8 mt-12 relative">

  <div className="w-full flex flex-col border-2 bg-gray-100 border-gray-300 rounded-md p-2 gap-4 min-h-40">
    <div className="flex justify-between items-center">
      <h3 className="text-start font-semibold">Edit Text on Slide</h3>
  {/* <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full shadow-sm">
    <FaEdit className="text-blue-700 text-sm" />
    <span>Select the text you want to refine</span>
  </div> */}

{/* {(planName === "free" || credits < 2) && (
  <button
    onClick={handleUpgrade}
    className="bg-blue-600 text-white text-sm px-3 py-1 rounded"
  >
    Upgrade
  </button>
)} */}

    </div>

    <div className="flex justify-between items-center gap-4">
      <button
        // disabled={planName === "free"}
          //  && pptCountMonthly >= 3
        onClick={() => setActiveRefineMode("rewrite")}
className="flex flex-col items-center justify-center border border-blue-500 rounded w-1/2 py-4 bg-white text-gray-700 hover:bg-blue-50"

      >
        <span className="text-base font-medium">Rewrite &</span>
        <span className="text-base font-medium">Refine</span>
      </button>

      <button
        // disabled={planName === "free"}
        onClick={() => setActiveRefineMode("tone")}
className="flex flex-col items-center justify-center border border-blue-500 rounded w-1/2 py-4 bg-white text-gray-700 hover:bg-blue-50"

      >
        <span className="text-base font-medium">Tone &</span>
        <span className="text-base font-medium">Audience</span>
      </button>
    </div>
  </div>
</div>

    {/* Image Tools Panel even if presentation doesn't exist */}
    <div className="w-full flex items-center px-1 mb-2 mt-6 relative">
      <div className="w-full flex flex-col border-2 bg-gray-100 border-gray-300 rounded-md p-2 gap-4 min-h-40">
        <div className="flex justify-between items-center">
          <h3 className="text-start font-semibold">Image Tools</h3>
 {/* {(planName === "free" || credits < 2) && (
  <button
    onClick={handleUpgrade}
    className="bg-blue-600 text-white text-sm px-3 py-1 rounded"
  >
    Upgrade
  </button>
)} */}

        </div>

        <div className="flex justify-between items-center gap-4">
          <button
            // disabled={planName === "free"}
            onClick={() => setActiveRefineMode("image-generate")}
className="flex flex-col items-center justify-center border border-blue-500 rounded w-1/2 py-4 bg-white text-gray-700 hover:bg-blue-50"

          >
            <span className="text-base font-medium">Generate</span>
            <span className="text-base font-medium">Images</span>
          </button>

          <button
            // disabled={planName === "free"}
            onClick={() => setActiveRefineMode("image-search")}
    className="flex flex-col items-center justify-center border border-blue-500 rounded w-1/2 py-4 bg-white text-gray-700 hover:bg-blue-50"

          >
            <span className="text-base font-medium">Search</span>
            <span className="text-base font-medium">Images</span>
          </button>
        </div>
      </div>
    </div>
  </>
)}


    {/* Render full UI only if presentation exists */}
    {presentationExists !== false && (
      <>
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
                className={`group flex items-center justify-center border ${
                  isGenSlideValid
                    ? "border-blue-500 hover:border-blue-500 hover:border-2 hover:bg-blue-500"
                    : "border-gray-300 bg-gray-200 cursor-not-allowed"
                } p-2 rounded transition-colors`}
                disabled={!isGenSlideValid}
              >
                <FaSyncAlt
                  className={`${
                    isGenSlideValid ? "text-gray-700 group-hover:text-white" : "text-gray-400"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Refine text on slide */}
<div className="w-full flex items-center px-1 mt-6 mb-4 relative">

  <div className="w-full flex flex-col border-2 bg-gray-100 border-gray-300 rounded-md p-2 gap-4 min-h-40">
    <div className="flex justify-between items-center">
      <h3 className="text-start font-semibold">Edit Text on Slide</h3>
  {/* <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full shadow-sm">
    <FaEdit className="text-blue-700 text-sm" />
    <span>Select the text you want to refine</span>
  </div> */}

{/* {(planName === "free" || credits < 5) && (
  <button
    onClick={handleUpgrade}
    className="bg-blue-600 text-white text-sm px-3 py-1 rounded"
  >
    Upgrade
  </button>
)} */}

    </div>

    <div className="flex justify-between items-center gap-4">
      <button
        // disabled={planName === "free"}
          //  && pptCountMonthly >= 3
        onClick={() => setActiveRefineMode("rewrite")}
className="flex flex-col items-center justify-center border border-blue-500 rounded w-1/2 py-4 bg-white text-gray-700 hover:bg-blue-50"

      >
        <span className="text-base font-medium">Rewrite &</span>
        <span className="text-base font-medium">Refine</span>
      </button>

      <button
        // disabled={planName === "free"}
        onClick={() => setActiveRefineMode("tone")}
className="flex flex-col items-center justify-center border border-blue-500 rounded w-1/2 py-4 bg-white text-gray-700 hover:bg-blue-50"

      >
        <span className="text-base font-medium">Tone &</span>
        <span className="text-base font-medium">Audience</span>
      </button>
    </div>
  </div>
</div>



        {/* AI Image Tools */}
<div className="w-full flex items-center px-1 mb-2 relative">
  <div className="w-full flex flex-col border-2 bg-gray-100 border-gray-300 rounded-md p-2 gap-4 min-h-40">
    <div className="flex justify-between items-center">
      <h3 className="text-start font-semibold">Image Tools</h3>
{/* {(planName === "free" || credits < 5) && (
  <button
    onClick={handleUpgrade}
    className="bg-blue-600 text-white text-sm px-3 py-1 rounded"
  >
    Upgrade
  </button>
)} */}

    </div>

    <div className="flex justify-between items-center gap-4">
      <button
        // disabled={planName === "free"}
        onClick={() => setActiveRefineMode("image-generate")}
className="flex flex-col items-center justify-center border border-blue-500 rounded w-1/2 py-4 bg-white text-gray-700 hover:bg-blue-50"

      >
        <span className="text-base font-medium">Generate</span>
        <span className="text-base font-medium">Images</span>
      </button>

      <button
        // disabled={planName === "free"}
        onClick={() => setActiveRefineMode("image-search")}
className="flex flex-col items-center justify-center border border-blue-500 rounded w-1/2 py-4 bg-white text-gray-700 hover:bg-blue-50"

      >
        <span className="text-base font-medium">Search</span>
        <span className="text-base font-medium">Images</span>
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
              {/* <input
                type="number"
                placeholder="Enter Position"
                className="w-full border px-3 py-2 rounded-md"
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
              /> */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
        <button
  onClick={handleSubmit}
  disabled={submitLoading}
  className={`px-4 py-2 rounded text-white ${
    submitLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {submitLoading ? "Creating..." : "Create Slide"}
</button>

              </div>
            </div>
          </div>
        )}
      </>
    )}
  </div>
);

}
