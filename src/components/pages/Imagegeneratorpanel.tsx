import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

interface Props {
  onBack: () => void;
}

export default function ImageGeneratorPanel({ onBack }: Props) {
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("vector"); // default is vector, shown as "auto"
  const [effect, setEffect] = useState("auto");
  const [size, setSize] = useState("Square (1x1)");
  const [count, setCount] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please provide an image description.");
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
          userID,
          orgID,
          documentID,
          type: "generate",
          description,
          style,
          effect,
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
        toast.success("Images generated successfully!");
      } else {
        toast.error("No images returned.");
      }
    } catch (err) {
      toast.error("Failed to generate images.");
      console.error("Image generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddImageToSlide = (url: string) => {
    window.parent.postMessage({ type: "insertImage", imageUrl: url }, "*");
    toast.success("Image added to slide!");
  };

  const styleOptions = [
    { label: "auto", value: "auto" },
    { label: "photo", value: "photo" },
    { label: "digital-art", value: "digital-art" },
    { label: "3d", value: "3d" },
    { label: "painting", value: "painting" },
    { label: "low-poly", value: "low-poly" },
    { label: "pixel-art", value: "pixel-art" },
    { label: "anime", value: "anime" },
    { label: "cyberpunk", value: "cyberpunk" },
    { label: "comic", value: "comic" },
    { label: "vintage", value: "vintage" },
    { label: "cartoon", value: "cartoon" },
    { label: "vector", value: "vector" },
    { label: "studio-shot", value: "studio-shot" },
    { label: "dark", value: "dark" },
    { label: "sketch", value: "sketch" },
    { label: "mockup", value: "mockup" },
    { label: "2000s-pone", value: "2000s-pone" },
    { label: "70s-vibe", value: "70s-vibe" },
    { label: "watercolor", value: "watercolor" },
    { label: "art-nouveau", value: "art-nouveau" },
    { label: "origami", value: "origami" },
    { label: "surreal", value: "surreal" },
    { label: "fantasy", value: "fantasy" },
    { label: "traditional-japan", value: "traditional-japan" }
  ];

  return (
    <div className="p-4 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 font-medium"
        >
          <FaArrowLeft /> Generate Images
        </button>
        <button className="text-gray-500 font-semibold">✕</button>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <textarea
          placeholder="Image Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-2 py-2 h-24"
        />

        <div className="flex justify-between items-center">
          <label className="w-1/2">Image Style</label>
          <select
            className="w-1/2 border rounded px-2 py-1"
            value={style === "vector" ? "auto" : style}
            onChange={(e) => {
              const val = e.target.value;
              setStyle(val === "auto" ? "vector" : val);
            }}
          >
            {styleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between items-center">
          <label className="w-1/2">Styling Effects</label>
          <select
            className="w-1/2 border rounded px-2 py-1"
            value={effect}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "auto") {
                setEffect("vibrant");
              } else {
                setEffect(val);
              }
            }}
          >
            {[
              "auto", "b&w", "pastel", "sepia", "dramatic", "vibrant",
              "orange&teal", "film-filter", "split", "electric", "pastel-pink",
              "gold-glow", "autumn", "muted-green", "deep-teal", "duotone",
              "terracotta&teal", "red&blue", "cold-neon", "burgundy&blue"
            ].map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>

        <div className="flex justify-between items-center">
          <label className="w-1/2">Image Size</label>
          <select
            className="w-1/2 border rounded px-2 py-1"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            {[
              "Square (1x1)",
              "Social Story (9x16)",
              "Widescreen (16x9)",
              "Traditional (3x4)",
              "Classic (4x3)"
            ].map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className="w-1/2">No. of Images</label>
          <div className="flex items-center gap-2 w-1/2">
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setCount(c => Math.max(1, c - 1))}
            >−</button>
            <span>{count}</span>
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setCount(c => Math.min(4, c + 1))}
            >+</button>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`bg-blue-600 text-white py-2 px-4 rounded w-full mt-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>

        {/* Output */}
        {images.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Generated Images (Click to Add)</h4>
            <div className="grid grid-cols-2 gap-2">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="generated"
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
