import React, { useEffect, useState } from 'react'
import { FaStar, FaBuilding } from 'react-icons/fa'
import { CompanyNameFormProps } from '../../../types/onboardingTypes'
import { layoutStyles } from '../OnboardingContainer'

const CompanyNameForm: React.FC<CompanyNameFormProps> = ({
  onContinue,
  initialData,
}) => {
  const [companyName, setCompanyName] = useState(initialData)

  useEffect(() => {
    setCompanyName(initialData)
  }, [initialData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (companyName) {
      onContinue({ companyName })
    }
  }

  return (
    <div className="w-full mt-[4rem] sm:mt-[4rem] lg:mt-2 lg:bg-white lg:shadow-lg lg:max-w-4xl lg:w-[800px] lg:h-[600px] lg:rounded-3xl lg:flex lg:flex-col lg:justify-between lg:p-4 lg:sm:p-8 lg:mx-auto">
      <div className="flex flex-col items-center gap-1 mb-8 sm:mt-4 lg:mb-8 lg:mt-0">
        <FaStar className="text-[#3667B2] text-2xl mb-4" />
        <FaBuilding className="text-[#3667B2] lg:text-4xl text-6xl mb-2" />
        <h1 className="text-2xl text-[#091220] font-bold mb-1">
          Your Company Name
        </h1>
        <p className="text-[#5D5F61]">Provide your company name</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center flex-grow w-full max-w-sm mx-auto"
      >
        <div className="w-full mt-6 sm:mt-0 px-2 sm:px-0">
          <label
            htmlFor="companyName"
            className="mb-3 font-semibold text-[#4A4B4D] block text-left"
          >
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            placeholder="Enter company name"
            className="mb-4 lg:p-2 p-4 border w-full rounded-xl"
            value={companyName}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col items-center justify-center mt-16 sm:mt-8 w-full space-y-2 px-2 sm:px-0">
          <button
            type="submit"
            disabled={!companyName}
            className={`px-6 py-2 rounded-xl lg:h-[2.8rem] h-[3.3rem] transition w-full ${
              companyName
                ? 'bg-[#3667B2] text-white hover:bg-[#0A8568]'
                : 'bg-[#E6EAF0] text-[#797C81] cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}

export default CompanyNameForm
