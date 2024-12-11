import { useState, useRef, useEffect } from 'react'
import { FaImage, FaPlus } from 'react-icons/fa'
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
  loading: boolean // Added loading state to each person
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
      loading: false, // Initial loading state for the first person
    },
  ])

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [people]);

  const handleInputChange = (value: string, index: number, field: string) => {
    const updatedPeople = [...people]
    updatedPeople[index] = { ...updatedPeople[index], [field]: value }
    setPeople(updatedPeople)
  }

  const handleImageUpload = async (file: File | null, index: number) => {
    if (!file) {
      setPeople((prevPeople) => {
        const updatedPeople = [...prevPeople]
        updatedPeople[index].image = '' // Clear existing image
        updatedPeople[index].loading = false // Set loading to false when no file
        return updatedPeople
      })
      return
    }

    setPeople((prevPeople) => {
      const updatedPeople = [...prevPeople]
      updatedPeople[index].loading = true // Set loading to true for the current person
      return updatedPeople
    })

    try {
      const url = await uploadLogoToS3(file)
      setPeople((prevPeople) => {
        const updatedPeople = [...prevPeople]
        updatedPeople[index].image = url
        updatedPeople[index].loading = false // Set loading to false after upload
        return updatedPeople
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      setPeople((prevPeople) => {
        const updatedPeople = [...prevPeople]
        updatedPeople[index].loading = false // Set loading to false on error
        return updatedPeople
      })
    }
  }

  const addNewPerson = () => {
    const currentPerson = people[people.length - 1]

    // Ensure the mandatory fields are filled before adding a new person
    if (!currentPerson.name.trim() || !currentPerson.description.trim()) {
      alert('Please fill in the required fields (Name and Description) before adding a new person.')
      return
    }

    // Limit the number of people to 6
    if (people.length >= 6) {
      alert('You can only add up to 6 people.')
      return
    }

    // Add a new person with default values
    setPeople([
      ...people,
      {
        name: '',
        designation: '',
        company: '',
        description: '',
        image: '',
        loading: false, // Initialize loading state for the new person
      },
    ])
  }

  const isAddMoreDisabled = (() => {
    const currentPerson = people[people.length - 1]
    return (
      !currentPerson.name.trim() ||
      !currentPerson.description.trim() ||
      people.length >= 6
    )
  })()

  const isGenerateDisabled = !(people.length >= 2 && // At least two people
    people[0].name.trim() &&
    people[0].designation.trim() &&
    people[0].company.trim() &&
    people[0].description.trim() &&
    people[0].image &&
    people[1].name.trim() && // Ensure the second person also has filled fields
    people[1].designation.trim() &&
    people[1].company.trim() &&
    people[1].description.trim() &&
    people[1].image
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
      <div className="flex items-center justify-between w-full p-4">
        <h2 className="hidden md:block md:text-lg font-semibold text-[#091220]">
          {heading}
        </h2>
        <BackButton onClick={onBack} />
      </div>

      <div
        ref={containerRef}
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
              {person.image && (
                <div className="flex items-center gap-2">
                  <img
                    src={person.image}
                    alt="Uploaded"
                    className="w-8 h-8 object-cover border border-gray-300"
                  />
                  <button
                    onClick={() => handleImageUpload(null, index)} // Trigger reupload
                    className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 hover:text-blue-800 transition-all duration-200"
                  >
                    Change Image
                  </button>
                </div>
              )}

              {!person.image && !person.loading && (
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

              {person.loading && <span className="text-gray-500">Uploading...</span>}
            </div>

            {index === people.length - 1 && window.innerWidth >= 768 && (
             <button
             onClick={addNewPerson}
             disabled={isAddMoreDisabled}
             className={`flex w-[47%] lg:w-[180px] items-center justify-center gap-x-2 py-2 md:border md:border-gray-300 md:rounded-lg  text-[#5D5F61] ${
               isAddMoreDisabled
                 ? 'bg-[#E1E3E5] text-[#5D5F61] cursor-not-allowed' // Disabled state
              : 'bg-white text-[#5D5F61] hover:bg-[#3667B2] hover:text-white' // Active state
             }`}
           >
             <FaPlus className="text-[#000000]" />
             Add More People
           </button>
            )}
          </div>
        ))}
      </div>

      <div
        className={`mt-auto py-2 gap-2 flex w-full px-4 justify-between lg:justify-end lg:w-auto lg:gap-4 ${
          window.innerWidth >= 768 ? 'absolute bottom-4 right-4' : ''
        }`}
      >
        {window.innerWidth < 768 && (
          <button
            onClick={addNewPerson}
            disabled={isAddMoreDisabled}
            className={`flex w-[47%] lg:w-[180px] md:hidden items-center justify-center gap-x-2 py-2 md:border md:border-gray-300 md:rounded-lg  text-[#5D5F61] ${
              isAddMoreDisabled
                ? 'bg-[#E1E3E5] text-[#5D5F61] cursor-not-allowed' // Disabled state
              : 'bg-white text-[#5D5F61] hover:bg-[#3667B2] hover:text-white' // Active state
            }`}
          >
             <FaPlus className="text-[#000000]" />
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
