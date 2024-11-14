import React, { useEffect, useState } from 'react'
import { FaPhone } from 'react-icons/fa'

interface ContactDetailsFormProps {
  onContinue: (data: {
    contactEmail: string
    phone: string
    linkedin: string
  }) => void
  onBack: () => void
  initialData: { contactEmail: string; phone: string; linkedin: string }
}

const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({
  onContinue,
  onBack,
  initialData,
}) => {
  const [contactEmail, setContactEmail] = useState(initialData.contactEmail)
  const [phone, setPhone] = useState(initialData.phone)
  const [linkedin, setLinkedin] = useState(initialData.linkedin)
  const [isLinkedinValid, setIsLinkedinValid] = useState(true)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isPhoneValid, setIsPhoneValid] = useState(true)

  useEffect(() => {
    setContactEmail(initialData.contactEmail)
    setPhone(initialData.phone)
    setLinkedin(initialData.linkedin)
  }, [initialData])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setContactEmail(value)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsEmailValid(emailRegex.test(value))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhone(value)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    setIsPhoneValid(phoneRegex.test(value))
  }

  const handleLinkedinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLinkedin(value)
    const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/.*$/
    setIsLinkedinValid(linkedinRegex.test(value))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (contactEmail && phone && linkedin && isLinkedinValid) {
      onContinue({ contactEmail, phone, linkedin })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 text-center">
      <div className="bg-white shadow-lg w-full max-w-4xl h-auto md:w-[600px] md:h-[700px] lg:w-[800px] lg:h-[600px] rounded-3xl flex flex-col justify-between p-4 sm:p-8 mx-auto">
        <div className="flex flex-col items-center mb-4 gap-1 lg:mb-8">
          <FaPhone className="text-[#3667B2] text-4xl mb-2" />
          <h1 className="text-2xl text-[#091220] font-bold mb-1">
            Contact Details
          </h1>
          <p className="text-[#5D5F61]">Provide your contact details</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center flex-grow w-full max-w-sm mx-auto"
        >
          <div className="w-full">
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
              className={`mb-4 p-2 border w-full rounded-xl ${
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
              className={`mb-4 p-2 border w-full rounded-xl ${
                !isPhoneValid ? 'border-red-500' : ''
              }`}
              value={phone}
              onChange={handlePhoneChange}
            />
            {!isPhoneValid && (
              <p className="text-red-500 text-sm">
                Please enter a valid phone number.
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
              className="mb-4 p-2 border w-full rounded-xl"
              value={linkedin}
              onChange={handleLinkedinChange}
            />
            {!isLinkedinValid && (
              <p className="text-[#FF0000] text-sm text-left">
                Please enter a valid LinkedIn URL
              </p>
            )}
          </div>
          <div className="flex flex-col items-center justify-center mt-4 lg:mt-8 w-full space-y-2">
            <button
              type="submit"
              disabled={
                !contactEmail || !phone || !linkedin || !isLinkedinValid
              }
              className={`px-6 py-2 rounded-xl transition w-full max-w-sm ${
                contactEmail && phone && linkedin && isLinkedinValid
                  ? 'bg-[#3667B2] text-white hover:bg-[#0A8568]'
                  : 'bg-[#E6EAF0] text-[#797C81] cursor-not-allowed'
              }`}
            >
              Finish
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-[#8A8B8C] hover:bg-[#3667B2] hover:border-[#2d599c] hover:text-white rounded-xl transition w-full max-w-sm text-[#797C81]"
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
