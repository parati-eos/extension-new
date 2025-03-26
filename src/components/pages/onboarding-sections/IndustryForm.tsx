import React, { useEffect, useState } from 'react'
import { FaCity } from 'react-icons/fa'
import { IndustryFormProps } from '../../../@types/onboardingTypes'
import { BackButton, NextButton } from '../Buttons'
import { industrySectorMap } from '../../../utils/industrySector'

type SectorType = keyof typeof industrySectorMap

const IndustryForm: React.FC<IndustryFormProps> = ({
  onContinue,
  onBack,
  initialData,
  isNextLoading,
}) => {
  const [sector, setSector] = useState(initialData.sector)
  const [industry, setIndustry] = useState(initialData.industry)
  const [otherSector, setOtherSector] = useState<string>('')
  const [otherIndustry, setOtherIndustry] = useState<string>('')
  const [industryOptions, setIndustryOptions] = useState<string[]>([])

  // Set sector and industry based on initialData
  useEffect(() => {
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
    if (sector && sector !== 'Other' && sector in industrySectorMap) {
      setIndustryOptions([...industrySectorMap[sector as SectorType], 'Other'])
    }

    // Automatically set industry to "Other" if sector is "Other"
    if (sector === 'Other') {
      setIndustry('Other')
      setOtherIndustry('') // Reset otherIndustry input
    }
  }, [sector])

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value as SectorType // Cast to SectorType
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

  const isNextButtonDisabled =
    !sector ||
    !industry || // Ensure sector and industry are selected
    (sector === 'Other' && !otherSector) || // Validate otherSector input
    (industry === 'Other' && !otherIndustry) // Validate otherIndustry input

  return (
<div className="lg:p-0 p-2 w-full mt-[4rem] xl:mt-[2rem] 2xl:mt-[3rem] md:h-[90%] md:w-[80%] md:bg-white md:shadow-lg md:rounded-3xl md:flex md:flex-col items-center justify-between md:p-4">
      
      
      {/* Heading Section */}
      <div className="flex flex-col items-center gap-1">
        <FaCity className="text-[#3667B2] text-6xl lg:text-4xl xl:text-6xl mb-2" />
        <h1 className="text-2xl text-[#091220] font-bold mb-1">
          Your Industry
        </h1>
        <p className="text-[#5D5F61]">
          Provide details about sector and industry
        </p>
      </div>

      {/* Input Section */}
      <form onSubmit={handleSubmit} className="hidden w-full max-w-2xl mx-auto lg:flex-grow p-2 lg:p-0 lg:flex flex-col justify-center overflow-auto scrollbar-none">
        <div className=" gap-2 w-full flex flex-col lg:flex-row ">
          
          {/* Sector Selection */}
          <div className="lg:w-1/2 flex flex-col">
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
              className="mb-2 lg:p-2 p-3 border w-full rounded-xl"
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
                className="lg:p-2 p-4 border w-full rounded-xl outline-[#3667B2]"
                value={otherSector}
                onChange={(e) => setOtherSector(e.target.value)}
              />
            )}
          </div>

          {/* Industry Selection */}
          <div className="lg:w-1/2 flex flex-col">
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
              className="mb-2 lg:p-2 p-3 border w-full rounded-xl"
              disabled={!sector || sector === 'Other'}
            >
              {sector !== 'Other' && (
                <option value="" disabled>
                  Select industry
                </option>
              )}
              {sector === 'Other' && (
                <option value="" disabled>
                  Other
                </option>
              )}
              {industryOptions.map((industryOption) => (
                <option key={industryOption} value={industryOption}>
                  {industryOption}
                </option>
              ))}
            </select>
            {(industry === 'Other' || sector === 'Other') && (
              <input
                type="text"
                placeholder="Enter your industry"
                className="lg:p-2 p-4 border w-full rounded-xl outline-[#3667B2] "
                value={otherIndustry}
                onChange={(e) => setOtherIndustry(e.target.value)}
              />
            )}
          </div>

        </div>
      </form>
      {/* Input Section Mobile */}
<div className="lg:hidden flex flex-col flex-grow w-full px-2 h-[32vh] ">
  <div
    className={`w-full  gap-x-4 mt-[0.5rem] lg:w-[70%] ${
      sector === 'Other' || industry === 'Other' ? 'md:mt-8' : ''
    } px-2 scrollbar-none`}
    style={{
      maxHeight: '32vh', // Prevent container from growing too much
      overflowY: 'auto', // Enable scrolling if needed
      WebkitOverflowScrolling: 'touch', // Smooth scrolling for iOS
    }}
  >
    {/* Sector Selection */}
    <div className="lg:w-1/2 flex flex-col">
      <label className="mb-3 font-semibold text-[#4A4B4D]">Sector</label>
      <select
        value={sector}
        onChange={handleSectorChange}
        className="mb-2 lg:p-2 p-3 border w-full rounded-xl"
      >
        <option value="" disabled>Select sector</option>
        {Object.keys(industrySectorMap).map((sectorKey) => (
          <option key={sectorKey} value={sectorKey}>{sectorKey}</option>
        ))}
      </select>
      {sector === 'Other' && (
        <input
          type="text"
          placeholder="Enter your sector"
          className="lg:p-2 p-4 border w-full rounded-xl outline-[#3667B2]"
          value={otherSector}
          onChange={(e) => setOtherSector(e.target.value)}
        />
      )}
    </div>

    {/* Industry Selection */}
    <div className="lg:w-1/2 flex flex-col">
      <label className="mb-3 font-semibold text-[#4A4B4D]">Industry</label>
      <select
        value={industry}
        onChange={handleIndustryChange}
        className="mb-2 lg:p-2 p-3 border w-full rounded-xl"
        disabled={!sector || sector === 'Other'}
      >
        <option value="" disabled>Select industry</option>
        {industryOptions.map((industryOption) => (
          <option key={industryOption} value={industryOption}>{industryOption}</option>
        ))}
      </select>
      {industry === 'Other' && (
        <input
          type="text"
          placeholder="Enter your industry"
          className="lg:p-2 p-4 border w-full rounded-xl outline-[#3667B2]"
          value={otherIndustry}
          onChange={(e) => setOtherIndustry(e.target.value)}
        />
      )}
    </div>
  </div>
</div>


      {/* Buttons Section */}
      <div className="lg:w-[40%] flex flex-col items-center p-2 mt-auto lg:pb-20 gap-2 ">
        {isNextLoading ? (
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        ) : (
          <NextButton disabled={isNextButtonDisabled} text={'Next'} onClick={handleSubmit} />
        )}
        <BackButton onClick={onBack} />
      </div>
      
    </div>
  )
}

export default IndustryForm
