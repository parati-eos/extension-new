import React from 'react';
import toolkit1 from '../../assets/toolkit1.png';
import toolkit2 from '../../assets/toolkit2.png';

const AiToolkitSection = () => {
  const items = [
    {
      number: '1',
      title: 'Rewrite Content with Precision',
      highlightColor: 'text-[#0A8568]',
      description: 'Adjust tone, format, and structure using powerful AI text tools built for presenters.',
    },
    {
      number: '2',
      title: 'Generate or Search Visuals Instantly',
      highlightColor: 'text-[#0A8568]',
      description: 'Just type a prompt or keyword—Zynth finds or creates the perfect image.',
    },
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            All-in-One AI Toolkit <br /> for Google Slides™
          </h2>
          <p className="text-gray-600 text-lg font-medium mt-2">
            Enhance Any Slide in Seconds
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 justify-between mb-12">
          <img
            src={toolkit1}
            alt="Toolkit Step 1"
            className="w-full lg:w-1/2 object-contain rounded-md shadow-md border-2 border-gray-500"
          />
          <img
            src={toolkit2}
            alt="Toolkit Step 2"
            className="w-full lg:w-1/2 object-contain rounded-md shadow-md border-2 border-gray-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item) => (
            <div key={item.number} className="flex items-start space-x-4">
              <div className="text-2xl font-semibold text-[#0A8568]">
                 <span className="text-[#0A8568] font-bold text-xl border border-[#0A8568] rounded-full w-8 h-8 flex items-center justify-center">
                {item.number}
              </span>
              </div>
              <div>
                <h3 className={`text-lg font-bold ${item.highlightColor}`}>
                  {item.title}
                </h3>
                <p className="text-gray-700 mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiToolkitSection;
