import { setUserPlan } from '../../redux/slices/userSlice'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  SetStateAction,
} from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { io } from 'socket.io-client'
import { Outline } from '../../types/types'
import { DesktopHeading, MobileHeading } from './Heading'
import PaymentGateway from '../payment/PaymentGateway'
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
import Contact from './custom-builder/Contact'
import Cover from './custom-builder/Cover'
import { useDispatch, useSelector } from 'react-redux'
import GuidedTour from '../onboarding/shared/GuidedTour'
import GuidedTourMobile from '../onboarding/shared/GuidedTourMobile'

interface SlideState {
  isLoading: boolean
  isNoGeneratedSlide: boolean
  genSlideID: string | null
  retryCount: number
  lastUpdated: number
}

interface SlideStates {
  [key: string]: SlideState
}

const createInitialSlideState = (): SlideState => ({
  isLoading: true,
  isNoGeneratedSlide: false,
  genSlideID: null,
  retryCount: 0,
  lastUpdated: Date.now(),
})

export default function ViewPresentation() {
  const [searchParams] = useSearchParams()
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL
  const authToken = sessionStorage.getItem('authToken')
  const orgId = sessionStorage.getItem('orgId')
  const userPlan = useSelector((state: any) => state.user.userPlan)
  const [documentID, setDocumentID] = useState<string | null>(null)
  const [pptName, setPptName] = useState<string | null>(null)
  const [presentationID, setPresentationID] = useState<string>('')
  const [isDocumentIDLoading, setIsDocumentIDLoading] = useState(true)
  const [isPptNameLoading, setIsPptNameLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(1)
  const [currentOutline, setCurrentOutline] = useState('')
  const [currentOutlineID, setCurrentOutlineID] = useState('')
  const [outlineType, setOutlineType] = useState('')
  const [outlines, setOutlines] = useState<Outline[]>([])
  const [displayModes, setDisplayModes] = useState<{
    [key: string]: DisplayMode
  }>({})
  const slideRefs = useRef<HTMLDivElement[]>([])
  const [totalSlides, setTotalSlides] = useState(Number)
  const [slidesId, setSlidesId] = useState<string[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const pricingModalHeading = 'Refine PPT'
  const [monthlyPlan, setMonthlyPlan] = useState<Plan>()
  const [yearlyPlan, setYearlyPlan] = useState<Plan>()
  const [currency, setCurrency] = useState('')
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [prevTotalSlides, setPrevTotalSlides] = useState(totalSlides)
  const [prevSlideIndex, setPrevSlideIndex] = useState(currentSlideIndex)
  const [isExportPaid, setIsExportPaid] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [showCountdown, setShowCountdown] = useState(false)
  const featureDisabled = userPlan === 'free' ? true : false
  const [newVersionBackDisabled, setNewVersionBackDisabled] = useState(false)
  const [slidesArray, setSlidesArray] = useState<{ [key: string]: string[] }>(
    {}
  )
  const [isNewSlideLoading, setIsNewSlideLoading] = useState<{
    [key: string]: boolean
  }>({})
  const [slideStates, setSlideStates] = useState<SlideStates>({})
  const [finalizedSlides, setFinalizedSlides] = useState<{
    [key: string]: string
  }>({})
  const [newSlideGenerated, setNewSlideGenerated] = useState<{
    [key: string]: string
  }>({})
  const [subId, setSubId] = useState('')
  const dispatch = useDispatch()

  // Handle Share Button Click
  const handleShare = async () => {
    const url = `/share?formId=${documentID}`
    window.open(url, '_blank') // Opens the URL in a new tab
  }

  // Handle Download Button Click
  const handleDownload = async () => {
    setShowCountdown(true)
    setCountdown(8)
    try {
      const formId = documentID
      if (!formId) {
        throw new Error('Form ID not found in localStorage')
      }

      // 1. First, update the payment status
      const updatePaymentStatus = async () => {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidedisplay/finalsheet/${documentID}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ paymentStatus: 1 }),
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        console.log('Payment status updated:', result)
      }

      // Call payment status update
      await updatePaymentStatus()

      // 3. Finally, call the original slides URL API
      // const response = await fetch(
      //   `${process.env.REACT_APP_BACKEND_URL}/slides/url?formId=${formId}`
      // )
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidedisplay/statuscheck/${documentID}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const presentationUrl = result.data.PresentationURL
      if (presentationUrl && typeof presentationUrl === 'string') {
        setCountdown(0)
        setIsExportPaid(true)
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          // Mobile: Open directly in the same tab
          window.location.href = presentationUrl
        } else {
          // Desktop: Open directly in a new tab
          window.open(presentationUrl, '_blank')
        }
      } else {
        throw new Error('Invalid URL in response')
      }
    } catch (error) {
      console.error('Error exporting presentation:', error)
      alert(
        "Oops! It seems like the pitch deck presentation is missing. Click 'Generate Presentation' to begin your journey to success!"
      )
    }
  }

  useEffect(() => {
    if (countdown === null || countdown === 0) {
      if (countdown === 0) {
        setShowCountdown(false) // Hide the modal once the countdown ends
        console.log('Download starting...')
      }
      return
    }

    const timer = setInterval(() => {
      setCountdown((prevCount) => (prevCount !== null ? prevCount - 1 : 0))
    }, 1000)

    return () => clearInterval(timer) // Cleanup the timer
  }, [countdown])

  // Function to check payment status and proceed
  const checkPaymentStatusAndProceed = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidedisplay/statuscheck/${documentID}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      const res = await response.json()
      if (res && res.data.paymentStatus === 1) {
        // Payment has already been made, run handleDownload
        handleDownload()
      } else if (res && res.data.paymentStatus === 0) {
        const paymentButton = document.getElementById('payment-button')
        if (paymentButton) {
          paymentButton.click()
        } else {
          console.error('Payment button not found')
        }
      } else {
        alert('Unable to determine payment status.')
      }
    } catch (error) {
      console.error('Error checking payment status:', error)
      alert('Error checking payment status. Please try again.')
    }
  }

  // Handle Delete Button Click
  const handleDelete = () => {
    axios
      .patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidedisplay/slidedisplay/display/${slidesArray[currentOutline]?.[currentSlideIndex]}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setSlidesArray((prevSlidesArray) => {
          const updatedSlidesArray = { ...prevSlidesArray }
          const updatedSlides = updatedSlidesArray[currentOutline].filter(
            (_, index) => index !== currentSlideIndex
          )
          updatedSlidesArray[currentOutline] = updatedSlides
          // Check if the updatedSlides array is empty
          if (updatedSlides.length === 0) {
            setDisplayModes((prev) => ({
              ...prev,
              [currentOutline]: 'newContent',
            }))
            setNewVersionBackDisabled(true)
          }

          setCurrentSlideIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : 0
          )

          return updatedSlidesArray
        })
      })
  }

  // Handle Finalize Button Click
  const handleFinalize = () => {
    const slideId = slidesArray[currentOutline]?.[currentSlideIndex]

    axios
      .patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidedisplay/slidedisplay/selected/${slideId}/${documentID}/${currentOutlineID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response) => {
        setFinalizedSlides((prevFinalizedSlides) => {
          const updatedFinalizedSlides = { ...prevFinalizedSlides }

          // Check if currentOutline is already present and its value is the same as slideId
          if (updatedFinalizedSlides[currentOutline] === slideId) {
            // Remove the value but keep the key
            updatedFinalizedSlides[currentOutline] = ''
          } else {
            // Update the value of currentOutline to slideId
            updatedFinalizedSlides[currentOutline] = slideId
          }

          return updatedFinalizedSlides
        })
      })
      .catch((error) => {
        console.log('Error finalizing the slide')
      })
  }

  // Handle Add New Slide Version Button
  const handlePlusClick = (outlineTitle: string) => {
    updateSlideState(outlineTitle, {
      isLoading: false,
      isNoGeneratedSlide: false,
      lastUpdated: Date.now(),
    })
    setDisplayModes((prev) => ({
      ...prev,
      [outlineTitle]: prev[outlineTitle] === 'slides' ? 'newContent' : 'slides',
    }))
  }

  // Paginate Back
  const handlePaginatePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1)
      setSlideStates((prev) => ({
        ...prev,
        [currentOutline]: {
          ...prev[currentOutline],
          isLoading: true,
        },
      }))

      setTimeout(() => {
        setSlideStates((prev) => ({
          ...prev,
          [currentOutline]: {
            ...prev[currentOutline],
            isLoading: false,
          },
        }))
      }, 100)
    }
  }

  // Paginate Next
  const handlePaginateNext = () => {
    const currentSlides = slidesArray[currentOutline]
    if (currentSlides && currentSlideIndex < currentSlides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1)
      setSlideStates((prev) => ({
        ...prev,
        [currentOutline]: {
          ...prev[currentOutline],
          isLoading: true,
        },
      }))

      setTimeout(() => {
        setSlideStates((prev) => ({
          ...prev,
          [currentOutline]: {
            ...prev[currentOutline],
            isLoading: false,
          },
        }))
      }, 100)
    }
  }

  // Custom Builder Slide Type Select Handler
  const handleCustomTypeClick = (
    typeName: DisplayMode,
    outlineTitle: string
  ) => {
    setDisplayModes((prev) => ({
      ...prev,
      [outlineTitle]: typeName,
    }))
  }

  // Mobile Back Button
  const onBack = (outlineTitle: string) => {
    setDisplayModes((prev) => {
      const currentMode = prev[outlineTitle]
      let newMode: DisplayMode = 'slides'

      if (
        (outlineTitle === outlines[0].title ||
          outlineTitle === outlines[outlines.length - 1].title) &&
        currentMode === 'customBuilder'
      ) {
        newMode = 'newContent'
      }

      if (currentMode === 'SlideNarrative') {
        newMode = 'newContent'
      } else if (currentMode === 'customBuilder') {
        newMode = 'newContent'
      } else if (currentMode === 'Cover') {
        newMode = 'newContent'
      } else if (currentMode === 'newContent') {
        newMode = 'slides'
      } else {
        newMode = 'customBuilder'
      }

      return {
        ...prev,
        [outlineTitle]: newMode,
      }
    })
  }

  // MEDIUM LARGE SCREENS: Sidebar Outline Select
  const handleOutlineSelect = (title: string) => {
    setCurrentOutline(title)
    setCurrentOutlineID(outlines.find((o) => o.title === title)?.outlineID!)
    const slideIndex = outlines.findIndex((o) => o.title === title)
    setCurrentSlide(slideIndex)
    slideRefs.current[slideIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
    setCurrentSlideIndex(0)

    // Only execute setDisplayModes if isNewSlideLoading[title] is false or undefined
    if (
      isNewSlideLoading[title] === false ||
      isNewSlideLoading[title] === undefined
    ) {
      setDisplayModes((prev) => ({
        ...prev,
        [currentOutline]:
          slidesArray[title]?.length === 0
            ? 'newContent'
            : prev[currentOutline],
      }))
    }

    setIsNewSlideLoading((prev) => ({
      ...prev,
      [currentOutline]: prev[currentOutline],
    }))

    setNewSlideGenerated((prev) => ({
      ...prev,
      [title]: prev[title] && '',
    }))
  }

  // MEDIUM LARGE SCREENS: Slide Scroll
  const debounce = (fn: Function, delay: number) => {
    let timer: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }
  }
  const handleScroll = debounce(() => {
    if (!scrollContainerRef.current) return
    // setCurrentSlideIndex(0)
    const scrollTop = scrollContainerRef.current.scrollTop || 0
    const closestIndex = slideRefs.current.findIndex((slideRef, index) => {
      if (!slideRef) return false

      const offset = slideRef.offsetTop - scrollTop
      return offset >= 0 && offset < slideRef.offsetHeight
    })

    if (
      closestIndex !== -1 &&
      outlines[closestIndex]?.title !== currentOutline
    ) {
      setCurrentOutline(outlines[closestIndex]?.title)
      setCurrentOutlineID(outlines[closestIndex]?.outlineID!)
      if (
        isNewSlideLoading[currentOutline] === false ||
        isNewSlideLoading[currentOutline] === undefined
      ) {
        setDisplayModes((prev) => ({
          ...prev,
          [currentOutline]:
            slidesArray[currentOutline]?.length === 0
              ? 'newContent'
              : prev[currentOutline],
        }))
      }
      setNewSlideGenerated((prev) => ({
        ...prev,
        [currentOutline]: prev[currentOutline] && '',
      }))
    }
  }, 100)

  // Quick Generate Slide
  const handleQuickGenerate = async () => {
    // Set loading state at the start
    setSlideStates((prev) => {
      return {
        ...prev,
        [currentOutline]: {
          ...prev[currentOutline],
          isLoading: slidesArray[currentOutline]?.length === 0,
          isNoGeneratedSlide: false,
          lastUpdated: Date.now(),
        },
      }
    })

    setIsNewSlideLoading((prev) => ({
      ...prev,
      [currentOutline]: true,
    }))

    setDisplayModes((prev) => {
      if (
        !slideStates[currentOutline]?.isLoading &&
        slidesArray[currentOutline] &&
        slidesArray[currentOutline].length > 0
      ) {
        console.log('Quick Generate Display State')

        return {
          ...prev,
          [currentOutline]: 'slides',
        }
      }
      return prev
    })

    let slideType = outlineType

    try {
      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/generate-document/${orgId}`,
          {
            type: slideType,
            title: currentOutline.replace(/^\d+\.\s*/, ''),
            documentID: documentID,
            outlineID: currentOutlineID,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then((response) => {
          toast.info('Slide Generation Started', {
            position: 'top-right',
            autoClose: 3000,
          })
        })
        .catch((error) => {
          toast.error('Error while generating slide', {
            position: 'top-right',
            autoClose: 3000,
          })
          setSlideStates((prev) => {
            const genSlideID = prev[currentOutline]?.genSlideID
            return {
              ...prev,
              [currentOutline]: {
                ...prev[currentOutline],
                isLoading: false,
                isNoGeneratedSlide: !genSlideID || genSlideID === '',
                lastUpdated: Date.now(),
              },
            }
          })
          setDisplayModes((prev) => ({ ...prev, [currentOutline]: 'slides' }))
          setIsNewSlideLoading((prev) => ({
            ...prev,
            [currentOutline]: false,
          }))
        })
    } catch (error) {
      console.error('Error generating slide:', error)
      toast.error('Error while generating slide', {
        position: 'top-right',
        autoClose: 3000,
      })

      // Reset loading state on error
      setSlideStates((prev) => ({
        ...prev,
        [currentOutline]: {
          ...prev[currentOutline],
          isLoading: false,
          lastUpdated: Date.now(),
        },
      }))
      setIsNewSlideLoading((prev) => ({
        ...prev,
        [currentOutline]: false,
      }))
    }
  }

  // Render Slide Content
  const renderContent = ({
    isMobile,
    index,
    outlineTitle,
  }: {
    displayMode: string
    isMobile: boolean
    index?: number
    GenSlideID: string
    outlineTitle: string
  }) => {
    const currentDisplayMode = displayModes[outlineTitle]
    const slideState = slideStates[outlineTitle] || createInitialSlideState()
    const currentSlideId = slidesArray[outlineTitle]?.[currentSlideIndex]

    switch (currentDisplayMode) {
      case 'slides':
        return (
          <>
            {slideState.isLoading ? (
              <div className="w-full h-full flex flex-col gap-y-3 items-center justify-center">
                <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                <h1>Generating Slide Please Wait...</h1>
              </div>
            ) : slideState.isNoGeneratedSlide ? (
              <div className="w-full h-full flex flex-col gap-y-3 items-center justify-center">
                <h1 className="text-red-600">
                  Sorry! Slide could not be generated. Try generating New
                  Version of the slide.
                </h1>
              </div>
            ) : slideState.genSlideID ? (
              <iframe
                src={`https://docs.google.com/presentation/d/${presentationID}/embed?rm=minimal&start=false&loop=false&slide=id.${currentSlideId}`}
                title={`Slide ${index ? index + 1 : currentSlideIndex + 1}`}
                className="w-full h-full pointer-events-none"
                style={{ border: 0 }}
              />
            ) : null}
          </>
        )

      case 'newContent':
        const NewSlideVersion = isMobile
          ? MobileNewSlideVersion
          : DesktopNewSlideVersion
        return (
          <NewSlideVersion
            isLoading={slideState.isLoading}
            subscriptionId={subId}
            setDisplayMode={(value: SetStateAction<DisplayMode>) => {
              const newMode =
                typeof value === 'function'
                  ? value(displayModes[outlineTitle] || 'slides')
                  : value
              setDisplayModes((prev) => ({
                ...prev,
                [outlineTitle]: newMode,
              }))
            }}
            handleQuickGenerate={async () => {
              updateSlideState(outlineTitle, {
                isLoading: true,
                isNoGeneratedSlide: false,
                retryCount: 0,
                lastUpdated: Date.now(),
              })
              await handleQuickGenerate()
            }}
            handleCustomBuilderClick={() => {
              if (featureDisabled) {
                toast.info('Upgrade to pro to access this feature', {
                  position: 'top-right',
                  autoClose: 3000,
                })
              } else {
                const newMode =
                  outlineTitle === outlines[0].title
                    ? 'Cover'
                    : outlineTitle === outlines[outlines.length - 1].title
                    ? 'Contact'
                    : 'customBuilder'
                setDisplayModes((prev) => ({
                  ...prev,
                  [outlineTitle]: newMode,
                }))
              }
            }}
            handleSlideNarrative={() => {
              setDisplayModes((prev) => ({
                ...prev,
                [outlineTitle]: 'SlideNarrative',
              }))
            }}
            userPlan={userPlan!}
            customBuilderDisabled={featureDisabled}
            openPricingModal={() => setIsPricingModalOpen(true)}
            monthlyPlanAmount={monthlyPlanAmount}
            yearlyPlanAmount={yearlyPlanAmount}
            currency={currency}
            yearlyPlanId={yearlyPlanId!}
            monthlyPlanId={monthlyPlanId!}
            authToken={authToken!}
            orgId={orgId!}
            backDisabled={newVersionBackDisabled}
          />
        )

      case 'customBuilder':
        return (
          <CustomBuilderMenu
            onTypeClick={(type) => handleCustomTypeClick(type, outlineTitle)}
            setDisplayMode={(value: React.SetStateAction<DisplayMode>) => {
              setDisplayModes((prev) => ({
                ...prev,
                [outlineTitle]:
                  typeof value === 'function'
                    ? value(prev[outlineTitle] || 'slides')
                    : value,
              }))
            }}
          />
        )

      default:
        const components: Record<string, React.FC<any>> = {
          Points,
          People,
          Table,
          Timeline,
          SlideNarrative,
          Statistics,
          Images,
          Graphs,
          Contact,
          Cover,
        }

        const Component = components[currentDisplayMode]
        if (!Component) return null

        return (
          <Component
            heading={currentOutline.replace(/^\d+\.\s*/, '')}
            slideType={outlineType}
            documentID={documentID!}
            orgId={orgId!}
            authToken={authToken!}
            setDisplayMode={(mode: DisplayMode) => {
              setDisplayModes((prev) => ({
                ...prev,
                [outlineTitle]: mode,
              }))
            }}
            outlineID={currentOutlineID}
            setIsSlideLoading={() => {
              setSlideStates((prev) => {
                return {
                  ...prev,
                  [currentOutline]: {
                    ...prev[currentOutline],
                    isLoading:
                      !slidesArray[currentOutline] ||
                      slidesArray[currentOutline].length === 0,
                    isNoGeneratedSlide: false,
                    lastUpdated: Date.now(),
                  },
                }
              })

              setIsNewSlideLoading((prev) => ({
                ...prev,
                [currentOutline]: true,
              }))
              if (slidesArray[currentOutline]?.length !== 0) {
                setDisplayModes((prev) => ({
                  ...prev,
                  [outlineTitle]: 'slides',
                }))
              }
            }}
          />
        )
    }
  }

  // Effect to monitor changes
  useEffect(() => {
    if (totalSlides !== prevTotalSlides) {
      updateSlideState(currentOutline, {
        isLoading: false,
        isNoGeneratedSlide: false,
        retryCount: 0,
        lastUpdated: Date.now(),
      })

      if (
        slidesArray[currentOutline] &&
        slidesArray[currentOutline].length >= 1
      ) {
        setDisplayModes((prev) => ({
          ...prev,
          [currentOutline]: prev[currentOutline], // Preserve the previous state
        }))
      }

      if (totalSlides !== 0) {
        setIsNewSlideLoading((prev) => {
          if (prev[currentOutline]) {
            setNewSlideGenerated((prev) => ({
              ...prev,
              [currentOutline]: 'Yes',
            }))
            toast.success(`Slide Generated`, {
              position: 'top-right',
              autoClose: 3000,
            })
            setDisplayModes((prev) => ({
              ...prev,
              [currentOutline]: 'slides', // Preserve the previous state
            }))
            return {
              ...prev,
              [currentOutline]: false,
            }
          }
          return prev
        })
      }
    }

    if (totalSlides !== 0) {
      setNewVersionBackDisabled(false)
    }

    setPrevTotalSlides(totalSlides)
  }, [totalSlides, prevTotalSlides])

  useEffect(() => {
    const { initialStates, initialModes } = outlines.reduce(
      (acc, outline) => {
        acc.initialStates[outline.title] = createInitialSlideState()
        acc.initialModes[outline.title] = 'slides'
        return acc
      },
      {
        initialStates: {} as { [key: string]: SlideState },
        initialModes: {} as { [key: string]: DisplayMode },
      }
    )

    console.log('Reached HERE')

    setSlideStates(initialStates)
    setDisplayModes(initialModes)
  }, [outlines])

  const updateSlideState = useCallback(
    (outlineTitle: string, updates: Partial<SlideState>) => {
      setSlideStates((prev) => ({
        ...prev,
        [outlineTitle]: {
          ...prev[outlineTitle],
          ...updates,
        },
      }))
    },
    []
  )

  const newSlidesRef = useRef<any[]>([]) // Ref to store newSlides persistently
  // TODO: WEB SOCKET
  useEffect(() => {
    if (currentOutline !== '' && documentID !== null) {
      const socket = io(SOCKET_URL, { transports: ['websocket'] })
      console.info('Connecting to WebSocket server...')

      // Set initial loading state
      setSlideStates((prev) => {
        const isNoGeneratedSlide = prev[currentOutline]?.isNoGeneratedSlide
        const hasSlidesData = slidesArray[currentOutline]?.length > 0

        // Keep loading true if isNewSlideLoading is true and no slides exist
        const shouldKeepLoading =
          isNewSlideLoading[currentOutline] && !hasSlidesData

        // Only update isLoading to true if it is not already true
        return {
          ...prev,
          [currentOutline]: {
            ...prev[currentOutline],
            isLoading:
              shouldKeepLoading ||
              (isNoGeneratedSlide === false && !hasSlidesData),

            lastUpdated: Date.now(),
          },
        }
      })

      // Clear loading state and set error screen after timeout if no data received
      const timeoutId = setTimeout(() => {
        setSlideStates((prev) => {
          const genSlideID = prev[currentOutline]?.genSlideID
          return {
            ...prev,
            [currentOutline]: {
              ...prev[currentOutline],
              isLoading: false,
              isNoGeneratedSlide:
                totalSlides === 0 && (!genSlideID || genSlideID === ''),
            },
          }
        })

        setIsNewSlideLoading((prev) => {
          if (prev[currentOutline]) {
            setNewSlideGenerated((prev) => ({
              ...prev,
              [currentOutline]: 'No',
            }))
            toast.error(`New Slide Not Generated`, {
              position: 'top-right',
              autoClose: 3000,
            })
            return {
              ...prev,
              [currentOutline]: false,
            }
          }
          return prev
        })
      }, 120000)

      const processSlides = (newSlides: any[]) => {
        console.log('Socket Data', newSlides)

        newSlidesRef.current = newSlides

        if (newSlides.length > 0) {
          const firstSlide = newSlides[0]

          if (
            firstSlide.outline_id === currentOutlineID &&
            slidesArray[currentOutline]?.length !== newSlides.length &&
            firstSlide.PresentationID &&
            (firstSlide.GenSlideID !== null || '')
          ) {
            console.log('Reached Socket')

            // Update state with successful response
            setSlideStates((prev) => ({
              ...prev,
              [currentOutline]: {
                ...prev[currentOutline],
                isLoading: false,
                isNoGeneratedSlide: false,
                genSlideID: firstSlide.GenSlideID,
                lastUpdated: Date.now(),
              },
            }))

            if (!presentationID) {
              setPresentationID(firstSlide.PresentationID)
            }

            const ids = newSlides
              .filter((slide: any) => slide.display)
              .map((slide: any) => slide.GenSlideID)

            setSlidesId(ids)
            setSlidesArray((prev) => {
              return {
                ...prev,
                [currentOutline]: ids,
              }
            })

            setTotalSlides(ids.length)
            // Update finalizedSlides state
            const selectedSlide = newSlides.find((slide: any) => slide.selected)
            if (selectedSlide) {
              setFinalizedSlides((prev) => ({
                ...prev,
                [currentOutline]: selectedSlide.GenSlideID,
              }))
            }

            // Check if newSlides array has only one object and its display key is false
            // or if there are more than one items and all have display set to false
            if (
              (newSlides.length === 1 && !newSlides[0].display) ||
              (newSlides.length > 1 &&
                newSlides.every((slide) => !slide.display))
            ) {
              setDisplayModes((prev) => ({
                ...prev,
                [currentOutline]: 'newContent',
              }))
              setNewVersionBackDisabled(true)
            }
          }
        }
      }

      socket.on('slidesData', processSlides)

      socket.emit('fetchSlides', {
        // slideType: currentOutline.replace(/^\d+\.\s*/, ''),
        formID: documentID,
        outlineID: currentOutlineID,
      })

      // Cleanup function
      return () => {
        clearTimeout(timeoutId)
        socket.off('slidesData', processSlides)
        socket.disconnect()
      }
    }
  }, [currentOutline, documentID])

  useEffect(() => {
    setCurrentSlideIndex(0)
    setPrevSlideIndex(0)
  }, [currentOutline])

  // Effect to set loader for pagination changes
  useEffect(() => {
    if (currentSlideIndex !== prevSlideIndex) {
      updateSlideState(currentOutline, {
        isLoading: true,
        retryCount: 0,
        lastUpdated: Date.now(),
      })

      setPrevSlideIndex(currentSlideIndex)
    }

    setTimeout(() => {
      updateSlideState(currentOutline, {
        isLoading: false,
        retryCount: 0,
        lastUpdated: Date.now(),
      })
    }, 3000)
  }, [currentSlideIndex, prevSlideIndex])

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
      if (fetchedOutlines.length > 0 && !currentOutline && !currentOutlineID) {
        setCurrentOutline(fetchedOutlines[0].title)
        setCurrentOutlineID(fetchedOutlines[0].outlineID)
      }
      setIsDocumentIDLoading(false)
    } catch (error) {
      console.error('Error fetching outlines:', error)
    }
  }, [documentID, authToken])
  useEffect(() => {
    if (searchParams.get('presentationName') !== null) {
      fetchOutlines()
    } else {
      const interval = setInterval(async () => {
        await fetchOutlines()
        if (!isDocumentIDLoading) {
          clearInterval(interval)
        }
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [fetchOutlines, documentID, searchParams, isDocumentIDLoading])

  // Set Slide Type For Quick Generate
  useEffect(() => {
    const matchingOutline = outlines.find(
      (outline) => outline.title === currentOutline
    )
    // Update the outlineType state with the type of the matched object
    setOutlineType(matchingOutline?.type || '')
  }, [outlines, currentOutline])

  // API CALL TO GET PRICING DATA, EXPORT PAYMENT STATUS AND USER PLAN
  useEffect(() => {
    const documentIDFromUrl = searchParams.get('documentID')
    setDocumentID(documentIDFromUrl)
    const pptNameFromUrl = searchParams.get('presentationName')
    // Fetch the pptName if needed
    const getPptName = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/documents/latest?documentID=${documentID}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        const result = response.data
        setPptName(result.documentName)
        setIsPptNameLoading(false)
        return true
      } catch (error) {
        console.error('Error fetching document:', error)
        return false
      }
    }

    if (!pptNameFromUrl) {
      const interval = setInterval(async () => {
        const success = await getPptName()
        if (success) {
          clearInterval(interval)
        }
      }, 2000)

      return () => clearInterval(interval)
    }

    setPptName(pptNameFromUrl)
    setIsPptNameLoading(false)

    // Get User Plan
    const fetchUserPlan = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/${orgId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        const planName = response.data.plan.plan_name
        const subscriptionId = response.data.plan.subscriptionId
        dispatch(setUserPlan(planName))
        setSubId(subscriptionId)
      } catch (error) {
        console.error('Error fetching user plan:', error)
      }
    }

    fetchUserPlan()

    // Function to check payment status and proceed
    const checkPaymentStatusAndProceed = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidedisplay/statuscheck/${documentID}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          }
        )

        const res = await response.json()
        if (res && res.data.paymentStatus === 1) {
          // Payment has already been made, run handleDownload
          setIsExportPaid(true)
        } else if (res && res.data.paymentStatus === 0) {
          // const paymentButton = document.getElementById('payment-button')
          // if (paymentButton) {
          //   paymentButton.click()
          // } else {
          //   console.error('Payment button not found')
          // }
          setIsExportPaid(false)
        } else {
          alert('Unable to determine payment status.')
        }
      } catch (error) {
        console.error('Error checking payment status:', error)
        alert('Error checking payment status. Please try again.')
      }
    }

    // Call the payment status check
    if (documentID && userPlan === 'free') {
      checkPaymentStatusAndProceed()
    }

    if (userPlan !== 'free') {
      setIsExportPaid(true)
    }

    // Get Pricing Data
    const getPricingData = async () => {
      const ipInfoResponse = await fetch(
        'https://ipinfo.io/json?token=f0e9cf876d422e'
      )
      const ipInfoData: IpInfoResponse = await ipInfoResponse.json()

      await axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/appscripts/razorpay/plans`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then((response) => {
          const country = ipInfoData!.country!

          if (country !== 'IN' && country !== 'India' && country !== 'In') {
            setMonthlyPlan(response.data.items[1])
            setYearlyPlan(response.data.items[0])
            setCurrency('USD')
          } else if (
            country === 'IN' ||
            country === 'India' ||
            country === 'In'
          ) {
            setMonthlyPlan(response.data.items[1])
            setYearlyPlan(response.data.items[0])
            setCurrency('INR')
          }
        })
    }

    getPricingData()
  }, [documentID, authToken, dispatch, orgId, userPlan, searchParams])
  const monthlyPlanAmount = monthlyPlan?.item.amount! / 100
  const monthlyPlanId = monthlyPlan?.id
  const yearlyPlanAmount = yearlyPlan?.item.amount! / 100
  const yearlyPlanId = yearlyPlan?.id

  return (
    <div className="flex flex-col lg:flex-row bg-[#F5F7FA] h-full md:h-screen no-scrollbar no-scrollbar::-webkit-scrollbar">
      {/* Export Countdown */}
      {showCountdown && (
        <div className="modal">
          <div className="modal-content">
            <p>
              Payment has been done! Your download will start in {countdown}{' '}
              seconds...
            </p>
          </div>
        </div>
      )}

      {/* Pricing Modal */}
      {isPricingModalOpen && userPlan === 'free' ? (
        <PricingModal
          closeModal={() => {
            setIsPricingModalOpen(false)
          }}
          heading={pricingModalHeading}
          subscriptionId={subId}
          monthlyPlanAmount={monthlyPlanAmount}
          yearlyPlanAmount={yearlyPlanAmount}
          currency={currency}
          yearlyPlanId={yearlyPlanId!}
          monthlyPlanId={monthlyPlanId!}
          authToken={authToken!}
          orgId={orgId!}
          exportButtonText={`Export For ${currency === 'INR' ? '₹' : '$'}${
            currency === 'INR' ? '499' : '9'
          }`}
          exportHandler={checkPaymentStatusAndProceed}
          isButtonDisabled={true}
        />
      ) : (
        <></>
      )}
      <PaymentGateway
        productinfo="Presentation Export"
        onSuccess={handleDownload}
        formId={documentID!}
        authToken={authToken!}
      />
      {/*LARGE SCREEN: HEADING*/}
      <DesktopHeading
        handleDownload={handleDownload}
        handleShare={handleShare}
        pptName={pptName!}
        isLoading={isPptNameLoading}
        userPlan={userPlan!}
        openPricingModal={() => setIsPricingModalOpen(true)}
        exportPaid={isExportPaid}
      />

      {/*MEDIUM LARGE SCREEN: MAIN CONTAINER*/}
      <div className="hidden lg:flex lg:flex-row lg:w-full lg:pt-16 ">
        {/*MEDIUM LARGE SCREEN: SIDEBAR*/}
        <Sidebar
          isNewSlideLoading={isNewSlideLoading}
          newSlideGenerated={newSlideGenerated}
          onOutlineSelect={handleOutlineSelect}
          selectedOutline={currentOutline!}
          fetchedOutlines={outlines!}
          documentID={documentID!}
          authToken={authToken!}
          fetchOutlines={fetchOutlines}
          isLoading={isDocumentIDLoading}
          isDisabled={featureDisabled}
          userPlan={userPlan}
          monthlyPlanAmount={monthlyPlanAmount}
          yearlyPlanAmount={yearlyPlanAmount}
          currency={currency}
          yearlyPlanId={yearlyPlanId!}
          monthlyPlanId={monthlyPlanId!}
          orgId={orgId!}
          subscriptionId={subId}
        />

        {/*MEDIUM LARGE SCREEN: SLIDE DISPLAY CONTAINER*/}
        <div className="flex-1">
          {/* MEDIUM LARGE SCREEN: SLIDE DISPLAY BOX*/}
          <div
            className="no-scrollbar rounded-sm shadow-lg relative w-[90%] bg-white border border-gray-200 mb-2 ml-12 overflow-y-scroll snap-y scroll-smooth snap-mandatory"
            style={{ height: 'calc(100vh - 200px)' }}
            onScroll={handleScroll}
            ref={scrollContainerRef}
          >
            {slideStates[currentOutline]?.isLoading && (
              <div className="w-full h-full flex flex-col gap-y-3 items-center justify-center">
                <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                <h1>Generating Slide Please Wait...</h1>
              </div>
            )}
            {outlines.map((outline, index) => (
              <div
                key={outline.title}
                ref={(el) => (slideRefs.current[index] = el!)}
                className="snap-center scroll-smooth w-full h-full mb-4"
              >
                {renderContent({
                  GenSlideID: slidesArray[outline.title]?.[currentSlideIndex],
                  displayMode: displayModes[outline.title],
                  isMobile: false,
                  index,
                  outlineTitle: outline.title,
                })}
              </div>
            ))}
          </div>

          {/* MEDIUM LARGE SCREEN: ACTION BUTTONS */}
          <div className="flex items-center justify-between ml-12">
            <DesktopButtonSection
              onDelete={handleDelete}
              onFinalize={handleFinalize}
              onNewVersion={() => handlePlusClick(currentOutline)}
              finalized={
                finalizedSlides[currentOutline] ===
                slidesArray[currentOutline]?.[currentSlideIndex]
              }
              currentSlideId={slidesArray[currentOutline]?.[currentSlideIndex]}
            />

            {/* MEDIUM LARGE SCREEN: PAGINATION BUTTONS */}
            <div className="flex items-center gap-2 mr-14">
              <button
                id="arrows"
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
                Slide{' '}
                {slidesArray[currentOutline]?.length > 0
                  ? currentSlideIndex + 1
                  : '0'}{' '}
                of {slidesArray[currentOutline]?.length || 0}
              </span>
              <button
                onClick={handlePaginateNext}
                disabled={
                  currentSlideIndex ===
                  (slidesArray[currentOutline]?.length ?? 0) - 1
                }
                className={`flex items-center border hover:cursor-pointer border-[#E1E3E5] bg-white p-2 rounded-md active:scale-95 transition transform duration-300 ${
                  currentSlideIndex ===
                  (slidesArray[currentOutline]?.length ?? 0) - 1
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
      <div className="block lg:hidden p-4 ">
        {/* MOBILE: HEADING */}
        <MobileHeading
          handleDownload={handleDownload}
          handleShare={handleShare}
          pptName={pptName!}
          isLoading={isPptNameLoading}
          userPlan={userPlan!}
          openPricingModal={() => setIsPricingModalOpen(true)}
          exportPaid={isExportPaid}
        />

        {/* MOBILE: OUTLINE Modal */}
        <div className="space-y-4 mt-4 mb-4">
          <div className="block lg:hidden">
            {outlines && outlines.length > 0 && (
              <MobileOutlineModal
                isNewSlideLoading={isNewSlideLoading}
                newSlideGenerated={newSlideGenerated}
                documentID={documentID!}
                outlines={outlines}
                onSelectOutline={(outline) => {
                  setCurrentOutline(outline)
                  setCurrentOutlineID(
                    outlines.find((o) => o.title === outline)?.outlineID!
                  )
                  const slideIndex = outlines.findIndex(
                    (o) => o.title === outline
                  )
                  setCurrentSlide(slideIndex)
                  setCurrentSlideIndex(0)
                  // Only execute setDisplayModes if isNewSlideLoading[title] is false or undefined
                  if (
                    isNewSlideLoading[outline] === false ||
                    isNewSlideLoading[outline] === undefined
                  ) {
                    setDisplayModes((prev) => ({
                      ...prev,
                      [currentOutline]:
                        slidesArray[outline]?.length === 0
                          ? 'newContent'
                          : prev[currentOutline],
                    }))
                  }

                  setIsNewSlideLoading((prev) => ({
                    ...prev,
                    [currentOutline]: prev[currentOutline],
                  }))

                  setNewSlideGenerated((prev) => ({
                    ...prev,
                    [outline]: prev[outline] && '',
                  }))
                }}
                selectedOutline={currentOutline}
                fetchOutlines={fetchOutlines}
                isLoading={isDocumentIDLoading}
                userPlan={userPlan}
                subscriptionId={subId}
                monthlyPlanAmount={monthlyPlanAmount}
                yearlyPlanAmount={yearlyPlanAmount}
                currency={currency}
                yearlyPlanId={yearlyPlanId!}
                monthlyPlanId={monthlyPlanId!}
                orgId={orgId!}
                authToken={authToken!}
              />
            )}
          </div>
        </div>

        {/* MOBILE: SLIDE DISPLAY BOX */}
        <div
          className={`relative bg-white ${
            displayModes[currentOutline] !== 'slides'
              ? 'h-[50vh] md:h-[50vh]'
              : 'h-[50.5vh]' // keep the height the same when 'slides' mode
          } w-full border border-gray-200 mb-2`}
        >
          {renderContent({
            GenSlideID: slidesArray[currentOutline]
              ? slidesArray[currentOutline][currentSlideIndex]
              : '',
            displayMode: displayModes[currentOutline],
            isMobile: true,
            outlineTitle: currentOutline,
          })}
        </div>

        {/* MOBILE: ACTION BUTTONS */}
        <div className={`relative flex items-center justify-between w-full`}>
          {displayModes[currentOutline] === 'slides' ? (
            <MobileButtonSection
              onDelete={handleDelete}
              onFinalize={handleFinalize}
              onNewVersion={() => handlePlusClick(currentOutline)}
              finalized={
                finalizedSlides[currentOutline] ===
                slidesArray[currentOutline]?.[currentSlideIndex]
              }
              currentSlideId={slidesId[currentSlideIndex]}
              displayMode={displayModes[currentOutline]}
            />
          ) : (
            <button
              onClick={() => onBack(currentOutline)}
              disabled={newVersionBackDisabled}
              className="border border-gray-300 p-2 rounded-md flex items-center"
            >
              Back
            </button>
          )}

          {/* MOBILE: PAGINATION BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              id="arrow-mobile"
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
              Slide{' '}
              {slidesArray[currentOutline]?.length > 0
                ? currentSlideIndex + 1
                : '0'}{' '}
              of {slidesArray[currentOutline]?.length || 0}
            </span>
            <button
              onClick={handlePaginateNext}
              disabled={
                currentSlideIndex === slidesArray[currentOutline]?.length - 1
              }
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
      <GuidedTour />
      <GuidedTourMobile />
    </div>
  )
}
