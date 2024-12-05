import React, { useEffect, useState } from 'react'
import { FaBuilding } from 'react-icons/fa'
import { CompanyNameFormProps } from '../../../types/onboardingTypes'
import { NextButton } from '../shared/Buttons'

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
    <div className="w-full mt-[6rem] xl:mt-[2rem] 2xl:mt-[3rem] md:h-[90%] md:w-[80%] md:bg-white md:shadow-lg md:rounded-3xl md:flex md:flex-col md:items-center md:justify-center md:p-4">
      {/* Heading */}
      <div className="flex flex-col items-center gap-1 mb-8">
        <FaBuilding className="text-[#3667B2] text-6xl lg:text-4xl xl:text-6xl mb-2" />
        <h1 className="text-2xl text-[#091220] font-bold mb-1">
          Your Company Name
        </h1>
        <p className="text-[#5D5F61]">Provide your company name</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center flex-grow w-full max-w-sm mx-auto"
      >
        {/* Input */}
        <div className="w-full mt-6 px-2">
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

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center mt-[6.5rem] w-full space-y-2 px-2">
          <NextButton disabled={!companyName} text={'Continue'} />
        </div>
      </form>
    </div>
  )
}

export default CompanyNameForm
