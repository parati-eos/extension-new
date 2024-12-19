import React from 'react'
import FooterImage1 from '../../assets/image1.png' // Replace with actual images
import FooterImage2 from '../../assets/image2.png' // Replace with actual images
import FooterImage3 from '../../assets/image3.png' // Replace with actual images
import { useNavigate } from 'react-router-dom'

const HowWorks: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-[#F0F6FF]" id="how-it-works">
      {/* How Zynth Works Section */}
      <section className="py-16 px-4 lg:px-24">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          How Zynth Works?
        </h2>
        <div className="space-y-16">
          {/* Step 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2 flex items-start gap-4">
              <div className="flex-shrink-0 text-blue-600 text-5xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  AI Presentation Maker
                </h3>
                <ul className="mt-4 text-black space-y-2 list-disc list-inside">
                  <li>
                    Generate a new presentation or refine an existing one.
                  </li>
                  <li>
                    Access data-driven content sourced from across the web.
                  </li>
                  <li>
                    Create AI slides built on proven presentation templates.
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/auth')}
                  className="mt-6 px-6 py-2 font-semibold bg-transparent border border-[#3667B2] text-[#3667B2] hover:text-white rounded-md hover:bg-[#3667B2] active:scale-95 active:opacity-80 transition-all duration-300"
                >
                  Generate Presentation
                </button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img
                src={FooterImage1}
                alt="AI Presentation Maker"
                className="w-full rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
            <div className="lg:w-1/2 flex items-start gap-4">
              <div className="flex-shrink-0 text-blue-600 text-5xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  Customizable Slide Designs
                </h3>
                <ul className="mt-4 text-black space-y-2 list-disc list-inside">
                  <li>
                    Instantly create a new slide with AI in a single click.
                  </li>
                  <li>
                    Transform your brief input into expertly crafted AI slides.
                  </li>
                  <li>
                    Tailor your presentation with customizable slide types.
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/auth')}
                  className="mt-6 px-6 py-2 bg-transparent font-semibold border border-[#3667B2] text-[#3667B2] hover:text-white rounded-md hover:bg-[#3667B2] active:scale-95 active:opacity-80 transition-all duration-300"
                >
                  Refine Presentation
                </button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img
                src={FooterImage2}
                alt="Customizable Slide Designs"
                className="w-full rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2 flex items-start gap-4">
              <div className="flex-shrink-0 text-blue-600 text-5xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  Seamless Presentation Sharing
                </h3>
                <ul className="mt-4 text-black space-y-2 list-disc list-inside">
                  <li>Share your AI presentation instantly via weblinks.</li>
                  <li>Download your AI-generated presentation as a PDF.</li>
                  <li>
                    Sync seamlessly by exporting to Google Slides for final
                    edits.
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/auth')}
                  className="mt-6 px-6 py-2 bg-transparent font-semibold border border-[#3667B2] text-[#3667B2] hover:text-white rounded-md hover:bg-[#3667B2] active:scale-95 active:opacity-80 transition-all duration-300"
                >
                  Share Presentation
                </button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img
                src={FooterImage3}
                alt="Seamless Presentation Sharing"
                className="w-full rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HowWorks
