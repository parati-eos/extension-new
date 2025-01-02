import React from "react";
import blogimage1 from '../../assets/blogimage1.png'; 
import blogimage2 from '../../assets/blogimage2.png'; 
import blogimage3 from '../../assets/blogimage3.png'; 
import zynthtext from '../../assets/zynth-text.png'

// Blog data interface
interface Blog {
  id: number;
  date: string;
  readTime: string;
  title: string;
  description: string;
  views: number;
  comments: number;
  imageUrl: string;
}

// Sample blog data (replace with API or props as needed)
const blogData: Blog[] = [
  {
    id: 1,
    date: "Oct 24",
    readTime: "10 min read",
    title: "The Future of Clean Air: Are We Winning the Battle Against Pollution?",
    description:
      "The India’s Air Pollution Crisis in recent years, India has emerged as one of the most rapidly developing nations in the world, but with...",
    views: 8,
    comments: 0,
    imageUrl: blogimage1,
  },
  {
    id: 2,
    date: "Oct 24",
    readTime: "10 min read",
    title: "Pitching to Impact Investors: Strategies for Communicating Social and Environmental Impact",
    description:
      "What is Impact Investing? Impact investing involves making investments with the dual purpose of generating positive, measurable social...",
    views: 8,
    comments: 0,
    imageUrl: blogimage2,
  },
  {
    id: 3,
    date: "Oct 24",
    readTime: "10 min read",
    title: "The Metrics Marathon: Choosing the Right Data Points for Your Startup Pitch Deck",
    description:
      "Why Metrics Matters? Metrics serve as the language of business, facilitating communication between founders and investors. When pitching...",
    views: 8,
    comments: 0,
    imageUrl: blogimage3,
  },
];

const BlogCard: React.FC<{ blog: Blog }> = ({ blog }) => {
  return (
    <div className="flex lg:flex-row flex-col gap-6 mt-20 bg-white rounded-lg border border-white shadow-md">

      
      <img
        src={blog.imageUrl}
        alt={blog.title}
        className="lg:w-1/2 h-1/2 object-cover rounded-lg"
      />
      <div className="flex-1 p-6">
        <p className="text-sm text-gray-500 mb-2">
          {blog.date} • {blog.readTime}
        </p>
        <h3 className="text-2xl font-semibold mb-4">{blog.title}</h3>
        <p className="text-base text-gray-700 mb-6">{blog.description}</p>
        <p className="text-sm text-gray-500">
          {blog.views} views • {blog.comments} comments
        </p>
      </div>
    </div>
  );
};




const BlogList: React.FC = () => {
  return (
    <div>
    <div className="max-w-5xl mx-auto px-4 py-10 ">
      {blogData.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
      
    </div>
      {/* Footer Section */}
      <footer className="bg-white py-12 mt-10">
        <div className="container mx-auto px-4">
          {/* Footer Logo & Text */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="text-left mb-6 md:mb-0">
              <img
                src={zynthtext}
                alt="Zynth Logo"
                className="h-10 mb-4 md:mb-2 mx-auto md:mx-0"
              />
              <p className="text-black text-sm">
                Create your investor presentations in a few minutes using our
                AI-powered pitch deck builder. No design skills needed.
              </p>
              <p className="text-black text-sm mt-2">
                © 2024 Parati Technologies Private Limited. All rights reserved.
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                <a 
  href="https://www.parati.in/about-us" 
  target="_blank" 
  rel="noopener noreferrer" 
  className="text-gray-600 hover:underline"
>
  About 
</a>
                </li>
                <li>
                  <a href="https://www.parati.in/impactdb"   target="_blank"  className="text-gray-600 hover:underline">
                    Impact DB
                  </a>
                </li>
                <li>
                  <a href="https://www.parati.in/eos" target="_blank"  className="text-gray-600 hover:underline">
                    Parati Eos
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.parati.in/business-strategy" target="_blank"  className="text-gray-600 hover:underline">
                    Business Strategy
                  </a>
                </li>
                <li>
                  <a href="https://www.parati.in/investor-relations" target="_blank"  className="text-gray-600 hover:underline">
                    Investor Relations
                  </a>
                </li>
                <li>
                  <a href="https://www.parati.in/managed-operations" target="_blank" className="text-gray-600 hover:underline">
                    Managed Operations
                  </a>
                </li>
                <li>
                  <a href="https://www.parati.in/digital-transformation" target="_blank" className="text-gray-600 hover:underline">
                    Digital Transformation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Helpful Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://zynth.ai/about" target="_blank" className="text-gray-600 hover:underline">
                    About
                  </a>
                </li>
                <li>
                  <a href="https://zynth.ai/contact" className="text-gray-600 hover:underline" target="_blank">
                    Contact us
                  </a>
                </li>
                <li>
                
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://zynth.ai/uploads/privacy" className="text-gray-600 hover:underline" target="_blank">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="https://zynth.ai/uploads/refunds" className="text-gray-600 hover:underline" target="_blank">
                    Refunds and Cancellations
                  </a>
                </li>
                <li>
                  <a href="https://zynth.ai/uploads/terms" className="text-gray-600 hover:underline" target="_blank">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogList;
