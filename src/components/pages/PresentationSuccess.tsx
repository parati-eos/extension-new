import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { toast } from "react-toastify";

const slideLoaderMessages = [
  "While this slide is generating, you can go through the outline to see what's coming up and if any slide is ready.",
  "You can also create new versions of each slide or add new sections in the outline to further improve your generated presentation.",
  "Do you know that knowledge workers spend almost 50% of their time in creating business documents?",
  "Remember, the slide output is as good as the input. So, make sure to try out the slide narrative feature by clicking on the new version button.",
  "Get more control over your slides by using the custom builder to create a new slide version.",
  "Great presentations take time—Zynth is crafting your slides with precision!",
  "Once you have your slides ready, you can click on the finalize button for the ones you like and seamlessly share the final presentation through the share button.",
  "Use the export button to convert your Zynth presentation into completely editable Google Slides while staying completely in sync between the two platforms.",
  "While we’re working on your deck, have you thought about your next big idea?",
  "Building a professional deck that aligns with your brand—almost there!",
];

const initialLoaderMessages = [
  "Gathering insights and visualizing your data for the perfect slides.",
  "Did you know? Zynth's AI uses tried-and-tested frameworks to create impactful presentations!",
  "By just waiting for a minute or two, you will be saving hours of content and design work.",
];

const PresentationSuccess = () => {
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("Generating presentation...");
  const [infoMsg, setInfoMsg] = useState(initialLoaderMessages[0]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showViewButton, setShowViewButton] = useState(false);

  const localProgress = useRef(0);
  const apiProgress = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageRotationRef = useRef<NodeJS.Timeout | null>(null);
  const reached50 = useRef(false);
  const { width, height } = useWindowSize();
  const authToken = sessionStorage.getItem("authToken") || "";
  const formId = sessionStorage.getItem("form_id");
const [viewLoading, setViewLoading] = useState(false);

  // ✅ Independent API call to update extension field
useEffect(() => {
  const createFinalsheet = async () => {
    const userId = sessionStorage.getItem("userEmail");
    const pptName = "Zynth Presentation";
    const pptType = "extension";
    const presentationUrl = sessionStorage.getItem("presentationId");
    const orderId = "default-order-id";

    if (!formId) {
      console.warn("⚠️ Missing data for creating Finalsheet");
      return;
      toast.error("⚠️ Missing data for creating Finalsheet");
    }

    try {
      await axios.post(
        "https://d2bwumaosaqsqc.cloudfront.net/api/v1/data/appscripts/history",
        {
          UserID: userId,
          FormID: formId,
          PresentationURL: presentationUrl,
          pptName,
          currentTime: new Date().toISOString(),
          paymentStatus: 0,
          exportStatus: false,
          order_id: orderId,
          ppt_type: pptType,
          extension: true
        }
      );
      console.log("✅ Finalsheet created successfully");
    } catch (err) {
      console.error("❌ Failed to create Finalsheet", err);
    }
  };

  createFinalsheet();
}, []);


  useEffect(() => {
    const fetchRealProgress = async () => {
      try {
        const res = await axios.post(
          "https://d2bwumaosaqsqc.cloudfront.net/api/v1/data/slidedisplay/check-slide_progress",
          { documentID: formId },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const real = Math.min(res.data?.progressPercentage || 0, 100);
        apiProgress.current = real;

        if (real >= 10 && real < 100 && !showViewButton) {
          setShowViewButton(true);
          setStatusMsg("✅ Some slides are ready. You can start viewing the presentation.");
        }

        if (res.data?.isComplete || real >= 100) {
          setProgress(100);
          setStatusMsg("✅ Presentation generation complete. Please close this screen to access your slides.");
          setShowConfetti(true);
          setShowViewButton(true);
          cleanup();
        }
      } catch (err) {
        console.log("Polling failed, retrying...");
      }
    };

    intervalRef.current = setInterval(() => {
      if (!reached50.current && localProgress.current < 50) {
        localProgress.current += 10;
        if (localProgress.current >= 50) {
          localProgress.current = 50;
          reached50.current = true;
        }
      }

      fetchRealProgress();
      const display = Math.max(localProgress.current, apiProgress.current);
      setProgress(display);
    }, 10000);

    timeoutRef.current = setTimeout(() => {
      cleanup();
      setStatusMsg("⏳ Please try again or check later.");
    }, 180000);

    messageRotationRef.current = setInterval(() => {
      const source = reached50.current ? slideLoaderMessages : initialLoaderMessages;
      const next = source[Math.floor(Math.random() * source.length)];
      setInfoMsg(next);
    }, 15000);

    return () => cleanup();
  }, []);

  const cleanup = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (messageRotationRef.current) clearInterval(messageRotationRef.current);
  };

  const handleViewSlides = () => {
     setViewLoading(true); // ✅ show loader
    if (window.parent) {
      window.parent.postMessage({ type: "closeRefineModal" }, "*");
          setTimeout(() => {
      setViewLoading(false);
    }, 5000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white p-6 text-center">
      {showConfetti && <Confetti width={width} height={height} />}
      <h1 className="text-2xl font-bold text-green-600 mb-4">{statusMsg}</h1>
      <p className="text-gray-700 mb-4">{infoMsg}</p>

      <div className="w-full max-w-xl h-4 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-green-500 transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-gray-600 mb-6">{progress}%</p>

      {showViewButton && (
        <button
  onClick={handleViewSlides}
  disabled={viewLoading}
  className={`px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition flex items-center justify-center gap-2 ${
    viewLoading ? "opacity-70 cursor-not-allowed" : ""
  }`}
>
  {viewLoading ? (
    <>
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      Closing...
    </>
  ) : (
    "View Presentation"
  )}
</button>

      )}
    </div>
  );
};

export default PresentationSuccess;
