import React, { useState, useEffect } from 'react'

// Define types for slide content and page elements
interface SlideContent {
  pageElements: PageElement[]
}

interface PageElement {
  image?: ImageElement
  textBox?: TextBoxElement
}

interface ImageElement {
  contentUrl: string
  width: number
  height: number
}

interface TextBoxElement {
  text: {
    content: string
  }
}

interface SlideProps {
  presentationId: string
  slideId: string
}

const SlideComponent: React.FC<SlideProps> = ({ presentationId, slideId }) => {
  const [slideContent, setSlideContent] = useState<SlideContent | null>(null)

  useEffect(() => {
    const fetchSlide = async () => {
      try {
        const response = await fetch(
          `https://slides.googleapis.com/v1/presentations/${presentationId}/pages/${slideId}`,
          {
            headers: {
              Authorization: `Bearer YOUR_ACCESS_TOKEN`,
            },
          }
        )
        const data: SlideContent = await response.json()
        setSlideContent(data)
      } catch (error) {
        console.error('Error fetching slide content:', error)
      }
    }

    fetchSlide()
  }, [presentationId, slideId])

  return (
    <div>
      {slideContent?.pageElements.map((element, index) => {
        if (element.image) {
          return (
            <img
              key={index}
              src={element.image.contentUrl}
              alt="Slide Element"
              style={{
                width: element.image.width,
                height: element.image.height,
              }}
            />
          )
        } else if (element.textBox) {
          return <p key={index}>{element.textBox.text.content}</p>
        }
        return null
      })}
    </div>
  )
}

export default SlideComponent

// {
//   /*
//     Dynamic Content Loading: Instead of reloading the iframe, dynamically update its content using postMessage or by directly manipulating its DOM (if allowed by cross-origin policies).
// Example:
// javascript
// const iframe = document.getElementById('slide-iframe');
// iframe.contentWindow.postMessage({ slideData: newSlide }, '*');
// Reduce iframe Reloading:
// If the iframe must reload, ensure only the relevant parts of the content are updated (e.g., by passing parameters to the iframe's URL or using AJAX inside the iframe).
// Ensure Efficient Rendering in the iframe:
// Optimize the page loaded in the iframe for faster rendering (e.g., minimize scripts, lazy-load assets).
// Leverage iframe Communication:
// Use the postMessage API for efficient communication between the parent page and iframe.
// Parent sends data: javascript
// const iframe = document.getElementById('slide-iframe');
// iframe.contentWindow.postMessage({ type: 'updateSlide', slideData: newSlide }, '*');
// iframe listens: javascript
// window.addEventListener('message', (event) => {
//     if (event.data.type === 'updateSlide') {
//         updateSlide(event.data.slideData); // Custom function to handle slide update
//     }
// });
//     */
// }
