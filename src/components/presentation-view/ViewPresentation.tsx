import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { io } from 'socket.io-client'
import { Outline } from '../../types/types'
import { DesktopHeading, MobileHeading } from './Heading'
import {
  MobileNewSlideVersion,
  DesktopNewSlideVersion,
} from './NewSlideVersion'
import Sidebar from './Sidebar'
import CustomBuilderMenu from './custom-builder/CustomBuilderMenu'
import Points from './custom-builder/Points'
import People from './custom-builder/People'
import Table from './custom-builder/Table'
import Timeline from './custom-builder/Timeline'
import Statistics from './custom-builder/Statistics'
import Images from './custom-builder/Images'
import Graphs from './custom-builder/Graphs'
import SlideNarrative from './SlideNarrative'
import MobileOutlineModal from './MobileOutlineModal'
import { PricingModal } from '../shared/PricingModal'
import { DisplayMode } from '../../types/presentationView'
import './viewpresentation.css'
import { DesktopButtonSection, MobileButtonSection } from './ActionButtons'
import { Plan } from '../../types/pricingTypes'
import { IpInfoResponse } from '../../types/authTypes'
import { toast } from 'react-toastify'

export default function ViewPresentation() {
  const [searchParams] = useSearchParams()
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL
  const authToken = sessionStorage.getItem('authToken')
  const orgId = sessionStorage.getItem('orgId')
  const userPlan = sessionStorage.getItem('userPlan')
  const [documentID, setDocumentID] = useState<string | null>(null)
  const [pptName, setPptName] = useState<string | null>(null)
  const [presentationID, setPresentationID] = useState<string>('')
  const [isDocumentIDLoading, setIsDocumentIDLoading] = useState(true)
  const [isSlideLoading, setIsSlideLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(1)
  const [currentOutline, setCurrentOutline] = useState('')
  const [outlineType, setOutlineType] = useState('')
  const [outlines, setOutlines] = useState<Outline[]>([])
  const [displayMode, setDisplayMode] = useState<DisplayMode>('slides')
  const [plusClickedSlide, setPlusClickedSlide] = useState<number | null>(null)
  const [finalized, setFinalized] = useState(false)
  const slideRefs = useRef<HTMLDivElement[]>([])
  const [totalSlides, setTotalSlides] = useState(Number)
  const [slidesId, setSlidesId] = useState<string[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const pricingModalHeading = 'Refine PPT'
  const [monthlyPlan, setMonthlyPlan] = useState<Plan>()
  const [yearlyPlan, setYearlyPlan] = useState<Plan>()
  const [currency, setCurrency] = useState('')
  const [isNoGeneratedSlide, setIsNoGeneratedSlide] = useState(false)

  // Handle Share Button Click
  const handleShare = async () => {
    const url = `/share?formId=${documentID}`
    window.open(url, '_blank') // Opens the URL in a new tab
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
    setCurrentOutline(outlines[newSlide - 1]?.title || '')
    if (newSlide !== plusClickedSlide) {
      setDisplayMode('slides')
    }
  }

  // Quick Generate Slide
  const handleQuickGenerate = async () => {
    setIsSlideLoading(true)
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
          alert('Quick Generate Success')
          setIsSlideLoading(false)
          console.log('QUICK GENERATE RESPONSE', response)
        })
        .catch((error) => {
          toast.error('Error while generating slide', {
            position: 'top-center',
            autoClose: 2000,
          })
          setIsSlideLoading(false)
        })
    } catch (error) {
      toast.error('Error while generating slide', {
        position: 'top-center',
        autoClose: 2000,
      })
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

  // Custom Builder Slide Type Select Handler
  const handleCustomTypeClick = (typeName: DisplayMode) => {
    setDisplayMode(typeName)
  }

  // Mobile Back Button
  const onBack = () => {
    if (displayMode === 'slideNarrative') {
      setDisplayMode('newContent')
    } else if (displayMode === 'customBuilder') {
      setDisplayMode('newContent')
    } else {
      setDisplayMode('customBuilder')
    }
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
          <>
            {!isSlideLoading && !isNoGeneratedSlide && (
              <iframe
                src={`https://docs.google.com/presentation/d/${presentationID}/embed?rm=minimal&start=false&loop=false&slide=id.${slidesId[currentSlideIndex]}`}
                title={`Slide ${currentSlideIndex + 1}`}
                className="w-full h-full"
                style={{ border: 0 }}
              />
            )}
            {isNoGeneratedSlide && (
              <div className="w-full h-full flex items-center justify-center">
                <h1>No Slide Generated</h1>
              </div>
            )}
          </>
        )
      case 'newContent':
        if (isMobile) {
          return (
            <MobileNewSlideVersion
              handleQuickGenerate={handleQuickGenerate}
              handleCustomBuilderClick={() => setDisplayMode('customBuilder')}
              handleSlideNarrative={() => setDisplayMode('SlideNarrative')}
              userPlan={userPlan!}
            />
          )
        } else if (plusClickedSlide === index! + 1) {
          return (
            <DesktopNewSlideVersion
              handleQuickGenerate={handleQuickGenerate}
              handleCustomBuilderClick={() => setDisplayMode('customBuilder')}
              handleSlideNarrative={() => setDisplayMode('SlideNarrative')}
              userPlan={userPlan!}
            />
          )
        }
        break
      case 'customBuilder':
        return (
          <CustomBuilderMenu
            onTypeClick={handleCustomTypeClick}
            setDisplayMode={setDisplayMode}
          />
        )
      case 'Points':
        return (
          <Points
            heading={currentOutline.replace(/^\d+\.\s*/, '')}
            slideType={outlineType}
            documentID={documentID!}
            orgId={orgId!}
            authToken={authToken!}
            setDisplayMode={setDisplayMode}
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
            setDisplayMode={setDisplayMode}
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
            setDisplayMode={setDisplayMode}
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
            setDisplayMode={setDisplayMode}
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
            setDisplayMode={setDisplayMode}
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
            setDisplayMode={setDisplayMode}
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
            setDisplayMode={setDisplayMode}
          />
        )
      default:
        return null
    }
  }

  // Get DocumentID and Presentation Name
  useEffect(() => {
    const getDocumentId = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/documents/latest/${orgId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        const result = response.data
        console.log('RESULT After 20sec', result)

        setPptName(result.documentName)
        setDocumentID(result.documentID)
        setIsDocumentIDLoading(false)
        // setIsSlideLoading(false)
      } catch (error) {
        console.error('Error fetching document:', error)
        setIsDocumentIDLoading(false)
      }
    }

    const documentID = searchParams.get('documentID')

    if (!documentID || documentID === 'loading') {
      // Trigger the API call only if documentID is not present or is 'loading'
      const timer = setTimeout(() => {
        getDocumentId()
      }, 20000) // delay

      // Cleanup the timer in case the component unmounts
      return () => clearTimeout(timer)
    } else {
      // Directly set the documentID if it is already present
      setDocumentID(documentID)
      const getPptName = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/documents/latest/${orgId}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          )
          const result = response.data
          setPptName(result.documentName)
        } catch (error) {
          console.error('Error fetching document:', error)
        }
      }
      getPptName()
      setIsDocumentIDLoading(false)
      setIsSlideLoading(false)
    }
  }, [])

  // API CALL TO GET USER SUBSCRIPTION PLAN
  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        await axios
          .get(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/${orgId}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          )
          .then((response) => {
            // setUserPlan(response.data.plan_name)
          })
          .catch((error) => {
            console.error('Error fetching organization data:', error)
          })
      } catch (error) {}
    }

    fetchUserPlan()
  }, [authToken, orgId])

  // TODO: WEB SOCKET
  // useEffect(() => {
  //   const socket = io(`${SOCKET_URL}`, {
  //     transports: ['websocket'],
  //   })
  //   console.log('Connecting to WebSocket server...')

  //   // When connected
  //   socket.on('connect', () => {
  //     console.log('Connected to WebSocket server', socket.id)
  //   })

  //   // Listen for slide data from the backend
  //   socket.on('slidesData', (newSlides) => {
  //     if (newSlides && newSlides.length > 0) {
  //       console.log('SOCKET DATA', newSlides)

  //       // Safely set presentationID and other states
  //       setPresentationID(newSlides[0].PresentationID)
  //       const ids = newSlides.map((item: any) => item.GenSlideID)
  //       setSlidesId(ids)
  //       setIsSlideLoading(false)
  //       setTotalSlides(ids.length)
  //     } else {
  //       console.warn('Received empty or invalid slides data')
  //       setSlidesId([])
  //       setTotalSlides(0)
  //       setIsSlideLoading(true)
  //     }
  //   })

  //   // Handle any error messages from the backend
  //   socket.on('error', (error) => {
  //     console.error('Error:', error.message)
  //   })

  //   // currentOutline.replace(/^\d+\.\s*/, '')
  //   console.log('Outline Passed', currentOutline.replace(/^\d+\.\s*/, ''))

  //   // Automatically fetch slides on component mount
  //   socket.emit('fetchSlides', {
  //     slideType: currentOutline.replace(/^\d+\.\s*/, ''),
  //     formID: documentID,
  //   })

  //   // Cleanup when the component unmounts
  //   return () => {
  //     console.log('Disconnecting from WebSocket server...')
  //     socket.disconnect()
  //   }
  // }, [currentOutline, SOCKET_URL])
  useEffect(() => {
    const socket = io(`${SOCKET_URL}`, {
      transports: ['websocket'],
    })
    console.log('Connecting to WebSocket server...')

    let timeoutId: NodeJS.Timeout | null = null // To track the 90-second timeout

    // Function to handle valid slide data
    const handleSlideData = (newSlides: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId) // Clear the timer if valid data is received
      }
      console.log('SOCKET DATA', newSlides)
      setPresentationID(newSlides[0]?.PresentationID || null)
      const ids = newSlides.map((item: any) => item.GenSlideID).filter(Boolean) // Filter out null/empty GenSlideID
      setSlidesId(ids)
      setTotalSlides(ids.length)
      setIsSlideLoading(false) // Set loading to false since we received data
      setIsNoGeneratedSlide(false)
    }

    // When connected
    socket.on('connect', () => {
      console.log('Connected to WebSocket server', socket.id)
    })

    // Listen for slide data from the backend
    socket.on('slidesData', (newSlides) => {
      if (newSlides && newSlides.length > 0) {
        // Check if valid GenSlideID exists
        const hasValidGenSlideID = newSlides.some(
          (item: any) => item.GenSlideID && item.GenSlideID.trim() !== ''
        )

        if (hasValidGenSlideID) {
          handleSlideData(newSlides) // Handle valid data
        } else {
          console.warn('Received slides data with empty GenSlideID')

          // Start 90-second timer if not already running
          if (!timeoutId) {
            setIsSlideLoading(true)
            timeoutId = setTimeout(() => {
              console.log('No valid slide data received within 90 seconds')
              setIsNoGeneratedSlide(true)
              setIsSlideLoading(false) // Stop loading after 90 seconds
              // setSlidesId([])
              console.log('EMPTY SLIDE IDS', slidesId)
              timeoutId = null
            }, 90000) // 90 seconds
          }

          setPresentationID(newSlides[0]?.PresentationID || null) // Update PresentationID
          setSlidesId([]) // No valid GenSlideID
          setTotalSlides(0)
        }
      } else {
        console.warn('Received empty or invalid slides data')

        // Start 90-second timer if not already running
        if (!timeoutId) {
          setIsSlideLoading(true)
          timeoutId = setTimeout(() => {
            console.warn('No valid slide data received within 90 seconds')
            setIsSlideLoading(true)
            timeoutId = null
          }, 90000) // 90 seconds
        }

        setSlidesId([])
        setTotalSlides(0)
      }
    })

    // Handle any error messages from the backend
    socket.on('error', (error) => {
      console.error('Error:', error.message)
    })

    console.log('Outline Passed : ', currentOutline.replace(/^\d+\.\s*/, ''))
    console.log('DocumentID Passed : ', documentID)

    // Automatically fetch slides on component mount
    socket.emit('fetchSlides', {
      slideType: currentOutline.replace(/^\d+\.\s*/, ''),
      formID: documentID,
    })

    // Cleanup when the component unmounts
    return () => {
      console.log('Disconnecting from WebSocket server...')
      if (timeoutId) {
        clearTimeout(timeoutId) // Clear any existing timer on unmount
      }
      socket.disconnect()
    }
  }, [currentOutline, SOCKET_URL, documentID])

  // Fetch Outlines
  const fetchOutlines = useCallback(async () => {
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
      if (fetchedOutlines.length > 0) {
        setCurrentOutline(fetchedOutlines[0].title)
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
    const matchingOutline = outlines.find(
      (outline) => outline.title === currentOutline
    )
    // Update the outlineType state with the type of the matched object
    setOutlineType(matchingOutline?.type || '')
  }, [outlines, currentOutline])

  // API CALL TO GET PRICING DATA FOR MODAL
  useEffect(() => {
    const getPricingData = async () => {
      const ipInfoResponse = await fetch(
        'https://ipinfo.io/json?token=f0e9cf876d422e'
      )
      const ipInfoData: IpInfoResponse = await ipInfoResponse.json()

      await axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/payments/razorpay/plans`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then((response) => {
          if (ipInfoData.country === 'IN' || 'India') {
            setMonthlyPlan(response.data.items[3])
            setYearlyPlan(response.data.items[1])
            setCurrency('INR')
          } else {
            setMonthlyPlan(response.data.items[2])
            setYearlyPlan(response.data.items[0])
            setCurrency('USD')
          }
        })
    }

    const timer = setTimeout(() => {
      getPricingData()
    }, 3000) // delay

    // Cleanup the timer in case the component unmounts
    return () => clearTimeout(timer)
  }, [])
  const monthlyPlanAmount = monthlyPlan?.item.amount! / 100
  const yearlyPlanAmount = yearlyPlan?.item.amount! / 100

  return (
    <div className="flex flex-col lg:flex-row bg-[#F5F7FA] h-[100vh] no-scrollbar no-scrollbar::-webkit-scrollbar">
      {/* Pricing Modal */}
      {isPricingModalOpen && userPlan === 'free' ? (
        <PricingModal
          closeModal={() => {
            setIsPricingModalOpen(false)
          }}
          heading={pricingModalHeading}
          monthlyPlanAmount={monthlyPlanAmount}
          yearlyPlanAmount={yearlyPlanAmount}
          currency={currency}
        />
      ) : (
        <></>
      )}
      {/*LARGE SCREEN: HEADING*/}
      <DesktopHeading
        handleDownload={handleDownload}
        handleShare={handleShare}
        pptName={pptName!}
        isLoading={isDocumentIDLoading}
        userPlan={userPlan!}
        openPricingModal={() => setIsPricingModalOpen(true)}
      />

      {/*MEDIUM LARGE SCREEN: MAIN CONTAINER*/}
      <div className="hidden lg:flex lg:flex-row lg:w-full lg:pt-16">
        {/*MEDIUM LARGE SCREEN: SIDEBAR*/}
        <Sidebar
          onOutlineSelect={handleOutlineSelect}
          selectedOutline={currentOutline!}
          fetchedOutlines={outlines!}
          documentID={documentID!}
          authToken={authToken!}
          fetchOutlines={fetchOutlines}
          isLoading={isDocumentIDLoading}
        />

        {/*MEDIUM LARGE SCREEN: SLIDE DISPLAY CONTAINER*/}
        <div className="flex-1">
          {/* MEDIUM LARGE SCREEN: SLIDE DISPLAY BOX*/}
          <div
            className="no-scrollbar rounded-sm shadow-lg relative w-[90%] bg-white border border-gray-200 mb-2 ml-12 overflow-y-scroll snap-y scroll-smooth snap-mandatory"
            style={{ height: 'calc(100vh - 200px)' }}
            onScroll={handleScroll}
          >
            {outlines.map((outline, index) => (
              <div
                key={outline.title}
                ref={(el) => (slideRefs.current[index] = el!)}
                className="snap-center scroll-smooth w-full h-full mb-4"
              >
                {isDocumentIDLoading ||
                  (isSlideLoading && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                    </div>
                  ))}
                {renderContent({
                  displayMode,
                  isMobile: false,
                  index,
                })}
              </div>
            ))}
          </div>

          {/* MEDIUM LARGE SCREEN: ACTION BUTTONS */}
          <div className="flex items-center justify-between ml-12">
            <DesktopButtonSection
              onDelete={handleDelete}
              onFinalize={handleFinalize}
              onNewVersion={handlePlusClick}
              finalized={finalized}
              currentSlideId={slidesId[currentSlideIndex]}
            />

            {/* MEDIUM LARGE SCREEN: PAGINATION BUTTONS */}
            <div className="flex items-center gap-2 mr-14">
              <button
                onClick={handlePaginatePrev}
                disabled={currentSlideIndex === 0}
                className={`flex items-center hover:cursor-pointer border border-[#E1E3E5] active:scale-95 transition transform duration-300 ${
                  currentSlideIndex === 0
                    ? 'bg-gray-200 hover:cursor-default'
                    : 'bg-white'
                } p-2 rounded-md`}
              >
                <FaArrowLeft className="h-4 w-4 text-[#5D5F61]" />
              </button>
              <span className="text-sm">
                Slide {currentSlideIndex + 1} of {slidesId.length}
              </span>
              <button
                onClick={handlePaginateNext}
                disabled={currentSlideIndex === slidesId.length - 1}
                className={`flex items-center border hover:cursor-pointer border-[#E1E3E5] bg-white p-2 rounded-md active:scale-95 transition transform duration-300 ${
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
      <div className="block lg:hidden p-4">
        {/* MOBILE: HEADING */}
        <MobileHeading
          handleDownload={handleDownload}
          handleShare={handleShare}
          pptName={pptName!}
          isLoading={isDocumentIDLoading}
          userPlan={userPlan!}
          openPricingModal={() => setIsPricingModalOpen(true)}
        />

        {/* MOBILE: OUTLINE Modal */}
        <div className="space-y-4 mt-12 mb-7">
          <div className="block lg:hidden">
            {outlines && outlines.length > 0 && (
              <MobileOutlineModal
                documentID={documentID!}
                outlines={outlines}
                onSelectOutline={(outline) => {
                  setCurrentOutline(outline)
                }}
                selectedOutline={currentOutline}
                fetchOutlines={fetchOutlines}
                isLoading={isDocumentIDLoading}
              />
            )}
          </div>
        </div>

        {/* MOBILE: SLIDE DISPLAY BOX */}
        <div
          className={`relative bg-white ${
            displayMode !== 'slides' ? 'h-[45vh] md:h-[50vh]' : 'h-[30vh]'
          } w-full border border-gray-200 mt-12 mb-6`}
        >
          {isSlideLoading && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
            </div>
          )}
          {renderContent({
            displayMode,
            isMobile: true,
          })}
        </div>

        {/*  ${
            displayMode === 'slides' ? 'mt-[10em]' : 'mt-10'
          } */}

        {/* MOBILE: ACTION BUTTONS */}
        <div className={`relative flex items-center justify-between w-full`}>
          {displayMode === 'slides' || displayMode === 'newContent' ? (
            <MobileButtonSection
              onDelete={handleDelete}
              onFinalize={handleFinalize}
              onNewVersion={handlePlusClick}
              finalized={finalized}
              currentSlideId={slidesId[currentSlideIndex]}
              displayMode={displayMode}
            />
          ) : (
            <button
              onClick={onBack}
              className="border border-gray-300 p-2 rounded-md flex items-center"
            >
              Back
            </button>
          )}

          {/* MOBILE: PAGINATION BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePaginatePrev}
              disabled={currentSlideIndex === 0}
              className="flex items-center border bg-white border-gray-300 p-2 rounded-md"
            >
              <FaArrowLeft
                className={`h-4 w-4 ${
                  currentSlide === 0 ? 'text-[#5D5F61]' : 'text-[#091220]'
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
