import React from 'react'
import vector from '../../assets/Vector29.png'

const AboutSection: React.FC = () => {
  return (
    <footer className="bg-white py-16">
      <div className="flex justify-center gap-4 mb-2">
        {/* Heading */}
        <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-900 mb-8">
          One Platform, Unlimited AI
        </h2>
        <img className="h-12 w-12" src={vector} alt="Design" />
      </div>

      {/* Tabs */}
      {/* Tabs */}
<div className="flex flex-wrap justify-center gap-4 mb-8 md:mb-12">
  {['Presentations', 'Slides', 'Designs', 'Templates', 'Frameworks'].map(
    (item, index) => (
      <p
        key={index}
        className={`px-6 py-2 text-center rounded-full font-medium ${
          index === 0
            ? 'bg-purple-100 text-purple-800'
            : index === 1
            ? 'bg-yellow-100 text-yellow-800'
            : index === 2
            ? 'bg-green-100 text-green-800'
            : index === 3
            ? 'bg-indigo-100 text-indigo-800'
            : 'bg-blue-100 text-blue-800'
        }`}
      >
        {item}
      </p>
    )
  )}
</div>

      {/* Description */}
      <p className="text-center text-lg md:text-base text-black w-[90%] md:max-w-xl mx-auto mb-12">
        Zynth empowers you to create tailored presentations for every purpose.
        Go beyond generic PowerPoint presentation templates and use your
        personal slides maker.
      </p>

      {/* Cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 w-[95%] md:w-full">
        <div className="bg-white border border-gray-200 md:border-none md:shadow-md p-6 rounded-xl text-left md:text-center">
          <h3 className="text-2xl md:text-lg font-semibold text-gray-900 mb-4 md:mb-2">
            For Businesses
          </h3>
          <p className="text-black text-base">
            Impress stakeholders with polished pitch decks, sales presentations,
            project proposals, and more.
          </p>
        </div>
        <div className="bg-white border border-gray-200 md:border-none md:shadow-md p-6 rounded-xl text-left md:text-center">
          <h3 className="text-2xl md:text-lg font-semibold text-gray-900 mb-4 md:mb-2">
            For Educators
          </h3>
          <p className="text-black text-base">
            Simplify classroom lessons, research reports, or academic projects
            with our AI PPT maker.
          </p>
        </div>
        <div className="bg-white border border-gray-200 md:border-none md:shadow-md p-6 rounded-xl text-left md:text-center">
          <h3 className="text-2xl md:text-lg font-semibold text-gray-900 mb-4 md:mb-2">
            For Creatives
          </h3>
          <p className="text-black text-base">
            Instantly build visually stunning AI slides for personal projects or
            creative ideas.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default AboutSection
