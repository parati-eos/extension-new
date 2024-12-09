import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaPlus,
  FaTrash,
} from 'react-icons/fa'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { io } from 'socket.io-client'
import { Outline } from '../../types/types'
import { DesktopHeading, MobileHeading } from './Heading'
import {
  MobileNewSlideVersion,
  DesktopNewSlideVersion,
} from './NewSlideVersion'
import Sidebar from './Sidebar'
import CustomBuilderMenu from './CustomBuilderMenu'
import Points from './custom-builder/Points'
import People from './custom-builder/People'
import Table from './custom-builder/Table'
import Timeline from './custom-builder/Timeline'
import Statistics from './custom-builder/Statistics'
import Images from './custom-builder/Images'
import Graphs from './custom-builder/Graphs'
import SlideNarrative from './SlideNarrative'
import MobileOutlineModal from './MobileOutlineModal'
import './viewpresentation.css'

export type DisplayMode =
  | 'slides'
  | 'newContent'
  | 'slideNarrative'
  | 'customBuilder'
  | 'Points'
  | 'Timeline'
  | 'Images'
  | 'Table'
  | 'People'
  | 'Graphs'
  | 'Statistics'
  | 'SlideNarrative'

export default function ViewPresentation() {
  const [currentSlide, setCurrentSlide] = useState(1)
  const [selectedOutline, setSelectedOutline] = useState('')
  const [currentOutline, setCurrentOutline] = useState('')
  const [outlines, setOutlines] = useState<Outline[]>([])
  const [slideImages, setSlideImages] = useState<{ [key: string]: string }>({})
  const [displayMode, setDisplayMode] = useState<DisplayMode>('slides')
  const [plusClickedSlide, setPlusClickedSlide] = useState<number | null>(null)
  const [finalized, setFinalized] = useState(false)
  const authToken = sessionStorage.getItem('authToken')
  const navigate = useNavigate()
  // const location = useLocation()
  // const searchParams = new URLSearchParams(location.search)
  // const presentationTypeReceived = searchParams.get('slideType')!
  // const slideType = presentationTypeReceived!.replace(/%20| /g, '')
  const orgId = sessionStorage.getItem('orgId')
  const documentID = sessionStorage.getItem('documentID')
  const slideRefs = useRef<HTMLDivElement[]>([])
  const [totalSlides, setTotalSlides] = useState(Number)
  const [slidesId, setSlidesId] = useState([]) // State to store slide IDs
  const [presentationID, setPresentationID] = useState<string>('')
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [outlineType, setOutlineType] = useState('')
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL

  // Handle Share Button Click
  const handleShare = async () => {
    navigate(`/share/?formId=${documentID}`)
  }

  // Handle Download Button Click
  const handleDownload = () => {
    alert('Download functionality triggered.')
  }

  // Handle Delete Button Click
  const handleDelete = () => {
    console.log(slidesId[currentSlideIndex])

    axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidedisplay/slidedisplay/display/${slidesId[currentSlideIndex]}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    )
  }

  // Handle Finalize Button Click
  const handleFinalize = () => {
    setFinalized(true)
    console.log(slidesId[currentSlideIndex])
    axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidedisplay/slidedisplay/selected/${slidesId[currentSlideIndex]}/${documentID}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    )
  }

  // Handle Add New Slide Version Button
  const handlePlusClick = async () => {
    if (displayMode === 'newContent') {
      setDisplayMode('slides')
      setPlusClickedSlide(null)
    } else {
      setDisplayMode('newContent')
      setPlusClickedSlide(currentSlide)
    }
  }

  // MEDIUM LARGE SCREENS: Sidebar Outline Select
  const handleOutlineSelect = (option: string) => {
    setSelectedOutline(option)
    setCurrentOutline(option)
    setCurrentSlide(outlines.findIndex((o) => o.title === option) + 1)
    const slideIndex = outlines.findIndex((o) => o.title === option)
    slideRefs.current[slideIndex]?.scrollIntoView({ behavior: 'smooth' })
    setCurrentSlideIndex(0)
  }

  // MEDIUM LARGE SCREENS: Slide Scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    const slideHeight = e.currentTarget.clientHeight
    const newSlide = Math.round(scrollTop / slideHeight) + 1
    setCurrentSlide(newSlide)
    setSelectedOutline(outlines[newSlide - 1]?.title || '')
    if (newSlide !== plusClickedSlide) {
      setDisplayMode('slides')
    }
  }

  // Quick Generate Slide
  const handleQuickGenerate = async () => {
    try {
      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/generate-document/${orgId}`,
          {
            type: outlineType,
            title: currentOutline.replace(/^\d+\.\s*/, ''),
            documentID: documentID,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then((response) => {
          console.log('QUICK GENERATE RESPONSE', response)
        })
        .catch((error) => {
          console.log('QUICK GENERATE RESPONSE ERROR', error)
        })
    } catch (error) {
      console.log('QUICK GENERATE TRY CATCH ERROR', error)
    }
  }

  // Paginate Back
  const handlePaginatePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prevIndex) => prevIndex - 1)
    }
  }

  // Paginate Next
  const handlePaginateNext = () => {
    if (currentSlideIndex < slidesId.length - 1) {
      setCurrentSlideIndex((prevIndex) => prevIndex + 1)
    }
  }

  // Web Socket To Get Slide Data
  useEffect(() => {
    const socket = io(`${SOCKET_URL}`, {
      transports: ['websocket'],
    })
    console.log('Connecting to WebSocket server...')

    // When connected
    socket.on('connect', () => {
      console.log('Connected to WebSocket server', socket.id)
    })

    // Listen for slide data from the backend
    socket.on('slidesData', (newSlides) => {
      const result = newSlides
      setPresentationID(result[0].PresentationID)
      const ids = result.map((item: any) => item.GenSlideID)
      setSlidesId(ids)
      setTotalSlides(ids.length)
    })

    // Handle any error messages from the backend
    socket.on('error', (error) => {
      console.error('Error:', error.message)
    })

    // const slideTypeData = currentOutline.replace(/^\d+\.\s*/, '')

    // Automatically fetch slides on component mount
    socket.emit('fetchSlides', {
      slideType: 'Key Features',
      formID: 'Document-1732794823300',
    })

    // Cleanup when the component unmounts
    return () => {
      console.log('Disconnecting from WebSocket server...')
      socket.disconnect()
    }
  }, [currentOutline, SOCKET_URL])

  // Fetch Outlines
  const fetchOutlines = useCallback(async () => {
    const sampleImageUrl = {
      default:
        'https://cdn2.slidemodel.com/wp-content/uploads/60009-01-business-proposal-powerpoint-template-1.jpg',
    }
    if (!documentID) return

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/outline/${documentID}/outline`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      const fetchedOutlines = response.data.outline
      setOutlines(fetchedOutlines)
      const dynamicSlideImages = fetchedOutlines.reduce(
        (acc: { [key: string]: string }, outline: Outline) => {
          acc[outline.title] = sampleImageUrl.default
          return acc
        },
        {}
      )
      setSlideImages(dynamicSlideImages)
      if (fetchedOutlines.length > 0) {
        setCurrentOutline(fetchedOutlines[0].title)
        setSelectedOutline(fetchedOutlines[0].title)
      }
    } catch (error) {
      console.error('Error fetching outlines:', error)
    }
  }, [documentID, authToken])

  useEffect(() => {
    fetchOutlines()
  }, [fetchOutlines])

  // Set Slide Type For Quick Generate
  useEffect(() => {
    // Find the object in outlines that matches the currentOutline title
    const matchingOutline = outlines.find(
      (outline) => outline.title === currentOutline
    )

    // Update the outlineType state with the type of the matched object
    setOutlineType(matchingOutline?.type || '')
  }, [outlines, currentOutline])

  // Custom Builder Slide Type Select Handler
  const handleCustomTypeClick = (typeName: DisplayMode) => {
    setDisplayMode(typeName)
  }

  // Render Slide Content
  const renderContent = ({
    displayMode,
    isMobile,
    index,
  }: {
    displayMode: string
    isMobile: boolean
    index?: number
  }) => {
    switch (displayMode) {
      case 'slides':
        return (
          <iframe
            src={`https://docs.google.com/presentation/d/${presentationID}/embed?rm=minimal&start=false&loop=false&slide=id.${slidesId[currentSlideIndex]}`}
            title={`Slide ${currentSlideIndex + 1}`}
            className="w-full h-full"
            style={{ border: 0 }}
          />
        )
      case 'newContent':
        if (isMobile) {
          return (
            <MobileNewSlideVersion
              handleQuickGenerate={handleQuickGenerate}
              handleCustomBuilderClick={() => setDisplayMode('customBuilder')}
              handleSlideNarrative={() => setDisplayMode('SlideNarrative')}
            />
          )
        } else if (plusClickedSlide === index! + 1) {
          return (
            <DesktopNewSlideVersion
              handleQuickGenerate={handleQuickGenerate}
              handleCustomBuilderClick={() => setDisplayMode('customBuilder')}
              handleSlideNarrative={() => setDisplayMode('SlideNarrative')}
            />
          )
        }
        break
      case 'customBuilder':
        return <CustomBuilderMenu onTypeClick={handleCustomTypeClick} />
      case 'Points':
        return (
          <Points
            heading={currentOutline.replace(/^\d+\.\s*/, '')}
            slideType={outlineType}
            documentID={documentID!}
            orgId={orgId!}
            authToken={authToken!}
          />
        )
      case 'People':
        return (
          <People
            heading={currentOutline.replace(/^\d+\.\s*/, '')}
            slideType={outlineType}
            documentID={documentID!}
            orgId={orgId!}
            authToken={authToken!}
            setDisplayMode={setDisplayMode}
          />
        )
      case 'Table':
        return (
          <Table
            heading={currentOutline.replace(/^\d+\.\s*/, '')}
            slideType={outlineType}
            documentID={documentID!}
            orgId={orgId!}
            authToken={authToken!}
          />
        )
      case 'Timeline':
        return (
          <Timeline
            heading={currentOutline.replace(/^\d+\.\s*/, '')}
            slideType={outlineType}
            documentID={documentID!}
            orgId={orgId!}
            authToken={authToken!}
          />
        )
      case 'SlideNarrative':
        return (
          <SlideNarrative
            heading={currentOutline.replace(/^\d+\.\s*/, '')}
            slideType={outlineType}
            documentID={documentID!}
            orgId={orgId!}
            authToken={authToken!}
          />
        )
      case 'Statistics':
        return (
          <Statistics
            heading={currentOutline.replace(/^\d+\.\s*/, '')}
            slideType={outlineType}
            documentID={documentID!}
            orgId={orgId!}
            authToken={authToken!}
          />
        )
      case 'Images':
        return (
          <Images
            heading={currentOutline.replace(/^\d+\.\s*/, '')}
            slideType={outlineType}
            documentID={documentID!}
            orgId={orgId!}
            authToken={authToken!}
          />
        )
      case 'Graphs':
        return (
          <Graphs
            heading={currentOutline.replace(/^\d+\.\s*/, '')}
            slideType={outlineType}
            documentID={documentID!}
            orgId={orgId!}
            authToken={authToken!}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col lg:flex-row bg-[#F5F7FA] h-[100vh]">
      {/*LARGE SCREEN: HEADING*/}
      <DesktopHeading
        handleDownload={handleDownload}
        handleShare={handleShare}
      />

      {/*MEDIUM LARGE SCREEN: MAIN CONTAINER*/}
      <div className="hidden lg:flex lg:flex-row lg:w-full lg:pt-16">
        {/*MEDIUM LARGE SCREEN: SIDEBAR*/}
        <Sidebar
          onOutlineSelect={handleOutlineSelect}
          selectedOutline={selectedOutline!}
          fetchedOutlines={outlines!}
          documentID={documentID!}
          authToken={authToken!}
          fetchOutlines={fetchOutlines}
        />

        {/*MEDIUM LARGE SCREEN: SLIDE DISPLAY CONTAINER*/}
        <div className="flex-1">
          {/* MEDIUM LARGE SCREEN: SLIDE DISPLAY BOX*/}
          <div
            className="no-scrollbar rounded-sm shadow-lg relative w-[90%] bg-white border border-gray-200 mb-2 ml-16 overflow-y-scroll snap-y snap-mandatory"
            style={{ height: 'calc(100vh - 200px)' }}
            onScroll={handleScroll}
          >
            {Object.entries(slideImages).map(([outline], index) => (
              <div
                key={outline}
                ref={(el) => (slideRefs.current[index] = el!)}
                className="snap-center w-full h-screen"
                style={{ height: '100%' }}
              >
                {renderContent({
                  displayMode,
                  isMobile: false,
                  index,
                })}
              </div>
            ))}
          </div>

          {/* MEDIUM LARGE SCREEN: ACTION BUTTONS */}
          <div className="flex items-center justify-between ml-16">
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="hover:text-red-600 border border-gray-300 p-2 rounded-md flex items-center"
              >
                <FaTrash className="h-4 w-4 text-[#5D5F61] mr-1" />
                <span className="hidden text-[#5D5F61] lg:block">
                  {' '}
                  Delete Version
                </span>
              </button>
              <button
                onClick={handleFinalize}
                className={`p-2 rounded-md flex items-center border ${
                  finalized && selectedOutline === currentOutline
                    ? 'border-[#0A8568] bg-[#36fa810a]'
                    : 'border-gray-300'
                }`}
              >
                <FaCheck
                  className={`h-4 w-4 mr-1 ${
                    finalized && selectedOutline === currentOutline
                      ? 'text-[#0A8568]'
                      : 'text-[#5D5F61]'
                  }`}
                />
                <span className="hidden text-[#5D5F61] lg:block">
                  {' '}
                  Finalize Version
                </span>
              </button>
              <button
                onClick={handlePlusClick}
                className="hover:text-blue-600 border border-[#3667B2] p-2 rounded-md flex items-center"
              >
                <FaPlus className="h-4 w-4 mr-1 text-[#3667B2]" />
                <span className="hidden text-[#3667B2] lg:block">
                  {' '}
                  New Versions
                </span>
              </button>
            </div>

            {/* MEDIUM LARGE SCREEN: PAGINATION BUTTONS */}
            <div className="flex items-center gap-2 mr-12">
              <button
                onClick={handlePaginatePrev}
                disabled={currentSlideIndex === 0}
                className="flex items-center hover:cursor-pointer border border-[#E1E3E5] bg-white p-2 rounded-md"
              >
                <FaArrowLeft className="h-4 w-4 text-[#5D5F61]" />
              </button>
              <span className="text-sm">
                Slide {currentSlideIndex + 1} of {slidesId.length}
              </span>
              <button
                onClick={handlePaginateNext}
                disabled={currentSlideIndex === slidesId.length - 1}
                className={`flex items-center border hover:cursor-pointer border-[#E1E3E5] bg-white p-2 rounded-md ${
                  currentSlideIndex === slidesId.length - 1
                    ? 'text-gray-400'
                    : 'hover:text-blue-600'
                }`}
              >
                <FaArrowRight className="h-4 w-4 text-[#5D5F61]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE: MAIN CONTAINER */}
      <div className="block lg:hidden p-4 mx-auto">
        {/* MOBILE: HEADING */}
        <MobileHeading
          handleDownload={handleDownload}
          handleShare={handleShare}
        />

        {/* MOBILE: OUTLINE DROPDOWN */}
        <div className="space-y-4 mt-12 mb-7">
          <div className="block lg:hidden">
            {outlines && outlines.length > 0 && (
              <MobileOutlineModal
                documentID={documentID!}
                outlines={outlines}
                onSelectOutline={(outline) => setSelectedOutline(outline)}
                selectedOutline={selectedOutline}
                fetchOutlines={fetchOutlines}
              />
            )}
          </div>
        </div>

        {/* MOBILE: SLIDE DISPLAY BOX */}
        <div
          className={`relative bg-white h-[30vh] ${
            displayMode === 'People' ? 'h-[38vh]' : ''
          } border border-gray-200 mt-12 mb-6`}
        >
          {renderContent({
            displayMode,
            isMobile: true,
          })}
        </div>

        {/* MOBILE: ACTION BUTTONS */}
        <div className="flex items-center justify-between w-full mt-10">
          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              className="hover:text-red-600 border border-gray-300 p-2 rounded-md flex items-center"
            >
              <FaTrash className="h-4 w-4 text-[#5D5F61]" />
            </button>
            <button
              onClick={handleFinalize}
              className={`border ${
                finalized && selectedOutline === currentOutline
                  ? 'border-[#0A8568] bg-[#36fa810a]'
                  : 'border-gray-300'
              } p-2 rounded-md flex items-center`}
            >
              <FaCheck
                className={`h-4 w-4 ${
                  finalized && selectedOutline === currentOutline
                    ? 'text-[#0A8568]'
                    : 'text-[#5D5F61]'
                }`}
              />
            </button>
            <button
              onClick={handlePlusClick}
              className={`hover:text-blue-600 border ${
                displayMode === 'newContent'
                  ? 'border-gray-300'
                  : 'border-[#3667B2]'
              } p-2 rounded-md flex items-center`}
            >
              <FaPlus
                className={`h-4 w-4 ${
                  displayMode === 'newContent'
                    ? 'text-[#5D5F61]'
                    : 'text-[#3667B2]'
                }`}
              />
            </button>
          </div>

          {/* MOBILE: PAGINATION BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePaginatePrev}
              disabled={currentSlideIndex === 0}
              className="flex items-center border bg-white border-gray-300 p-2 rounded-md"
            >
              <FaArrowLeft
                className={`h-4 w-4 ${
                  currentSlide === 1 ? 'text-[#5D5F61]' : 'text-[#091220]'
                }`}
              />
            </button>
            <span className="text-sm text-[#5D5F61]">
              Slide {currentSlideIndex + 1} of {slidesId.length}
            </span>
            <button
              onClick={handlePaginateNext}
              disabled={currentSlideIndex === slidesId.length - 1}
              className={`flex items-center border border-gray-300 bg-white p-2 rounded-md ${
                currentSlide === totalSlides
                  ? 'text-[#091220]'
                  : 'hover:text-blue-600'
              }`}
            >
              <FaArrowRight className="h-4 w-4 text-[#091220]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
