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
import { Outline } from '../../types/presentationView'
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
import { slideLoaderMessages, initialLoaderMessages } from '../../utils/data'

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
  const [initialSlides, setInitialSlides] = useState<{
    [key: string]: number
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
  const [displayBoxLoading, setDisplayBoxLoading] = useState(true)
  const slidesArrayRef = useRef(slidesArray)
  const newSlideLoadingRef = useRef(isNewSlideLoading)
  const slideStatesRef = useRef(slideStates)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [currentSlideLoaderMessageIndex, setCurrentSlideLoaderMessageIndex] =
    useState(0)

  // Initial Loader Messages
  useEffect(() => {
    if (!displayBoxLoading) return

    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex < initialLoaderMessages.length - 1 ? prevIndex + 1 : 0
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [displayBoxLoading])

  // Slide Loader Messages
  useEffect(() => {
    if (!slideStates[currentOutlineID]?.isLoading) return

    const interval = setInterval(() => {
      setCurrentSlideLoaderMessageIndex((prevIndex) =>
        prevIndex < slideLoaderMessages.length - 1 ? prevIndex + 1 : 0
      )
      // setCurrentSlideLoaderMessageIndex(
      //   (prevIndex) =>
      //     prevIndex < slideLoaderMessages.length - 1 ? prevIndex + 1 : prevIndex // Stop incrementing at the last message
      // )
    }, 10000)

    return () => clearInterval(interval)
  }, [slideStates[currentOutlineID]?.isLoading])

  const openPricingModal = async () => {
    setIsPricingModalOpen(true)
    try {
      // Update the export status
      const updatePaymentStatus = async () => {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidedisplay/finalsheet/${documentID}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ exportstatus: true }),
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
    } catch (error) {
      console.log(error)
    }
  }

  // Handle Share Button Click
  const handleShare = async () => {
    const url = `/presentation-share?formId=${documentID}`
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
            body: JSON.stringify({ paymentStatus: 1, exportstatus: true }),
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

      // 2. Then, call the additional API to get presentationID
      const callAdditionalApi = async () => {
        if (presentationID) {
          // Call the second API with the extracted presentationID
          const secondApiResponse = await fetch(
            `https://script.google.com/macros/s/AKfycbyUR5SWxE4IHJ6uVr1eVTS7WhJywnbCNBs2zlJsUFbafyCsaNWiGxg7HQbyB3zx7R6z/exec?presentationID=${presentationID}`
          )
          const secondApiText = await secondApiResponse.text()
          try {
            const secondApiResult = JSON.parse(secondApiText)
          } catch (jsonError) {
            console.error(
              'Error parsing second API response as JSON:',
              jsonError
            )
          }
        } else {
          throw new Error('PresentationID not found in the response')
        }
      }

      // Call additional API
      await callAdditionalApi()

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
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidedisplay/slidedisplay/display/${slidesArray[currentOutlineID]?.[currentSlideIndex]}`,
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
          const updatedSlides = updatedSlidesArray[currentOutlineID].filter(
            (_, index) => index !== currentSlideIndex
          )
          updatedSlidesArray[currentOutlineID] = updatedSlides
          // Check if the updatedSlides array is empty
          if (updatedSlides.length === 0) {
            setDisplayModes((prev) => ({
              ...prev,
              [currentOutlineID]: 'newContent',
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
    const slideId = slidesArray[currentOutlineID]?.[currentSlideIndex]
    const isFinalized = finalizedSlides[currentOutlineID] === slideId

    setFinalizedSlides((prevFinalizedSlides) => {
      const updatedFinalizedSlides = { ...prevFinalizedSlides }

      // Check if currentOutline is already present and its value is the same as slideId
      if (updatedFinalizedSlides[currentOutlineID] === slideId) {
        // Remove the value but keep the key
        updatedFinalizedSlides[currentOutlineID] = ''
      } else {
        // Update the value of currentOutline to slideId
        updatedFinalizedSlides[currentOutlineID] = slideId
      }

      return updatedFinalizedSlides
    })

    const url = isFinalized
      ? `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidedisplay/slidedisplay/displayfalse/${slideId}`
      : `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidedisplay/slidedisplay/selected/${slideId}/${documentID}/${currentOutlineID}`
    const requestType = isFinalized ? 'post' : 'patch'

    axios[requestType](
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    )
      .then((response) => {})
      .catch((error) => {
        console.log('Error finalizing the slide')
        setFinalizedSlides((prevFinalizedSlides) => {
          const updatedFinalizedSlides = { ...prevFinalizedSlides }

          // Check if currentOutline is already present and its value is the same as slideId
          if (updatedFinalizedSlides[currentOutlineID] === slideId) {
            // Remove the value but keep the key
            updatedFinalizedSlides[currentOutlineID] = ''
          }

          return updatedFinalizedSlides
        })
      })
  }

  // Handle Add New Slide Version Button
  const handlePlusClick = (outlineid: string) => {
    updateSlideState(outlineid, {
      isLoading: false,
      isNoGeneratedSlide: false,
      lastUpdated: Date.now(),
    })

    const isCoverOutline = outlines.some(
      (outline) => outline.type === 'Cover' && outline.outlineID === outlineid
    )
    const isContactOutline = outlines.some(
      (outline) => outline.type === 'Contact' && outline.outlineID === outlineid
    )

    setDisplayModes((prev) => ({
      ...prev,
      [outlineid]: isCoverOutline
        ? 'Cover'
        : isContactOutline
        ? 'Contact'
        : prev[outlineid] === 'slides'
        ? 'newContent'
        : 'slides',
    }))
  }

  // Paginate Back
  const handlePaginatePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1)
      setSlideStates((prev) => ({
        ...prev,
        [currentOutlineID]: {
          ...prev[currentOutlineID],
          isLoading: true,
        },
      }))

      setTimeout(() => {
        setSlideStates((prev) => ({
          ...prev,
          [currentOutlineID]: {
            ...prev[currentOutlineID],
            isLoading: false,
          },
        }))
      }, 100)
    }
  }

  // Paginate Next
  const handlePaginateNext = () => {
    const currentSlides = slidesArray[currentOutlineID]
    if (currentSlides && currentSlideIndex < currentSlides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1)
      setSlideStates((prev) => ({
        ...prev,
        [currentOutlineID]: {
          ...prev[currentOutlineID],
          isLoading: true,
        },
      }))

      setTimeout(() => {
        setSlideStates((prev) => ({
          ...prev,
          [currentOutlineID]: {
            ...prev[currentOutlineID],
            isLoading: false,
          },
        }))
      }, 100)
    }
  }

  // Custom Builder Slide Type Select Handler
  const handleCustomTypeClick = (typeName: DisplayMode, outlineid: string) => {
    setDisplayModes((prev) => ({
      ...prev,
      [outlineid]: typeName,
    }))
  }

  // Mobile Back Button
  const onBack = (outlineid: string) => {
    setDisplayModes((prev) => {
      const currentMode = prev[outlineid]
      let newMode: DisplayMode = 'slides'

      if (
        (outlineid === outlines[0].outlineID ||
          outlineid === outlines[outlines.length - 1].outlineID) &&
        currentMode === 'customBuilder'
      ) {
        newMode = 'newContent'
      }

      if (currentMode === 'SlideNarrative') {
        newMode = 'newContent'
      } else if (currentMode === 'customBuilder') {
        newMode = 'newContent'
      } else if (currentMode === 'Cover') {
        newMode = 'slides'
      } else if (currentMode === 'Contact') {
        newMode = 'slides'
      } else if (currentMode === 'newContent') {
        newMode = 'slides'
      } else {
        newMode = 'customBuilder'
      }

      return {
        ...prev,
        [outlineid]: newMode,
      }
    })
  }

  // Quick Generate Slide
  const handleQuickGenerate = async () => {
    toast.info(
      `Request sent to a generate new version for ${currentOutline.replace(
        /^\d+\.\s*/,
        ''
      )}`,
      {
        position: 'top-right',
        autoClose: 3000,
      }
    )
    const storedOutlineIDs = sessionStorage.getItem('outlineIDs')
    setInitialSlides((prev) => ({
      ...prev,
      [currentOutlineID]: slidesArrayRef.current[currentOutlineID]?.length ?? 0,
    }))
    if (storedOutlineIDs) {
      const outlineIDs = JSON.parse(storedOutlineIDs)

      // Check if currentOutlineID exists in the array
      if (outlineIDs.includes(currentOutlineID)) {
        // Remove currentOutlineID from the array
        const updatedOutlineIDs = outlineIDs.filter(
          (id: string) => id !== currentOutlineID
        )

        // Update the sessionStorage with the modified array
        sessionStorage.setItem('outlineIDs', JSON.stringify(updatedOutlineIDs))
      }
    }
    // Set loading state at the start
    setSlideStates((prev) => {
      return {
        ...prev,
        [currentOutlineID]: {
          ...prev[currentOutlineID],
          isLoading:
            slidesArray[currentOutlineID]?.length === 0 ||
            !slidesArray[currentOutlineID],
          isNoGeneratedSlide: false,
          lastUpdated: Date.now(),
        },
      }
    })

    setIsNewSlideLoading((prev) => ({
      ...prev,
      [currentOutlineID]: true,
    }))

    setDisplayModes((prev) => {
      if (
        !slideStates[currentOutlineID]?.isLoading &&
        slidesArray[currentOutlineID] &&
        slidesArray[currentOutlineID].length > 0
      ) {
        return {
          ...prev,
          [currentOutlineID]: 'slides',
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
          toast.info(
            `Slide Generation Started for ${currentOutline.replace(
              /^\d+\.\s*/,
              ''
            )}`,
            {
              position: 'top-right',
              autoClose: 3000,
            }
          )
        })
        .catch((error) => {
          toast.error('Error while generating slide', {
            position: 'top-right',
            autoClose: 3000,
          })
          setSlideStates((prev) => {
            const genSlideID = prev[currentOutlineID]?.genSlideID
            return {
              ...prev,
              [currentOutlineID]: {
                ...prev[currentOutlineID],
                isLoading: false,
                isNoGeneratedSlide: !genSlideID || genSlideID === '',
                lastUpdated: Date.now(),
              },
            }
          })
          setDisplayModes((prev) => ({ ...prev, [currentOutlineID]: 'slides' }))
          setIsNewSlideLoading((prev) => ({
            ...prev,
            [currentOutlineID]: false,
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
        [currentOutlineID]: {
          ...prev[currentOutlineID],
          isLoading: false,
          lastUpdated: Date.now(),
        },
      }))
      setIsNewSlideLoading((prev) => ({
        ...prev,
        [currentOutlineID]: false,
      }))
    }
  }

  // MEDIUM LARGE SCREENS: Sidebar Outline Select
  const handleOutlineSelect = (outlineid: string) => {
    setCurrentOutline(outlines.find((o) => o.outlineID === outlineid)?.title!)
    setCurrentOutlineID(outlineid)
    const slideIndex = outlines.findIndex((o) => o.outlineID === outlineid)
    setCurrentSlide(slideIndex)
    slideRefs.current[slideIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
    setCurrentSlideIndex(0)

    // Only execute setDisplayModes if isNewSlideLoading[title] is false or undefined
    if (
      isNewSlideLoading[outlineid] === false ||
      isNewSlideLoading[outlineid] === undefined
    ) {
      setDisplayModes((prev) => ({
        ...prev,
        [outlineid]:
          slidesArray[outlineid]?.length === 0 ? 'newContent' : prev[outlineid],
      }))
    } else {
      setDisplayModes((prev) => ({
        ...prev,
        [outlineid]:
          slidesArray[outlineid]?.length === 0 && totalSlides === 0
            ? 'newContent'
            : 'slides',
      }))
    }

    setIsNewSlideLoading((prev) => ({
      ...prev,
      [outlineid]: prev[outlineid],
    }))

    setNewSlideGenerated((prev) => ({
      ...prev,
      [outlineid]: prev[outlineid] && '',
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
        isNewSlideLoading[currentOutlineID] === false ||
        isNewSlideLoading[currentOutlineID] === undefined
      ) {
        setDisplayModes((prev) => ({
          ...prev,
          [currentOutlineID]:
            slidesArray[currentOutlineID]?.length === 0
              ? 'newContent'
              : prev[currentOutlineID],
        }))
      } else {
        setDisplayModes((prev) => ({
          ...prev,
          [currentOutlineID]:
            slidesArray[currentOutlineID]?.length === 0 && totalSlides === 0
              ? 'newContent'
              : 'slides',
        }))
      }

      setIsNewSlideLoading((prev) => ({
        ...prev,
        [currentOutlineID]: prev[currentOutlineID],
      }))

      setNewSlideGenerated((prev) => ({
        ...prev,
        [currentOutlineID]: prev[currentOutlineID] && '',
      }))
    }
  }, 100)

  // Function to check if slides exist for an outline
  const hasSlidesForOutline = (outlineid: string) => {
    return slidesArray[outlineid]?.length > 0
  }

  // Render Slide Content
  const renderContent = ({
    isMobile,
    index,
    outlineid,
  }: {
    displayMode: string
    isMobile: boolean
    index?: number
    GenSlideID: string
    outlineid: string
  }) => {
    const currentDisplayMode = displayModes[outlineid]
    const slideState = slideStates[outlineid] || createInitialSlideState()
    const currentSlideId = slidesArray[outlineid]?.[currentSlideIndex]

    switch (currentDisplayMode) {
      case 'slides':
        return (
          <>
            {slideState.isLoading ? (
              <div className="w-full h-full flex flex-col gap-y-3 items-center justify-center text-center">
                <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                <p className="text-gray-600 text-sm mt-3">
                  {slideLoaderMessages[currentSlideLoaderMessageIndex]}
                </p>
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
            handleBack={() => {
              if (!slidesArray[currentOutlineID]) {
                console.log('Reached Here')

                setSlideStates((prev) => ({
                  ...prev,
                  [currentOutlineID]: {
                    ...prev[currentOutlineID],
                    isLoading: true,
                  },
                }))
                setDisplayModes((prev) => ({
                  ...prev,
                  [currentOutlineID]: 'slides',
                }))
              } else {
                setDisplayModes((prev) => ({
                  ...prev,
                  [outlineid]: 'slides',
                }))
              }
            }}
            setDisplayMode={(value: SetStateAction<DisplayMode>) => {
              const newMode =
                typeof value === 'function'
                  ? value(displayModes[outlineid] || 'slides')
                  : value
              setDisplayModes((prev) => ({
                ...prev,
                [outlineid]: newMode,
              }))
            }}
            handleQuickGenerate={async () => {
              updateSlideState(outlineid, {
                isLoading: true,
                isNoGeneratedSlide: false,
                retryCount: 0,
                lastUpdated: Date.now(),
              })
              await handleQuickGenerate()
            }}
            handleCustomBuilderClick={() => {
              const newMode =
                outlineid === outlines[0].title
                  ? 'Cover'
                  : outlineid === outlines[outlines.length - 1].title
                  ? 'Contact'
                  : 'customBuilder'
              setDisplayModes((prev) => ({
                ...prev,
                [outlineid]: newMode,
              }))
            }}
            handleSlideNarrative={() => {
              setDisplayModes((prev) => ({
                ...prev,
                [outlineid]: 'SlideNarrative',
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
            onTypeClick={(type) => handleCustomTypeClick(type, outlineid)}
            setDisplayMode={(value: React.SetStateAction<DisplayMode>) => {
              setDisplayModes((prev) => ({
                ...prev,
                [outlineid]:
                  typeof value === 'function'
                    ? value(prev[outlineid] || 'slides')
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
            handleBack={() => {
              if (!slidesArray[currentOutlineID]) {
                console.log('Reached Here')

                setSlideStates((prev) => ({
                  ...prev,
                  [currentOutlineID]: {
                    ...prev[currentOutlineID],
                    isLoading: true,
                  },
                }))
                setDisplayModes((prev) => ({
                  ...prev,
                  [currentOutlineID]: 'slides',
                }))
              } else {
                setDisplayModes((prev) => ({
                  ...prev,
                  [outlineid]: 'slides',
                }))
              }
            }}
            setDisplayMode={(mode: DisplayMode) => {
              setDisplayModes((prev) => ({
                ...prev,
                [outlineid]: mode,
              }))
            }}
            outlineID={currentOutlineID}
            setFailed={() => {
              setIsNewSlideLoading((prev) => {
                if (prev[currentOutlineID]) {
                  setNewSlideGenerated((prev) => ({
                    ...prev,
                    [currentOutlineID]: 'No',
                  }))
                  toast.error(`New Slide Not Generated`, {
                    position: 'top-right',
                    autoClose: 3000,
                  })
                  return {
                    ...prev,
                    [currentOutlineID]: false,
                  }
                }
                return prev
              })
            }}
            setIsSlideLoading={() => {
              setInitialSlides((prev) => ({
                ...prev,
                [currentOutlineID]:
                  slidesArrayRef.current[currentOutlineID]?.length ?? 0,
              }))
              setSlideStates((prev) => {
                return {
                  ...prev,
                  [currentOutlineID]: {
                    ...prev[currentOutlineID],
                    isLoading:
                      !slidesArray[currentOutlineID] ||
                      slidesArray[currentOutlineID].length === 0,
                    isNoGeneratedSlide: false,
                    lastUpdated: Date.now(),
                  },
                }
              })

              setIsNewSlideLoading((prev) => ({
                ...prev,
                [currentOutlineID]: true,
              }))
              if (slidesArray[currentOutlineID]?.length !== 0) {
                setDisplayModes((prev) => ({
                  ...prev,
                  [outlineid]: 'slides',
                }))
              }
            }}
          />
        )
    }
  }

  useEffect(() => {
    // Get stored outline IDs from sessionStorage
    const storedOutlineIDs = sessionStorage.getItem('outlineIDs')
    const outlineIDs = storedOutlineIDs ? JSON.parse(storedOutlineIDs) : []

    setSlideStates((prev) => {
      const updatedStates = { ...prev }
      for (const outline of outlines) {
        if (!updatedStates[outline.outlineID]) {
          // Initialize slide state if it doesn't exist
          updatedStates[outline.outlineID] = createInitialSlideState()
        } else if (
          outline.outlineID === currentOutlineID &&
          outlineIDs.includes(currentOutlineID) && // Only modify if currentOutlineID is in sessionStorage
          updatedStates[outline.outlineID].isLoading
        ) {
          updatedStates[outline.outlineID] = {
            ...updatedStates[outline.outlineID],
            isLoading: false, // Set loading to false only for the matching outline
          }
        }
      }
      return updatedStates
    })

    setDisplayModes((prev) => {
      const updatedModes = { ...prev }
      for (const outline of outlines) {
        if (!updatedModes[outline.outlineID]) {
          updatedModes[outline.outlineID] = 'slides'
        } else if (
          outline.outlineID === currentOutlineID &&
          outlineIDs.includes(currentOutlineID) && // Ensure we only update displayMode for valid outlines
          updatedModes[outline.outlineID] === 'slides'
        ) {
          updatedModes[outline.outlineID] = 'newContent'
        }
      }
      return updatedModes
    })
  }, [outlines, currentOutline, currentOutlineID])

  // Slide State Update Function
  const updateSlideState = useCallback(
    (outlineid: string, updates: Partial<SlideState>) => {
      setSlideStates((prev) => ({
        ...prev,
        [outlineid]: {
          ...prev[outlineid],
          ...updates,
        },
      }))
    },
    []
  )

  // Check if outlineID exists in sessionStorage
  const isOutlineIDInSessionStorage = (currentOutlineID: string): boolean => {
    const storedOutlineIDs = sessionStorage.getItem('outlineIDs')
    const outlineIDs = storedOutlineIDs ? JSON.parse(storedOutlineIDs) : []

    return outlineIDs.includes(currentOutlineID)
  }
  // Monitor State Changes to Utilize in Socket
  useEffect(() => {
    slidesArrayRef.current = slidesArray
  }, [slidesArray])
  useEffect(() => {
    slideStatesRef.current = slideStates
  }, [slideStates])
  useEffect(() => {
    newSlideLoadingRef.current = isNewSlideLoading
  }, [isNewSlideLoading])
  const newSlidesRef = useRef<any[]>([]) // Ref to store newSlides persistently
  // TODO: WEB SOCKET
  useEffect(() => {
    if (currentOutline !== '' && documentID !== null) {
      const socket = io(SOCKET_URL, { transports: ['websocket'] })
      console.info('Connecting to WebSocket server...')

      // Set initial loading state
      if (!isOutlineIDInSessionStorage(currentOutlineID)) {
        setSlideStates((prev) => {
          const currentState = prev[currentOutlineID]
          const hasExistingSlides = hasSlidesForOutline(currentOutline)

          // Don't set loading if we already have slides
          if (hasExistingSlides) {
            return {
              ...prev,
              [currentOutlineID]: {
                ...currentState,
                genSlideID: slidesArray[currentOutlineID][0],
                isLoading: false,
                isNoGeneratedSlide: false,
                lastUpdated: Date.now(),
              },
            }
          }

          // Only set loading if we need new slides
          const shouldBeLoading =
            isNewSlideLoading[currentOutlineID] ||
            (!currentState?.genSlideID && !hasExistingSlides)

          return {
            ...prev,
            [currentOutlineID]: {
              ...currentState,
              isLoading: shouldBeLoading,
              isNoGeneratedSlide: false,
              lastUpdated: Date.now(),
            },
          }
        })
      }

      if (isOutlineIDInSessionStorage(currentOutlineID)) {
        setSlideStates((prev) => {
          return {
            ...prev,
            [currentOutlineID]: {
              isLoading: false,
              isNoGeneratedSlide: false,
              genSlideID: null,
              retryCount: 0,
              lastUpdated: Date.now(),
            },
          }
        })

        setDisplayModes((prev) => ({
          ...prev,
          [currentOutlineID]: 'newContent',
        }))

        setNewVersionBackDisabled(true)
      }

      // Clear loading state and set error screen after timeout if no data received
      const timeoutId = setTimeout(() => {
        setSlideStates((prev) => ({
          ...prev,
          [currentOutlineID]: {
            ...prev[currentOutlineID],
            isLoading: false,
            isNoGeneratedSlide:
              slidesArrayRef.current[currentOutlineID]?.length === 0 ||
              !slidesArrayRef.current[currentOutlineID],
          },
        }))

        console.log('Timeout Slides')

        setIsNewSlideLoading((prev) => {
          if (prev[currentOutlineID]) {
            setNewSlideGenerated((prev) => ({
              ...prev,
              [currentOutlineID]: 'No',
            }))
            toast.error(`New Slide Not Generated`, {
              position: 'top-right',
              autoClose: 3000,
            })
            return {
              ...prev,
              [currentOutlineID]: false,
            }
          }
          return prev
        })
      }, 120000)

      const processSlides = (newSlides: any[]) => {
        newSlidesRef.current = newSlides

        if (
          newSlides.length > 0 &&
          currentOutlineID === newSlides[0].outline_id
        ) {
          const firstSlide = newSlides[0]

          if (
            firstSlide.outline_id === currentOutlineID &&
            slidesArray[currentOutlineID]?.length !== newSlides.length &&
            firstSlide.PresentationID &&
            (firstSlide.GenSlideID !== null || '')
          ) {
            if (
              newSlideLoadingRef.current[currentOutlineID] &&
              newSlides.length === 1 &&
              !slidesArrayRef.current[currentOutlineID] &&
              newSlides[0].display
            ) {
              setIsNewSlideLoading((prev) => ({
                ...prev,
                [currentOutlineID]: false,
              }))
              console.log('Socket Effect')
              setNewSlideGenerated((prev) => ({
                ...prev,
                [currentOutlineID]: 'Yes',
              }))
              toast.success(`Slide Generated`, {
                position: 'top-right',
                autoClose: 3000,
              })

              setDisplayModes((prev) => ({
                ...prev,
                [currentOutlineID]: 'slides',
              }))
            }

            // Update state with successful response
            setSlideStates((prev) => ({
              ...prev,
              [currentOutlineID]: {
                ...prev[currentOutlineID],
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
                [currentOutlineID]: ids,
              }
            })

            setTotalSlides(ids.length)
            // Update finalizedSlides state
            const selectedSlide = newSlides.find((slide: any) => slide.selected)
            if (selectedSlide) {
              setFinalizedSlides((prev) => ({
                ...prev,
                [currentOutlineID]: selectedSlide.GenSlideID,
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
                [currentOutlineID]: 'newContent',
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

      // Retrieve the array of new outlineIDs from sessionStorage
      const storedOutlineIDs = sessionStorage.getItem('outlineIDs')
      const newOutlineIDs = storedOutlineIDs ? JSON.parse(storedOutlineIDs) : []

      // Find the first outline in fetchedOutlines that matches an ID in newOutlineIDs
      const newOutlineIndex = fetchedOutlines.findIndex((outline: any) =>
        newOutlineIDs.includes(outline.outlineID)
      )

      if (newOutlineIndex > -1) {
        // Find the outline just before the new outline
        const targetOutlineIndex = newOutlineIndex > 0 ? newOutlineIndex - 1 : 0
        const targetOutline = fetchedOutlines[targetOutlineIndex]

        setCurrentOutline(targetOutline.title)
        setCurrentOutlineID(targetOutline.outlineID)

        // Immediately set state for the new outline
        const newOutline = fetchedOutlines[newOutlineIndex]
        setSlideStates((prev) => ({
          ...prev,
          [newOutline.outlineID]: {
            ...prev[newOutline.outlineID],
            isLoading: false,
            isNoGeneratedSlide: false,
            genSlideID: null,
            retryCount: 0,
            lastUpdated: Date.now(),
          },
        }))
        setDisplayModes((prev) => ({
          ...prev,
          [newOutline.outlineID]: 'newContent',
        }))
      } else {
        setCurrentOutline(fetchedOutlines[0].title)
        setCurrentOutlineID(fetchedOutlines[0].outlineID)
      }
      setDisplayBoxLoading(false)
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

  // Effect to set slides to first slide in outline change
  useEffect(() => {
    setCurrentSlideIndex(0)
    setPrevSlideIndex(0)
  }, [currentOutlineID])

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
        slidesArray[currentOutlineID] &&
        slidesArray[currentOutlineID].length >= 1
      ) {
        setDisplayModes((prev) => ({
          ...prev,
          [currentOutlineID]: prev[currentOutlineID], // Preserve the previous state
        }))
      }
    }

    if (totalSlides !== 0) {
      setNewVersionBackDisabled(false)
    }

    console.log('Initial Slides State: ', initialSlides[currentOutlineID])

    if (
      initialSlides[currentOutlineID] &&
      initialSlides[currentOutlineID] !== totalSlides
    ) {
      setIsNewSlideLoading((prev) => {
        if (prev[currentOutlineID]) {
          console.log('Pagination Effect')

          setNewSlideGenerated((prev) => ({
            ...prev,
            [currentOutlineID]: 'Yes',
          }))
          toast.success(`Slide Generated`, {
            position: 'top-right',
            autoClose: 3000,
          })
          setDisplayModes((prev) => ({
            ...prev,
            [currentOutlineID]: 'slides', // Preserve the previous state
          }))
          return {
            ...prev,
            [currentOutlineID]: false,
          }
        }
        return prev
      })
    }
    console.log('Initial Slides', initialSlides[currentOutlineID])
    console.log('Current Slides', totalSlides)

    setPrevTotalSlides(totalSlides)
  }, [totalSlides, prevTotalSlides])

  // Effect to Set Slide Type For Quick Generate
  useEffect(() => {
    const matchingOutline = outlines.find(
      (outline) => outline.outlineID === currentOutlineID
    )
    // Update the outlineType state with the type of the matched object
    setOutlineType(matchingOutline?.type || '')
  }, [outlines, currentOutlineID])

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
            setMonthlyPlan(response.data.items[4])
            setYearlyPlan(response.data.items[2])
            // setMonthlyPlan(response.data.items[1])
            // setYearlyPlan(response.data.items[0])
            setCurrency('USD')
          } else if (
            country === 'IN' ||
            country === 'India' ||
            country === 'In'
          ) {
            setMonthlyPlan(response.data.items[5])
            setYearlyPlan(response.data.items[3])
            // setMonthlyPlan(response.data.items[1])
            // setYearlyPlan(response.data.items[0])
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

  const deleteFinalizeDisabled =
    isDocumentIDLoading || !slidesArray[currentOutlineID]
  const buttonsDisabled = isDocumentIDLoading

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
        openPricingModal={openPricingModal}
        exportPaid={isExportPaid}
        buttonsDisabled={buttonsDisabled}
      />

      {/*MEDIUM LARGE SCREEN: MAIN CONTAINER*/}
      <div className="hidden lg:flex lg:flex-row lg:w-full lg:pt-16 ">
        {/*MEDIUM LARGE SCREEN: SIDEBAR*/}
        <Sidebar
          isNewSlideLoading={isNewSlideLoading}
          newSlideGenerated={newSlideGenerated}
          onOutlineSelect={handleOutlineSelect}
          selectedOutline={currentOutline!}
          selectedOutlineID={currentOutlineID!}
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
            {displayBoxLoading && (
              <div className="w-full h-full flex flex-col gap-y-3 items-center justify-center text-center">
                <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                <p className="text-gray-600 text-sm mt-3">
                  {initialLoaderMessages[currentMessageIndex]}
                </p>
              </div>
            )}
            {outlines.map((outline, index) => (
              <div
                key={outline.outlineID}
                ref={(el) => (slideRefs.current[index] = el!)}
                className="snap-center scroll-smooth w-full h-full mb-4"
              >
                {renderContent({
                  GenSlideID:
                    slidesArray[outline.outlineID]?.[currentSlideIndex],
                  displayMode: displayModes[outline.outlineID],
                  isMobile: false,
                  index,
                  outlineid: outline.outlineID,
                })}
              </div>
            ))}
          </div>

          {/* MEDIUM LARGE SCREEN: ACTION BUTTONS */}
          <div className="flex items-center justify-between ml-12">
            <DesktopButtonSection
              userPlan={userPlan}
              onDelete={handleDelete}
              onFinalize={handleFinalize}
              onNewVersion={() => handlePlusClick(currentOutlineID)}
              finalized={
                finalizedSlides[currentOutlineID] ===
                slidesArray[currentOutlineID]?.[currentSlideIndex]
              }
              currentSlideId={
                slidesArray[currentOutlineID]?.[currentSlideIndex]
              }
              deleteFinalizeDisabled={deleteFinalizeDisabled}
              newVersionDisabled={buttonsDisabled}
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
                {slidesArray[currentOutlineID]?.length > 0
                  ? currentSlideIndex + 1
                  : '0'}{' '}
                of {slidesArray[currentOutlineID]?.length || 0}
              </span>
              <button
                onClick={handlePaginateNext}
                disabled={
                  currentSlideIndex ===
                  (slidesArray[currentOutlineID]?.length ?? 0) - 1
                }
                className={`flex items-center border hover:cursor-pointer border-[#E1E3E5] bg-white p-2 rounded-md active:scale-95 transition transform duration-300 ${
                  currentSlideIndex ===
                  (slidesArray[currentOutlineID]?.length ?? 0) - 1
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
          openPricingModal={openPricingModal}
          exportPaid={isExportPaid}
          buttonsDisabled={buttonsDisabled}
        />

        {/* MOBILE: OUTLINE Modal */}
        <div className="space-y-4 mt-4 mb-4">
          <div className="block lg:hidden">
            {outlines && outlines.length > 0 && (
              <MobileOutlineModal
                isNewSlideLoading={isNewSlideLoading}
                selectedOutlineID={currentOutlineID!}
                newSlideGenerated={newSlideGenerated}
                documentID={documentID!}
                outlines={outlines}
                onSelectOutline={handleOutlineSelect}
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
            displayModes[currentOutlineID] !== 'slides'
              ? 'h-[50vh] md:h-[50vh]'
              : 'h-[50.5vh]' // keep the height the same when 'slides' mode
          } w-full border border-gray-200 mb-2`}
        >
          {displayBoxLoading && (
            <div className="w-full h-full flex flex-col gap-y-3 items-center justify-center text-center">
              <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
              <p className="text-gray-600 text-sm mt-3">
                {initialLoaderMessages[currentMessageIndex]}
              </p>
            </div>
          )}
          {renderContent({
            GenSlideID: slidesArray[currentOutlineID]
              ? slidesArray[currentOutlineID][currentSlideIndex]
              : '',
            displayMode: displayModes[currentOutlineID],
            isMobile: true,
            outlineid: currentOutlineID,
          })}
        </div>

        {/* MOBILE: ACTION BUTTONS */}
        <div className={`relative flex items-center justify-between w-full`}>
          {displayModes[currentOutlineID] === 'slides' ? (
            <MobileButtonSection
              onDelete={handleDelete}
              onFinalize={handleFinalize}
              onNewVersion={() => handlePlusClick(currentOutlineID)}
              deleteFinalizeDisabled={deleteFinalizeDisabled}
              newVersionDisabled={buttonsDisabled}
              finalized={
                finalizedSlides[currentOutlineID] ===
                slidesArray[currentOutlineID]?.[currentSlideIndex]
              }
              currentSlideId={slidesId[currentSlideIndex]}
              displayMode={displayModes[currentOutlineID]}
            />
          ) : (
            <button
              onClick={() => onBack(currentOutlineID)}
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
              {slidesArray[currentOutlineID]?.length > 0
                ? currentSlideIndex + 1
                : '0'}{' '}
              of {slidesArray[currentOutlineID]?.length || 0}
            </span>
            <button
              onClick={handlePaginateNext}
              disabled={
                currentSlideIndex === slidesArray[currentOutlineID]?.length - 1
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
