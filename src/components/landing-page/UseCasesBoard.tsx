import React from "react";
import revisionloop from '../../assets/revision-loop.png'
import fragmented from '../../assets/fragmented-storytelling.png'
import statics from '../../assets/static-content.png'
import analytics from '../../assets/analytics.png'
import beforezynth from '../../assets/board-before.png'
import bullet from '../../assets/Group 596.png'
import arrows from '../../assets/arrows.png'
import arrowblue from '../../assets/arrowblue.png'
import imageleft from '../../assets/BOARD1.png'
import imageright from '../../assets/BOARD2.png'
import image1 from '../../assets/board-center.png'
import { useNavigate } from "react-router-dom";
const UseCasesBoard: React.FC = () => {
   const navigate = useNavigate();
  return (
    <div className="bg-gray-50 text-[#101828] p-2 md:p-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl text-[#101828]  font-bold mb-4">
        Impress Your Board with AI-Powered <br/>
          <span className="text-[#3667B2]"> Insight-Driven Presentations


          </span>
        </h1>
        <p className="text-lg font-medium p-6">
        Deliver clear, data-rich presentations that combine strategic <br/> insights with professional design—crafted effortlessly with Zynth.



        </p>
        <div className="p-4">
        <button 
        
        onClick={() => navigate("/contact-us")}
        className="bg-[#3667B2] text-white px-6 py-3 rounded-lg text-base font-normal hover:bg-[#2c56a0] transition">
        Automate Your Board Meetings Now 
        </button>
        </div>
       
      </section>
      
      {/* How Zynth Solves Challenges */}
      <section className="mt-16 bg-white px-6 py-12 rounded-lg shadow-lg w-full mx-auto">
        <div className="mb-8">
        <p className="text-2xl text-[#101828] font-bold text-center ">
          How Zynth 
        </p>

        <p className="text-2xl  font-bold text-center  text-[#3667B2] ">
        Solves Board Presentation Challenges


        </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="text-center">
            <img src={revisionloop} alt="Endless Revision Loop" className="mx-auto mb-4 w-14 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Data Overload</h3>
            <p className="text-gray-700 mt-2">Difficulty in transforming complex financial and strategic   <br/>data into clear, digestible insights.

            </p>
          </div>
          <div className="text-center">
            <img src={fragmented} alt="Fragmented Storytelling" className="mx-auto mb-4 w-14 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Ambiguous Messaging</h3>
            <p className="text-gray-700 mt-2"> Challenges in crafting a clear narrative <br/> that resonates with board members.


            </p>
          </div>
          <div className="text-center">
            <img src={statics} alt="Static Content Issue" className="mx-auto mb-4 w-14 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Time Constraints</h3>
            <p className="text-gray-700 mt-2">Manual slide creation delays <br/>crucial decision-making processes.


            </p>
          </div>
          <div className="text-center">
            <img src={analytics} alt="Lack of Insightful Analytics" className="mx-auto mb-4 w-18 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Inconsistent Branding</h3>
            <p className="text-gray-700 mt-2"> A disjointed look that undermines the  <br/> professional tone required for board-level communications.


            </p>
          </div>
        </div>
      </section>
      
{/* Before & After Section */}
<section className="mt-16 text-center max-w-5xl mx-auto">

  <p className="text-2xl font-bold text-[#101828] mb-8">
    The Power of AI-Driven  Board Presentations
  </p>

  {/* Images & Arrows Container */}
  <div className="relative flex items-center justify-center gap-16">
    {/* Before Zynth */}
    <div className="flex-1 text-center">
      <img src={beforezynth} alt="Before Zynth" className="mx-auto w-80 h-42" />
    </div>

    {/* Arrows (Fixed Positioning) */}
    <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
      <img src={arrowblue} alt="Arrow 1" className="w-6 h-auto" />
      <img src={arrows} alt="Arrow 2 (Black)" className="ml-4 w-8 h-auto" />
      <img src={arrowblue} alt="Arrow 3" className="w-6 h-auto" />
    </div>

    {/* After Zynth */}
    <div className="flex-1 text-center">
      <img src="https://zynthimage.s3.us-east-1.amazonaws.com/uploads/ezgif.com-animated-gif-maker+(1).gif" alt="After Zynth" className="mx-auto w-80 h-42 lg:w-96 lg:h-56 " />
    </div>
  </div>

  {/* Separate Text (To Avoid Affecting Arrow Alignment) */}
  <div className="grid md:grid-cols-2 gap-8 mt-6">
    <div className="text-center">

      <p className="text-gray-700 mt-2 px-4">
      A cluttered, disorganized presentation with raw data,  <br/>inconsistent formatting, and a lack of clear insights.



      </p>
    </div>

    <div className="text-center">
   
      <p className="text-gray-700 mt-2 px-4">
      A streamlined, professional board deck that  <br/> delivers actionable insights through clear data visualizations and a cohesive 
    narrative—all generated in 


      <br/>  minutes.
      </p>
    </div>
  </div>
</section>
<section className="w-full  mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Heading */}
      <h2 className="text-center text-3xl font-bold text-gray-900">
        Why Zynth is the <br />
        <span className="text-[#3667B2]">Ultimate Solution for Product Deck</span>
      </h2>
      <div className="flex justify-center lg:justify-between items-center  mt-16 px-6">
  {/* Left Image with Ellipse */}
  <div className="flex flex-col items-center">
    <div className="w-70 h-40 bg-gray-200 rounded-xl shadow-lg"
 
    >
        <img src={imageleft} alt="Image 1" className="w-full h-full object-cover rounded-xl" />
      {/* Placeholder for Image 1 */}
    </div>
    
  </div>

  {/* Center Image (Highlighted) with Ellipse */}
  <div className="hidden md:flex flex-col items-center "
    
    >
      <div className="w-96 h-80  flex items-center justify-center space-x-4"
      
      >
        <img src={image1} alt="Image 1" className="w-full h-full object-contain rounded-xl" />
        
      </div>
    </div>


  {/* Right Image with Ellipse */}
  <div className="hidden md:flex flex-col items-center"

  >
    <div className="w-70 h-40 bg-gray-200 rounded-xl shadow-lg"
    
    
    >
    <img src={imageright} alt="Image 1" className="w-full h-full object-cover rounded-xl" />
      {/* Placeholder for Image 3 */}
    </div>
    
  </div>
</div>



      <section className="w-full max-w-7xl mx-auto  bg-white ">
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6  border-gray-300 pt-12">
        {/* Feature 1 */}
        <div className="flex flex-col items-center lg:border-r text-center px-4">
          <h3 className="text-lg font-semibold text-[#3667B2]">
          AI-Powered Data Visualization
          </h3>
          <p className="text-gray-700 mt-2">
          Automatically converts complex data into clear, impactful charts and graphics.



          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center lg:border-r text-center px-4">
          <h3 className="text-lg font-semibold text-[#3667B2]">
          Pre-Approved Templates
          </h3>
          <p className="text-gray-700 mt-2">
          Ensures a consistent, on-brand  look and feel across every slide.


          <br/> 
        
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center lg:border-r text-center px-4">
          <h3 className="text-lg font-semibold text-[#3667B2]">
          Smart Customization
          </h3>
          <p className="text-gray-700 mt-2">
          Adapts the presentation to your board’s specific strategic and communication needs.



          </p>
        </div>

        {/* Feature 4 */}
        <div className="flex flex-col items-center lg:border-r text-center px-4">
          <h3 className="text-lg font-semibold text-[#3667B2]">
          Smart Visual Curation
          </h3>
          <p className="text-gray-700 mt-2">
          AI suggests the right balance of text  and visuals,  avoiding cluttered slides or overwhelming data.
          </p>
        </div>
      </div>
    </section>

    

    
    </section>
    <div className="flex items-center justify-center bg-gray-100 px-2 py-16">
  <div className="w-full mx-auto flex flex-col gap-32 lg:flex-row items-center">
    {/* Left: Image Section */}
    <div className="flex justify-center lg:w-1/2 mb-10 lg:mb-0">
      <img src="https://zynthimage.s3.amazonaws.com/uploads/1740518849886_businessman-discussing-white-board-with-colleague.jpg" alt="Zynth Benefits" className="w-full max-w-md object-contain" />
    </div>

    {/* Right: Text Section */}
    <div className="lg:w-1/2 text-center lg:text-left">
      <h2 className="text-4xl font-bold text-[#101828]">
        Who <span className="text-[#3667B2]">Benefits from </span>
        <span className="text-[#101828]">Zynth?</span>
      </h2>
      <p className="text-lg font-semibold text-[#3667B2] mt-2">
        Tailored for High-Performance Board Teams
      </p>

      <p className="text-base font-bold text-gray-800 mt-6 ">
        Designed for Enterprise Board Teams that:
      </p>

      {/* Benefits List */}
      <ul className="mt-6 space-y-5 text-left">
        {[
      "Quickly adopt a solution that presents strategic insights and performance <br/> updates in a clear, professional manner.",
      " Transform complex financial data into visually compelling,easy-to-understand charts.",
      "Receive concise, actionable information that supports informed decision-making.",
      "Enhance board meetings with data-driven presentations  that align   with strategic objectives.",
        ].map((benefit, index) => (
          <li key={index} className="flex items-center space-x-4 text-gray-800">
            {/* Bullet Point Image */}
            <img src={bullet} alt="Bullet Icon" className="w-8 h-8 object-contain" />
            {/* Text */}
            <p dangerouslySetInnerHTML={{ __html: benefit }} />
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>
   

      {/* CTA Section */}
      <section
      className="w-full py-16 mt-8 p-2 bg-cover bg-center flex flex-col items-center text-center"
      style={{ backgroundImage: "url('/dealbg.png')" }}
    >
      <h2 className="text-3xl font-bold text-gray-900">
        READY TO <br />
        <span className="text-[#3667B2]">Elevate Your Board Meetings?        </span>
      </h2>
      <button 
      
      onClick={() => navigate("/contact-us")}
      className="mt-6 bg-[#3667B2] text-white px-12 py-3 rounded-lg font-semibold hover:bg-[#2c56a0] transition">
      Start Crafting Your Board Presentation Today

      </button>
    </section>



    </div>
  );
};

export default UseCasesBoard;
