import { useState, useRef, useEffect } from 'react'
import { FaImage, FaMinus, FaPlus } from 'react-icons/fa'
import uploadFileToS3 from './uploadfiletoS3'
import axios from 'axios'
import { BackButton } from './BackButton'
import { DisplayMode } from '../../@types/presentationView'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'

interface PeopleProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
  outlineID: string
  setIsSlideLoading: () => void
  setFailed: () => void
}

export default function People({
  heading,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
  outlineID,
  setIsSlideLoading,
  setFailed,
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
  const [isImageUploading, setIsImageUploading] = useState(false) // Track image upload state
  const [slideTitle, setSlideTitle] = useState('') // Local state for slide title
  const [refineLoadingStates, setRefineLoadingStates] = useState<boolean[]>(
    new Array(people.length).fill(false)
  )
  const [refineLoadingSlideTitle, setRefineLoadingSlideTitle] = useState(false) // State for slideTitle loader
  const [focusedInput, setFocusedInput] = useState<number | null>(null) // Define focusedInput
  const [isInitialDataLoad, setIsInitialDataLoad] = useState(true)

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
    const charLimit = field === 'description' ? 150 : 25

    if (value.length <= charLimit) {
      const updatedPeople = [...people]
      updatedPeople[index] = { ...updatedPeople[index], [field]: value }
      setPeople(updatedPeople)
    }
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

    // Set image uploading state
    setIsImageUploading(true) // Set global state to true when image upload starts

    setPeople((prevPeople) => {
      const updatedPeople = [...prevPeople]
      updatedPeople[index].loading = true // Set loading to true for the current person
      return updatedPeople
    })

    try {
      const uploadedFile = {
        name: file.name,
        type: file.type,
        body: file,
      }

      const url = await uploadFileToS3(uploadedFile)
      setPeople((prevPeople) => {
        const updatedPeople = [...prevPeople]
        updatedPeople[index].image = url
        updatedPeople[index].loading = false // Set loading to false after upload
        return updatedPeople
      })
    } catch (error) {
      toast.error('Error uploading image', {
        position: 'top-right',
        autoClose: 3000,
      })
      setPeople((prevPeople) => {
        const updatedPeople = [...prevPeople]
        updatedPeople[index].loading = false // Set loading to false on error
        return updatedPeople
      })
    } finally {
      // Set image uploading state to false after the upload finishes
      setIsImageUploading(false) // Reset the uploading state
    }
  }

  const addNewPerson = () => {
    setIsInitialDataLoad(false)
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
    toast.info(`Request sent to a generate new version for ${heading}`, {
      position: 'top-right',
      autoClose: 3000,
    })
    const storedOutlineIDs = sessionStorage.getItem('outlineIDs')
    if (storedOutlineIDs) {
      const outlineIDs = JSON.parse(storedOutlineIDs)

      // Check if currentOutlineID exists in the array
      if (outlineIDs.includes(outlineID)) {
        // Remove currentOutlineID from the array
        const updatedOutlineIDs = outlineIDs.filter(
          (id: string) => id !== outlineID
        )

        // Update the sessionStorage with the modified array
        sessionStorage.setItem('outlineIDs', JSON.stringify(updatedOutlineIDs))
      }
    }
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
            title: slideTitle,
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
      toast.info(`Data submitted successfully for ${heading}`, {
        position: 'top-right',
        autoClose: 3000,
      })
      setIsLoading(false)
      setDisplayMode('slides')
    } catch (error) {
      toast.error('Error submitting data!', {
        position: 'top-right',
        autoClose: 3000,
      })
      setFailed()
    }
  }

  // Modified useEffect for scroll behavior
  useEffect(() => {
    if (containerRef.current) {
      if (isInitialDataLoad) {
        // For initial data load, scroll to top
        requestAnimationFrame(() => {
          containerRef.current?.scrollTo({
            top: 0,
            behavior: 'instant',
          })
        })
      }
    }
  }, [people, isInitialDataLoad])
  const removePerson = (index: number) => {
    if (people.length > 2) {
      setIsInitialDataLoad(false) 
      setPeople(people.filter((_, i) => i !== index));
    }
  };
  
  const fetchSlideData = async () => {
    const payload = {
      type: "People",
      title: slideTitle,
      documentID,
      outlineID,
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/fetch-document/${orgId}/people`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      if (response.status === 200) {
        const slideData = response.data;
        setIsInitialDataLoad(true)
  
        if (slideData.title) setSlideTitle(slideData.title);
  
        if (slideData.people && Array.isArray(slideData.people)) {
          interface Person {
            name: string
            designation: string
            company: string
            description: string
            image: string
            loading: boolean
          }

          interface SlideData {
            slideName: string
            people: Person[]
          }

          const filteredPeople: Person[] = (slideData as SlideData).people
            .map((person: Person) => ({
              name: person.name?.trim() || '',
              designation: person.designation?.trim() || '',
              company: person.company?.trim() || '',
              description: person.description?.trim() || '',
              image: person.image?.trim() || '',
              loading: false, // Ensure loading state is initialized
            }))
            .filter(
              (person: { name: string; description: string }) =>
                person.name !== '' && person.description !== '' // Ensure essential fields are present
            )

          setPeople(
            filteredPeople.length > 0
              ? filteredPeople
              : [
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
                ]
          )
        }
      }
    } catch (error) {
      console.error('Error fetching slide data:', error)
      setIsInitialDataLoad(false)
    }
  }

  useEffect(() => {
    fetchSlideData() // Fetch data on mount
  }, [documentID, outlineID, orgId]) // Run when dependencies change

  const refineText = async (type: string, index?: number) => {
    const newRefineLoadingStates = [...refineLoadingStates]
    newRefineLoadingStates[index!] = true // Set loading for this specific index
    setRefineLoadingStates(newRefineLoadingStates)

    let textToRefine = ''

    if (type === 'slideTitle') {
      textToRefine = slideTitle
      setRefineLoadingSlideTitle(true) // Set loader state to true when refining slideTitle
    } else if (type === 'people' && index !== undefined) {
      textToRefine = people[index].description
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/refineText`,
        {
          type: type,
          textToRefine: textToRefine,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      if (response.status === 200) {
        const refinedText = response.data.refinedText

        if (type === 'slideTitle') {
          setSlideTitle(refinedText)
        } else if (type === 'people' && index !== undefined) {
          const updatedPeopleDescriptions = [...people]
          updatedPeopleDescriptions[index].description = refinedText
          setPeople(updatedPeopleDescriptions)
        }
      }
      newRefineLoadingStates[index!] = false // Stop loading for this specific index
      setRefineLoadingStates(newRefineLoadingStates)
      setRefineLoadingSlideTitle(false) // Set slideTitle loading state back to false
    } catch (error) {
      toast.error('Error refining text!', {
        position: 'top-right',
        autoClose: 3000,
      })
      newRefineLoadingStates[index!] = false // Stop loading for this specific index
      setRefineLoadingStates(newRefineLoadingStates)
      setRefineLoadingSlideTitle(false) // Set slideTitle loading state back to false
    }
  }

  const handleNameChange = (value: string, index: number) => {
    // Ensure that only alphabetic characters and spaces are allowed in the name input
    const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '')
    handleInputChange(sanitizedValue, index, 'name')
  }

  const [showTooltip, setShowTooltip] = useState(false)
  const isGenerateDisabled =
    !(
      people[0].name.trim() &&
      people[0].description.trim() &&
      people[1].name.trim() &&
      people[1].description.trim()
    ) || !slideTitle.trim()

  const isTooltipSwitch = !(
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
          <div className="w-full p-1">
            <div className="relative">
              <input
                type="text"
                value={slideTitle}
                maxLength={50}
                onChange={(e) => setSlideTitle(e.target.value)}
                onFocus={(e) => {
                  const input = e.target as HTMLInputElement // Explicitly cast EventTarget to HTMLInputElement
                  input.scrollLeft = input.scrollWidth // Scroll to the end on focus
                }}
                style={{
                  textOverflow: 'ellipsis', // Truncate text with dots
                  whiteSpace: 'nowrap', // Prevent text wrapping
                  overflow: 'hidden', // Hide overflowing text
                }}
                placeholder="Add Slide Title"
                className="border w-full mt-2 text-[#091220] md:text-lg rounded-md font-semibold bg-transparent p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-ellipsis overflow-hidden whitespace-nowrap pr-10"
              />
              {refineLoadingSlideTitle ? (
                <div className="absolute top-[55%] right-2 transform -translate-y-1/2 w-full h-full flex items-center justify-end">
                  <div className="w-4 h-4 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                </div>
              ) : (  slideTitle.length>0 && (
                <div className="absolute top-[55%] right-2 transform -translate-y-1/2">
                  <div className="relative group">
                    <FontAwesomeIcon
                      icon={faWandMagicSparkles}
                      onClick={() => refineText('slideTitle')}
                      className="hover:scale-105 hover:cursor-pointer active:scale-95 text-[#3667B2]"
                    />
                    {/* Tooltip */}
                    <span className="absolute top-[-35px] right-0 bg-black w-max text-white text-xs rounded px-2 py-1 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">
                      Click to refine text.
                    </span>
                  </div>
                </div>
              )
              )}
            </div>
          </div>

          <div
            ref={containerRef}
            className={`flex-1  overflow-y-auto scrollbar-none md:mt-1 ${
              people.length > 3 ? 'max-h-[calc(100vh-200px)]' : ''
            }`}
          >
            {people.map((person, index) => (
              <div className='flex flex-row w-full items-center gap-2'>
              <div
                key={index}
                className={`flex flex-col gap-2 lg:gap-4 mb-2 p-1 w-full${
                  index === people.length - 1 ? 'lg:mb-4 w-full' : ''
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-4 w-full mt-2 ">
                  <div className="flex flex-col">
                    <input
                      type="text"
                      value={person.name}
                      onFocus={() => setFocusedInput(index)} // Set focus
                      onBlur={() => setFocusedInput(null)} // Remove focus
                      onChange={(e) => handleNameChange(e.target.value, index)}
                      placeholder={`Enter Name ${index + 1}`}
                      className="p-2 border border-gray-300 rounded-md lg:rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span
                      className={`text-xs mt-1 ml-1 ${
                        focusedInput === index
                          ? person.name.length > 20
                            ? 'text-red-500'
                            : 'text-gray-500'
                          : 'invisible' // Hide text but reserve space
                      }`}
                    >
                      {person.name.length}/25 characters
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      value={person.designation}
                      onFocus={() => setFocusedInput(index + 200)} // Set focus
                      onBlur={() => setFocusedInput(null)} // Remove focus
                      onChange={(e) =>
                        handleInputChange(e.target.value, index, 'designation')
                      }
                      placeholder={`Enter Designation ${index + 1}`}
                      className="p-2 border border-gray-300 rounded-md lg:rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span
                      className={`text-xs mt-1 ml-1 ${
                        focusedInput === index + 200
                          ? person.designation.length > 20
                            ? 'text-red-500'
                            : 'text-gray-500'
                          : 'invisible' // Hide text but reserve space
                      }`}
                    >
                      {person.designation.length}/25 characters
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      value={person.company}
                      onFocus={() => setFocusedInput(index + 100)} // Set focus
                      onBlur={() => setFocusedInput(null)} // Remove focus
                      onChange={(e) =>
                        handleInputChange(e.target.value, index, 'company')
                      }
                      placeholder={`Enter Company ${index + 1}`}
                      className="p-2 border border-gray-300 rounded-md lg:rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span
                      className={`text-xs mt-1 ml-1 ${
                        focusedInput === index + 100
                          ? person.company.length > 20
                            ? 'text-red-500'
                            : 'text-gray-500'
                          : 'invisible' // Hide text but reserve space
                      }`}
                    >
                      {person.company.length}/25 characters
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="relative w-full">
                    <input
                      type="text"
                      onBlur={() => setFocusedInput(null)} // Remove focus
                      value={person.description}
                      onChange={(e) =>
                        handleInputChange(e.target.value, index, 'description')
                      }
                      placeholder={`Enter Description ${index + 1}`}
                      onFocus={(e) => {
                        setFocusedInput(index + 300)
                        const input = e.target as HTMLInputElement // Explicitly cast EventTarget to HTMLInputElement
                        input.scrollLeft = input.scrollWidth // Scroll to the end on focus
                      }}
                      style={{
                        textOverflow: 'ellipsis', // Truncate text with dots
                        whiteSpace: 'nowrap', // Prevent text wrapping
                        overflow: 'hidden', // Hide overflowing text
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-ellipsis overflow-hidden whitespace-nowrap pr-10"
                    />
                    {refineLoadingStates[index] ? (
                      <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                        <div className="w-4 h-4 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      person.description.length>0 &&(
                      <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                        <div className="relative group">
                          <FontAwesomeIcon
                            icon={faWandMagicSparkles}
                            onClick={() => refineText('people', index)}
                            className="hover:scale-105 hover:cursor-pointer active:scale-95 text-[#3667B2]"
                          />
                          {/* Tooltip */}
                          <span className="absolute top-[-35px] w-max right-0 bg-black text-white text-xs rounded px-2 py-1 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">
                            Click to refine text
                          </span>
                        </div>
                      </div>
                      )
                    )}
                  </div>
                  <span
                    className={`text-xs mt-1 ml-1 ${
                      focusedInput === index + 300
                        ? person.description.length > 140
                          ? 'text-red-500'
                          : 'text-gray-500'
                        : 'invisible' // Hide text but reserve space
                    }`}
                  >
                    {person.description.length}/150 characters
                  </span>
                </div>

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
                   <button
                   onClick={() => removePerson(index)}
                   disabled={people.length <= 2} // Prevents removing if only 1 person remains
                   className={`${
                     people.length <= 2
                       ? 'text-gray-400 cursor-not-allowed' // Disabled state
                       : 'text-[#3667B2] hover:bg-red-100' // Active state
                   } bg-white  flex items-center justify-center border border-[#E1E3E5] rounded-full w-6 h-6 p-2 transition`}
                 >
                   <FaMinus />
                 </button>
                 </div>
              
            ))}
     

          </div>

          <div className="flex w-full justify-end relative">
            <button
              onClick={(e) => {
                if (!isGenerateDisabled && !isImageUploading) {
                  handleGenerateSlide()
                } else {
                  e.preventDefault() // Prevent action when disabled
                }
              }}
              onMouseEnter={() => {
                if (isGenerateDisabled || isAddMoreDisabled)
                  setShowTooltip(true) // Show tooltip for relevant condition
              }}
              onMouseLeave={() => setShowTooltip(false)} // Hide tooltip on mouse leave
              className={`lg:w-[180px] py-2 px-5 justify-end rounded-md active:scale-95 transition transform duration-300 ${
                isGenerateDisabled || isImageUploading || !slideTitle
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#3667B2] text-white hover:bg-[#28518a]'
              }`}
            >
              Generate Slide
              {/* Tooltip */}
              {showTooltip && (
                <span className="absolute top-[-35px] left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-10">
                  {isTooltipSwitch
                    ? 'Minimum 2 people required.'
                    : 'Slide title is required.'}
                </span>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
