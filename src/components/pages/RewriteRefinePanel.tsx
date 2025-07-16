import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit, FaCoins } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

interface Props {
  selectedText: string;
  onBack: () => void;
}

export default function RewriteRefinePanel({ selectedText, onBack }: Props) {
  const [refinedText, setRefinedText] = useState("");
  const [capitalization, setCapitalization] = useState("Auto");
  const [structure, setStructure] = useState("Auto");
  const [length, setLength] = useState("Auto");
  const [wordCount, setWordCount] = useState("Auto");
  const [language, setLanguage] = useState("Same as text");
  const [loading, setLoading] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const [credits, setCredits] = useState<number>(0);
  const [planName, setPlanName] = useState("free");

  const authToken = sessionStorage.getItem("authToken");
  const orgID = sessionStorage.getItem("orgId") || "";
  const userID = sessionStorage.getItem("userEmail") || "";
  const documentID = sessionStorage.getItem("presentationId") || "";
  const navigate = useNavigate();

  useEffect(() => {
    const fallbackText = sessionStorage.getItem("selectedSlideText") || "";
    setOriginalText(selectedText || fallbackText);
  }, [selectedText]);

  useEffect(() => {
    if (!authToken) navigate("/");
  }, [authToken, navigate]);

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
    } catch (error) {
      console.error("Failed to fetch credits", error);
      setCredits(0);
      setPlanName("free");
    }
  };

  useEffect(() => {
    if (authToken && orgID) fetchCredits();
  }, [authToken, orgID]);

  const refreshCredits = async () => {
    await fetchCredits();
    toast.success("Credits refreshed");
  };

  const isAllowedToRefine = planName !== "free" || credits >= 2;

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
      mode: "rewrite",
      capitalization,
      structure,
      length,
      wordCount,
      language,
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
          Rewrite & Refine
        </button>
        <button className="text-gray-500 font-semibold">✕</button>
      </div>

      <div className="space-y-4">
        {/* Capitalization */}
        <div className="flex justify-between items-center">
          <label className="w-1/2">Capitalization</label>
          <select
            className="w-1/2 border rounded px-2 py-1"
            value={capitalization}
            onChange={(e) => setCapitalization(e.target.value)}
          >
            <option>Auto</option>
            <option>Sentence Case</option>
            <option>Title Case</option>
            <option>UPPER CASE</option>
            <option>lower case</option>
          </select>
        </div>

        {/* Structure */}
        <div className="flex justify-between items-center">
          <label className="w-1/2">Structure</label>
          <select
            className="w-1/2 border rounded px-2 py-1"
            value={structure}
            onChange={(e) => setStructure(e.target.value)}
          >
            <option>Auto</option>
            <option>Bullet Points</option>
            <option>Paragraph</option>
          </select>
        </div>

        {/* Length & Word Count */}
        <div className="flex gap-4 items-start">
          <div className="flex flex-col w-1/2">
            <label className="mb-1">Change Length</label>
            <select
              className="border rounded px-2 py-1"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            >
              <option>Auto</option>
              <option>Shorten</option>
              <option>Lengthen</option>
            </select>
          </div>

          <div className="flex flex-col w-1/2">
            <label className="mb-1 flex justify-between items-start">
              <span>Word Count</span>
              {wordCount !== "Auto" && (
                <button
                  type="button"
                  className="text-xs text-blue-600 ml-auto"
                  onClick={() => setWordCount("Auto")}
                >
                  Reset
                </button>
              )}
            </label>
            <input
              type="number"
              min={1}
              className="border rounded px-2 py-1"
              placeholder="Auto"
              value={wordCount === "Auto" ? "" : wordCount}
              onChange={(e) => {
                const value = e.target.value;
                if (!value || isNaN(Number(value))) {
                  setWordCount("Auto");
                } else {
                  setWordCount(String(Number(value)));
                }
              }}
            />
          </div>
        </div>

        {/* Language */}
        <div className="flex justify-between items-center">
          <label className="w-1/2">Target Language</label>
          <select
            className="w-1/2 border rounded px-2 py-1"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>Same as text</option>
            <option>English</option>
            <option>Hindi</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Italian</option>
            <option>Portuguese</option>
            <option>Russian</option>
            <option>Chinese (Simplified)</option>
            <option>Chinese (Traditional)</option>
            <option>Japanese</option>
            <option>Korean</option>
            <option>Arabic</option>
            <option>Bengali</option>
            <option>Urdu</option>
            <option>Turkish</option>
            <option>Dutch</option>
            <option>Polish</option>
            <option>Vietnamese</option>
            <option>Indonesian</option>
            <option>Thai</option>
            <option>Swedish</option>
            <option>Norwegian</option>
            <option>Finnish</option>
            <option>Danish</option>
            <option>Hebrew</option>
          </select>
        </div>

        {/* Refine Button */}
        <div className="relative w-full mt-2">
          <button
            onClick={handleRefine}
            disabled={loading || !isAllowedToRefine}
            className={`relative bg-blue-600 text-white font-semibold py-4 px-4 w-full rounded-lg text-center transition-all ${
              loading || !isAllowedToRefine
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
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

        {/* Refined Output */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">Refined Text</span>
            <button
              onClick={() => {
                if (refinedText?.trim()) {
                  const textarea = document.createElement("textarea");
                  textarea.value = refinedText;
                  textarea.style.position = "fixed";
                  textarea.style.opacity = "0";
                  document.body.appendChild(textarea);
                  textarea.focus();
                  textarea.select();
                  try {
                    const success = document.execCommand("copy");
                    success
                      ? toast.success("Copied to clipboard!")
                      : toast.error("Copy failed.");
                  } catch {
                    toast.error("Clipboard copy not supported.");
                  }
                  document.body.removeChild(textarea);
                } else {
                  toast.error("Nothing to copy.");
                }
              }}
              className="text-sm text-blue-600"
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
