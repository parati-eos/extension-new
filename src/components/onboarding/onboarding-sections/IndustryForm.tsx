import React, { useState } from 'react'
import IndustryIcon from '../../../assets/industry-icon.png'

interface IndustryFormProps {
  onContinue: () => void
}

const IndustryForm: React.FC<IndustryFormProps> = ({ onContinue }) => {
  const [sector, setSector] = useState('')
  const [industry, setIndustry] = useState('')

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSector(e.target.value)
  }

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIndustry(e.target.value)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="bg-white shadow-lg w-[920px] h-[835px] rounded-3xl flex items-center justify-center">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8 gap-1">
            <img
              src={IndustryIcon}
              alt="Industry Icon"
              className="w-16 h-16 mb-4"
            />
            <h1 className="text-2xl text-[#091220] font-bold mb-2">
              Your Industry
            </h1>
            <p className="text-[#5D5F61]">
              Provide details about sector and industry
            </p>
          </div>
          <div className="flex flex-col items-start w-full max-w-lg">
            <label
              htmlFor="sector"
              className="mb-2 font-semibold text-[#4A4B4D]"
            >
              Sector
            </label>
            <select
              id="sector"
              value={sector}
              onChange={handleSectorChange}
              className="mb-4 p-2 border w-full rounded-xl"
            >
              <option value="" disabled>
                Select sector
              </option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              {/* Add more options as needed */}
            </select>

            <label
              htmlFor="industry"
              className="mb-2 font-semibold text-[#4A4B4D]"
            >
              Industry
            </label>
            <select
              id="industry"
              value={industry}
              onChange={handleIndustryChange}
              className="mb-4 p-2 border w-full rounded-xl"
            >
              <option value="" disabled>
                Select industry
              </option>
              <option value="Software">Software</option>
              <option value="Biotechnology">Biotechnology</option>
              <option value="Banking">Banking</option>
              <option value="E-Learning">E-Learning</option>
              {/* Add more options as needed */}
            </select>

            <button
              onClick={onContinue}
              disabled={!sector || !industry}
              className={`px-6 py-2 rounded-xl transition w-full ${
                sector && industry
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

export default IndustryForm
