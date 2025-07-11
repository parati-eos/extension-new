import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import axios from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Props {
  selectedText: string;
  onBack: () => void;
}

export default function ToneAudiencePanel({ selectedText, onBack }: Props) {
  const [refinedText, setRefinedText] = useState("");
  const [tone, setTone] = useState("Same as Text");
  const [technicalDepth, setTechnicalDepth] = useState("Same as Text");
  const [audience, setAudience] = useState("Auto");
  const [creativity, setCreativity] = useState("Same as Text");
  const [loading, setLoading] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const [credits, setCredits] = useState<number>(0);
  const [planName, setPlanName] = useState("free");

  const navigate = useNavigate();
  const authToken = sessionStorage.getItem("authToken");
  const orgID = sessionStorage.getItem("orgId") || "";
  const userID = sessionStorage.getItem("userEmail") || "";
  const documentID = sessionStorage.getItem("presentationId") || "";

  const isAllowedToRefine = planName !== "free" || credits >= 2;

  useEffect(() => {
    const fallbackText = sessionStorage.getItem("selectedSlideText") || "";
    setOriginalText(selectedText || fallbackText);
  }, [selectedText]);

  useEffect(() => {
    if (!authToken) navigate("/");
  }, [authToken, navigate]);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/${orgID}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setCredits(res.data?.credits || 0);
        setPlanName(res.data?.plan?.plan_name || "free");
      } catch (err) {
        console.error("Failed to fetch credits:", err);
        setCredits(0);
        setPlanName("free");
      }
    };

    if (authToken && orgID) fetchCredits();
  }, [authToken, orgID]);

  const handleUpgrade = () => {
    const query = new URLSearchParams({
      authToken: authToken || "",
      userEmail: userID || "",
      orgId: orgID || "",
    });
    window.open(`/pricing?${query.toString()}`, "_blank", "noopener,noreferrer");
  };

  const handleRefine = async () => {
    if (!originalText?.trim()) {
      toast.error("No text found for refinement.");
      return;
    }

    const payload = {
      userID,
      orgID,
      documentID,
      originalText,
      mode: "tone",
      tone,
      technicalDepth,
      audience,
      creativity,
    };

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/refine-text-extension`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (res.data?.refinedText) {
        setRefinedText(res.data.refinedText);
        toast.success("Text refined successfully!");
        if (planName === "free") setCredits((prev) => prev - 2);
      } else {
        toast.error("Refinement failed. No output.");
      }
    } catch (error: any) {
      console.error("Error refining text:", error.message);
      toast.error("Failed to refine text.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!refinedText?.trim()) {
      toast.error("Nothing to copy.");
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = refinedText;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) toast.success("Copied to clipboard!");
      else toast.error("Copy command failed.");
    } catch {
      toast.error("Clipboard copy not supported.");
    }

    document.body.removeChild(textarea);
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 font-medium"
        >
          <FaArrowLeft />
          Tone & Audience
        </button>
        <button className="text-gray-500 font-semibold">✕</button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="w-1/2">Change Tone</label>
          <select
            className="w-1/2 border rounded px-2 py-1"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option>Same as Text</option>
            <option>Friendly</option>
            <option>Professional</option>
            <option>Casual</option>
            <option>Formal</option>
          </select>
        </div>

        <div className="flex justify-between items-center">
          <label className="w-1/2">Technical Depth</label>
          <select
            className="w-1/2 border rounded px-2 py-1"
            value={technicalDepth}
            onChange={(e) => setTechnicalDepth(e.target.value)}
          >
            <option>Same as Text</option>
            <option>Simplify</option>
            <option>More Technical</option>
          </select>
        </div>

        <div className="flex justify-between items-center">
          <label className="w-1/2">Audience</label>
          <select
            className="w-1/2 border rounded px-2 py-1"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          >
            <option>Auto</option>
            <option>Internal Team</option>
            <option>Customers</option>
            <option>Investors</option>
            <option>Partners</option>
            <option>Prospects</option>
            <option>Students</option>
          </select>
        </div>

        <div className="flex justify-between items-center">
          <label className="w-1/2">Creativity</label>
          <select
            className="w-1/2 border rounded px-2 py-1"
            value={creativity}
            onChange={(e) => setCreativity(e.target.value)}
          >
            <option>Same as Text</option>
            <option>Less Creative</option>
            <option>More Creative</option>
          </select>
        </div>

        <div className="relative w-full mt-2">
          <button
            onClick={handleRefine}
            disabled={loading || !isAllowedToRefine}
            className={`relative bg-blue-600 text-white font-semibold py-3 px-4 w-full rounded-lg text-center transition-all ${
              loading || !isAllowedToRefine ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            Refine Text
            <div className="absolute top-0 right-0 bg-[#091220] text-white text-xs px-2 py-1 rounded-tr-lg rounded-bl-lg flex items-center gap-1">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="coin"
                className="w-3 h-3"
              />
              2 Credits
            </div>
          </button>

          <div className="flex justify-between items-center mt-2 text-sm text-gray-700">
            <span>
              Credits Available: {credits}
            </span>
            <button
              className="text-blue-600 font-medium flex items-center gap-1"
              onClick={handleUpgrade}
            >
              Get More Credits <span>→</span>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">Refined Text</span>
            <button
              onClick={handleCopy}
              className="text-sm text-blue-600 hover:underline"
            >
              Copy
            </button>
          </div>
          <div className="border p-3 rounded bg-gray-50 h-40 overflow-auto whitespace-pre-wrap text-sm">
            {refinedText || "<output will appear here>"}
          </div>
        </div>
      </div>
    </div>
  );
}
