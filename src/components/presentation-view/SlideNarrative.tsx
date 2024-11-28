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
  
  export default function SlideNarrative() {
    
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
  
        <div className="w-full mt-[4rem] sm:mt-[4rem] lg:mt-2 bg-white lg:shadow-lg lg:max-w-4xl lg:w-[800px] lg:h-[600px] lg:rounded-3xl lg:flex lg:flex-col lg:justify-center lg:items-center lg:p-4 lg:sm:p-8 lg:mx-auto ">
          <div className="w-[95%] hidden lg:flex justify-between mb-20">
          <div className="flex flex-col gap-2">
          <h2 className="text-xl text-[#091220] w-[17rem] font-bold">
                      Cover
                    </h2>



  </div>
        <button
                type="button"
               
                className="px-6 py-2 h-[3.3rem] lg:h-[2.7rem] border border-[#8A8B8C] hover:bg-[#3667B2] hover:border-[#2d599c] hover:text-white  rounded-md transition  text-[#797C81]   "
              >
                Back
              </button>
              </div>
        <div className="ml-3 lg:ml-0 w-[95%] mt-[0.5rem] lg:mt-0  border border-gray-300 rounded-xl p-4 h-72 flex flex-col justify-center items-center md:transition-transform md:transform md:hover:scale-105 mb-5 lg:mb-16">
  
        <textarea className='w-full h-full outline-none'placeholder="Please provide some context and narrative to generate this slide."></textarea>
        {/* Main Content */}
       
        <div
        
        
        className="flex flex-col items-center ">
  
            
              
              
            </div>
           
            
            </div>
            <div className="ml-3 lg:ml-0 flex gap-2 justify-center  lg:justify-end w-[95%] mb-5 lg:mb-0  ">
            <button 
                type="button"
               
                className="w-full flex  items-center justify-around lg:justify-center py-2 h-[2.7rem]  lg:w-[30%] lg:py-6 lg:h-[2.7rem] border border-[#8A8B8C] hover:bg-[#3667B2] hover:border-[#2d599c] hover:text-white  rounded-md  transition  text-[#797C81]   "
              >
                <FaPaperclip className="h-4 w-4"/>
               <span>Attach Image</span> 
              </button>
              <button
                type="button"
               
                className="w-full px-6 py-2 h-[2.7rem] lg:h-[3.1rem] border border-[#8A8B8C] lg:w-[30%]   bg-[#3667B2] hover:bg-white hover:border-[#797C81] hover:text-[#797C81] rounded-md transition  text-white   "
              >
                Generate Slide
              </button>
              
              </div>
          </div>
 
          <button
                type="button"
               
                className="px-5 py-2 mt-4 lg:hidden h-[2.7rem] w-[4.625rem] border border-[#8A8B8C] hover:bg-[#3667B2] hover:border-[#2d599c] hover:text-white  rounded-md transition  text-[#797C81]  "
              >
                Back
              </button>
          </div>
    
          
    
    );
  }
  
  