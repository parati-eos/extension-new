
  import React, { useEffect, useState } from 'react'
  import ChartIcon from "../../../assets/ci_chart-line.png"
  import BarIcon from "../../../assets/uis_graph-bar.png";
  import PieIcon from "../../../assets/flowbite_chart-pie-solid.png";
  
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
   
     
              
      <div className="flex flex-col lg:flex-row bg-[#F5F7FA] h-full w-full">
        

        <div className="w-full h-full bg-white  lg:flex lg:flex-col   lg:p-4 lg:sm:p-8 lg:mx-auto   ">
        <p className=" hidden lg:block font-bold break-words">Graphs</p>
        <div className="w-full  flex justify-between ">
      <div className="flex flex-col gap-2 mt-3">
          
                   



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
           <h2 className="text-l text-[#091220] w-[17rem] font-light  ml-2 mt-24 ">
                    Select chart type
                    </h2>
               
                    
                    <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 mt-4 mr-5 ml-2 ">
                      <div className="flex flex-col items-center border  border-gray-300 h-fit w-fit px-12 py-4 rounded-md">
                        <img
                          src={ChartIcon}
                          alt="ChartIcon"
                          className="h-16 w-16"
                        />
                        <span>Points</span>
                      </div>
                      <div className="flex flex-col items-center border  border-gray-300 h-fit w-fit px-12 py-4 rounded-md">
                        <img
                          src={BarIcon}
                          alt="BarIcon"
                          className="h-16 w-16"
                        />
                        <span>Bar</span>
                      </div>
                      <div className="flex flex-col items-center border  border-gray-300 h-fit w-fit px-12 py-4 rounded-md">
                        <img
                          src={PieIcon}
                          alt="ChartIcone"
                          className="h-16 w-16"
                        />
                        <span>Pie</span>
                      </div>
                     
                    </div>
                    
                  </div>
                  <div className="flex gap-3 justify-end w-full mt-20">
          {/* Generate Slide Button */}
          <button
         
            type="button"
            className="px-6 py-2 mb-2 mr-2 h-[3.3rem] lg:h-[2.7rem] mt-24 border border-[#8A8B8C] bg-[#3667B2] hover:bg-white hover:border-[#797C81] hover:text-[#797C81] rounded-md transition text-white ml-10"
          >
            Generate Slide
          </button>
        </div>
              </div>
             
         
          </div>
          
              
         
          
          
         
          
    
    );
  }
  
  