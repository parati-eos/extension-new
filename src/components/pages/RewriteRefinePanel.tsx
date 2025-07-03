import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
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
  if (!authToken) {
    navigate("/");
  }
}, [authToken, navigate]);
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
    if (refinedText) {
      navigator.clipboard.writeText(refinedText);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto">
      {/* Header */}
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

      {/* Controls */}
      <div className="space-y-4">
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

<div className="flex gap-4 items-start">
  {/* Change Length */}
  <div className="flex flex-col w-1/2">
    <label className="mb-1 leading-tight break-words">Change Length</label>
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

  {/* Word Count */}
  <div className="flex flex-col w-1/2">
    <label className="mb-1 leading-tight break-words flex flex-wrap justify-between items-start">
      <span className="block">Word Count</span>
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
        <button
          onClick={handleRefine}
          disabled={loading}
          className={`bg-blue-600 text-white py-2 px-4 rounded w-full mt-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Refining..." : "Refine Text"}
        </button>

        {/* Refined Output */}
{/* Refined Output */}
<div className="mt-4">
  <div className="flex justify-between items-center mb-1">
    <span className="font-semibold">Refined Text</span>
    <button
      onClick={() => {
        if (refinedText?.trim()) {
          const textarea = document.createElement("textarea");
          textarea.value = refinedText;
          textarea.style.position = "fixed"; // Prevent scrolling to bottom
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();

          try {
            const success = document.execCommand("copy");
            if (success) {
              toast.success("Copied to clipboard!");
            } else {
              toast.error("Copy command failed.");
            }
          } catch (err) {
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
