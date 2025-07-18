
import React from 'react';
import slide1 from '../../assets/view-1.png';
import slide2 from '../../assets/view-2.png';
import slide3 from '../../assets/view-3.png';
import slide4 from '../../assets/view-4.png';
import slide5 from '../../assets/view-5.png';
import slide6 from '../../assets/view-6.png';
import slide7 from '../../assets/view-7.png';
import slide8 from '../../assets/view-8.png';

const slideTypes = [
  {
    title: 'Text & Image',
    bestFor: 'Combining narrative with visuals for maximum impact',
    image: slide1,
  },
  {
    title: 'Points',
    bestFor: 'Bullet lists, processes, how-tos',
    image: slide2,
  },
  {
    title: 'Statistics',
    bestFor: 'KPIs, data summaries, quick metrics',
    image: slide3,
  },
  {
    title: 'Timelines',
    bestFor: 'Roadmaps, milestones, phased-based plans',
    image: slide4,
  },
  {
    title: 'Graphs',
    bestFor: 'Bar, pie, and line charts (visuals)',
    image: slide5,
  },
  {
    title: 'People',
    bestFor: 'Testimonials, quotes, speaker highlights',
    image: slide6,
  },
  {
    title: 'Images',
    bestFor: 'Visual showcases, moodboards, illustrative content',
    image: slide7,
  },
  {
    title: 'Tables',
    bestFor: 'Comparisons, structured data, pricing breakdowns',
    image: slide8,
  },
];

const SlideTypesSection = () => {
  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-9xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Slide Types You Can <br /> Generate Instantly
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {slideTypes.map((slide, index) => (
          <div key={index} className="bg-white border rounded-xl p-4 shadow-sm flex flex-col items-start">
            <div className="text-sm font-semibold text-gray-700 mb-1">Slide Type: <span className="text-[#0A8568]">{slide.title}</span></div>
            <div className="text-sm text-gray-500 mb-3 min-h-[40px]">Best For: <span className="text-[#0A8568]">{slide.bestFor}</span></div>
            <img
              src={slide.image}
              alt={`Slide example for ${slide.title}`}
              className="w-full rounded-md object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlideTypesSection;
