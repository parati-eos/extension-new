import React, { useState } from 'react'
import ContactIcon from '../../../assets/contact-icon.png'

interface ContactDetailsFormProps {
  onContinue: () => void
}

const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({
  onContinue,
}) => {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [linkedin, setLinkedin] = useState('')

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlephoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value)
  }

  const handleLinkedinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkedin(e.target.value)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="bg-white shadow-lg w-[920px] h-[835px] rounded-3xl flex items-center justify-center">
        <div className="p-8 w-full max-w-lg">
          <div className="flex flex-col items-center mb-8 gap-1">
            <img
              src={ContactIcon}
              alt="Contact Icon"
              className="w-16 h-16 mb-4"
            />
            <h1 className="text-2xl text-[#091220] font-bold mb-2">
              Contact Details
            </h1>
            <p className="text-[#5D5F61]">Provide your contact details</p>
          </div>
          <div className="flex flex-col items-start w-full">
            <label
              htmlFor="email"
              className="mb-2 font-semibold text-[#4A4B4D]"
            >
              Company Email
            </label>
            <input
              type="text"
              id="email"
              placeholder="Enter email"
              className="mb-4 p-2 border w-full rounded-xl"
              value={email}
              onChange={handleEmailChange}
            />
            <label
              htmlFor="phone"
              className="mb-2 font-semibold text-[#4A4B4D]"
            >
              Company Phone
            </label>
            <input
              type="text"
              id="phone"
              placeholder="Enter phone number"
              className="mb-4 p-2 border w-full rounded-xl"
              value={phone}
              onChange={handlephoneChange}
            />
            <label
              htmlFor="linkedin"
              className="mb-2 font-semibold text-[#4A4B4D]"
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
            <button
              onClick={onContinue}
              disabled={!email || !phone || !linkedin}
              className={`px-6 py-2 rounded-xl transition w-full ${
                email && phone && linkedin
                  ? 'bg-[#0A8568] text-white hover:bg-blue-600'
                  : 'bg-[#E6EAF0] text-[#797C81] cursor-not-allowed'
              }`}
            >
              Finish
            </button>
            <button className="px-6 py-2 border border-[#8A8B8C] rounded-xl transition w-full text-[#797C81] mt-4">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactDetailsForm
