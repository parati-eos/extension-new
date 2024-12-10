import { useState } from 'react'
import { FaImage } from 'react-icons/fa'
import uploadLogoToS3 from '../../../utils/uploadLogoToS3'
import axios from 'axios'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../ViewPresentation'

interface PeopleProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
}

interface IPerson {
  name: string
  image: string
  designation: string
  company: string
  description: string
}

export default function People({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
}: PeopleProps) {
  const [people, setPeople] = useState<IPerson[]>([
    {
      name: '',
      designation: '',
      company: '',
      description: '',
      image: '',
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (value: string, index: number, field: string) => {
    const updatedPeople = [...people]
    updatedPeople[index] = { ...updatedPeople[index], [field]: value }
    setPeople(updatedPeople)
  }

  const handleImageUpload = async (file: File | null, index: number) => {
    if (file) {
      setIsLoading(true)
      try {
        const url = await uploadLogoToS3(file)
        setPeople((prevPeople) => {
          const updatedPeople = [...prevPeople]
          updatedPeople[index].image = url
          return updatedPeople
        })
      } catch (error) {
        console.error('Error uploading image:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const addNewPerson = () => {
    const currentPerson = people[people.length - 1]

    if (
      currentPerson.name &&
      currentPerson.designation &&
      currentPerson.company &&
      currentPerson.description &&
      currentPerson.image
    ) {
      if (people.length < 6) {
        setPeople([
          ...people,
          {
            name: '',
            designation: '',
            company: '',
            description: '',
            image: '',
          },
        ])
      }
    }
  }

  const isAddMoreDisabled = (() => {
    const currentPerson = people[people.length - 1]
    return (
      !currentPerson.name.trim() ||
      !currentPerson.designation.trim() ||
      !currentPerson.company.trim() ||
      !currentPerson.description.trim() ||
      !currentPerson.image ||
      people.length >= 6
    )
  })()

  // Enable "Generate Slide" if at least one person is fully filled out
  const isGenerateDisabled = !(
    people.length > 0 &&
    people[0].name.trim() &&
    people[0].designation.trim() &&
    people[0].company.trim() &&
    people[0].description.trim() &&
    people[0].image
  )

  const handleGenerateSlide = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/people`,
        {
          type: 'people',
          title: heading,
          documentID: documentID,
          data: {
            slideName: heading,
            people: people,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      alert('Data successfully sent to the server!')
      console.log('Server response:', response.data)
    } catch (error) {
      console.error('Error sending data:', error)
      alert('Failed to send data.')
    }
  }

  const onBack = () => {
    setDisplayMode('customBuilder')
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* Heading Section */}
      <div className="flex items-center justify-between w-full p-4">
        <h2 className="hidden md:block md:text-lg font-semibold text-[#091220]">
          {heading}
        </h2>
        <BackButton onClick={onBack} />
      </div>

      {/* Input Section */}
      <div
        className={`flex-1 px-4 overflow-y-auto md:mt-1 ${
          people.length > 3 ? 'max-h-[calc(100vh-200px)]' : ''
        }`}
      >
        {people.map((person, index) => (
          <div
            key={index}
            className={`flex flex-col gap-4 mb-4 ${
              index === people.length - 1 ? 'lg:mb-8' : ''
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-4 w-full">
              <input
                type="text"
                value={person.name}
                onChange={(e) =>
                  handleInputChange(e.target.value, index, 'name')
                }
                placeholder="Name"
                className="p-2 border border-gray-300 rounded-md lg:rounded-lg"
              />
              <input
                type="text"
                value={person.designation}
                onChange={(e) =>
                  handleInputChange(e.target.value, index, 'designation')
                }
                placeholder="Designation"
                className="p-2 border border-gray-300 rounded-md lg:rounded-lg"
              />
              <input
                type="text"
                value={person.company}
                onChange={(e) =>
                  handleInputChange(e.target.value, index, 'company')
                }
                placeholder="Company"
                className="p-2 border border-gray-300 rounded-md lg:rounded-lg"
              />
            </div>

            <input
              type="text"
              value={person.description}
              onChange={(e) =>
                handleInputChange(e.target.value, index, 'description')
              }
              placeholder="Description"
              className="w-full p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center gap-2">
              {!person.image && !isLoading && (
                <label className="flex items-center gap-6 md:gap-2 border border-gray-300 px-4 py-2 rounded-md w-[100%] lg:w-[32%] cursor-pointer text-blue-500">
                  <FaImage />
                  <span className="hidden md:block">Select Image</span>
                  <span className="md:hidden">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleImageUpload(e.target.files?.[0] || null, index)
                    }
                  />
                </label>
              )}
              {isLoading && <span className="text-gray-500">Uploading...</span>}
              {person.image && (
                <img
                  src={person.image}
                  alt="Uploaded"
                  className="w-8 h-8 object-cover border border-gray-300"
                />
              )}
            </div>

            {/* Add More People Button - Medium/Large Screens */}
            {index === people.length - 1 && window.innerWidth >= 768 && (
              <button
                onClick={addNewPerson}
                disabled={isAddMoreDisabled}
                className={`hidden lg:flex items-center justify-center w-[12%] py-2 rounded-md ${
                  isAddMoreDisabled
                    ? 'bg-gray-200 text-gray-500'
                    : 'bg-[#3667B2] text-white'
                }`}
              >
                Add people
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Button Section */}
      <div
        className={`mt-auto py-2 gap-2 flex w-full px-4 justify-between lg:justify-end lg:w-auto lg:gap-4 ${
          window.innerWidth >= 768 ? 'absolute bottom-4 right-4' : ''
        }`}
      >
        {/* Add More People Button - Mobile/Small Screens */}
        {window.innerWidth < 768 && (
          <button
            onClick={addNewPerson}
            disabled={isAddMoreDisabled}
            className={`flex w-[47%] lg:w-[180px] md:hidden items-center justify-center gap-x-2 py-2 rounded-md ${
              isAddMoreDisabled
                ? 'bg-gray-200 text-gray-500'
                : 'bg-[#3667B2] text-white'
            }`}
          >
            Add More People
          </button>
        )}

        <button
          onClick={handleGenerateSlide}
          disabled={isGenerateDisabled}
          className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md transition-all duration-200 transform ${
            isGenerateDisabled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-[#3667B2] text-white hover:bg-[#2c56a0] hover:scale-105 active:scale-95'
          }`}
        >
          Generate Slide
        </button>
      </div>
    </div>
  )
}
