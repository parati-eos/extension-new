import React, { useState } from 'react'
import WebsiteIcon from '../../../assets/website.png'

interface WebsiteLinkFormProps {
  onContinue: () => void
}

const WebsiteLinkForm: React.FC<WebsiteLinkFormProps> = ({ onContinue }) => {
  const [websiteLink, setWebsiteLink] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebsiteLink(e.target.value)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="bg-white shadow-lg w-[920px] h-[835px] rounded-3xl flex items-center justify-center">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8 gap-1">
            <img
              src={WebsiteIcon}
              alt="Website Icon"
              className="w-16 h-16 mb-4"
            />
            <h1 className="text-2xl text-[#091220] font-bold mb-2">
              Website Link
            </h1>
            <p className="text-[#5D5F61]">Provide your website link</p>
          </div>
          <div className="flex flex-col items-start w-full max-w-lg">
            <label
              htmlFor="websiteLink"
              className="mb-2 font-semibold text-[#4A4B4D]"
            >
              Website Link
            </label>
            <input
              type="text"
              id="websiteLink"
              placeholder="Enter website link"
              className="mb-4 p-2 border w-full rounded-xl"
              value={websiteLink}
              onChange={handleInputChange}
            />
            <button
              onClick={onContinue}
              disabled={!websiteLink}
              className={`px-6 py-2 rounded-xl transition w-full ${
                websiteLink
                  ? 'bg-[#0A8568] text-white hover:bg-blue-600'
                  : 'bg-[#E6EAF0] text-[#797C81] cursor-not-allowed'
              }`}
            >
              Next
            </button>
            <button className="px-6 py-2 border border-[#8A8B8C] rounded-xl transition w-full text-[#797C81] mt-4">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebsiteLinkForm
