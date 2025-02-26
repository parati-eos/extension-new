import React from "react";
import revisionloop from '../../assets/revision-loop.png'
import fragmented from '../../assets/fragmented-storytelling.png'
import statics from '../../assets/static-content.png'
import analytics from '../../assets/analytics.png'
import beforezynth from '../../assets/sales-before.png'
import arrows from '../../assets/arrows.png'
import bullet from '../../assets/Group 596.png'
import arrowblue from '../../assets/arrowblue.png'
import imageleft from '../../assets/SALES1.png'
import imageright from '../../assets/SALES2.png'
import image1 from '../../assets/sales-center.png'
import { useNavigate } from "react-router-dom";

const UseCasesSales: React.FC = () => {

  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 text-[#101828] px-4 py-8 md:p-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl text-[#101828]  font-bold mb-4">
          Win More Deals with <br/>
          <span className="text-[#3667B2]"> Zynth’s AI-Powered Sales Decks</span>
        </h1>
        <p className="text-lg font-medium p-6">
          Close deals faster with compelling, on-brand sales <br/> presentations—built effortlessly with Zynth.
        </p>
        <div className="p-4">
        <button
      onClick={() => navigate("/contact-us")}
      className="bg-[#3667B2] text-white px-6 py-3 rounded-lg text-base font-normal hover:bg-[#2c56a0] transition"
    >
      Automate your Sales Decks
    </button>
        </div>
        <p className="text-base text-[#091220] font-medium mt-6">
        Crafting the perfect sales deck takes time. With Zynth, create high-impact presentations in <br/> minutes—optimized for any pitch, whether in-person, over Zoom, or via email.
        </p>
      </section>
      
      {/* How Zynth Solves Challenges */}
      <section className="mt-16 bg-white px-6 py-12 rounded-lg shadow-lg w-full mx-auto">
        <div className="mb-8">
        <p className="text-2xl text-[#101828] font-bold text-center ">
          How Zynth 
        </p>

        <p className="text-2xl  font-bold text-center  text-[#3667B2] ">
          Solves Sales Deck Challenges
        </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="text-center">
            <img src={revisionloop} alt="Endless Revision Loop" className="mx-auto mb-4 w-14 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Endless Revision Loop</h3>
            <p className="text-gray-700 mt-2">Repeatedly modifying the same sales deck for<br/> each prospect wastes time  and<br/> disrupts message consistency.</p>
          </div>
          <div className="text-center">
            <img src={fragmented} alt="Fragmented Storytelling" className="mx-auto mb-4 w-14 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Fragmented Storytelling</h3>
            <p className="text-gray-700 mt-2">Frequent changes to a sales pitch deck can reduce <br/> the deck’s overall impact.
            </p>
          </div>
          <div className="text-center">
            <img src={statics} alt="Static Content Issue" className="mx-auto mb-4 w-14 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Static Content Issue</h3>
            <p className="text-gray-700 mt-2">Decks often lag behind in reflecting <br/> up-to-date market or product information.</p>
          </div>
          <div className="text-center">
            <img src={analytics} alt="Lack of Insightful Analytics" className="mx-auto mb-4 w-18 h-14" />
            <h3 className="text-xl text-[#3667B2] font-semibold">Lack of Insightful Analytics</h3>
            <p className="text-gray-700 mt-2">Without integrated performance feedback, it’s hard to know which <br/> adjustments effectively drive  engagement.</p>
          </div>
        </div>
      </section>
      
{/* Before & After Section */}
<section className="mt-8 text-center max-w-5xl mx-auto py-4">

  <p className="text-2xl font-bold text-[#101828] mb-8">
    The Power of AI-Driven Sales Decks
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
      <img src="https://zynthimage.s3.us-east-1.amazonaws.com/uploads/ezgif.com-animated-gif-maker+(7).gif" alt="After Zynth" className="mx-auto w-80 h-42" />
    </div>
  </div>

  {/* Separate Text (To Avoid Affecting Arrow Alignment) */}
  <div className="grid md:grid-cols-2 gap-8 mt-6">
    <div className="text-center">
  
      <p className="text-gray-700 mt-2 px-4">
        Collecting information from multiple sources,<br/> manually editing slides, 
        inconsistent branding,<br/>  and time-consuming revisions.
      </p>
    </div>

    <div className="text-center">

      <p className="text-gray-700 mt-2 px-4">
        AI-crafted sales pitch decks with dynamic <br/> content tailored to specific audiences, 
        ensuring <br/> professional, high-impact presentations in  minutes.
      </p>
    </div>
  </div>
</section>
<section className="w-full  mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Heading */}
      <h2 className="text-center text-3xl font-bold text-gray-900">
        Why Zynth is the <br />
        <span className="text-[#3667B2]">Ultimate Solution for Sales Deck</span>
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
            Smart Customization Engine
          </h3>
          <p className="text-gray-700 mt-2">
            Zynth builds upon your specific templates,eliminating the need for
            repetitive, manual  tweaks.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center lg:border-r text-center px-4">
          <h3 className="text-lg font-semibold text-[#3667B2]">
            Instant Content Generation
          </h3>
          <p className="text-gray-700 mt-2">
          Real-time data integration ensures your B2B sales deck stays up to date.

          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center lg:border-r text-center px-4">
          <h3 className="text-lg font-semibold text-[#3667B2]">
            Seamless Narrative Integrity
          </h3>
          <p className="text-gray-700 mt-2">
            Its dynamic content framework preserves a consistent, compelling
            story personalized to  your organization.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="flex flex-col items-center lg:border-r text-center px-4">
          <h3 className="text-lg font-semibold text-[#3667B2]">
            Actionable Analytics Dashboard
          </h3>
          <p className="text-gray-700 mt-2">
            In-built performance tracking provides clear insights on
            engagement, enabling teams to drive results.
          </p>
        </div>
      </div>
    </section>

    

    
    </section>
    <div className="flex items-center  justify-center bg-gray-100 px-2 py-16">
  <div className="w-full mx-auto flex flex-col gap-32 lg:flex-row items-center">
    {/* Left: Image Section */}
    <div className="flex justify-center lg:w-1/2 mb-10 lg:mb-0">
      <img src="https://zynthimage.s3.amazonaws.com/uploads/1740519426492_multi-ethnic-businesspeople-discussing-financial-company-solution-sitting-conference-table-meeting-room.jpg"alt="Zynth Benefits" className="w-full max-w-md object-contain" />
    </div>

    {/* Right: Text Section */}
    <div className="lg:w-1/2 lg:text-left text-center">
      <h2 className="text-4xl font-bold text-[#101828]">
        Who <span className="text-[#3667B2]">Benefits from </span>
        <span className="text-[#101828]">Zynth?</span>
      </h2>
      <p className="text-lg font-semibold text-[#3667B2] mt-4 lg:mt-2 ">
        Tailored for High-Performance Sales Teams
      </p>

     

      {/* Benefits List */}
      <ul className="mt-6 space-y-5 text-left">
        {[
         "Frequently create and update sales decks for different clients",
         "Need consistent branding and messaging across all decks",
         "Require rapid customization of presentations for various industries",
         "Operate at scale—handling multiple pitches daily or weekly",
         "Want real-time engagement insights to refine sales strategies",
       
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
        <span className="text-[#3667B2]">CLOSE MORE DEALS?</span>
      </h2>
      <button 
        onClick={() => navigate("/contact-us")}
      className="mt-6 bg-[#3667B2] text-white px-12 py-3 rounded-lg font-semibold hover:bg-[#2c56a0] transition">
        Integrate Zynth With Your Workflows
      </button>
    </section>



    </div>
  );
};

export default UseCasesSales;
