import React, { useEffect, useState } from 'react'
import { FaCity } from 'react-icons/fa'

interface IndustryFormProps {
  onContinue: (data: { sector: string; industry: string }) => void
  onBack: () => void
  initialData: { sector: string; industry: string }
}

const IndustryForm: React.FC<IndustryFormProps> = ({
  onContinue,
  onBack,
  initialData,
}) => {
  const [sector, setSector] = useState(initialData.sector)
  const [industry, setIndustry] = useState(initialData.industry)
  const [otherSector, setOtherSector] = useState<string>('')
  const [otherIndustry, setOtherIndustry] = useState<string>('')

  useEffect(() => {
    // Check if the initial sector is a custom value (not in predefined options)
    if (
      !['Technology', 'Healthcare', 'Finance', 'Education', ''].includes(
        initialData.sector
      )
    ) {
      setSector('Other')
      setOtherSector(initialData.sector)
    } else {
      setSector(initialData.sector)
    }

    // Check if the initial industry is a custom value (not in predefined options)
    if (
      !['Software', 'Biotechnology', 'Banking', 'E-Learning', ''].includes(
        initialData.industry
      )
    ) {
      setIndustry('Other')
      setOtherIndustry(initialData.industry)
    } else {
      setIndustry(initialData.industry)
    }
  }, [initialData])

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    setSector(selectedValue)
    if (selectedValue !== 'Other') {
      setOtherSector('') // Clear otherSector input if not selecting "Other"
    }
  }

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    setIndustry(selectedValue)
    if (selectedValue !== 'Other') {
      setOtherIndustry('') // Clear otherIndustry input if not selecting "Other"
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const sectorData = sector === 'Other' ? otherSector : sector
    const industryData = industry === 'Other' ? otherIndustry : industry

    if (sectorData && industryData) {
      onContinue({
        sector: sectorData,
        industry: industryData,
      })
    }
  }

  return (
    <div className="flex flex-col mt-[2rem] sm:mt-[4rem] lg:mt-2 items-center justify-start min-w-full min-h-screen p-4 sm:p-6 text-center">
      <div className="w-full mt-8 sm:mt-[4rem] lg:mt-2 lg:bg-white lg:shadow-lg lg:max-w-4xl lg:w-[800px] lg:h-[600px] lg:rounded-3xl lg:flex lg:flex-col lg:justify-between lg:p-4 lg:sm:p-8 lg:mx-auto">
        <div className="flex flex-col items-center gap-1 mb-8 sm:mt-4 lg:mb-8 lg:mt-0">
          <FaCity className="text-[#3667B2] lg:text-6xl text-7xl mb-2" />
          <h1 className="text-2xl text-[#091220] font-bold mb-1">
            Your Industry
          </h1>
          <p className="text-[#5D5F61]">
            Provide details about sector and industry
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center flex-grow w-full max-w-sm mx-auto"
        >
          <div className="w-full mt-[2rem] lg:mt-0 px-2 sm:px-0">
            <label
              htmlFor="sector"
              className="mb-2 font-semibold text-[#4A4B4D] block text-left"
            >
              Sector
            </label>
            <select
              id="sector"
              value={sector}
              onChange={handleSectorChange}
              className="mb-4 lg:p-2 p-3 border w-full rounded-xl"
            >
              <option value="" disabled>
                Select sector
              </option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
            {sector === 'Other' && (
              <input
                type="text"
                placeholder="Enter your sector"
                className="mb-4 p-2 border w-full rounded-xl"
                value={otherSector}
                onChange={(e) => setOtherSector(e.target.value)}
              />
            )}

            <label
              htmlFor="industry"
              className="mb-2 font-semibold text-[#4A4B4D] block text-left"
            >
              Industry
            </label>
            <select
              id="industry"
              value={industry}
              onChange={handleIndustryChange}
              className="mb-4 lg:p-2 p-3 border w-full rounded-xl"
            >
              <option value="" disabled>
                Select industry
              </option>
              <option value="Software">Software</option>
              <option value="Biotechnology">Biotechnology</option>
              <option value="Banking">Banking</option>
              <option value="E-Learning">E-Learning</option>
              <option value="Other">Other</option>
            </select>
            {industry === 'Other' && (
              <input
                type="text"
                placeholder="Enter your industry"
                className="p-2 border w-full rounded-xl"
                value={otherIndustry}
                onChange={(e) => setOtherIndustry(e.target.value)}
              />
            )}
          </div>
          <div className="flex flex-col items-center justify-center lg:mt-[2rem] mt-[6rem] w-full space-y-2 px-2 sm:px-0">
            <button
              type="submit"
              disabled={
                !sector ||
                !industry ||
                (sector === 'Other' && !otherSector) ||
                (industry === 'Other' && !otherIndustry)
              }
              className={`px-6 py-2 mb-3 rounded-xl lg:h-[2.7rem] h-[3.3rem] transition w-full ${
                sector &&
                industry &&
                (sector !== 'Other' || otherSector) &&
                (industry !== 'Other' || otherIndustry)
                  ? 'bg-[#3667B2] text-white hover:bg-[#0A8568]'
                  : 'bg-[#E6EAF0] text-[#797C81] cursor-not-allowed'
              }`}
            >
              Next
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 h-[3.3rem] lg:h-[2.7rem] border border-[#8A8B8C] hover:bg-[#3667B2] hover:border-[#2d599c] hover:text-white rounded-xl transition w-full text-[#797C81]"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default IndustryForm
