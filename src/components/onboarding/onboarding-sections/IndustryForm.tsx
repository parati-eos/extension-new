import React, { useEffect, useState } from 'react'
import { FaCity } from 'react-icons/fa'
import { IndustryFormProps } from '../../../types/onboardingTypes'
import { BackButton, NextButton } from '../shared/Buttons'

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
    <div className="w-full mt-[6rem] xl:mt-[2rem] 2xl:mt-[3rem] md:h-[90%] md:w-[80%] md:bg-white md:shadow-lg md:rounded-3xl md:flex md:flex-col md:justify-center md:p-4">
      {/* Heading */}
      <div className="flex flex-col items-center gap-1 mb-8">
        <FaCity className="text-[#3667B2] lg:text-4xl text-6xl xl:text-6xl mb-2" />
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
        {/* Input */}
        <div
          className={`w-full lg:flex lg:justify-center lg:gap-4 mt-4 px-2 ${
            (sector === 'Other' || industry === 'Other') &&
            'md:overflow-y-auto md:max-h-40 lg:max-h-48'
          }`}
        >
          <div className="flex flex-col w-full">
            <label
              htmlFor="sector"
              className="mb-3 font-semibold text-[#4A4B4D] block text-left"
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
                className="lg:p-2 p-4 border w-full rounded-xl"
                value={otherSector}
                onChange={(e) => setOtherSector(e.target.value)}
              />
            )}
          </div>

          <div className="flex flex-col w-full">
            <label
              htmlFor="industry"
              className="mb-3 font-semibold text-[#4A4B4D] block text-left"
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
                className="lg:p-2 p-4 border w-full rounded-xl"
                value={otherIndustry}
                onChange={(e) => setOtherIndustry(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Buttons */}
        <div
          className={`flex flex-col items-center justify-center mt-16 lg:mt-36 ${
            sector === 'Other' || industry === 'Other' ? 'lg:mt-32' : ''
          } w-full space-y-2 px-2`}
        >
          <NextButton
            disabled={
              !sector ||
              !industry ||
              (sector === 'Other' && !otherSector) ||
              (industry === 'Other' && !otherIndustry)
            }
            text={'Next'}
          />
          <BackButton onClick={onBack} />
        </div>
      </form>
    </div>
  )
}

export default IndustryForm
