import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

interface Props {
  onBack: () => void;
}

export default function ImageSearchPanel({ onBack }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [style, setStyle] = useState("Auto");
  const [size, setSize] = useState("All");
  const [count, setCount] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

const handleSearch = async () => {
  if (!searchTerm.trim()) {
    toast.error("Please enter a search term.");
    return;
  }

  const userID = sessionStorage.getItem("userEmail") || "";
  const orgID = sessionStorage.getItem("orgId") || "";
  const documentID = sessionStorage.getItem("presentationId") || "";
  const authToken = sessionStorage.getItem("authToken");

  if (!userID || !orgID || !documentID || !authToken) {
    toast.error("Missing session or authentication data.");
    return;
  }

  setLoading(true);
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/imagegenerator`,
      {
        type: "search",
        userID,
        orgID,
        documentID,
        searchTerm,
        style,
        size,
        count,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.data?.images?.length) {
      setImages(response.data.images);
      toast.success("Images found!");
    } else {
      toast.error("No images found.");
    }
  } catch (err) {
    toast.error("Image search failed.");
    console.error("Image search error:", err);
  } finally {
    setLoading(false);
  }
};


  const handleAddImageToSlide = (url: string) => {
    window.parent.postMessage({ type: "insertImage", imageUrl: url }, "*");
    toast.success("Image added to slide!");
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 font-medium"
        >
          <FaArrowLeft /> Search Images
        </button>
        <button className="text-gray-500 font-semibold">✕</button>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <input
          placeholder="Search Terms"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded px-2 py-2"
        />

        <div className="flex justify-between items-center">
          <label className="w-1/2">Image Style</label>
          <select
            className="w-1/2 border rounded px-2 py-1"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            {["Auto", "Photo", "Vector"].map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-between items-center">
          <label className="w-1/2">Image Size</label>
          <select
            className="w-1/2 border rounded px-2 py-1"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            {["All", "Landscape", "Portrait", "Square"].map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className="w-1/2">No. of Images</label>
          <div className="flex items-center gap-2 w-1/2">
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setCount((c) => Math.max(1, c - 1))}
            >
              −
            </button>
            <span>{count}</span>
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setCount((c) => Math.min(10, c + 1))}
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className={`bg-blue-600 text-white py-2 px-4 rounded w-full mt-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Searching..." : "Search Images"}
        </button>

        {/* Output */}
        {images.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Results (Click to Add)</h4>
            <div className="grid grid-cols-2 gap-2">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="result"
                  onClick={() => handleAddImageToSlide(img)}
                  className="cursor-pointer rounded border"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
