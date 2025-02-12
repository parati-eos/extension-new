import React, { useEffect, useState } from 'react'
import { FaPhone } from 'react-icons/fa'
import { ContactDetailsFormProps } from '../../../types/onboardingTypes'
import { BackButton, NextButton } from '../shared/Buttons'

const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({
  onContinue,
  onBack,
  initialData,
  isNextLoading,
}) => {
  const [contactEmail, setContactEmail] = useState(
    initialData.contactEmail || ''
  )
  const [contactPhone, setContactPhone] = useState(
    initialData.contactPhone || ''
  )
  const [linkedinLink, setLinkedinLink] = useState(
    initialData.linkedinLink || ''
  )
  const [isLinkedinValid, setIsLinkedinValid] = useState(true)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isPhoneValid, setIsPhoneValid] = useState(true)

  useEffect(() => {
    setContactEmail(initialData.contactEmail || '')
    setContactPhone(initialData.contactPhone || '')
    setLinkedinLink(initialData.linkedinLink || '')
  }, [initialData])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setContactEmail(value)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    setIsEmailValid(value === '' || emailRegex.test(value)) // Valid if empty or matches regex
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
  
    // Remove all non-numeric characters
    value = value.replace(/\D/g, '');
  
    // Prevent leading zeros
    if (value.startsWith('0')) {
      value = value.substring(1);
    }
  
    // Limit the input to 10 digits
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
  
    setContactPhone(value);
  
    // Validate the phone number (exactly 10 digits)
    const phoneRegex = /^[1-9]\d{9}$/;
    setIsPhoneValid(phoneRegex.test(value));
  };

  const handleLinkedinFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!linkedinLink) {
      setLinkedinLink("https://"); // Pre-fill "https://" only if input is empty
    }
  };
  
  const handleLinkedinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  
    // Allow backspace to clear the input
    if (value === "") {
      setLinkedinLink(""); // Allow user to completely clear input
      return;
    }
  
    
  
    const linkedinRegex =
      /^https:\/\/(www\.)?linkedin\.com\/(in|company|pub)\/[a-zA-Z0-9_-]{3,}\/?$/;
  
    setIsLinkedinValid(linkedinRegex.test(value)); // Validate LinkedIn URL
    setLinkedinLink(value); // Update state
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onContinue({ contactEmail, contactPhone, linkedinLink })
  }

  // Form is valid if all filled fields are valid or all fields are empty
  const isFormValid =
    (contactEmail === '' && contactPhone === '' && linkedinLink === '') || // All empty
    ((contactEmail === '' || isEmailValid) &&
      (contactPhone === '' || isPhoneValid) &&
      (linkedinLink === '' || isLinkedinValid)) // At least one filled and valid

  return (
    <div className="lg:p-0 p-2 w-full mt-[4rem] xl:mt-[2rem] 2xl:mt-[3rem] md:h-[90%] md:w-[80%] md:bg-white md:shadow-lg md:rounded-3xl md:flex md:flex-col md:items-center md:justify-between md:p-4">
      {/* Heading Section */}
      <div className="flex flex-col items-center gap-2 mb-6">
        <FaPhone className="text-[#3667B2] text-5xl xl:text-6xl mb-2" />
        <h1 className="text-2xl text-[#091220] font-bold">Contact Details</h1>
        <p className="text-[#5D5F61]">Provide your contact details</p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto flex-grow flex flex-col justify-center">
        <div className="flex flex-col gap-4">
          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#4A4B4D]">Email</label>
            <input
              type="text"
              placeholder="Enter email"
              className={`p-3 border w-full rounded-xl outline-[#3667B2] ${!isEmailValid ? 'border-red-500' : ''}`}
              value={contactEmail}
              onChange={handleEmailChange}
            />
            {!isEmailValid && <p className="text-red-500 text-sm">Invalid email address.</p>}
          </div>

          {/* Phone Input */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#4A4B4D]">Phone</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              className={`p-3 border w-full rounded-xl outline-[#3667B2] ${!isPhoneValid && contactPhone ? 'border-red-500' : ''}`}
              value={contactPhone}
              onChange={handlePhoneChange}
            />
            {!isPhoneValid && contactPhone && <p className="text-red-500 text-sm">Invalid phone number.</p>}
          </div>

          {/* LinkedIn Input */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#4A4B4D]">LinkedIn</label>
            <input
              type="text"
              placeholder="Enter LinkedIn URL"
              className={`p-3 border w-full rounded-xl outline-[#3667B2] ${!isLinkedinValid && linkedinLink ? 'border-red-500' : ''}`}
              value={linkedinLink}
              onChange={handleLinkedinChange}
            />
            {!isLinkedinValid && linkedinLink && <p className="text-red-500 text-sm">Invalid LinkedIn URL.</p>}
          </div>
        </div>
      </form>

      {/* Button Section */}
     {/* Button Section */}
<div className="lg:w-[40%] flex flex-col items-center lg:p-2 py-4 px-2 mt-auto lg:pb-20 gap-2">
  {isNextLoading ? (
    <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
  ) : contactEmail.length > 0 || contactPhone.length > 0 || linkedinLink.length > 0 ? (
    // Show "Finish" button if any field is filled
    <NextButton text="Finish" disabled={!isFormValid}  onClick={handleSubmit} />
  ) : (
    // Show "Skip" button if all fields are empty
    <NextButton text="Skip" onClick={() => onContinue({ contactEmail: '', contactPhone: '', linkedinLink: '' })} />
  )}
  <BackButton onClick={onBack} />
</div>

    </div>
  );
};

export default ContactDetailsForm;
