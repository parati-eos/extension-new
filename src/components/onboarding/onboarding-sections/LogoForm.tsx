import React, { useState } from 'react'
import LogoIcon from '../../../assets/logo-sidebar-section.png'

interface CompanyNameFormProps {
  onContinue: () => void
}

const CompanyNameForm: React.FC<CompanyNameFormProps> = ({ onContinue }) => {
  const [logo, setLogo] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0])
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="bg-white shadow-lg w-[920px] h-[835px] rounded-3xl flex items-center justify-center">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8 gap-1">
            <img src={LogoIcon} alt="Logo Icon" className="w-16 h-16 mb-4" />
            <h1 className="text-2xl text-[#091220] font-bold mb-2">
              Company Logo
            </h1>
            <p className="text-[#5D5F61]">Upload your company logo</p>
          </div>
          <div className="flex flex-col items-start w-full max-w-lg">
            <label
              htmlFor="companyLogo"
              className="mb-2 font-semibold text-[#4A4B4D]"
            >
              Company Logo
            </label>
            <input
              type="file"
              id="companyLogo"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4 p-2 border w-full rounded-xl"
            />
            <button
              onClick={onContinue}
              disabled={!logo}
              className={`px-6 py-2 rounded-xl transition w-full ${
                logo
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

export default CompanyNameForm
