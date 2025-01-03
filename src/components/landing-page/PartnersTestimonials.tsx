import React from 'react'
import secondfooterimage from '../../assets/secondfooter.png'
import { useNavigate } from 'react-router-dom'
type Testimonial = {
  text: string
  author: string
  avatar?: string // Optional if avatar is present
}

const PartnersTestimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      text: "The pitch deck created through Zynth app is excellent, providing a clear and professional presentation of our ideas. The design is visually appealing and the content flows smoothly, effectively conveying our message. We're very happy with the outcome and confident it will make a strong impact",
      author: 'Hitesh Mittal, Founder, HITECH ENVIRO ENGINEERS & CONSULTANTS PVT. LTD',
    },
    {
      text: 'This tool is exceptionally powerful. I was struggling to navigate the process of creating a compelling pitch deck and felt uncertain about the next steps. Discovering this solution was a turning point—it provided a beautifully designed pitch deck for my company, offering clarity and confidence in presenting our vision',
      author: 'Dr Akoisana Singh',
    },
    {
      text: 'The tool delivers excellent output, creating a well-structured and visually appealing pitch deck. It was a seamless experience and a great value for my company.',
      author: 'Anthony Crosato',
    },
  ]

  const navigate = useNavigate()

  return (
    <footer className="bg-gray-100 ">
      {/* Partners Section */}
      <div className="bg-white py-12 pb-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Our Partners</h2>
          <div className="flex justify-between">
          <a 
  href="https://www.diwanhub.com/" 
  target="_blank" 
  rel="noopener noreferrer" // Security best practices for external links
>
              <img
              src="https://zynthimage.s3.amazonaws.com/uploads/184_images%20%283%29.png"
              alt="Our Partners"
              className="md:h-48 h-28 "
            />
            </a>
           <a 
  href="https://www.marwaricatalysts.com/" 
  target="_blank" 
  rel="noopener noreferrer" // Security best practices for external links
>
  <img
    src="https://zynthimage.s3.amazonaws.com/uploads/375_vr90kaasazgk14pgxt8h%20%281%29.png"
    alt="Our Partners"
    className="md:h-48 h-28"
  />
</a>
<a 
  href="https://www.parati.in/" 
  target="_blank" 
  rel="noopener noreferrer" // Security best practices for external links
>
              <img
              src="https://zynthimage.s3.amazonaws.com/uploads/320_Untitled%20design.png"
              alt="Our Partners"
              className="md:h-48 h-28"
            />
            </a>

          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Real Users, Real Results</h2>
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
      <div className="text-center mt-6">
        <button
          onClick={() => navigate('/auth')}
          className="bg-blue-600 text-white px-8 py-4 font-semibold rounded-lg shadow-md hover:bg-blue-700 mb-4 active:scale-95 transition transform duration-300"
        >
          See How Zynth Can Help You
        </button>
      </div>
    </footer>
  )
}

export default PartnersTestimonials
