import React, { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;

}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",

  });

  const [status, setStatus] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };



  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("https://formspree.io/f/mwpvykgq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          postMessage: "Your custom post message here", // Add postMessage
        }),
      });
  
      if (response.ok) {
        setStatus("Message sent!");
        toast.success("Message sent successfully!"); // Success toast message
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        
        });
      } else {
        setStatus("Failed to send message.");
        toast.error("Failed to send message."); // Error toast message
      }
    } catch (error) {
      setStatus("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again."); // Error toast message
    }
  };

  return (
    <>
    <section className="lg:hidden h-auto flex flex-col lg:flex-row items-center justify-center p-4">
      {/* Image Section */}
      <div className="w-full lg:w-1/2 flex justify-center lg:justify-start mb-6 lg:mb-0">
        <div className="relative w-full max-w-[400px] lg:max-w-none">
          <img
            src="https://pagedone.io/asset/uploads/1696488602.png"
            alt="Contact Us"
            className="w-full h-auto object-cover rounded-2xl lg:rounded-l-2xl"
          />
          <h1 className="absolute top-4 left-4 text-white text-3xl lg:text-4xl font-bold">
            Contact Us
          </h1>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 max-w-lg bg-white shadow-md rounded-2xl p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-900"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="johndoe@email.com"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-900"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 89"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-900"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message..."
              className="w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-900 resize-none"
              rows={4}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col items-center mt-4">
            <button
              disabled={!formData.email || !formData.message}
              type="submit"
              className={`w-full bg-yellow-600 text-white font-semibold py-3 rounded-lg transition duration-300 ${
                !formData.email || !formData.message ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-700"
              }`}
            >
              Submit
            </button>
            {status && (
              <p className={`mt-2 text-sm ${status.includes("sent") ? "text-green-600" : "text-red-600"}`}>
                {status}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
    <section className="hidden h-screen lg:flex">
    <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row w-full">
      <div className="relative w-full lg:w-1/2 h-1/2 lg:h-full mb-10 lg:mb-0">
        <img
          src="https://pagedone.io/asset/uploads/1696488602.png"
          alt="Contact Us"
          className="lg:w-[90%] lg:h-[90%] object-cover lg:rounded-l-2xl rounded-2xl bg-blend-multiply bg-indigo-700"
        />    
        <h1 className="font-manrope text-white text-4xl font-bold leading-10 absolute top-11 left-11">
          Contact us
        </h1>
      </div>
      <div className="lg:w-1/2 w-full lg:h-full flex flex-col justify-between lg:rounded-r-2xl lg:rounded-l-none rounded-lg ">
        <form onSubmit={handleSubmit} className="flex flex-col h-[80%]">
          <div className="lg:mb-8 mb-6">
            <label className="block text-black mb-3">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="block w-full border border-gray-300 rounded bg-transparent text-black py-4 px-3" />
          </div>
          <div className="lg:mb-8 mb-6">
            <label className="block text-black mb-3">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="johndoe@email.com" className="block w-full border border-gray-300 bg-transparent rounded text-black py-4 px-3" />
          </div>
          <div className="lg:mb-8 mb-6">
            <label className="block text-black mb-3">Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 89" className="block w-full border border-gray-300 bg-transparent rounded text-black py-4 px-3" />
          </div>
          <div className="lg:mb-8 mb-6">
<label className="block text-black mb-3">Message</label>
<textarea 
  name="message" 
  value={formData.message} 
  onChange={handleChange} 
  placeholder="Enter your message" 
  className="block w-full border border-gray-300 rounded bg-transparent text-black py-4 px-3 resize-none" 
  rows={4} 
/>
</div>

         
<div className="flex items-center space-x-4 mt-auto">
<button 
  disabled={!formData.email || !formData.message}
  type="submit" 
  className={`w-full bg-yellow-600 text-black font-semibold py-4 rounded transition 
    ${!formData.email || !formData.message ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-700"}`}
>
  Submit
</button>
{status && <p className={`${status.includes("sent") ? "text-green-600" : "text-red-600"} text-sm`}>{status}</p>}
</div>

        </form>
      </div>
    </div>
  </section>
  </>
  );
};


export default ContactUs;
