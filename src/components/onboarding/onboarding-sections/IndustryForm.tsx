import React, { useEffect, useState } from 'react'
import { FaCity } from 'react-icons/fa'
import { IndustryFormProps } from '../../../types/onboardingTypes'
import { BackButton, NextButton } from '../shared/Buttons'
import { industrySectorMap } from '../../../utils/industrySector'

const IndustryForm: React.FC<IndustryFormProps> = ({
  onContinue,
  onBack,
  initialData,
}) => {
  const [sector, setSector] = useState(initialData.sector)
  const [industry, setIndustry] = useState(initialData.industry)
  const [otherSector, setOtherSector] = useState<string>('')
  const [otherIndustry, setOtherIndustry] = useState<string>('')
  const [industryOptions, setIndustryOptions] = useState<string[]>([])

  useEffect(() => {
    // Set sector and industry based on initialData
    if (
      !Object.keys(industrySectorMap).includes(initialData.sector) &&
      initialData.sector
    ) {
      setSector('Other')
      setOtherSector(initialData.sector)
    } else {
      setSector(initialData.sector)
    }

    if (
      !Object.values(industrySectorMap).flat().includes(initialData.industry) &&
      initialData.industry
    ) {
      setIndustry('Other')
      setOtherIndustry(initialData.industry)
    } else {
      setIndustry(initialData.industry)
    }
  }, [initialData])

  useEffect(() => {
    // Update industry options when sector changes
    if (sector && sector !== 'Other') {
      setIndustryOptions([...industrySectorMap[sector], 'Other'])
      setIndustry('') // Reset industry
      setOtherIndustry('') // Clear otherIndustry input
    }
  }, [sector])

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    setSector(selectedValue)
    if (selectedValue === 'Other') {
      setOtherSector('')
      setOtherIndustry('')
    }
  }

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    setIndustry(selectedValue)
    if (selectedValue !== 'Other') {
      setOtherIndustry('') // Clear otherIndustry input
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
    <div className="w-full mt-[4rem] xl:mt-[2rem] 2xl:mt-[3rem] md:h-[90%] md:w-[80%] md:bg-white md:shadow-lg md:rounded-3xl md:flex md:flex-col md:justify-center md:p-4">
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
          className={`w-full lg:flex lg:justify-center lg:gap-4 mt-8 md:mt-4 px-2 ${
            (sector === 'Other' || industry === 'Other') &&
            'md:overflow-y-auto md:max-h-32 lg:max-h-40'
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
              {Object.keys(industrySectorMap).map((sectorKey) => (
                <option key={sectorKey} value={sectorKey}>
                  {sectorKey}
                </option>
              ))}
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
              disabled={!sector || sector === 'Other'}
            >
              <option value="" disabled>
                Select industry
              </option>
              {industryOptions.map((industryOption) => (
                <option key={industryOption} value={industryOption}>
                  {industryOption}
                </option>
              ))}
            </select>
            {industry === 'Other' || sector === 'Other' ? (
              <input
                type="text"
                placeholder="Enter your industry"
                className="lg:p-2 p-4 border w-full rounded-xl"
                value={otherIndustry}
                onChange={(e) => setOtherIndustry(e.target.value)}
              />
            ) : (
              <></>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div
          className={`flex flex-col items-center justify-center mt-24 md:mt-16 lg:mt-36 ${
            sector === 'Other' || industry === 'Other' ? 'lg:mt-32' : ''
          } w-full space-y-2 px-2`}
        >
          <NextButton
            disabled={
              !(
                sector &&
                industry &&
                (sector !== 'Other' || otherSector) &&
                (industry !== 'Other' || otherIndustry)
              )
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
