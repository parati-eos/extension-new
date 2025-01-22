import React, { useState, useEffect, useRef } from 'react'

interface SlideItem {
  FormID: string
  PresentationURL: string
  pptName: string
  ppt_type: string
  currentTime: string
  paymentStatus: number
}

const HistoryThumbnail = ({
  item,
  onEdit,
  isVisible,
}: {
  item: SlideItem
  onEdit: (formId: string, pptName: string) => void
  isVisible: boolean
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const getSheetIdFromUrl = (url: string) => {
    const matches = url.match(/[-\w]{25,}/)
    return matches ? matches[0] : ''
  }

  useEffect(() => {
    if (isVisible && !isLoaded) {
      const iframe = iframeRef.current
      if (iframe) {
        iframe.onload = () => setIsLoaded(true)
        iframe.src = `https://docs.google.com/presentation/d/${getSheetIdFromUrl(
          item.PresentationURL
        )}/embed?rm=minimal&slide=id.p&start=false`
      }
    }
  }, [isVisible, item.PresentationURL, isLoaded])

  return (
    <div className="relative w-[12rem] h-[7rem] overflow-hidden">
      <div
        onClick={() => onEdit(item.FormID, item.pptName)}
        className="absolute top-0 left-0 w-full h-full z-10 cursor-pointer"
      />
      {!isLoaded && isVisible && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="animate-pulse text-sm text-gray-500">Loading...</div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        title={item.pptName}
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ border: 'none', pointerEvents: 'none' }}
      />
    </div>
  )
}

export default HistoryThumbnail
