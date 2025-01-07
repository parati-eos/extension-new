import GuidedTour from "../onboarding/shared/GuidedTour"

const createInitialSlideState = (): SlideState => ({
  isLoading: true,
  isNoGeneratedSlide: false,
  genSlideID: null,
  retryCount: 0,
  lastUpdated: Date.now(),
})

const useSlideStateManager = () => {
  const [slideStates, setSlideStates] = useState<SlideStates>({})

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

  const initializeSlideStates = useCallback((outlines: Outline[]) => {
    const initialStates = outlines.reduce((acc, outline) => {
      acc[outline.title] = createInitialSlideState()
      return acc
    }, {} as SlideStates)
    setSlideStates(initialStates)
  }, [])

  return { slideStates, updateSlideState, initializeSlideStates }
}

export default function ViewPresentation() {
  const [searchParams] = useSearchParams()
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL
  const authToken = sessionStorage.getItem('authToken')
  const orgId = sessionStorage.getItem('orgId')
  const userPlan = useSelector((state: any) => state.user.userPlan)
  // const userPlan = sessionStorage.getItem('userPlan')
  const [documentID, setDocumentID] = useState<string | null>(null)
  const [pptName, setPptName] = useState<string | null>(null)
  const [presentationID, setPresentationID] = useState<string>('')
  const [isDocumentIDLoading, setIsDocumentIDLoading] = useState(true)
  const [isSlideLoading, setIsSlideLoading] = useState(true)
  const [isNoGeneratedSlide, setIsNoGeneratedSlide] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(1)
  const [currentOutline, setCurrentOutline] = useState('')
  const [currentOutlineID, setCurrentOutlineID] = useState('')
  const [outlineType, setOutlineType] = useState('')
  const [outlines, setOutlines] = useState<Outline[]>([])
  const [displayMode, setDisplayMode] = useState<DisplayMode>('slides')
  const [displayModes, setDisplayModes] = useState<{
    [key: string]: DisplayMode
  }>({})
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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [prevTotalSlides, setPrevTotalSlides] = useState(totalSlides)
  const [prevSlideIndex, setPrevSlideIndex] = useState(currentSlideIndex)
  const featureDisabled = userPlan === 'free' ? true : false
  const [slidesArray, setSlidesArray] = useState<{ [key: string]: string }>({})

  const { slideStates, updateSlideState, initializeSlideStates } =
    useSlideStateManager()

  // Handle Add New Slide Version Button
  const handlePlusClick = (outlineTitle: string) => {
    updateSlideState(outlineTitle, {
      isLoading: false,
    })
    setDisplayModes((prev) => ({
      ...prev,
      [outlineTitle]: prev[outlineTitle] === 'slides' ? 'newContent' : 'slides',
    }))
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
    setDisplayMode('slides')
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
      setDisplayMode('slides')
    }
  }, 100)

  // Quick Generate Slide
  const handleQuickGenerate = async (outlineTitle: string) => {
    updateSlideState(outlineTitle, {
      isLoading: true,
      isNoGeneratedSlide: false,
      retryCount: 0,
      lastUpdated: Date.now(),
    })

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/generate-document/${orgId}`,
        {
          type: outlineType,
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

      toast.success('Quick Generation Started')
      setDisplayMode('slides')
    } catch (error) {
      updateSlideState(outlineTitle, {
        isLoading: false,
        error: 'Failed to generate slide',
      })
      toast.error('Error while generating slide', {
        position: 'top-right',
        autoClose: 2000,
      })
    }
  }

  // Paginate Back
  const handlePaginatePrev = () => {
    if (currentSlideIndex > 0) {
      const prevOutline = outlines[currentSlideIndex - 1].title
      updateSlideState(prevOutline, {
        isLoading: true,
        lastUpdated: Date.now(),
      })
      setCurrentSlideIndex((prevIndex) => prevIndex - 1)

      // Auto-reset loading state after timeout
      setTimeout(() => {
        updateSlideState(prevOutline, {
          isLoading: false,
        })
      }, 3000)
    }
  }

  // Paginate Next
  const handlePaginateNext = () => {
    if (currentSlideIndex < slidesId.length - 1) {
      const nextOutline = outlines[currentSlideIndex + 1].title
      updateSlideState(nextOutline, {
        isLoading: true,
        lastUpdated: Date.now(),
      })
      setCurrentSlideIndex((prevIndex) => prevIndex + 1)

      // Auto-reset loading state after timeout
      setTimeout(() => {
        updateSlideState(nextOutline, {
          isLoading: false,
        })
      }, 3000)
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

      if (currentMode === 'SlideNarrative') {
        newMode = 'newContent'
      } else if (currentMode === 'customBuilder') {
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

  // Render Slide Content
  const renderContent = ({
    displayMode,
    isMobile,
    index,
    GenSlideID,
    outlineTitle,
  }: {
    displayMode: string
    isMobile: boolean
    index?: number
    GenSlideID: string
    outlineTitle: string
  }) => {
    const currentDisplayMode = displayModes[outlineTitle] || 'slides'
    const slideState = slideStates[outlineTitle] || {
      isLoading: true,
      isNoGeneratedSlide: false,
      genSlideID: null,
      retryCount: 0,
      lastUpdated: Date.now(),
    }
    console.log(slideState)

    // Helper function to determine if we should show loading state
    const shouldShowLoading = () => {
      return (
        slideState.isLoading &&
        !slideState.isNoGeneratedSlide &&
        !slideState.genSlideID &&
        Date.now() - slideState.lastUpdated < 90000 // 90 second timeout
      )
    }

    // Helper function to determine if we should show error state
    const shouldShowError = () => {
      return (
        slideState.isNoGeneratedSlide ||
        (slideState.isLoading && Date.now() - slideState.lastUpdated >= 90000)
      )
    }

    switch (currentDisplayMode) {
      case 'slides':
        return (
          <>
            {shouldShowLoading() && (
              <div className="w-full h-full flex flex-col gap-y-3 items-center justify-center">
                <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                <h1>Generating Slide Please Wait...</h1>
                {slideState.retryCount > 0 && (
                  <p className="text-sm text-gray-500">
                    Retry attempt {slideState.retryCount}/3...
                  </p>
                )}
              </div>
            )}
            {!shouldShowLoading() &&
              !shouldShowError() &&
              slideState.genSlideID && (
                <iframe
                  src={`https://docs.google.com/presentation/d/${presentationID}/embed?rm=minimal&start=false&loop=false&slide=id.${slideState.genSlideID}`}
                  title={`Slide ${index ? index + 1 : currentSlideIndex + 1}`}
                  className={`w-full h-full pointer-events-none transition-opacity duration-500 ${
                    slideState.isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{ border: 0 }}
                  onLoad={() => {
                    // Update slide state when iframe loads successfully
                    updateSlideState(outlineTitle, {
                      isLoading: false,
                      isNoGeneratedSlide: false,
                    })
                  }}
                  onError={() => {
                    // Handle iframe load errors
                    if (slideState.retryCount < 3) {
                      updateSlideState(outlineTitle, {
                        retryCount: slideState.retryCount + 1,
                        lastUpdated: Date.now(),
                      })
                    } else {
                      updateSlideState(outlineTitle, {
                        isNoGeneratedSlide: true,
                        isLoading: false,
                      })
                    }
                  }}
                />
              )}
            {shouldShowError() && (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <h1 className="text-red-500">
                  Sorry! Slide Could Not Be Generated
                </h1>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => {
                    // Reset state and trigger regeneration
                    updateSlideState(outlineTitle, {
                      isLoading: true,
                      isNoGeneratedSlide: false,
                      retryCount: 0,
                      lastUpdated: Date.now(),
                    })
                    handleQuickGenerate(outlineTitle)
                  }}
                >
                  Retry Generation
                </button>
              </div>
            )}
          </>
        )

      case 'newContent':
        const NewSlideVersion = isMobile
          ? MobileNewSlideVersion
          : DesktopNewSlideVersion
        return (
          <NewSlideVersion
            isLoading={slideState.isLoading}
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
              await handleQuickGenerate(outlineTitle)
            }}
            handleCustomBuilderClick={() => {
              if (featureDisabled) {
                toast.info('Upgrade to pro to access this feature')
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
              updateSlideState(outlineTitle, {
                isLoading: true,
                lastUpdated: Date.now(),
              })
              setDisplayModes((prev) => ({
                ...prev,
                [outlineTitle]: 'slides',
              }))
            }}
          />
        )
    }
  }

  useEffect(() => {
    if (outlines.length > 0) {
      outlines.forEach((outline) => {
        updateSlideState(outline.title, {
          isLoading: true,
          isNoGeneratedSlide: false,
          genSlideID: null,
          retryCount: 0,
          lastUpdated: Date.now(),
        })
      })
    }
  }, [outlines, updateSlideState])

  useEffect(() => {
    const initialModes = outlines.reduce((acc, outline) => {
      acc[outline.title] = 'slides'
      return acc
    }, {} as { [key: string]: DisplayMode })

    setDisplayModes(initialModes)
  }, [outlines])

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
        // Only update documentID if it hasn't been set yet
        setPptName(result.documentName)
        setDocumentID((prev) => prev || result.documentID)
        console.log('Document ID Set From API', result.documentID)
        setIsDocumentIDLoading(false)
      } catch (error) {
        console.error('Error fetching document:', error)
        setIsDocumentIDLoading(false)
      }
    }

    const documentIDFromUrl = searchParams.get('documentID')
    const pptNameFromUrl = searchParams.get('presentationName')

    if (documentIDFromUrl && documentIDFromUrl !== 'loading') {
      // If documentID comes from URL and is valid, set it only if it hasn't been set
      setDocumentID((prev) => prev || documentIDFromUrl)
      setPptName(pptNameFromUrl)
      console.log('')

      // Fetch the pptName if needed
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
    } else {
      // Trigger the API call only if documentID is not present or is 'loading'
      const timer = setTimeout(() => {
        getDocumentId()
      }, 23000) // delay

      // Cleanup the timer in case the component unmounts
      return () => clearTimeout(timer)
    }
  }, [searchParams, authToken, orgId])

  // TODO: WEB SOCKET
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const newSlidesRef = useRef<any[]>([]) // Ref to store newSlides persistently
  const newSlidesJSON = JSON.stringify(newSlidesRef.current)

  useEffect(() => {
    if (
      currentOutline !== '' &&
      documentID !== null &&
      !slidesArray[currentOutline]
    ) {
      const socket = io(SOCKET_URL, { transports: ['websocket'] })

      const processSlides = (newSlides: any[]) => {
        const sectionName = currentOutline.replace(/^\d+\.\s*/, '')

        if (newSlides.length > 0 && newSlides[0].SectionName === sectionName) {
          const firstSlide = newSlides[0]

          updateSlideState(currentOutline, {
            isLoading: false,
            isNoGeneratedSlide: false,
            genSlideID: firstSlide.GenSlideID,
            retryCount: 0,
            lastUpdated: Date.now(),
          })

          if (!presentationID) {
            setPresentationID(firstSlide.PresentationID)
          }

          setSlidesId(newSlides.map((slide) => slide.GenSlideID))
          setSlidesArray((prev) => ({
            ...prev,
            [firstSlide.SectionName]: firstSlide.GenSlideID,
          }))
          setTotalSlides(newSlides.length)
        }
      }

      socket.on('slidesData', processSlides)

      socket.emit('fetchSlides', {
        slideType: currentOutline.replace(/^\d+\.\s*/, ''),
        formID: documentID,
      })

      return () => {
        socket.off('slidesData', processSlides)
        socket.disconnect()
      }
    }
  }, [currentOutline, documentID, updateSlideState])

  useEffect(() => {
    if (outlines.length > 0) {
      initializeSlideStates(outlines)
    }
  }, [outlines, initializeSlideStates])

  // Effect to monitor changes
  useEffect(() => {
    if (totalSlides !== prevTotalSlides && currentOutline) {
      updateSlideState(currentOutline, {
        isLoading: false,
      })
      setPrevTotalSlides(totalSlides)
    }
  }, [totalSlides, prevTotalSlides, currentOutline, updateSlideState])

  // Effect to set loader for pagination changes
  useEffect(() => {
    if (currentSlideIndex !== prevSlideIndex) {
      const currentOutline = outlines[currentSlideIndex]?.title
      if (currentOutline) {
        updateSlideState(currentOutline, {
          isLoading: true,
          lastUpdated: Date.now(),
        })
      }
      setPrevSlideIndex(currentSlideIndex)
    }

    setTimeout(() => {
      if (currentOutline) {
        updateSlideState(currentOutline, {
          isLoading: false,
          lastUpdated: Date.now(),
        })
      }
    }, 6000)
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
      console.log('Fetched Outlines:', fetchedOutlines)

      setOutlines(fetchedOutlines)
      if (fetchedOutlines.length > 0) {
        setCurrentOutline(fetchedOutlines[0].title)
        setCurrentOutlineID(fetchedOutlines[0].outlineID)
      }
    } catch (error) {
      console.error('Error fetching outlines:', error)
    }
  }, [documentID, authToken])
  useEffect(() => {
    fetchOutlines()
  }, [fetchOutlines, documentID])

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
            setMonthlyPlan(response.data.items[5])
            setYearlyPlan(response.data.items[3])
            setCurrency('INR')
          } else {
            setMonthlyPlan(response.data.items[4])
            setYearlyPlan(response.data.items[2])
            setCurrency('USD')
          }
        })
    }

    const timer = setTimeout(() => {
      getPricingData()
    }, 3000) // delay

    // Cleanup the timer in case the component unmounts
    return () => clearTimeout(timer)
  }, [authToken])
  const monthlyPlanAmount = monthlyPlan?.item.amount! / 100
  const monthlyPlanId = monthlyPlan?.id
  const yearlyPlanAmount = yearlyPlan?.item.amount! / 100
  const yearlyPlanId = yearlyPlan?.id

  return (
    <div className="flex flex-col lg:flex-row bg-[#F5F7FA] h-full md:h-[100vh] no-scrollbar no-scrollbar::-webkit-scrollbar">
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
      />
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
      <div className="hidden lg:flex lg:flex-row lg:w-full lg:pt-16 ">
        {/*MEDIUM LARGE SCREEN: SIDEBAR*/}
        <Sidebar
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
            {slideStates[currentOutline]?.isLoading &&
              !slideStates[currentOutline]?.isNoGeneratedSlide && (
                <div className="w-full h-full flex flex-col gap-y-3 items-center justify-center">
                  <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                  <h1>Generating Slide Please Wait...</h1>
                  {slideStates[currentOutline]?.retryCount > 0 && (
                    <p className="text-sm text-gray-500">
                      Retry attempt {slideStates[currentOutline].retryCount}
                      /3...
                    </p>
                  )}
                </div>
              )}
            {outlines.map((outline, index) => (
              <div
                key={outline.title}
                ref={(el) => (slideRefs.current[index] = el!)}
                className="snap-center scroll-smooth w-full h-full mb-4"
              >
                {renderContent({
                  GenSlideID: slidesArray[outline.title],
                  displayMode,
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
              finalized={finalized}
              currentSlideId={slidesId[currentSlideIndex]}
            />

            {/* MEDIUM LARGE SCREEN: PAGINATION BUTTONS */}
            <div 
        
            className="flex items-center gap-2 mr-14">
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
                  setCurrentOutlineID(
                    outlines.find((o) => o.title === outline)?.outlineID!
                  )
                  const slideIndex = outlines.findIndex(
                    (o) => o.title === outline
                  )
                  setCurrentSlide(slideIndex)
                  setCurrentSlideIndex(0)
                  setDisplayMode('slides')
                }}
                selectedOutline={currentOutline}
                fetchOutlines={fetchOutlines}
                isLoading={isDocumentIDLoading}
                isDisabled={featureDisabled}
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
          {renderContent({
            GenSlideID: slidesArray[currentOutline],
            displayMode,
            isMobile: true,
            outlineTitle: currentOutline,
          })}
        </div>

        {/* MOBILE: ACTION BUTTONS */}
        <div className={`relative flex items-center justify-between w-full`}>
          {displayMode === 'slides' ? (
            <MobileButtonSection
              onDelete={handleDelete}
              onFinalize={handleFinalize}
              onNewVersion={() => handlePlusClick(currentOutline)}
              finalized={finalized}
              currentSlideId={slidesId[currentSlideIndex]}
              displayMode={displayMode}
            />
          ) : (
            <button
              onClick={() => onBack(currentOutline)}
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
