import React from 'react';
import vector from '../../assets/Vector29.png'

const FirstFooter: React.FC = () => {
  return (
    <footer className="bg-gray-50 py-16 ">
      <div className='flex justify-center gap-4 mb-2'>
      {/* Heading */}
      <span className="text-4xl font-bold text-center text-gray-900 mb-8">
        One Platform, Unlimited AI
       
      </span>
      <img src={vector}/>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {['Presentations', 'Slides', 'Designs', 'Templates', 'Frameworks'].map((item, index) => (
          <button
            key={index}
            className={`px-6 py-2 rounded-full font-medium text-gray-900 ${
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
          </button>
        ))}
      </div>

      {/* Description */}
      <p className="text-center text-gray-600 max-w-xl mx-auto mb-12">
        Zynth empowers you to create tailored presentations for every purpose.
        Go beyond generic PowerPoint presentation templates and use your
        personal slides maker.
      </p>

      {/* Cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            For Businesses
          </h3>
          <p className="text-gray-600">
            Impress stakeholders with polished pitch decks, sales presentations,
            project proposals, and more.
          </p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            For Educators
          </h3>
          <p className="text-gray-600">
            Simplify classroom lessons, research reports, or academic projects
            with our AI PPT maker.
          </p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            For Creatives
          </h3>
          <p className="text-gray-600">
            Instantly build visually stunning AI slides for personal projects or
            creative ideas.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FirstFooter;
