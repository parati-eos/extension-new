import React, { useEffect, useState } from 'react'
import { FaStar, FaBuilding } from 'react-icons/fa'

interface CompanyNameFormProps {
  onContinue: (data: { companyName: string }) => void
  initialData: string
}

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 text-center">
      <div className="bg-white shadow-lg w-full max-w-4xl h-auto lg:w-[800px] lg:h-[600px] rounded-3xl flex flex-col justify-between p-4 sm:p-8 mx-auto">
        <div className="flex flex-col items-center mb-4 gap-1 lg:mb-8">
          <FaStar className="text-[#3667B2] text-xl mb-2" />
          <FaBuilding className="text-[#3667B2] text-4xl mb-2" />
          <h1 className="text-2xl text-[#091220] font-bold mb-1">
            Your Company Name
          </h1>
          <p className="text-[#5D5F61]">Provide your company name</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:mb-16 items-center justify-center flex-grow w-full max-w-sm mx-auto"
        >
          <div className="w-full">
            <label
              htmlFor="companyName"
              className="mb-2 font-semibold text-[#4A4B4D] block text-left"
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
          </div>
          <div className="flex flex-col items-center justify-center mt-4 lg:mt-8 w-full space-y-2">
            <button
              type="submit"
              disabled={!companyName}
              className={`px-6 py-2 rounded-xl transition w-full max-w-sm ${
                companyName
                  ? 'bg-[#0A8568] text-white hover:bg-[#3667B2]'
                  : 'bg-[#E6EAF0] text-[#797C81] cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CompanyNameForm
