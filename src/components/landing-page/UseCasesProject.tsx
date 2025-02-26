import React from "react";
import revisionloop from '../../assets/revision-loop.png'
import fragmented from '../../assets/fragmented-storytelling.png'
import statics from '../../assets/static-content.png'
import analytics from '../../assets/analytics.png'
import beforezynth from '../../assets/project-before.png'
import arrows from '../../assets/arrows.png'
import bullet from '../../assets/Group 596.png'
import arrowblue from '../../assets/arrowblue.png'
import imageleft from '../../assets/PROJECT1.png'
import imageright from '../../assets/PROJECT2.png'
import image1 from '../../assets/proposal-center.png'
import { useNavigate } from "react-router-dom";
const UseCasesProject: React.FC = () => {
    const navigate = useNavigate();
  return (
    <div className="bg-gray-50 text-[#101828] px-4 py-8 md:p-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl text-[#101828]  font-bold mb-4">
        Win Projects with Persuasive <br/>
          <span className="text-[#3667B2]"> AI-Enhanced Proposals

          </span>
        </h1>
        <p className="text-lg font-medium p-6">
        Craft comprehensive, on-brand project proposals that win<br/> client trust and secure projects faster.


        </p>
        <div className="p-4">
        <button 
          onClick={() => navigate("/contact-us")}
        className="bg-[#3667B2] text-white px-6 py-3 rounded-lg text-base font-normal hover:bg-[#2c56a0] transition">
        Automate Your Project Proposals
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
        Solves Product Proposal Challenges

        </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="text-center">
            <img src={revisionloop} alt="Endless Revision Loop" className="mx-auto mb-4 w-14 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Complex Details</h3>
            <p className="text-gray-700 mt-2">Conveying intricate project information  <br/>in a clear, digestible format.
            </p>
          </div>
          <div className="text-center">
            <img src={fragmented} alt="Fragmented Storytelling" className="mx-auto mb-4 w-14 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Time-Consuming Drafting</h3>
            <p className="text-gray-700 mt-2"> Manual creation that  <br/> delays proposal submissions.

            </p>
          </div>
          <div className="text-center">
            <img src={statics} alt="Static Content Issue" className="mx-auto mb-4 w-14 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Inconsistent Formatting</h3>
            <p className="text-gray-700 mt-2">Disjointed layouts that <br/> hurt professional appeal.

            </p>
          </div>
          <div className="text-center">
            <img src={analytics} alt="Lack of Insightful Analytics" className="mx-auto mb-4 w-18 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Lack of Persuasion</h3>
            <p className="text-gray-700 mt-2">Difficulty in demonstrating  <br/> clear value and project benefits.

            </p>
          </div>
        </div>
      </section>
      
{/* Before & After Section */}
<section className="mt-16 text-center max-w-5xl mx-auto">

  <p className="text-2xl font-bold text-[#101828] mb-8">
    The Power of AI-Driven Proposals
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
      <img src="https://zynthimage.s3.amazonaws.com/uploads/1740495806843_ezgif.com-animated-gif-maker%20%282%29.gif" alt="After Zynth" className="mx-auto w-80 h-42" />
    </div>
  </div>

  {/* Separate Text (To Avoid Affecting Arrow Alignment) */}
  <div className="grid md:grid-cols-2 gap-8 mt-6">
    <div className="text-center">
      
      <p className="text-gray-700 mt-2 px-4">
      A raw, disorganized proposal with  <br/>scattered details and inconsistent formatting.


      </p>
    </div>

    <div className="text-center">

      <p className="text-gray-700 mt-2 px-4">
      A polished, cohesive proposal that <br/> clearly communicates project scope, 
      <br/> deliverables, and value—all crafted in 

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
      <div className="flex lg:justify-between justify-center items-center  mt-16 px-6">
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
          AI-Powered Structuring
          </h3>
          <p className="text-gray-700 mt-2">
          Automatically organizes complex  <br/>details into a persuasive narrative.


          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center lg:border-r text-center px-4">
          <h3 className="text-lg font-semibold text-[#3667B2]">
          Pre-Approved Templates
          </h3>
          <p className="text-gray-700 mt-2">
          Maintains consistent branding  -<br/> and a professional layout.

          <br/> 
        
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center lg:border-r text-center px-4">
          <h3 className="text-lg font-semibold text-[#3667B2]">
          Smart Customization
          </h3>
          <p className="text-gray-700 mt-2">
          Adapts to the unique requirements<br/>of each project, ensuring clarity and impact.


          </p>
        </div>

        {/* Feature 4 */}
        <div className="flex flex-col items-center lg:border-r text-center px-4">
          <h3 className="text-lg font-semibold text-[#3667B2]">
          Smart Visual Curation
          </h3>
          <p className="text-gray-700 mt-2">
          AI suggests the right balance of text <br/> and visuals,  avoiding cluttered slides or overwhelming data.
          </p>
        </div>
      </div>
    </section>

    

    
    </section>
    <div className="flex items-center justify-center bg-gray-100 px-2 py-16">
  <div className="w-full mx-auto flex flex-col gap-32 lg:flex-row items-center">
    {/* Left: Image Section */}
    <div className="flex justify-center lg:w-1/2 mb-10 lg:mb-0">
      <img src="https://zynthimage.s3.amazonaws.com/uploads/1740518572169_male-graphic-designer-looking-document.jpg" alt="Zynth Benefits" className="w-full max-w-md object-contain" />
    </div>

    {/* Right: Text Section */}
    <div className="lg:w-1/2 lg:text-left text-center">
      <h2 className="text-4xl font-bold text-[#101828]">
        Who <span className="text-[#3667B2]">Benefits from </span>
        <span className="text-[#101828]">Zynth?</span>
      </h2>
      <p className="text-lg font-semibold text-[#3667B2] mt-2">
        Tailored for High-Performance Project Teams
      </p>

      <p className="text-base font-bold text-gray-800 mt-6 ">
        Designed for Enterprise Project Teams that:
      </p>

      {/* Benefits List */}
      <ul className="mt-6 space-y-5 text-left">
        {[
    "Speed up project proposal creation and improve win rates.",
    " Align project documentation with client expectations seamlessly.",
    "Adopt agile solutions to deliver compelling, professional project <br/> PPTs that win new business.",
    "Maintain consistency and quality across multiple client project <br/>  proposal presentations with minimal effort",
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
      className="w-full py-16 mt-8  bg-cover bg-center flex flex-col items-center text-center"
      style={{ backgroundImage: "url('/dealbg.png')" }}
    >
      <h2 className="text-3xl font-bold text-gray-900">
        READY TO <br />
        <span className="text-[#3667B2]">Secure Your Next Project?
        </span>
      </h2>
      <button 
            onClick={() => navigate("/contact-us")}
      className="mt-6 bg-[#3667B2] text-white px-12 py-3 rounded-lg font-semibold hover:bg-[#2c56a0] transition">
      Start Crafting Your Proposal Now

      </button>
    </section>



    </div>
  );
};

export default UseCasesProject;
