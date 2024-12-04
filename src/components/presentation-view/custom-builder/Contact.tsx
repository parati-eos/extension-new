import { FaPaperclip } from 'react-icons/fa';

export default function Contact() {
  return (
    <div className="flex flex-col p-4 h-full ">
      {/* Header Section */}
      <div className="flex lg:mt-2 items-center justify-between w-full px-4">
        <h2 className="hidden md:block md:text-lg font-semibold text-[#091220]">
          Contact
        </h2>
        <button
          className="hidden md:block text-sm border border-[#8A8B8C] px-3 py-1 rounded-lg text-[#5D5F61] hover:underline"
        >
          Back
        </button>
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto lg:w-[65%] space-y-4 mt-6">
        {/* Input fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Website link"
            className="p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Enter email"
            className="p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            placeholder="Enter phone"
            className="p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            placeholder="Linkedin profile link"
            className="p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Attach Image Button */}
        <button className="p-3 flex items-center  lg:w-[49%] border border-gray-300 rounded-lg ">
            <div className='flex items-center ml-1'>
          <FaPaperclip className="mr-2" />
          <span>Attach Image</span>
          </div>
        </button>
      </div>

      {/* Generate Slide Button */}
      <div className="mt-6 flex justify-end">
        <button
          className="bg-[#3667B2] text-white py-2 px-6 rounded-md hover:bg-[#254a84] focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Generate Slide
        </button>
      </div>
    </div>
  );
}
