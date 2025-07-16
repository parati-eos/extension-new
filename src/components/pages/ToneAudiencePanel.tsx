import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit, FaCoins } from "react-icons/fa";
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

  useEffect(() => {
    const fallbackText = sessionStorage.getItem("selectedSlideText") || "";
    setOriginalText(selectedText || fallbackText);
  }, [selectedText]);

  useEffect(() => {
    if (!authToken) navigate("/");
  }, [authToken, navigate]);

  useEffect(() => {
    if (authToken && orgID) fetchCredits();
  }, [authToken, orgID]);

  const refreshCredits = async () => {
    await fetchCredits();
    toast.success("Credits refreshed");
  };

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

        if (planName === "free") {
          const newCredits = credits - 2;
          setCredits(newCredits);
          await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organizationedit/${orgID}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({ credits: newCredits }),
            }
          );
        }
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
 <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full shadow-sm mb-4">
  <FaEdit className="text-blue-700 text-sm" />
  <span>Select the text you want to refine</span>
</div>

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
            className={`relative bg-blue-600 text-white font-semibold py-4 px-4 w-full rounded-lg text-center transition-all ${
              loading || !isAllowedToRefine ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            Refine Text
            {planName === "free" && (
              <div className="absolute top-0 right-0 bg-[#091220] text-white text-xs px-2 py-1 rounded-tr-lg rounded-bl-lg flex items-center gap-1">
                <FaCoins className="text-yellow-400 text-sm" /> 2 Credits
              </div>
            )}
          </button>

          {planName === "free" && (
            <div className="flex flex-col mt-2 text-sm text-gray-700 gap-1">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <FaCoins className="text-yellow-400" /> Credits Available: {credits}
                </span>
            <button
  className="text-blue-600 font-medium flex flex-col items-end ml-auto"
  onClick={handleUpgrade}
>
  <span>Get More</span>
  <span>Credits →</span>
</button>
              </div>
              <button
                onClick={refreshCredits}
                className="text-xs text-blue-500 underline self-start"
              >
                ↻ Refresh Credits
              </button>
            </div>
          )}
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
