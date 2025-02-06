import uploadFileToS3 from '../../../utils/uploadFileToS3'
import React, { useEffect, useState } from 'react'
import { FaImage, FaBullseye, FaPalette } from 'react-icons/fa'
import { LogoFormProps } from '../../../types/onboardingTypes'
import { BackButton, NextButton } from '../shared/Buttons'
import { toast } from 'react-toastify'
import removeBackground from '../../../utils/removeBG'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

const LogoForm: React.FC<LogoFormProps> = ({
  onContinue,
  onBack,
  initialData,
  isNextLoading,
}) => {
  const [logo, setLogo] = useState<string | null>(initialData)
  const [isUploading, setIsUploading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [primaryColor, setPrimaryColor] = useState('#3667B2')
  const [secondaryColor, setSecondaryColor] = useState('#5D5F61')

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
    if (logo) {
      onContinue({ logo }) // Send URL to parent on form submit
    }
  }

  return (
    <div className="lg:p-0 p-2 w-full h-full xl:mt-[2rem] 2xl:mt-[3rem] md:h-[90%] md:w-[80%] md:bg-white md:shadow-lg md:rounded-3xl md:flex md:flex-col  md:p-4">
      {/* Heading */}
      <div className='w-full justify-center'>
      <div className="flex flex-col justify-center items-center gap-1 lg:mb-8">
        <FaBullseye className="text-[#3667B2] lg:text-4xl text-6xl xl:text-6xl mb-2" />
        <h1 className="text-2xl text-[#091220] font-bold mb-1">Branding</h1>
        <p className="text-[#5D5F61]">Upload your company logo</p>
      </div>

        <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center  flex-grow w-full justify-center  mx-auto"
      >
          <div className='flex flex-col md:flex-row  w-full gap-2 px-4'>
          {/* Input */}
        <div
          className={`md:w-full bg-white shadow-lg  rounded-3xl flex flex-col items-center p-6 ${
            logo !== '' ? 'md:mt-0' : ''
          } p-7  hover:scale-105`}
        >
          <input
            type="file"
            id="companyLogo"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="h-full w-full flex flex-col items-center justify-center mx-auto">
            {logo ? (
              <img
                src={logo}
                alt="Uploaded Logo"
                 className="w-24 h-24 rounded-full  shadow-md object-contain aspect-auto"
              />
            ) : (
              <>
                <FaImage className="text-gray-500 text-4xl mb-4" />
                <p className="text-gray-500 mb-4">
                  {isUploading ? 'Uploading...' : 'Upload Your Logo'}
                </p>
              </>
            )}
            <div className='p-2'>
            <button
              type="button"
              onClick={handleButtonClick}
              className="px-4 py-2 border font-semibold rounded-xl text-gray-500 hover:bg-[#3667B2] hover:border-none hover:text-white transition"
            >
              {logo ? 'Upload Again' : 'Upload Logo'}
            </button>
          </div>
          </div>
        </div>
            {/* Branding Color Section */}
      <div className="md:h-full md:w-full bg-white shadow-lg  rounded-3xl flex flex-col items-center hover:scale-105 p-6">
        <FaPalette className="text-gray-500 text-6xl mb-4 h-10 w-10" />
        <h2 className="text-2xl font-bold text-[#091220] mb-2">Select Branding Colours</h2>
        <p className="text-[#5D5F61]">Choose your primary and secondary colors</p>

        {/* Color Preview */}
        <div className="flex space-x-4 mt-6">
          <div className="w-12 h-12 rounded-full border border-gray-300" style={{ backgroundColor: primaryColor }} />
          <div className="w-12 h-12 rounded-full border border-gray-300" style={{ backgroundColor: secondaryColor }} />
        </div>

        {/* Open Modal Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 px-4 py-2 bg-[#3667B2] text-white rounded-xl hover:bg-[#274b8a] transition"
        >
          Choose Colours
        </button>
      </div>
      </div>
          {/* Buttons */}
          <div className="flex flex-col items-center justify-center mt-6 space-y-2 w-full max-w-sm">
          {isNextLoading ? (
            <div className="w-full flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
            </div>
          ) : (
            <NextButton disabled={!logo} text={'Next'} />
          )}

          {/* Back Button */}
          <BackButton onClick={onBack} />
        </div>
            </form>    
      </div>

    
{/* Color Selection Modal */}
<Transition appear show={isModalOpen} as={Fragment}>
  <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <Dialog.Panel className="bg-white p-4 rounded-2xl shadow-lg w-[90%] max-w-md">
        <Dialog.Title className="text-xl font-bold text-[#091220] mb-4">Select Branding Colours</Dialog.Title>

        <div className="space-y-6">
          {/* Primary Color */}
          <div className=" items-center grid grid-cols-3 gap-2 ">
            <label className="font-semibold text-gray-700">Primary Color:</label>
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-24 p-2  border border-gray-300 rounded-lg text-center shadow-sm focus:ring-2 focus:ring-[#3667B2] outline-none"
            />
          <div className="relative w-12 h-12">
  <input
    type="color"
    value={primaryColor}
    onChange={(e) => setPrimaryColor(e.target.value)}
    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
  />
  <div
    className="w-12 h-12 rounded-full border border-gray-300 shadow-md cursor-pointer transition-transform hover:scale-110"
    style={{ backgroundColor: primaryColor }}
  />
</div>

         
          </div>

          {/* Secondary Color */}
          <div className=" items-center grid grid-cols-3  gap-2 ">
            <label className="font-semibold text-gray-700">Secondary Color:</label>
            <input
              type="text"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="w-24 p-2 border border-gray-300 rounded-lg text-center shadow-sm focus:ring-2 focus:ring-[#3667B2] outline-none"
            />
          <div className="relative w-12 h-12">
  <input
    type="color"
    value={secondaryColor}
    onChange={(e) => setPrimaryColor(e.target.value)}
    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
  />
  <div
    className="w-12 h-12 rounded-full border border-gray-300 shadow-md cursor-pointer transition-transform hover:scale-110"
    style={{ backgroundColor: secondaryColor }}
  />
</div>

          
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-[#3667B2] text-white rounded-lg hover:bg-[#274b8a] transition-all shadow-md"
            onClick={() => setIsModalOpen(false)}
          >
            Save
          </button>
        </div>
      </Dialog.Panel>
    </div>
  </Dialog>
</Transition>

    </div>
  )
}

export default LogoForm
