import uploadLogoToS3 from '../../../utils/uploadLogoToS3'
import React, { useEffect, useState } from 'react'
import { FaImage, FaBullseye } from 'react-icons/fa'
import { LogoFormProps } from '../../../types/onboardingTypes'
import { BackButton, NextButton } from '../shared/Buttons'

const LogoForm: React.FC<LogoFormProps> = ({
  onContinue,
  onBack,
  initialData,
}) => {
  const [logo, setLogo] = useState<string | null>(initialData)
  const [isUploading, setIsUploading] = useState(false)

  // Update URL preview if initialData changes
  useEffect(() => {
    if (initialData) {
      setLogo(initialData)
    }
  }, [initialData])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIsUploading(true) // Indicate uploading

      try {
        // Upload file to S3 and get the URL
        const url = await uploadLogoToS3(file)
        setLogo(url)
      } catch (error) {
        console.error('Error uploading logo:', error)
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleButtonClick = () => {
    document.getElementById('companyLogo')?.click()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (logo) {
      onContinue({ logo }) // Send URL to parent on form submit
    }
  }

  return (
    <div className="w-full mt-[4rem] xl:mt-[2rem] 2xl:mt-[3rem] md:h-[90%] md:w-[80%] md:bg-white md:shadow-lg md:rounded-3xl md:flex md:flex-col md:justify-between md:p-4">
      {/* Heading */}
      <div className="flex flex-col items-center gap-1 mb-8">
        <FaBullseye className="text-[#3667B2] lg:text-4xl text-6xl xl:text-6xl mb-2" />
        <h1 className="text-2xl text-[#091220] font-bold mb-1">Company Logo</h1>
        <p className="text-[#5D5F61]">Upload your company logo</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center flex-grow w-full max-w-sm mx-auto"
      >
        {/* Input */}
        <div
          className={`w-[90%] md:w-full border border-gray-200 mt-6 md:mt-6 ${
            logo !== '' ? 'md:mt-4' : ''
          } p-10 rounded-lg hover:scale-105`}
        >
          <input
            type="file"
            id="companyLogo"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center">
            {logo ? (
              <img
                src={logo}
                alt="Uploaded Logo"
                className="w-16 h-16 lg:w-24 lg:h-24 object-fit mb-2"
              />
            ) : (
              <>
                <FaImage className="text-gray-500 text-4xl mb-4" />
                <p className="text-gray-500 mb-4">
                  {isUploading ? 'Uploading...' : 'Upload Your Logo'}
                </p>
              </>
            )}
            <button
              type="button"
              onClick={handleButtonClick}
              className="px-4 py-2 border font-semibold rounded-xl text-gray-500 hover:bg-[#3667B2] hover:border-none hover:text-white transition"
            >
              {logo ? 'Upload Again' : 'Upload Logo'}
            </button>
          </div>
        </div>

        {/* Button */}
        <div
          className={`flex flex-col items-center justify-center mt-[3.5rem] md:mt-7 ${
            logo !== '' ? 'md:mt-1' : ''
          } w-full space-y-2 px-2`}
        >
          <NextButton disabled={!logo} text={'Next'} />
          <BackButton onClick={onBack} />
        </div>
      </form>
    </div>
  )
}

export default LogoForm
