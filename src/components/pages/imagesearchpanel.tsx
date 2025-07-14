// 👇 Updated ImageSearchPanel with dynamic credit deduction based on count
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaCoins } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [credits, setCredits] = useState<number>(0);
  const [planName, setPlanName] = useState("free");

  const navigate = useNavigate();
  const userID = sessionStorage.getItem("userEmail") || "";
  const orgID = sessionStorage.getItem("orgId") || "";
  const documentID = sessionStorage.getItem("presentationId") || "";
  const authToken = sessionStorage.getItem("authToken");

  const fetchCredits = async () => {
    if (!orgID || !authToken) return;
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/${orgID}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
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
    fetchCredits();
  }, [authToken, orgID]);

  const refreshCredits = async () => {
    await fetchCredits();
    toast.success("Credits refreshed");
  };

  const isAllowedToSearch = planName !== "free" || credits >= 2;

  const handleUpgrade = () => {
    const query = new URLSearchParams({
      authToken: authToken || "",
      userEmail: userID || "",
      orgId: orgID || "",
    });
    window.open(`/pricing?${query.toString()}`, "_blank", "noopener,noreferrer");
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term.");
      return;
    }

    if (!userID || !orgID || !documentID || !authToken) {
      toast.error("Missing session or authentication data.");
      return;
    }

    const creditsToDeduct = count * 2;
    if (planName === "free" && credits < creditsToDeduct) {
      toast.error(`You need at least ${creditsToDeduct} credits to search ${count} image(s).`);
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

        if (planName === "free") {
          const newCredits = credits - creditsToDeduct;
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
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 font-medium"
        >
          <FaArrowLeft /> Search Images
        </button>
        <button className="text-gray-500 font-semibold">✕</button>
      </div>

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
            >−</button>
            <span>{count}</span>
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setCount((c) => Math.min(10, c + 1))}
            >+</button>
          </div>
        </div>

        <div className="relative w-full mt-2">
          <button
            onClick={handleSearch}
            disabled={loading || !isAllowedToSearch}
            className={`relative bg-blue-600 text-white font-semibold py-4 px-4 w-full rounded-lg text-center transition-all ${
              loading || !isAllowedToSearch
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Searching..." : "Search Images"}
            {planName === "free" && (
              <div className="absolute top-0 right-0 bg-[#091220] text-white text-xs px-2 py-1 rounded-tr-lg rounded-bl-lg flex items-center gap-1">
                <FaCoins className="text-yellow-400 text-sm" />
                {count * 2} Credits
              </div>
            )}
          </button>

          {planName === "free" && (
            <div className="flex flex-col mt-2 text-sm text-gray-700 gap-1">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <FaCoins className="text-yellow-400" />
                  Credits Available: {credits}
                </span>
                <button
                  className="text-blue-600 font-medium flex items-center gap-1"
                  onClick={handleUpgrade}
                >
                  Get More Credits <span>→</span>
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