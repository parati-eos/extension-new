import React, { useEffect, useState } from 'react'
import { FaPhone } from 'react-icons/fa'
import { ContactDetailsFormProps } from '../../../types/onboardingTypes'
import { BackButton, NextButton } from '../shared/Buttons'

const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({
  onContinue,
  onBack,
  initialData,
}) => {
  const [contactEmail, setContactEmail] = useState(initialData.contactEmail)
  const [contactPhone, setContactPhone] = useState(initialData.contactPhone)
  const [linkedinLink, setLinkedinLink] = useState(initialData.linkedinLink)
  const [isLinkedinValid, setIsLinkedinValid] = useState(true)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isPhoneValid, setIsPhoneValid] = useState(true)

  useEffect(() => {
    setContactEmail(initialData.contactEmail)
    setContactPhone(initialData.contactPhone)
    setLinkedinLink(initialData.linkedinLink)
  }, [initialData])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setContactEmail(value)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    setIsEmailValid(!value || emailRegex.test(value))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setContactPhone(value)
    const phoneRegex = /^\+?[1-9]\d{9,14}$/


    setIsPhoneValid(!value || phoneRegex.test(value))
  }

  const handleLinkedinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.trim();
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      value = `https://${value}`;
    }
    setLinkedinLink(value);
  
    const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/(in|company|pub)\/[a-zA-Z0-9_-]{3,}$/;
    // Check if the field is not empty and matches the regex
    setIsLinkedinValid(value !== '' && linkedinRegex.test(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onContinue({ contactEmail, contactPhone, linkedinLink })
  }

  // Disable Finish button if any field is invalid
  const isFormValid = isEmailValid && isPhoneValid && isLinkedinValid && linkedinLink.trim() !== '';

  return (
    <div className="w-full mt-[2rem] 2xl:mt-[3rem] md:h-[90%] md:w-[80%] md:bg-white md:shadow-lg md:rounded-3xl md:flex md:flex-col md:justify-center md:p-4">
      {/* Heading */}
      <div className="flex flex-col items-center gap-1 mb-8 md:mb-6">
        <FaPhone className="text-[#3667B2] lg:text-4xl text-5xl xl:text-6xl mb-2" />
        <h1 className="text-2xl text-[#091220] font-bold mb-1">
          Contact Details
        </h1>
        <p className="text-[#5D5F61]">Provide your contact details</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center flex-grow w-full max-w-sm mx-auto"
      >
        {/* Email */}
        <div className="w-full px-2">
          <label
            htmlFor="email"
            className="mb-3 font-semibold text-[#4A4B4D] block text-left"
          >
            Company Email
          </label>
          <input
            type="text"
            id="email"
            placeholder="Enter email"
            className={`mb-4 lg:p-2 p-4 border w-full rounded-xl outline-[#3667B2] ${
              !isEmailValid ? 'border-red-500' : ''
            }`}
            value={contactEmail}
            onChange={handleEmailChange}
          />
          {!isEmailValid && (
            <p className="text-red-500 text-sm">
              Please enter a valid email address.
            </p>
          )}

          {/* Phone */}
          <label
            htmlFor="phone"
            className="mb-3 font-semibold text-[#4A4B4D] block text-left"
          >
            Company Phone
          </label>
          <input
            type="text"
            id="phone"
            placeholder="Enter phone number"
            className={`mb-4 lg:p-2 p-4 border w-full rounded-xl outline-[#3667B2] ${
              !isPhoneValid ? 'border-red-500' : ''
            }`}
            value={contactPhone}
            onChange={handlePhoneChange}
          />
          {!isPhoneValid && (
            <p className="text-red-500 text-sm">
              Please enter a valid phone number. Remove 0 from the start if
              present.
            </p>
          )}

          {/* LinkedIn */}
          <label
            htmlFor="linkedin"
            className="mb-3 font-semibold text-[#4A4B4D] block text-left"
          >
            Company LinkedIn
          </label>
          <input
            type="text"
            id="linkedin"
            placeholder="Link of your LinkedIn profile"
            className={`mb-4 lg:p-2 p-4 border w-full rounded-xl outline-[#3667B2] ${
              !isLinkedinValid ? 'border-red-500' : ''
            }`}
            value={linkedinLink}
            onChange={handleLinkedinChange}
          />
          {!isLinkedinValid && (
            <p className="text-[#FF0000] text-sm text-left">
              Please enter a valid LinkedIn URL
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center w-full space-y-2 px-2">
          <NextButton text="Finish" disabled={!isFormValid} /> {/* Disable button if form is invalid */}
          <BackButton onClick={onBack} />
        </div>
      </form>
    </div>
  )
}

export default ContactDetailsForm