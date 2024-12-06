import React, { useEffect, useState } from 'react'
import { FaGlobe } from 'react-icons/fa'
import { WebsiteLinkFormProps } from '../../../types/onboardingTypes'
import { NextButton, BackButton } from '../shared/Buttons'

const WebsiteLinkForm: React.FC<WebsiteLinkFormProps> = ({
  onContinue,
  onBack,
  initialData,
}) => {
  const [websiteLink, setWebsiteLink] = useState(initialData)

  useEffect(() => {
    setWebsiteLink(initialData)
  }, [initialData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let updatedValue = e.target.value
    if (
      !updatedValue.startsWith('http://') &&
      !updatedValue.startsWith('https://')
    ) {
      updatedValue = `https://${updatedValue}`
    }
    setWebsiteLink(updatedValue)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (websiteLink) {
      onContinue({ websiteLink })
    }
  }

  return (
    <div className="w-full mt-[4rem] xl:mt-[2rem] 2xl:mt-[3rem] md:h-[90%] md:w-[80%] md:bg-white md:shadow-lg md:rounded-3xl md:flex md:flex-col md:justify-center md:p-4">
      {/* Heading */}
      <div className="flex flex-col items-center gap-1 mb-8">
        <FaGlobe className="text-[#3667B2] lg:text-4xl text-6xl xl:text-6xl mb-2" />
        <h1 className="text-2xl text-[#091220] font-bold mb-1">Website Link</h1>
        <p className="text-[#5D5F61]">Provide your website link</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center flex-grow mt-2 w-full max-w-sm mx-auto"
      >
        {/* Input */}
        <div className="w-full mt-[7rem] md:mt-6 px-2 mb-24">
          <label
            htmlFor="websiteLink"
            className="mb-3 font-semibold text-[#4A4B4D] block text-left"
          >
            Website Link
          </label>
          <input
            type="text"
            id="websiteLink"
            placeholder="Enter website link"
            className="mb-4 lg:p-2 p-4 border w-full rounded-xl"
            value={websiteLink}
            onChange={handleInputChange}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center mt-4 md:mt-10 w-full space-y-2 px-2">
          <NextButton disabled={!websiteLink} text={'Next'} />
          <BackButton onClick={onBack} />
        </div>
      </form>
    </div>
  )
}

export default WebsiteLinkForm
