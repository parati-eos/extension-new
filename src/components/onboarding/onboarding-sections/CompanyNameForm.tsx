import React, { useState } from 'react'
import StarIcon from '../../../assets/star.png'
import CompanyIcon from '../../../assets/company-sidebar-section.png'

interface CompanyNameFormProps {
  onContinue: () => void
}

const CompanyNameForm: React.FC<CompanyNameFormProps> = ({ onContinue }) => {
  const [companyName, setCompanyName] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="bg-white shadow-lg w-[920px] h-[835px] rounded-3xl flex items-center justify-center">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8 gap-1">
            <img src={StarIcon} alt="Star Icon" className="w-8 h-8 mb-2" />
            <img
              src={CompanyIcon}
              alt="Company Icon"
              className="w-16 h-16 mb-4"
            />
            <h1 className="text-2xl text-[#091220] font-bold mb-2">
              Your Company Name
            </h1>
            <p className="text-[#5D5F61]">Provide your company name</p>
          </div>
          <div className="flex flex-col items-start w-full max-w-lg">
            <label
              htmlFor="companyName"
              className="mb-2 font-semibold text-[#4A4B4D]"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              placeholder="Enter company name"
              className="mb-4 p-2 border w-full rounded-xl"
              value={companyName}
              onChange={handleInputChange}
            />
            <button
              onClick={onContinue}
              disabled={!companyName}
              className={`px-6 py-2 rounded-xl transition w-full ${
                companyName
                  ? 'bg-[#0A8568] text-white hover:bg-blue-600'
                  : 'bg-[#E6EAF0] text-[#797C81] cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyNameForm
