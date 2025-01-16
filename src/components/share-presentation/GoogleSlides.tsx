import React, { useState, useEffect, useRef } from 'react'
import { Grid } from 'react-loader-spinner'
import ShareSidebar from './ShareSidebar'
import ShareOutlineModal from './ShareOutlineModal'
import '../presentation-view/viewpresentation.css'

interface GoogleSlidesProps {
  formId: string
}

const GoogleSlides = ({ formId }: GoogleSlidesProps) => {
  const [slidesData, setSlidesData] = useState<
    { title: string; genSlideIDs: string[] }[]
  >([])
  const [presentationID, setPresentationID] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [currentOutline, setCurrentOutline] = useState('')
  const slideRefs = useRef<HTMLDivElement[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const authToken = sessionStorage.getItem('authToken')

  // MEDIUM LARGE SCREENS: Sidebar Outline Select
  const handleOutlineSelect = (title: string) => {
    setCurrentOutline(title)
    const slideIndex = slidesData.findIndex((o) => o.title === title)
    slideRefs.current[slideIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
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
      slidesData[closestIndex]?.title !== currentOutline
    ) {
      setCurrentOutline(slidesData[closestIndex]?.title)
    }
  }, 100)

  useEffect(() => {
    const fetchSlidesData = async () => {
      try {
        const serverurl = process.env.REACT_APP_BACKEND_URL
        const url = `${serverurl}/api/v1/data/slidedisplay/genSlideIDs/${formId}`
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch slides data')
        }
        const data = await response.json()
        setPresentationID(data.presentationID)
        setSlidesData(data.outlineData)
        setCurrentOutline(data.outlineData[0].title)
        setLoading(false)
      } catch (error: any) {
        console.error('Error fetching slides data:', error.message)
      }
    }
    fetchSlidesData()
  }, [formId, authToken])

  if (loading) {
    return (
      <div className="relative top-[30vh] left-[56vh]">
        <Grid
          visible={true}
          height="120"
          width="120"
          color="#3667B2"
          ariaLabel="grid-loading"
          radius="12.5"
        />
      </div>
    )
  }

  return (
    <div className="bg-slate-100 h-full no-scrollbar no-scrollbar::-webkit-scrollbar">
      {slidesData.length < 1 ? (
        <div className="text-center text-xl font-bold text-aliceblue">
          No slides to display. Please finalize some slides in the application
          to be displayed here.
        </div>
      ) : (
        <>
          <div className="hidden lg:flex lg:flex-row lg:w-full lg:h-full lg:pt-6">
            <ShareSidebar
              onOutlineSelect={handleOutlineSelect}
              selectedOutline={currentOutline}
              outlines={slidesData.map((slide) => slide.title)}
            />

            <div
              className="no-scrollbar rounded-sm shadow-lg relative w-[90%] bg-white border border-gray-200 mb-2 ml-12 overflow-y-scroll snap-y scroll-smooth snap-mandatory"
              style={{ height: 'calc(100vh - 200px)' }}
              onScroll={handleScroll}
              ref={scrollContainerRef}
            >
              {slidesData.map((outline, index) => (
                <div
                  key={outline.title}
                  ref={(el) => (slideRefs.current[index] = el!)}
                  className="snap-center scroll-smooth w-full h-full mb-4"
                >
                  <iframe
                    key={outline.title}
                    className="w-full h-full bg-black border-[1px] border-[#3667B2] rounded-lg mb-2 pointer-events-none"
                    title={`Google slide - ${outline.title}`}
                    src={`https://docs.google.com/presentation/d/${presentationID}/embed?rm=minimal&start=false&loop=false&slide=id.${outline.genSlideIDs[0]}`}
                  ></iframe>
                </div>
              ))}
            </div>
          </div>
          <div className="block lg:hidden px-4 py-10">
            <ShareOutlineModal
              onOutlineSelect={handleOutlineSelect}
              selectedOutline={currentOutline}
              isLoading={loading}
              outlines={slidesData.map((slide) => slide.title)}
            />
            <div
              className={`relative bg-white h-[50.5vh] w-full border border-gray-200 mb-2`}
            >
              {slidesData.map((outline, index) => (
                <div
                  key={outline.title}
                  ref={(el) => (slideRefs.current[index] = el!)}
                  className="snap-center scroll-smooth w-full h-full mb-4"
                >
                  <iframe
                    key={outline.title}
                    className="w-full h-full bg-black border-[1px] border-[#3667B2] rounded-lg mb-2 pointer-events-none"
                    title={`Google slide - ${outline.title}`}
                    src={`https://docs.google.com/presentation/d/${presentationID}/embed?rm=minimal&start=false&loop=false&slide=id.${outline.genSlideIDs[0]}`}
                  ></iframe>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default GoogleSlides
