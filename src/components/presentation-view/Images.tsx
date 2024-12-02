import React, { useEffect, useState } from "react";
import Imagelogo from "../../assets/imagelogo.png";
import uploadLogoToS3 from "../../utils/uploadLogoToS3";

interface LogoFormProps {
  onContinue: (data: { logos: string[] }) => void;
  onBack: () => void;
  initialData: string[] | null;
}

const LogoForm: React.FC<LogoFormProps> = ({ onContinue, onBack, initialData }) => {
  const [logos, setLogos] = useState<string[]>(initialData || []);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setLogos(initialData);
    }
  }, [initialData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const files = e.target.files;
    if (files) {
      setIsUploading(true);

      try {
        const urls = await Promise.all(
          Array.from(files).map((file) => uploadLogoToS3(file))
        );

        if (index !== undefined) {
          setLogos((prev) => {
            const updatedLogos = [...prev];
            updatedLogos[index] = urls[0];
            return updatedLogos;
          });
        } else {
          setLogos((prev) => [...prev, ...urls]);
        }
      } catch (error) {
        console.error("Error uploading logo:", error);
        alert("Failed to upload the image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (logos.length > 0) {
      onContinue({ logos });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-[#F5F7FA] h-[100vh]">
      <div className="w-full mt-[4rem] sm:mt-[4rem] lg:mt-2 bg-white lg:bg-white lg:shadow-lg lg:max-w-4xl lg:w-[800px] lg:h-[600px] lg:rounded-3xl lg:flex lg:flex-col lg:justify-between lg:items-center lg:p-4 lg:sm:p-8 lg:mx-auto">
        <div className="flex  mb-10 w-full justify-around">
          <div className="flex flex-col gap-2 mb-40">
            <p className="hidden font-bold break-words">Images</p>
            <input className="text-2xl w-[17rem]" placeholder="Type slide name" />
            
            {/* Image Uploader and Rendered Images Section - 4-Column Grid Layout */}
            <div className="grid grid-cols-4 gap-x-12 gap-y-5 mt-5 w-full">
              {/* Render uploaded images */}
              {logos.map((logo, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center flex-shrink-0"
                  style={{ width: "150px", height: "100px" }}
                >
                  <img
                    src={logo}
                    alt={`Uploaded Logo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {/* Upload Section */}
              <div
  className="flex flex-col items-center flex-shrink-0 lg:hidden "
  style={{ width: "500px", height: "100px" }}
>

<button
  className="w-full"
  onClick={() => document.getElementById("imageInput")?.click()}
>
  <div
    className="flex hidden lg:flex w-full h-full border border-gray-300 rounded-xl p-4 flex-col justify-center items-center md:transition-transform md:transform md:hover:scale-105"
  >
    <img src={Imagelogo} className="text-gray-500 text-2xl mb-2" />
    <p className="text-gray-500 mb-2">
      {isUploading ? "Uploading..." : "Select or drag image(s)"}
    </p>
   
  </div>
  
</button>

<button
  className="w-full"
  onClick={() => document.getElementById("imageInput")?.click()}
>
  <div
    className="lg:hidden ml-2 w-full h-full border border-gray-300 p-4 flex md:flex-col lg:flex-col rounded-xl justify-between items-center md:transition-transform md:transform md:hover:scale-105"
  >
    <div className="flex gap-2">
    <img src={Imagelogo} className="text-gray-500 text-2xl mb-2 " />
    <p className="text-gray-500 mt-4" >
      {isUploading ? "Uploading..." : "Upload Image(s)"}
    </p>
    </div>
    <button
              type="button"
              className="  px-4 py-2  font-semibold  text-[#3667B2] hover:bg-[#3667B2] hover:border-none hover:text-white transition "
            >
              <span className="lg:hidden">Upload</span>
            </button>
  </div>
</button>

  <input
    type="file"
    id="imageInput"
    className="hidden"
    accept="image/*"
    onChange={(e) => handleFileChange(e)} // Append to the right
    multiple
  />
</div>
<div
  className="hidden lg:flex flex-col items-center flex-shrink-0  "
  style={{ width: "180px", height: "100px" }}
>


<button
  className="w-full"
  onClick={() => document.getElementById("imageInput")?.click()}
>
  <div
    className="flex hidden lg:flex w-full h-full border border-gray-300 rounded-xl p-4 flex-col justify-center items-center md:transition-transform md:transform md:hover:scale-105"
  >
    <img src={Imagelogo} className="text-gray-500 text-2xl mb-2" />
    <p className="text-gray-500 mb-2">
      {isUploading ? "Uploading..." : "Select or drag image(s)"}
    </p>
   
  </div>
  
</button>

<button
  className="w-full"
  onClick={() => document.getElementById("imageInput")?.click()}
>
  <div
    className="lg:hidden ml-2 w-full h-full border border-gray-300 p-4 flex md:flex-col lg:flex-col rounded-xl justify-center items-center md:transition-transform md:transform md:hover:scale-105"
  >
    <img src={Imagelogo} className="text-gray-500 text-2xl mb-2 " />
    <p className="text-gray-500 mb-2">
      {isUploading ? "Uploading..." : "Upload Image(s)"}
    </p>
    <button
              type="button"
              className="  px-4 py-2 border font-semibold rounded-xl text-gray-500 hover:bg-[#3667B2] hover:border-none hover:text-white transition "
            >
              <span className="lg:hidden">Upload</span>
            </button>
  </div>
</button>

  <input
    type="file"
    id="imageInput"
    className="hidden"
    accept="image/*"
    onChange={(e) => handleFileChange(e)} // Append to the right
    multiple
  />
</div>

            </div>
          </div>

          <button
            onClick={onBack}
            type="button"
            className="hidden px-3 py-1 h-[3.3rem] lg:h-[2.7rem] border border-[#8A8B8C] hover:bg-[#3667B2] hover:border-[#2d599c] hover:text-white rounded-md transition text-[#797C81] mb-3"
          >
            Back
          </button>
        </div>

        <div className="flex gap-3 justify-end lg:justify-start w-full">
          {/* Generate Slide Button */}
          <button
            onClick={handleSubmit}
            type="button"
            className="px-6 py-2 mb-2 mr-2 h-[3.3rem] lg:h-[2.7rem] border border-[#8A8B8C] bg-[#3667B2] hover:bg-white hover:border-[#797C81] hover:text-[#797C81] rounded-md transition text-white ml-10"
          >
            Generate Slide
          </button>
        </div>
      </div>
      <button
                type="button"
               
                className="px-5 py-2 mt-4 lg:hidden h-[2.7rem] w-[4.625rem] border border-[#8A8B8C] hover:bg-[#3667B2] hover:border-[#2d599c] hover:text-white  rounded-md transition  text-[#797C81] ml-2 "
              >
                Back
              </button>
    </div>
  );
};

export default LogoForm;
