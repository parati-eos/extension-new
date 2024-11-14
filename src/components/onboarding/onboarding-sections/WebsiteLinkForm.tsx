import React, { useEffect, useState } from 'react'
import { FaGlobe } from 'react-icons/fa'

interface WebsiteLinkFormProps {
  onContinue: (data: { websiteLink: string }) => void
  onBack: () => void
  initialData: string
}

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 text-center">
      <div className="bg-white shadow-lg w-full max-w-4xl h-auto md:w-[600px] md:h-[700px] lg:w-[800px] lg:h-[600px] rounded-3xl flex flex-col justify-between p-4 sm:p-8 mx-auto">
        <div className="flex flex-col items-center mb-4 gap-1 lg:mb-8">
          <FaGlobe className="text-[#3667B2] text-4xl mb-2" />
          <h1 className="text-2xl text-[#091220] font-bold mb-1">
            Website Link
          </h1>
          <p className="text-[#5D5F61]">Provide your website link</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center flex-grow lg:my-8 w-full max-w-sm mx-auto"
        >
          <div className="w-full">
            <label
              htmlFor="websiteLink"
              className="mb-2 font-semibold text-[#4A4B4D] block text-left"
            >
              Website Link
            </label>
            <input
              type="text"
              id="websiteLink"
              placeholder="Enter website link"
              className="mb-4 p-2 border w-full rounded-xl"
              value={websiteLink}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col items-center justify-center mt-4 lg:mt-8 w-full space-y-2">
            <button
              type="submit"
              disabled={!websiteLink}
              className={`px-6 py-2 rounded-xl transition w-full max-w-sm ${
                websiteLink
                  ? 'bg-[#3667B2] text-white hover:bg-[#0A8568]'
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

export default WebsiteLinkForm
