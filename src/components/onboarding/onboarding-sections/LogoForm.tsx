import uploadLogoToS3 from '../../../utils/uploadLogoToS3'
import React, { useEffect, useState } from 'react'
import { FaImage, FaBullseye } from 'react-icons/fa'
import { LogoFormProps } from '../../../types/onboardingTypes'

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
    <div className="w-full mt-[4rem] sm:mt-[4rem] lg:mt-2 lg:bg-white lg:shadow-lg lg:max-w-4xl lg:w-[800px] lg:h-[600px] lg:rounded-3xl lg:flex lg:flex-col lg:justify-between lg:p-4 lg:sm:p-8 lg:mx-auto">
      <div className="flex flex-col items-center gap-1 mb-8 sm:mt-4 lg:mb-8 lg:mt-0">
        <FaBullseye className="text-[#3667B2] lg:text-4xl text-6xl mb-3" />
        <h1 className="text-2xl text-[#091220] font-bold mb-1">Company Logo</h1>
        <p className="text-[#5D5F61]">Upload your company logo</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center flex-grow w-full max-w-sm mx-auto"
      >
        <div className="w-[90vw] mt-[0.5rem] lg:mt-0 max-w-sm border border-gray-300 rounded-xl p-4 h-72 flex flex-col justify-center items-center md:transition-transform md:transform md:hover:scale-105">
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
                className="w-24 h-24 lg:w-48 lg:h-48 object-contain mb-4"
              />
            ) : (
              <>
                <FaImage className="text-gray-500 text-4xl mb-4" />
                <p className="text-gray-500 mb-4">
                  {isUploading
                    ? 'Uploading...'
                    : 'Select or drag to upload your logo'}
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
        <div className="flex flex-col items-center justify-center lg:mt-6 mt-14 w-[92vw] space-y-2 px-2 sm:px-0">
          <button
            type="submit"
            disabled={!logo}
            className={`px-6 py-2 lg:mb-2 mb-3 rounded-xl lg:h-12 h-[3.3rem] transition lg:w-[31%] w-full ${
              logo
                ? 'bg-[#3667B2] text-white hover:bg-[#0A8568]'
                : 'bg-[#E6EAF0] text-[#797C81] cursor-not-allowed'
            }`}
          >
            Next
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 h-[3.3rem] lg:h-12 border border-[#8A8B8C] hover:bg-[#3667B2] hover:border-[#2d599c] hover:text-white rounded-xl transition w-full lg:w-[31%] text-[#797C81]"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  )
}

export default LogoForm
