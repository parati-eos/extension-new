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
  import ChartIcon from "../../assets/ci_chart-line.png"
  import SlideNarrativeIcon from "../../assets/slide-narrative.png";
  import QuickGenerateIcon from "../../assets/quick-generate.png";
  import TimelineIcon from "../../assets/timeline.png";
  import ImagesIcon from "../../assets/Images.png";
  import TableIcon from "../../assets/table.png";
  import PeopleIcon from "../../assets/people.png";
  import StatisticsIcon from "../../assets/statistics.png";
  import GraphsIcon from "../../assets/graphs.png";
  import BarIcon from "../../assets/uis_graph-bar.png";
  import PieIcon from "../../assets/flowbite_chart-pie-solid.png";
  import "./viewpresentation.css";
  import { FaImage, FaBullseye } from 'react-icons/fa'
  
  export default function Graphs() {
    
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

        <div className="w-full mt-[4rem] sm:mt-[4rem] lg:mt-2 bg-white lg:shadow-lg lg:max-w-4xl lg:w-[800px] lg:h-[600px] lg:rounded-3xl lg:flex lg:flex-col  lg:items-end  lg:p-4 lg:sm:p-8 lg:mx-auto ">
        <div className="w-[95%]  flex justify-between lg:mb-20">
      <div className="flex flex-col gap-2 mt-3">
          
                    <h2 className="text-l text-[#091220] w-[17rem] font-light ml-10 lg:ml-0 mt-20 ">
                    Select chart type
                    </h2>



  </div>
        <button
                type="button"
               
                className="hidden lg:block px-6 py-2 h-[3.3rem] lg:h-[2.7rem] border border-[#8A8B8C] hover:bg-[#3667B2] hover:border-[#2d599c] hover:text-white  rounded-md transition  text-[#797C81] mr-5 mt-5 "
              >
                Back
              </button>
              </div>
              <div
            
            
          >
          
               
                    
                    <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 mt-4 mr-5">
                      <div className="flex flex-col items-center lg:border  border-gray-300 h-fit w-fit px-12 py-4 rounded-md">
                        <img
                          src={ChartIcon}
                          alt="ChartIcon"
                          className="h-16 w-16"
                        />
                        <span>Points</span>
                      </div>
                      <div className="flex flex-col items-center lg:border  border-gray-300 h-fit w-fit px-12 py-4 rounded-md">
                        <img
                          src={BarIcon}
                          alt="BarIcon"
                          className="h-16 w-16"
                        />
                        <span>Bar</span>
                      </div>
                      <div className="flex flex-col items-center lg:border  border-gray-300 h-fit w-fit px-12 py-4 rounded-md">
                        <img
                          src={PieIcon}
                          alt="ChartIcone"
                          className="h-16 w-16"
                        />
                        <span>Pie</span>
                      </div>
                     
                    </div>
                    
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
  }
  
  