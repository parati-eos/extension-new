import React, { useEffect, useState } from 'react'
import { FaGlobe } from 'react-icons/fa'
import { WebsiteLinkFormProps } from '../../../types/onboardingTypes'
import { NextButton, BackButton } from '../shared/Buttons'

const WebsiteLinkForm: React.FC<WebsiteLinkFormProps> = ({
  onContinue,
  onBack,
  initialData,
  isNextLoading,
}) => {
  const [websiteLink, setWebsiteLink] = useState(initialData)
  const [isValidLink, setIsValidLink] = useState(false)

  useEffect(() => {
    setWebsiteLink(initialData)
    validateLink(initialData) // Validate initial data if provided
  }, [initialData])

  const validateLink = (link: string | undefined) => {
    if (!link) {
      setIsValidLink(false)
      return
    }
    // Regular expression to validate a URL
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/
    setIsValidLink(urlRegex.test(link))
  }

  const handleInputFocus = () => {
    if (!websiteLink) {
      setWebsiteLink('https://') // Pre-fill "https://" if empty
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.value

    if (updatedValue === '') {
      setWebsiteLink('')
      validateLink('')
      return
    }

    setWebsiteLink(updatedValue)
    validateLink(updatedValue)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onContinue({ websiteLink }) // Allows an empty or filled website link
  }

  return (
    <div className="lg:p-0 p-2 w-full mt-[4rem] xl:mt-[2rem] 2xl:mt-[3rem] md:h-[90%] md:w-[80%] md:bg-white md:shadow-lg md:rounded-3xl md:flex md:flex-col md:items-center md:justify-between md:p-4">
      
      {/* Heading Section */}
      <div className="flex flex-col items-center gap-1 p-2 lg:p-0">
        <FaGlobe className="text-[#3667B2] text-6xl lg:text-4xl xl:text-6xl mb-2" />
        <h1 className="text-2xl text-[#091220] font-bold mb-1">Website Link</h1>
        <p className="text-[#5D5F61]">Provide your website link</p>
      </div>

      {/* Input Section */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto flex-grow flex flex-col justify-center">
        <div className="w-full ">
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
            className="mb-7 lg:p-2 p-4 border w-full rounded-xl outline-[#3667B2]"
            value={websiteLink}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          {!isValidLink && websiteLink && (
            <p className="text-red-500 text-sm mt-2">
              Please enter a valid website link.
            </p>
          )}
        </div>
      </form>

     {/* Buttons Section */}
<div className="lg:w-[40%] flex flex-col items-center p-2 mt-auto lg:pb-20 gap-2">
  {isNextLoading ? (
    <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
  ) : websiteLink.length > 0 ? ( 
    // If websiteLink has a value, show "Continue" button
    <NextButton text={'Continue'} disabled={!isValidLink} onClick={handleSubmit} />
  ) : ( 
    // If websiteLink is empty, show "Skip" button
    <NextButton text={'Skip'} onClick={() => onContinue({ websiteLink: '' })} />
  )}
  <BackButton onClick={onBack} />
</div>

      
    </div>
  )
}

export default WebsiteLinkForm
