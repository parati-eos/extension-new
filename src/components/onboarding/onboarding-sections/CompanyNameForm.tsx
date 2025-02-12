import React, { useEffect, useState } from 'react'
import { FaBuilding } from 'react-icons/fa'
import { CompanyNameFormProps } from '../../../types/onboardingTypes'
import { NextButton } from '../shared/Buttons'

const CompanyNameForm: React.FC<CompanyNameFormProps> = ({
  onContinue,
  initialData,
  isNextLoading,
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
    <div className="lg:p-0 p-2 w-full mt-[4rem]  md:h-[90%] md:w-[80%] md:bg-white md:shadow-lg md:rounded-3xl md:flex md:flex-col md:items-center md:justify-between md:p-4">
      {/* Container with full height to push elements to their respective positions */}
      <div className="flex flex-col h-full w-full items-center ">
        {/* Heading */}
        <div className="flex flex-col items-center gap-1 p-2 lg:p-0">
          <FaBuilding className="text-[#3667B2] text-6xl lg:text-4xl xl:text-6xl mb-2" />
          <h1 className="text-2xl text-[#091220] font-bold">Organization Name</h1>
          <p className="text-[#5D5F61]">Provide your organization name</p>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto flex-grow flex flex-col justify-center">
          <div className="w-full py-4">
            <label htmlFor="companyName" className="mb-3 font-semibold text-[#4A4B4D] block text-left">
              Organization Name
            </label>
            <input
              type="text"
              id="companyName"
              placeholder="Enter organization name"
              className="mb-4 lg:p-2 p-4 border w-full rounded-xl outline-[#3667B2]"
              value={companyName}
              onChange={handleInputChange}
            />
          </div>
        </form>

        {/* Buttons - Positioned moderately above the bottom using `mt-auto` */}
        <div className="lg:w-[40%] w-full  flex flex-col items-center p-2 mt-auto lg:pb-[8.5rem]">
          {isNextLoading ? (
            <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
          ) : (
            <NextButton disabled={!companyName} text={'Continue'} onClick={handleSubmit} />
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyNameForm
