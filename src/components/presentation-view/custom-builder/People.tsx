import { useState, useRef, useEffect } from 'react'
import { FaImage, FaPlus } from 'react-icons/fa'
import uploadLogoToS3 from '../../../utils/uploadLogoToS3'
import axios from 'axios'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../../../types/presentationView'
import { toast } from 'react-toastify'

interface PeopleProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
  outlineID: string
  setIsSlideLoading: () => void
}

export default function People({
  heading,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
  outlineID,
  setIsSlideLoading,
}: PeopleProps) {
  const [people, setPeople] = useState([
    {
      name: '',
      designation: '',
      company: '',
      description: '',
      image: '',
      loading: false,
    },
    {
      name: '',
      designation: '',
      company: '',
      description: '',
      image: '',
      loading: false,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isFirstRender = useRef(true) // Tracks if it's the first render
  const [isUserInteracting, setIsUserInteracting] = useState(false) // Tracks user interaction

  // Detect and handle user interaction (scrolling manually)
  useEffect(() => {
    const container = containerRef.current

    if (container) {
      const handleScroll = () => {
        const nearBottom =
          Math.abs(
            container.scrollHeight -
              container.scrollTop -
              container.clientHeight
          ) < 1

        // If not near the bottom, assume user interaction
        setIsUserInteracting(!nearBottom)
      }

      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Handle scroll logic for the first render and subsequent updates
  useEffect(() => {
    const container = containerRef.current

    if (container) {
      if (isFirstRender.current) {
        // Delay the scroll setting to ensure DOM content is fully rendered
        requestAnimationFrame(() => {
          container.scrollTop = 0 // Explicitly set scroll to the top
        })
        isFirstRender.current = false // Mark first render as complete
      } else if (!isUserInteracting) {
        // Only scroll to the bottom if the user is not interacting
        container.scrollTop = container.scrollHeight
      }
    }
  }, [people, isUserInteracting])

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
      toast.error('Error uploading image', {
        position: 'top-right',
        autoClose: 2000,
      })
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
      alert(
        'Please fill in the required fields (Name and Description) before adding a new person.'
      )
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

  const handleGenerateSlide = async () => {
    setIsSlideLoading()
    setIsLoading(true)

    // Filter out the loading property from each person
    const payloadPeople = people.map(({ loading, ...rest }) => rest)

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/people`,
        {
          type: 'People',
          documentID: documentID,
          data: {
            slideName: heading,
            title: heading,
            people: payloadPeople,
          },
          outlineID: outlineID,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      toast.success('Data successfully sent to the server!', {
        position: 'top-right',
        autoClose: 2000,
      })
      setIsLoading(false)
      setDisplayMode('slides')
      console.log('Server response:', response.data)
    } catch (error) {
      toast.error('Error sending data', {
        position: 'top-right',
        autoClose: 2000,
      })
    }
  }

  const handleNameChange = (value: string, index: number) => {
    // Ensure that only alphabetic characters and spaces are allowed in the name input
    const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '')
    handleInputChange(sanitizedValue, index, 'name')
  }

  const [showTooltip, setShowTooltip] = useState(false)
  const isGenerateDisabled = !(
    people[0].name.trim() &&
    people[0].description.trim() &&
    people[1].name.trim() &&
    people[1].description.trim()
  )

  const onBack = () => {
    setDisplayMode('customBuilder')
  }

  return (
    <div className="flex flex-col w-full h-full p-2 lg:p-4">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between w-full">
            <h3 className="text-semibold">People</h3>
            <BackButton onClick={onBack} />
          </div>
          <h2 className="hidden lg:block md:text-lg font-semibold text-[#091220]">
            {heading}
          </h2>
          <div
            ref={containerRef}
            className={`flex-1 lg:px-2 overflow-y-auto scrollbar-none md:mt-1 ${
              people.length > 3 ? 'max-h-[calc(100vh-200px)]' : ''
            }`}
          >
            {people.map((person, index) => (
              <div
                key={index}
                className={`flex flex-col gap-4 mb-2 p-1 ${
                  index === people.length - 1 ? 'lg:mb-4' : ''
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-4 w-full mt-2 ">
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => handleNameChange(e.target.value, index)}
                    placeholder={`Enter Name ${index + 1}`}
                    className="p-2 border border-gray-300 rounded-md lg:rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={person.designation}
                    onChange={(e) =>
                      handleInputChange(e.target.value, index, 'designation')
                    }
                    placeholder={`Enter Designation ${index + 1}`}
                    className="p-2 border border-gray-300 rounded-md lg:rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={person.company}
                    onChange={(e) =>
                      handleInputChange(e.target.value, index, 'company')
                    }
                    placeholder={`Enter Company ${index + 1}`}
                    className="p-2 border border-gray-300 rounded-md lg:rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <input
                  type="text"
                  value={person.description}
                  onChange={(e) =>
                    handleInputChange(e.target.value, index, 'description')
                  }
                  placeholder={`Enter Description ${index + 1}`}
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
                      <label className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 hover:text-blue-800 transition-all duration-200 cursor-pointer">
                        Change Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(
                              e.target.files?.[0] || null,
                              index
                            )
                          }
                        />
                      </label>
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

                  {person.loading && (
                    <span className="text-gray-500">Uploading...</span>
                  )}
                </div>

                {index === people.length - 1 && (
                  <button
                    onClick={addNewPerson}
                    disabled={isAddMoreDisabled}
                    className={`flex w-1/2  lg:w-[180px] items-center justify-center gap-x-2 py-2 md:border md:border-gray-300 md:rounded-lg  text-[#5D5F61] ${
                      isAddMoreDisabled
                        ? 'bg-[#E1E3E5] text-[#5D5F61] cursor-not-allowed' // Disabled state
                        : 'bg-white text-[#5D5F61] hover:bg-[#3667B2] hover:text-white' // Active state
                    }`}
                  >
                    <FaPlus />
                    Add More People
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className=" flex w-full  justify-end ">
            <button
              onClick={(e) => {
                if (!isGenerateDisabled) {
                  handleGenerateSlide()
                } else {
                  e.preventDefault() // Prevent action when disabled
                }
              }}
              onMouseEnter={() => isGenerateDisabled && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className={`lg:w-[180px] py-2 px-5 justify-end  rounded-md active:scale-95 transition transform duration-300 ${
                isGenerateDisabled
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#3667B2] text-white hover:bg-[#28518a]'
              }`}
            >
              Generate Slide
              {/* Tooltip */}
              {isGenerateDisabled && showTooltip && (
                <span className="absolute top-[-35px] left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-10">
                  Minimum 2 people required
                </span>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
