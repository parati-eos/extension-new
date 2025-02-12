import uploadFileToS3 from '../../../utils/uploadFileToS3'
import React, { useEffect, useState } from 'react'
import { FaImage, FaBullseye } from 'react-icons/fa'
import { LogoFormProps } from '../../../types/onboardingTypes'
import { BackButton, NextButton } from '../shared/Buttons'
import { toast } from 'react-toastify'
import removeBackground from '../../../utils/removeBG'

const LogoForm: React.FC<LogoFormProps> = ({
  onContinue,
  onBack,
  initialData,
  isNextLoading,
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
      // Validation logic
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
      const maxSize = 5 * 1024 * 1024 // 5 MB
      const validType = allowedTypes.includes(file.type)
      const validSize = file.size <= maxSize

      if (!validType) {
        toast.error('Invalid file type. Please upload a PNG or JPEG image.', {
          position: 'top-right',
          autoClose: 3000,
        })
        return
      }

      if (!validSize) {
        toast.error('File size exceeds 5 MB. Please upload a smaller file.', {
          position: 'top-right',
          autoClose: 3000,
        })
        return
      }
      setIsUploading(true) // Indicate uploading

      try {
        // Upload file to S3 and get the URL
        const processedFile = await removeBackground(file)
        const processedLogo = {
          name: processedFile.name,
          type: processedFile.type,
          body: processedFile,
        }
        const url = await uploadFileToS3(processedLogo)
        setLogo(url)
      } catch (error) {
        toast.error('Error uploading logo', {
          position: 'top-right',
          autoClose: 3000,
        })
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
    onContinue({ logo: logo ?? '' }) // Ensure logo is always a string
  }

  return (
    <div className="lg:p-0 p-2 w-full mt-[4rem] xl:mt-[2rem] 2xl:mt-[3rem] md:h-[90%] md:w-[80%] md:bg-white md:shadow-lg md:rounded-3xl md:flex md:flex-col md:items-center md:justify-between md:p-4">
      
      {/* Heading Section */}
      <div className="flex flex-col items-center gap-1">
        <FaBullseye className="text-[#3667B2] text-6xl lg:text-4xl xl:text-6xl mb-2" />
        <h1 className="text-2xl text-[#091220] font-bold mb-1">Branding</h1>
        <p className="text-[#5D5F61]">Upload your company logo</p>
      </div>

      {/* Input Section */}
      <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto p-12">
        <div
          className="w-full border border-gray-200 p-7 rounded-lg hover:scale-105 flex flex-col items-center"
        >
          <input
            type="file"
            id="companyLogo"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {logo ? (
            <img
              src={logo}
              alt="Uploaded Logo"
              className="w-24 h-24 rounded-full shadow-md object-contain aspect-auto"
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
            className="mt-2 px-4 py-2 border font-semibold rounded-xl text-gray-500 hover:bg-[#3667B2] hover:border-none hover:text-white transition"
          >
            {logo ? 'Upload Again' : 'Upload Logo'}
          </button>
        </div>
      </form>

{/* Buttons - Positioned moderately above the bottom using `mt-auto` */}
<div className="lg:w-[40%] w-full flex flex-col items-center p-2 mt-auto lg:pb-20 gap-2">
  {isNextLoading ? (
    <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
  ) : logo ? ( 
    // If logo exists, show Continue button
    <NextButton text={'Continue'} onClick={handleSubmit} />
  ) : ( 
    // If no logo, show Skip button (Wrapped in an arrow function)
    <NextButton text={'Skip'} onClick={() => onContinue({ logo: '' })} />
  )}
  <BackButton onClick={onBack} />
</div>


    </div>
  )
}

export default LogoForm