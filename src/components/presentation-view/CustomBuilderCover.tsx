import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaDownload,
  FaPlus,
  FaShare,
  FaTrash,
  FaPaperclip
} from "react-icons/fa";
import React, { useEffect, useState } from 'react'
import CustomBuilderIcon from "../../assets/custom-builder.png";
import SlideNarrativeIcon from "../../assets/slide-narrative.png";
import QuickGenerateIcon from "../../assets/quick-generate.png";
import "./viewpresentation.css";
import { FaImage, FaBullseye } from 'react-icons/fa'

export default function CustomBuilderCover() {
  
  const [logo, setLogo] = useState<string | null>()
  const [isUploading, setIsUploading] = useState(false)
  // Navbar actions (for demonstration purposes)
  const handleShare = () => {
    alert("Share functionality triggered.");
  };

  const handleDownload = () => {
    alert("Download functionality triggered.");
  };

  return (
 
   
            
    <div className="flex flex-col lg:flex-row bg-[#F5F7FA] h-[100vh]">
      
      {/* Navbar */}
      <div className="hidden lg:flex lg:w-full lg:absolute lg:left-0 lg:pl-8 lg:pr-8 lg:pt-4">
        <div className="flex items-center gap-8 w-full">
         
          <div className="flex gap-2">
          
           
           
              
     
          </div>
        </div>
      </div>

      <div className="w-full mt-[4rem] sm:mt-[4rem] lg:mt-2 lg:bg-white lg:shadow-lg lg:max-w-4xl lg:w-[800px] lg:h-[600px] lg:rounded-3xl lg:flex lg:flex-col lg:justify-center lg:items-center lg:p-4 lg:sm:p-8 lg:mx-auto ">
        <div className="flex gap-x-80 mb-10">
        <div className="flex flex-col gap-2">
       
      <input className="font-semibold break-words" placeholder="Cover">
</input>
<input className="text-2xl w-[17rem]" placeholder="Enter Presentation Name">
</input>
</div>
      <button
              type="button"
             
              className="px-6 py-2 h-[3.3rem] lg:h-[2.7rem] border border-[#8A8B8C] hover:bg-[#3667B2] hover:border-[#2d599c] hover:text-white  rounded-md transition  text-[#797C81]   "
            >
              Back
            </button>
            </div>
      <div className="w-[95%] mt-[0.5rem] lg:mt-0  border border-gray-300 rounded-xl p-4 h-72 flex flex-col justify-center items-center md:transition-transform md:transform md:hover:scale-105 mb-16">

  
      {/* Main Content */}
      <div className="flex flex-col items-center ">
    
            {logo ? (
              <img
                src={logo}
                alt="Uploaded Logo"
                className="w-24 h-24 lg:w-48 lg:h-48 object-contain mb-4"
              />
            ) : (
              <>
                <FaImage className="text-gray-500 text-4xl mb-4" />
                <p className="text-gray-500 mb-4">
                  {isUploading
                    ? 'Uploading...'
                    : 'Select or drag to upload your logo'}
                </p>
              </>
            )}
            <button
              type="button"
              className="px-4 py-2 border font-semibold rounded-xl text-gray-500 hover:bg-[#3667B2] hover:border-none hover:text-white transition "
            >
              {logo ? 'Upload Again' : 'Upload Logo'}
            </button>
            
            
          </div>
         
          
          </div>
          <div className="flex gap-3 justify-end lg:justify-end w-full">
          <button 
              type="button"
             
              className="flex  items-center px-6 py-2 h-[3.3rem] lg:h-[2.7rem] border border-[#8A8B8C] hover:bg-[#3667B2] hover:border-[#2d599c] hover:text-white  rounded-md  transition  text-[#797C81]   "
            >
              <FaPaperclip className="h-4 w-4"/>
             <span>Attach Image</span> 
            </button>
            <button
              type="button"
             
              className="px-6 py-2 h-[3.3rem] lg:h-[2.7rem] border border-[#8A8B8C] bg-[#3667B2] hover:bg-white hover:border-[#797C81] hover:text-[#797C81] rounded-md transition  text-white   "
            >
              Generate Slide
            </button>
            
            </div>
        </div>
       
        </div>
  
        
  
  );
}

