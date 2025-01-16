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
  const [currentOutline, setCurrentOutline] = useState<string>('')
  const slideRefs = useRef<HTMLDivElement[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const authToken = sessionStorage.getItem('authToken')

  // MEDIUM LARGE SCREENS: Sidebar Outline Select
  const handleOutlineSelect = (title: string) => {
    const slideIndex = slidesData.findIndex((o) => o.title === title)
    if (slideIndex !== -1) {
      slideRefs.current[slideIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
      setCurrentOutline(title)
    }
  }

  // Handle scroll events to update the sidebar selection
  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const scrollTop = scrollContainerRef.current.scrollTop || 0
    let closestIndex = -1
    let minDistance = Number.MAX_VALUE

    slideRefs.current.forEach((slideRef, index) => {
      if (!slideRef) return
      const distance = Math.abs(slideRef.offsetTop - scrollTop)
      if (distance < minDistance) {
        closestIndex = index
        minDistance = distance
      }
    })

    if (
      closestIndex !== -1 &&
      slidesData[closestIndex]?.title !== currentOutline
    ) {
      setCurrentOutline(slidesData[closestIndex].title)
    }
  }

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
        setCurrentOutline(data.outlineData[0]?.title || '')
        setLoading(false)
      } catch (error: any) {
        console.error('Error fetching slides data:', error.message)
      }
    }
    fetchSlidesData()
  }, [formId, authToken])

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-[13rem]">
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
    <div className="bg-slate-100 py-2 h-full no-scrollbar no-scrollbar::-webkit-scrollbar">
      {slidesData.length < 1 ? (
        <div className="text-center text-xl font-bold text-aliceblue">
          No slides to display. Please finalize some slides in the application
          to be displayed here.
        </div>
      ) : (
        <div className="flex flex-row w-full h-full">
          <ShareSidebar
            onOutlineSelect={handleOutlineSelect}
            selectedOutline={currentOutline}
            outlines={slidesData.map((slide) => slide.title)}
          />
          <div
            className="no-scrollbar rounded-lg shadow-lg relative w-[85%] ml-[1.85rem] lg:ml-2 lg:mr-4 bg-white border border-gray-200 overflow-y-scroll snap-y scroll-smooth snap-mandatory"
            style={{ height: 'calc(100vh - 100px)' }}
            onScroll={handleScroll}
            ref={scrollContainerRef}
          >
            {slidesData.map((outline, index) => (
              <div
                key={outline.title}
                ref={(el) => (slideRefs.current[index] = el!)}
                className="snap-start w-full h-[50vh] lg:h-full mb-4"
              >
                <iframe
                  className="w-full h-full bg-black border-[1px] border-[#3667B2] rounded-lg mb-2 pointer-events-none"
                  title={`Google slide - ${outline.title}`}
                  src={`https://docs.google.com/presentation/d/${presentationID}/embed?rm=minimal&start=false&loop=false&slide=id.${outline.genSlideIDs[0]}`}
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GoogleSlides
