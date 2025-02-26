import React from "react";
import revisionloop from '../../assets/revision-loop.png'
import fragmented from '../../assets/fragmented-storytelling.png'
import statics from '../../assets/static-content.png'
import analytics from '../../assets/analytics.png'
import beforezynth from '../../assets/product-before.png'
import arrows from '../../assets/arrows.png'
import arrowblue from '../../assets/arrowblue.png'
import bullet from '../../assets/Group 596.png'
import imageleft from '../../assets/PRODUCT1.png'
import imageright from '../../assets/PRODUCT2.png'
import image1 from '../../assets/product-center.png'
import { useNavigate } from "react-router-dom";

const UseCasesProduct: React.FC = () => {
   const navigate = useNavigate();
  return (
    <div className="bg-gray-50 text-[#101828] p-2 md:p-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl text-[#101828]  font-bold mb-4">
        Captivate Audiences with  <br/>
          <span className="text-[#3667B2]"> AI-Enhanced Product Decks
          </span>
        </h1>
        <p className="text-lg font-medium p-6">
        Elevate your product slides with dynamic<br/> on-brand presentations that drive engagement.

        </p>
        <div className="p-4">
        <button 
        
        onClick={() => navigate("/contact-us")}
        className="bg-[#3667B2] text-white px-6 py-3 rounded-lg text-base font-normal hover:bg-[#2c56a0] transition">
        Automate Your  Product Presentation
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
        Solves Product Deck Challenges

        </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="text-center">
            <img src={revisionloop} alt="Endless Revision Loop" className="mx-auto mb-4 w-14 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Complex vs. Clear</h3>
            <p className="text-gray-700 mt-2">Struggling to balance technical  <br/>details without overwhelming or oversimplifying. </p>
          </div>
          <div className="text-center">
            <img src={fragmented} alt="Fragmented Storytelling" className="mx-auto mb-4 w-14 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Validation Gaps</h3>
            <p className="text-gray-700 mt-2">Missing real-world traction, <br/> testimonials, or data to back up claims.
            </p>
          </div>
          <div className="text-center">
            <img src={statics} alt="Static Content Issue" className="mx-auto mb-4 w-14 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Slide Flow Issues</h3>
            <p className="text-gray-700 mt-2">Poor transitions between slides <br/> that disrupt the story’s logic.
            </p>
          </div>
          <div className="text-center">
            <img src={analytics} alt="Lack of Insightful Analytics" className="mx-auto mb-4 w-18 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Visual Overload</h3>
            <p className="text-gray-700 mt-2">Overuse of text or complex graphics, <br/> making decks hard to skim.
            </p>
          </div>
        </div>
      </section>
      
{/* Before & After Section */}
<section className="mt-8 text-center max-w-5xl mx-auto py-4 ">

  <p className="text-2xl font-bold text-[#101828] mb-8">
    The Power of AI-Driven Product Decks
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
      <img src="https://zynthimage.s3.us-east-1.amazonaws.com/uploads/ezgif.com-animated-gif-maker+(5).gif" alt="After Zynth" className="mx-auto w-80 h-42" />
    </div>
  </div>

  {/* Separate Text (To Avoid Affecting Arrow Alignment) */}
  <div className="grid md:grid-cols-2 gap-8 mt-6">
    <div className="text-center">

      <p className="text-gray-700 mt-2 px-4">
      A product presentation lacking <br/>clarity and visual appeal

      </p>
    </div>

    <div className="text-center">

      <p className="text-gray-700 mt-2 px-4">
      A polished, cohesive product deck that clearly highlights features, 
      benefits, and user value—all crafted in 
     minutes.
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
          Balancing Complexity & Clarity
          </h3>
          <p className="text-gray-700 mt-2">
          Zynth simplifies technical jargon with AI-powered structuring, <br/> ensuring a deck is easy to   <br/> understand without losing depth.

          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center lg:border-r text-center px-4">
          <h3 className="text-lg font-semibold text-[#3667B2]">
          Validation & Credibility
          </h3>
          <p className="text-gray-700 mt-2">
          Seamlessly integrate testimonials and traction data -<br/> into your pitch deck<br/>for a compelling product introduction presentation.
          <br/> 
        
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center lg:border-r text-center px-4">
          <h3 className="text-lg font-semibold text-[#3667B2]">
          Slide Flow Optimization
          </h3>
          <p className="text-gray-700 mt-2">
          Slide Flow Optimization
          <br/>  sequence in your PowerPoint <br/> presentation, keeping engagement high.

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
    <div className="flex items-center  justify-center bg-gray-100 px-2 py-16">
  <div className="w-full mx-auto flex flex-col gap-32 lg:flex-row items-center">
    {/* Left: Image Section */}
    <div className="flex justify-center lg:w-1/2 mb-10 lg:mb-0">
      <img src="https://zynthimage.s3.amazonaws.com/uploads/1740517062323_industrial-designers-working-3d-model.jpg"alt="Zynth Benefits" className="w-full max-w-md object-contain" />
    </div>

    {/* Right: Text Section */}
    <div className="lg:w-1/2 lg:text-left text-center">
      <h2 className="text-4xl font-bold text-[#101828]">
        Who <span className="text-[#3667B2]">Benefits from </span>
        <span className="text-[#101828]">Zynth?</span>
      </h2>
      <p className="text-lg font-semibold text-[#3667B2] mt-4 lg:mt-2">
        Tailored for High-Performance Product Teams
      </p>

    

      {/* Benefits List */}
      <ul className="mt-6 space-y-5 text-left">
        {[
      "Streamline product updates and internal communications",
" Quickly craft decks that simplify complex product features",
"Design best product presentations to engage customers and boost conversions.",
"Adopt agile solutions to pitch innovative products with confidence",
       
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
        <span className="text-[#3667B2]">Transform Your Product Story?        </span>
      </h2>
      <button 
            onClick={() => navigate("/contact-us")}
      className="mt-6 bg-[#3667B2] text-white px-12 py-3 rounded-lg font-semibold hover:bg-[#2c56a0] transition">
      Start Creating Your Product Deck Today
      </button>
    </section>



    </div>
  );
};

export default UseCasesProduct;
