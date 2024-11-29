import React, { useEffect, useState } from 'react'
import { FaPhone } from 'react-icons/fa'

interface ContactDetailsFormProps {
  onContinue: (data: {
    contactEmail: string
    contactPhone: string
    linkedinLink: string
  }) => void
  onBack: () => void
  initialData: {
    contactEmail: string
    contactPhone: string
    linkedinLink: string
  }
}

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsEmailValid(emailRegex.test(value))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setContactPhone(value)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    setIsPhoneValid(phoneRegex.test(value))
  }

  const handleLinkedinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLinkedinLink(value)
    const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/.*$/
    setIsLinkedinValid(linkedinRegex.test(value))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (contactEmail && contactPhone && linkedinLink && isLinkedinValid) {
      onContinue({ contactEmail, contactPhone, linkedinLink })
    }
  }

  return (
    <div className="flex flex-col items-center justify-start mt-[2rem] sm:mt-[4rem] lg:mt-1 min-w-full min-h-screen p-4 sm:p-6 text-center">
      <div className="w-full mt-8 sm:mt-[4rem] lg:mt-2 lg:bg-white lg:shadow-lg lg:max-w-4xl lg:w-[800px] lg:h-[600px] lg:rounded-3xl lg:flex lg:flex-col lg:justify-between lg:p-4 lg:sm:p-8 lg:mx-auto">
        <div className="flex flex-col items-center gap-1 mb-8 sm:mt-4 lg:mb-8 lg:mt-0">
          <FaPhone className="text-[#3667B2] lg:text-5xl text-6xl mb-3" />
          <h1 className="text-2xl text-[#091220] font-bold mb-1">
            Contact Details
          </h1>
          <p className="text-[#5D5F61]">Provide your contact details</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center flex-grow w-full max-w-sm mx-auto"
        >
          <div className="w-full mt-7 lg:mt-0 px-2 sm:px-0">
            <label
              htmlFor="email"
              className="mb-2 font-semibold text-[#4A4B4D] block text-left"
            >
              Company Email
            </label>
            <input
              type="text"
              id="email"
              placeholder="Enter email"
              className={`mb-4 lg:p-2 p-4 border w-full rounded-xl ${
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
            <label
              htmlFor="phone"
              className="mb-2 font-semibold text-[#4A4B4D] block text-left"
            >
              Company Phone
            </label>
            <input
              type="text"
              id="phone"
              placeholder="Enter phone number"
              className={`mb-4 lg:p-2 p-4 border w-full rounded-xl ${
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
            <label
              htmlFor="linkedin"
              className="mb-2 font-semibold text-[#4A4B4D] block text-left"
            >
              Company LinkedIn
            </label>
            <input
              type="text"
              id="linkedin"
              placeholder="Link of your LinkedIn profile"
              className="mb-4 lg:p-2 p-4 border w-full rounded-xl"
              value={linkedinLink}
              onChange={handleLinkedinChange}
            />
            {!isLinkedinValid && (
              <p className="text-[#FF0000] text-sm text-left">
                Please enter a valid LinkedIn URL
              </p>
            )}
          </div>
          <div className="flex flex-col items-center justify-center mt-[1rem] w-full space-y-2 px-2 sm:px-0">
            <button
              type="submit"
              disabled={
                !contactEmail ||
                !contactPhone ||
                !linkedinLink ||
                !isLinkedinValid
              }
              className={`px-6 py-2 mb-3 rounded-xl lg:h-[2.7rem] h-[3.3rem] transition w-full ${
                contactEmail && contactPhone && linkedinLink && isLinkedinValid
                  ? 'bg-[#3667B2] text-white hover:bg-[#0A8568]'
                  : 'bg-[#E6EAF0] text-[#797C81] cursor-not-allowed'
              }`}
            >
              Finish
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

export default ContactDetailsForm
