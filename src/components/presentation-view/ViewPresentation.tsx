import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaDownload,
  FaPlus,
  FaShare,
  FaTrash,
} from 'react-icons/fa'
import * as React from 'react'
import Sidebar from './Sidebar'
import CustomBuilderIcon from '../../assets/custom-builder.png'
import SlideNarrativeIcon from '../../assets/slide-narrative.png'
import QuickGenerateIcon from '../../assets/quick-generate.png'
import './viewpresentation.css'

export default function ViewPresentation() {
  const [currentSlide, setCurrentSlide] = React.useState(1)
  const [selectedImage, setSelectedImage] = React.useState('/placeholder.svg')
  const [selectedOutline, setSelectedOutline] = React.useState('cover')
  const [currentOutline, setCurrentOutline] = React.useState('cover')
  const totalSlides = 5 // Assume 5 slides for pagination logic
  const slideRefs = React.useRef<HTMLDivElement[]>([])
  const [displayMode, setDisplayMode] = React.useState<'slides' | 'newContent'>(
    'slides'
  )
  const [plusClickedSlide, setPlusClickedSlide] = React.useState<number | null>(
    null
  )
  const [finalized, setFinalized] = React.useState(false)

  // Sample images for different slides
  const slideImages = {
    cover:
      'https://cdn2.slidemodel.com/wp-content/uploads/60009-01-business-proposal-powerpoint-template-1.jpg',
    introduction:
      'https://cdn2.slidemodel.com/wp-content/uploads/60009-01-business-proposal-powerpoint-template-2.jpg',
    content:
      'https://cdn.slidemodel.com/wp-content/uploads/60009-01-business-proposal-powerpoint-template-3.jpg',
    conclusion:
      'https://cdn2.slidemodel.com/wp-content/uploads/60009-01-business-proposal-powerpoint-template-4.jpg',
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value
    setSelectedImage(
      slideImages[selectedOption as keyof typeof slideImages] ||
        '/placeholder.svg'
    )
    setSelectedOutline(e.target.value)
  }

  const handleShare = () => {
    alert('Share functionality triggered.')
  }

  const handleDownload = () => {
    alert('Download functionality triggered.')
  }

  const handleDelete = () => {
    alert('Slide deleted.')
  }

  const handleConfirm = () => {
    alert('Changes confirmed.')
    setFinalized(true)
  }

  const handleOutlineSelect = (option: string) => {
    setSelectedOutline(option)
    setCurrentOutline(option)
    setSelectedImage(
      slideImages[option as keyof typeof slideImages] || '/placeholder.svg'
    )
    setCurrentSlide(Object.keys(slideImages).indexOf(option) + 1)
    // Scroll to the selected slide
    const slideIndex = Object.keys(slideImages).indexOf(option)
    slideRefs.current[slideIndex]?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    const slideHeight = e.currentTarget.clientHeight
    const newSlide = Math.round(scrollTop / slideHeight) + 1
    setCurrentSlide(newSlide)
    setSelectedOutline(Object.keys(slideImages)[newSlide - 1])
    if (newSlide !== plusClickedSlide) {
      setDisplayMode('slides')
    }
  }

  const handlePlusClick = () => {
    if (displayMode === 'newContent') {
      setDisplayMode('slides')
      setPlusClickedSlide(null)
    } else {
      setDisplayMode('newContent')
      setPlusClickedSlide(currentSlide)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row bg-[#F5F7FA] h-[100vh]">
      {/* Main content container for medium and larger screens */}
      <div className="hidden lg:flex lg:w-full">
        {/* Sidebar for medium and larger screens */}

        <Sidebar
          onOutlineSelect={handleOutlineSelect}
          selectedOutline={selectedOutline}
        />

        <div className="flex-1 p-2">
          <div className="flex items-center justify-between mt-2 mb-5">
            <h1 className="text-2xl font-semibold flex-1 mr-4 break-words">
              The Evolution of Our Path
            </h1>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="text-[#5D5F61] hover:text-blue-600 border border-gray-300 p-2 rounded-md"
              >
                <FaDownload className="h-4 w-4" />
              </button>
              <button
                onClick={handleShare}
                className="text-[#5D5F61] hover:text-blue-600 border border-gray-300 p-2 rounded-md"
              >
                <FaShare className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* Scrollable container for medium and larger screens */}
          <div
            className="no-scrollbar relative w-[95%] bg-white border border-gray-200 mt-2 mb-2 ml-4 overflow-y-scroll snap-y snap-mandatory"
            style={{ height: 'calc(100vh - 200px)' }}
            onScroll={handleScroll}
          >
            {Object.values(slideImages).map((image, index) => (
              <div
                key={index}
                ref={(el) => (slideRefs.current[index] = el!)}
                className="snap-start w-full h-screen"
                style={{ height: '100%' }}
              >
                {displayMode === 'newContent' &&
                plusClickedSlide === index + 1 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-xl text-[#091220] font-semibold">
                      Create a new slide
                    </h2>
                    <h3 className="text-base text-[#5D5F61]">
                      How would you like to create a new slide
                    </h3>
                    <div className="flex gap-4 mt-4">
                      <div className="flex flex-col items-center border border-gray-300 p-4 rounded-lg">
                        <img
                          src={QuickGenerateIcon}
                          alt="Quick Generate"
                          className="h-16 w-16"
                        />
                        <span>Quick Generate</span>
                      </div>
                      <div className="flex flex-col items-center border border-gray-300 p-4 rounded-lg">
                        <img
                          src={CustomBuilderIcon}
                          alt="Custom Builder"
                          className="h-16 w-16"
                        />
                        <span>Custom Builder</span>
                      </div>
                      <div className="flex flex-col items-center border border-gray-300 p-4 rounded-lg">
                        <img
                          src={SlideNarrativeIcon}
                          alt="Slide Narrative"
                          className="h-16 w-16"
                        />
                        <span>Slide Narrative</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={image}
                    title={`Slide ${index + 1}`}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    scrolling="no"
                    style={{ width: '100%', height: '100%' }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between ml-4">
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="hover:text-red-600 border border-gray-300 p-2 rounded-md flex items-center"
              >
                <FaTrash className="h-4 w-4 text-[#5D5F61]" />
                <span className="hidden text-[#5D5F61] lg:block">
                  {' '}
                  Delete Version
                </span>
              </button>
              <button
                onClick={handleConfirm}
                className="hover:text-green-600 border border-gray-300 p-2 rounded-md flex items-center"
              >
                <FaCheck className="h-4 w-4 text-[#5D5F61]" />
                <span className="hidden text-[#5D5F61] lg:block">
                  {' '}
                  Finalize Version
                </span>
              </button>
              <button
                onClick={handlePlusClick}
                className="hover:text-blue-600 border border-[#3667B2] p-2 rounded-md flex items-center"
              >
                <FaPlus className="h-4 w-4 text-[#3667B2]" />
                <span className="hidden text-[#3667B2] lg:block">
                  {' '}
                  New Version
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 mr-[2rem]">
              <button
                onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
                disabled={currentSlide === 1}
                className="flex items-center border border-gray-300 p-2 rounded-md"
              >
                <FaArrowLeft className="h-4 w-4 text-[#5D5F61]" />
              </button>
              <span className="text-sm">
                Slide {currentSlide} of {totalSlides}
              </span>
              <button
                onClick={() =>
                  setCurrentSlide((prev) => Math.min(totalSlides, prev + 1))
                }
                disabled={currentSlide === totalSlides}
                className={`flex items-center border border-gray-300 p-2 rounded-md ${
                  currentSlide === totalSlides
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

      {/* Main content container for mobile screens */}
      <div className="block lg:hidden p-4 mx-auto">
        <div className="flex items-center justify-between gap-2 mt-6 mb-5">
          <h1 className="text-2xl font-semibold flex-1 mr-4 break-words">
            The Evolution of Our Path
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="text-[#5D5F61] hover:text-blue-600 border border-gray-300 p-2 rounded-md"
            >
              <FaDownload className="h-4 w-4" />
            </button>
            <button
              onClick={handleShare}
              className="text-[#5D5F61] hover:text-blue-600 border border-gray-300 p-2 rounded-md"
            >
              <FaShare className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="space-y-4 mt-10 mb-7">
          <div className="space-y-2 flex flex-col">
            <label className="text-base text-[#5D5F61] font-medium">
              Outline
            </label>
            <select
              onChange={handleSelectChange}
              className="border rounded-lg h-fit p-2 py-4"
              value={selectedOutline}
            >
              <option value="cover">Cover</option>
              <option value="introduction">Introduction</option>
              <option value="content">Content</option>
              <option value="conclusion">Conclusion</option>
            </select>
          </div>
        </div>

        {/* Static iframe for small screens */}
        <div className="relative bg-white h-[30vh] border border-gray-200 mt-12 mb-6">
          {displayMode === 'newContent' &&
          plusClickedSlide === currentSlide &&
          selectedOutline === currentOutline ? (
            <div className="flex flex-col mt-2 items-center justify-center h-full">
              <h2 className="text-xl font-semibold">Create a new slide</h2>
              <h3 className="text-base text-[#5D5F61]">
                How would you like to create a new slide?
              </h3>
              <div className="flex gap-2 mt-4">
                <div className="flex flex-col items-center border border-gray-300 p-2">
                  <img
                    src={QuickGenerateIcon}
                    alt="Quick Generate"
                    className="h-12 w-12"
                  />
                  <span className="text-sm">Quick Generate</span>
                </div>
                <div className="flex flex-col items-center border border-gray-300 p-2">
                  <img
                    src={CustomBuilderIcon}
                    alt="Custom Builder"
                    className="h-12 w-12"
                  />
                  <span className="text-sm">Custom Builder</span>
                </div>
                <div className="flex flex-col items-center border border-gray-300 p-2">
                  <img
                    src={SlideNarrativeIcon}
                    alt="Slide Narrative"
                    className="h-12 w-12"
                  />
                  <span className="text-sm">Slide Narrative</span>
                </div>
              </div>
            </div>
          ) : (
            <img
              src={selectedImage}
              alt="Slide content"
              className="absolute top-0 left-0 w-full h-full"
            />
            // <iframe
            //   src={selectedImage}
            //   title="Slide content"
            //   className="absolute top-0 left-0 w-full h-full object-contain"
            //   frameBorder="0"
            //   allowFullScreen
            //   scrolling="no"
            // />
          )}
        </div>

        <div className="flex items-center justify-between w-full mt-10">
          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              className="hover:text-red-600 border border-gray-300 p-2 rounded-md flex items-center"
            >
              <FaTrash className="h-4 w-4 text-[#5D5F61]" />
            </button>
            <button
              onClick={handleConfirm}
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
              disabled={currentSlide === 1}
              className="flex items-center border bg-white border-gray-300 p-2 rounded-md"
            >
              <FaArrowLeft
                className={`h-4 w-4 ${
                  currentSlide === 1 ? 'text-[#5D5F61]' : 'text-[#091220]'
                }`}
              />
            </button>
            <span className="text-sm text-[#5D5F61]">
              Slide <span className="text-[#091220]">{currentSlide}</span> of{' '}
              {totalSlides}
            </span>
            <button
              onClick={() =>
                setCurrentSlide((prev) => Math.min(totalSlides, prev + 1))
              }
              disabled={currentSlide === totalSlides}
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
