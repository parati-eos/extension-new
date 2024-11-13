import React, { useEffect, useState } from 'react'
import { FaImage, FaBullseye } from 'react-icons/fa'

interface CompanyNameFormProps {
  onContinue: (data: { logo: File }) => void
  onBack: () => void
  initialData: File | null
}

const CompanyNameForm: React.FC<CompanyNameFormProps> = ({
  onContinue,
  onBack,
  initialData,
}) => {
  const [logo, setLogo] = useState<File | null>(initialData)

  useEffect(() => {
    if (initialData) {
      setLogo(initialData)
    }
  }, [initialData])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    document.getElementById('companyLogo')?.click()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (logo) {
      onContinue({ logo })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 text-center">
      <div className="bg-white shadow-lg w-full max-w-4xl h-auto lg:w-[800px] lg:h-[600px] rounded-3xl flex flex-col justify-between p-4 sm:p-8 mx-auto">
        <div className="flex flex-col items-center mb-4 gap-1 lg:mb-8">
          <FaBullseye className="text-[#3667B2] text-4xl mb-2" />
          <h1 className="text-2xl text-[#091220] font-bold mb-1">
            Company Logo
          </h1>
          <p className="text-[#5D5F61]">Upload your company logo</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center flex-grow w-full max-w-sm mx-auto"
        >
          <div className="w-full max-w-sm border border-gray-300 rounded-xl p-4 h-72 flex flex-col justify-center items-center md:transition-transform md:transform md:hover:scale-105">
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
                  src={URL.createObjectURL(logo)}
                  alt="Uploaded Logo"
                  className="w-24 h-24 lg:w-48 lg:h-48 object-contain mb-4"
                />
              ) : (
                <>
                  <FaImage className="text-gray-500 text-4xl mb-4" />
                  <p className="text-gray-500 mb-4">
                    Select or drag to upload your logo
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
          <div className="flex flex-col items-center justify-center mt-4 lg:mt-8 w-full space-y-2">
            <button
              type="submit"
              disabled={!logo}
              className={`px-6 py-2 rounded-xl transition w-full max-w-sm ${
                logo
                  ? 'bg-[#0A8568] text-white hover:bg-[#3667B2]'
                  : 'bg-[#E6EAF0] text-[#797C81] cursor-not-allowed'
              }`}
            >
              Next
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

export default CompanyNameForm
