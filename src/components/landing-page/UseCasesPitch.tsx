import React from "react";
import revisionloop from '../../assets/revision-loop.png'
import fragmented from '../../assets/fragmented-storytelling.png'
import statics from '../../assets/static-content.png'
import analytics from '../../assets/analytics.png'
import beforezynth from '../../assets/pitch-before.png'
import arrows from '../../assets/arrows.png'
import arrowblue from '../../assets/arrowblue.png'
import bullet from '../../assets/Group 596.png'
import imageleft from '../../assets/PITCH1.png'
import imageright from '../../assets/PITCH2.png'
import image1 from '../../assets/pitch-center.png'
import { useNavigate } from "react-router-dom";

const UseCasesPitch: React.FC = () => {
   const navigate = useNavigate();
  return (
    <div className="bg-gray-50 text-[#101828] px-4 py-8 md:p-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl text-[#101828]  font-bold mb-4">
        Win Investors with Persuasive, <br/>
          <span className="text-[#3667B2]"> AI-Enhanced Pitch Decks

          </span>
        </h1>
        <p className="text-lg font-medium p-6">
        Craft a compelling narrative and secure funding faster<br/> with on-brand, investor-ready business pitch deck.


        </p>
        <div className="p-4">
        <button 
              onClick={() => navigate("/contact-us")}
        className="bg-[#3667B2] text-white px-6 py-3 rounded-lg text-base font-normal hover:bg-[#2c56a0] transition">
        Get Your Pitch Deck!
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
        Solves Pitch Deck Challenges

        </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="text-center">
            <img src={revisionloop} alt="Endless Revision Loop" className="mx-auto mb-4 w-14 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Investor Fatigue </h3>
            <p className="text-gray-700 mt-2">Overloading slides with excessive data <br/>instead of keeping them crisp and compelling.
            </p>
          </div>
          <div className="text-center">
            <img src={fragmented} alt="Fragmented Storytelling" className="mx-auto mb-4 w-14 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Weak Problem-Solution Fit </h3>
            <p className="text-gray-700 mt-2"> Failing to clearly establish why the problem, <br/>  is urgent and why this solution is the best.
            </p>
          </div>
          <div className="text-center">
            <img src={statics} alt="Static Content Issue" className="mx-auto mb-4 w-14 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Scalability Proof Missing</h3>
            <p className="text-gray-700 mt-2">Not demonstrating how the business <br/> can grow beyond early traction.

            </p>
          </div>
          <div className="text-center">
            <img src={analytics} alt="Lack of Insightful Analytics" className="mx-auto mb-4 w-18 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Unclear Ask</h3>
            <p className="text-gray-700 mt-2"> Vague funding requirements or lack of clarity <br/> on how funds will be utilized effectively.

            </p>
          </div>
        </div>
      </section>
      
{/* Before & After Section */}
<section className="mt-16 text-center max-w-5xl mx-auto">
  <p className="text-2xl font-bold text-[#101828] mb-8">
    The Power of AI-Driven Pitch Decks
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
      <img src="https://zynthimage.s3.us-east-1.amazonaws.com/uploads/ezgif.com-animated-gif-maker+(6).gif" alt="After Zynth" className="mx-auto w-80 h-42" />
    </div>
  </div>

  {/* Separate Text (To Avoid Affecting Arrow Alignment) */}
  <div className="grid md:grid-cols-2 gap-8 mt-6">
    <div className="text-center">

      <p className="text-gray-700 mt-2 px-4">
      An investor pitch deck  with inconsistent<br/>design and messaging

      </p>
    </div>

    <div className="text-center">
   
      <p className="text-gray-700 mt-2 px-4">
      A polished, investor-ready pitch deck PPT  <br/> that clearly presents your vision—created in <br/> minutes with an AI pitch deck generator.


      </p>
    </div>
  </div>
</section>
<section className="w-full  mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Heading */}
      <h2 className="text-center text-3xl font-bold text-gray-900">
        Why Zynth is the <br />
        <span className="text-[#3667B2]">Ultimate Solution for Pitch Deck</span>
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
      <div className="w-full h-80  flex items-center justify-center space-x-4 rounded-xl"
      
      >
        <img src={image1} alt="Image 1" className="w-full h-full object-cover rounded-xl" />
        
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
          Investor-Friendly Content 
          </h3>
          <p className="text-gray-700 mt-2">
          Zynth refines pitch deck slides to keep  your startup pitch deck clear and engaging.


          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center lg:border-r text-center px-4">
          <h3 className="text-lg font-semibold text-[#3667B2]">
          Problem-Solution Fit Enhancement
          </h3>
          <p className="text-gray-700 mt-2">
          AI ensures the problem is clearly framed with 
   data-backed urgency and a compelling solution.
  
        
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center lg:border-r text-center px-4">
          <h3 className="text-lg font-semibold text-[#3667B2]">
          Scalability Focus
          </h3>
          <p className="text-gray-700 mt-2">
          Frameworks like Sequoia’s help structure a business pitch deck for growth potential.


          </p>
        </div>

        {/* Feature 4 */}
        <div className="flex flex-col items-center lg:border-r text-center px-4">
          <h3 className="text-lg font-semibold text-[#3667B2]">
          Clear Investment Ask
          </h3>
          <p className="text-gray-700 mt-2">
          Automated prompts help define funding needs,  usage breakdown, and ROI expectations transparently.

          </p>
        </div>
      </div>
    </section>

    

    
    </section>
    <div className="flex items-center lg:justify-between justify-center bg-gray-100 px-2 py-16">
  <div className="w-full mx-auto flex flex-col gap-32 lg:flex-row items-center">
    {/* Left: Image Section */}
    <div className="flex justify-center lg:w-1/2 mb-10 lg:mb-0">
      <img src="https://zynthimage.s3.amazonaws.com/uploads/1740517699769_african-man-black-suit.jpg"alt="Zynth Benefits" className="w-full max-w-md object-contain" />
    </div>

    {/* Right: Text Section */}
    <div className="lg:w-1/2 lg:text-left text-center">
      <h2 className="text-4xl font-bold text-[#101828]">
        Who <span className="text-[#3667B2]">Benefits from </span>
        <span className="text-[#101828]">Zynth?</span>
      </h2>
      <p className="text-lg font-semibold text-[#3667B2] lg:mt-2 mt-4">
        Tailored for High-Performance Pitch-Deck Teams
      </p>

   

      {/* Benefits List */}
      <ul className="mt-6 space-y-5 text-left">
        {[
     "Adopt an agile solution to quickly craft pitch decks that capture your business potential.",
     " Benefit from standardized, high-impact presentations that streamline the evaluation process.",
     "Design corporate pitch decks that align with brand messaging and strategy.",
     "Enhance client pitches with data-driven, persuasive presentations tailored to different audiences.",
       
        ].map((benefit, index) => (
          <li key={index} className="flex items-center space-x-4 text-gray-800">
            {/* Bullet Point Image */}
            <img src={bullet} alt="Bullet Icon" className="w-8 h-8 object-contain" />
            {/* Text */}
            <p>{benefit}</p>
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
        <span className="text-[#3667B2]"> Impress Investors and Secure Funding?        </span>
      </h2>
      <button 
      
      onClick={() => navigate("/contact-us")}
      className="lg:hidden mt-6 bg-[#3667B2] text-white px-6 lg:px-12 py-3 rounded-lg font-semibold hover:bg-[#2c56a0] transition">
      Start Crafting Your <br/>Pitch Deck Now

      </button>
      <button 
        onClick={() => navigate("/contact-us")}
      className="hidden lg:block mt-6 bg-[#3667B2] text-white px-6 lg:px-12 py-3 rounded-lg font-semibold hover:bg-[#2c56a0] transition">
      Start Creating Your  Product Deck Today
      </button>
    </section>



    </div>
  );
};

export default UseCasesPitch;
