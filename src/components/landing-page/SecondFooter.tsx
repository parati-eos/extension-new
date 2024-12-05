import React from 'react';
import secondfooterimage from '../../assets/secondfooter.png';
type Testimonial = {
  text: string;
  author: string;
  avatar?: string; // Optional if avatar is present
};

const SecondFooter: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      text: "It’s great to have a tool that enables people who aren’t designers to be designers. With minimal effort, our design team can help others do their jobs really well.",
      author: 'Gabriel MacSweeney',
    },
    {
      text: 'I can create my style guide with custom fonts, and edit templates quickly and way more effectively than with PowerPoint or Keynote.',
      author: 'Stephanie McSwiney',
    },
    {
      text: 'When we share a presentation via a link, we can see the stats on who opened it. It’s a great way of collaborating with clients.',
      author: 'Brando Vasquez',
    },
  ];

  return (
    <footer className="bg-gray-100 ">
      {/* Partners Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">Our Partners</h2>
          <div className="flex justify-center">
            <img
              src={secondfooterimage} 
              alt="Our Partners"
              className="h-16 md:h-20"
            />
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">Real Users, Real Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white shadow-md p-6 rounded-xl text-left"
              >
                <p className="italic mb-4">“{testimonial.text}”</p>
                <div className="flex items-center">
                  {testimonial.avatar && (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="h-10 w-10 rounded-full mr-4"
                    />
                  )}
                  <span className="font-bold">{testimonial.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call-to-Action */}
      <div className="text-center mt-12">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 mb-4">
          See How Zynth Can Help You
        </button>
      </div>
    </footer>
  );
};

export default SecondFooter;
