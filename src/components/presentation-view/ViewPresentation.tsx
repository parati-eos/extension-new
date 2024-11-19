// import {
//   FaArrowLeft,
//   FaArrowRight,
//   FaCheck,
//   FaDownload,
//   FaPlus,
//   FaShare,
//   FaTrash,
// } from 'react-icons/fa'
// import * as React from 'react'

// export default function ViewPresentation() {
//   const [currentSlide, setCurrentSlide] = React.useState(1)
//   const [selectedImage, setSelectedImage] = React.useState('/placeholder.svg')
//   const totalSlides = 5 // Assume 5 slides for pagination logic

//   // Sample images for different slides
//   const slideImages = {
//     cover:
//       'https://t4.ftcdn.net/jpg/05/09/54/73/360_F_509547319_DXcMSYwKLE4ZTOrihwpHbUmHudVsHVqg.jpg',
//     introduction:
//       'https://thumbs.dreamstime.com/b/introduction-concept-word-cork-board-77226561.jpg',
//     content:
//       'https://searchengineland.com/wp-content/seloads/2015/11/content-marketing-idea-lightbulb-ss-1920.jpg',
//     conclusion:
//       'https://blog.mugafi.com/wp-content/uploads/2022/06/how-to-write-conclusion.jpg',
//   }

//   const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedOption = e.target.value
//     setSelectedImage(
//       slideImages[selectedOption as keyof typeof slideImages] ||
//         '/placeholder.svg'
//     )
//   }

//   const handleShare = () => {
//     alert('Share functionality triggered.')
//   }

//   const handleDownload = () => {
//     alert('Download functionality triggered.')
//   }

//   const handleDelete = () => {
//     alert('Slide deleted.')
//   }

//   const handleConfirm = () => {
//     alert('Changes confirmed.')
//   }

//   return (
//     // Action Icons below the Slide
//     <div className="p-4 mt-2 max-w-2xl mx-auto">
//       <div className="flex items-center justify-between mb-7">
//         <h1 className="text-2xl font-semibold flex-1 mr-4 break-words">
//           The Evolution of Our Path
//         </h1>
//         <div className="flex gap-2">
//           <button
//             onClick={handleDownload}
//             className="text-[#5D5F61] hover:text-blue-600 border border-gray-300 p-2 rounded-md"
//           >
//             <FaDownload className="h-4 w-4" />
//           </button>
//           <button
//             onClick={handleShare}
//             className="text-[#5D5F61] hover:text-blue-600 border border-gray-300 p-2 rounded-md"
//           >
//             <FaShare className="h-4 w-4" />
//           </button>
//         </div>
//       </div>

//       <div className="space-y-4 mb-7">
//         <div className="space-y-2 flex flex-col">
//           <label className="text-sm text-[#5D5F61] font-medium">Outline</label>
//           <select
//             onChange={handleSelectChange}
//             className="border rounded-lg h-fit p-2"
//           >
//             <option value="cover">Cover</option>
//             <option value="introduction">Introduction</option>
//             <option value="content">Content</option>
//             <option value="conclusion">Conclusion</option>
//           </select>
//         </div>
//       </div>

//       <div className="border rounded-lg p-6 mb-6 bg-white">
//         <div className="relative aspect-[5/3]">
//           <img
//             src={selectedImage}
//             alt="Slide content"
//             className="object-cover rounded-lg"
//           />
//         </div>
//       </div>

//       <div className="flex items-center justify-between">
//         <div className="flex gap-2">
//           <button
//             onClick={handleDelete}
//             className="hover:text-red-600 border border-gray-300 p-2 rounded-md flex items-center"
//           >
//             <FaTrash className="h-4 w-4 text-[#5D5F61]" />
//           </button>
//           <button
//             onClick={handleConfirm}
//             className="hover:text-green-600 border border-gray-300 p-2 rounded-md flex items-center"
//           >
//             <FaCheck className="h-4 w-4 text-[#5D5F61]" />
//           </button>
//           <button
//             onClick={() => alert('Add new slide')}
//             className="hover:text-blue-600 border border-gray-300 p-2 rounded-md flex items-center"
//           >
//             <FaPlus className="h-4 w-4 text-[#5D5F61]" />
//           </button>
//         </div>

//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
//             disabled={currentSlide === 1}
//             className="flex items-center border border-gray-300 p-2 rounded-md"
//           >
//             <FaArrowLeft className="h-4 w-4 text-[#5D5F61]" />
//           </button>
//           <span className="text-sm">
//             Slide {currentSlide} of {totalSlides}
//           </span>
//           <button
//             onClick={() =>
//               setCurrentSlide((prev) => Math.min(totalSlides, prev + 1))
//             }
//             disabled={currentSlide === totalSlides}
//             className={`flex items-center border border-gray-300 p-2 rounded-md ${
//               currentSlide === totalSlides
//                 ? 'text-gray-400'
//                 : 'hover:text-blue-600'
//             }`}
//           >
//             <FaArrowRight className="h-4 w-4 text-[#5D5F61]" />
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// ViewPresentation.tsx
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

export default function ViewPresentation() {
  const [currentSlide, setCurrentSlide] = React.useState(1)
  const [selectedImage, setSelectedImage] = React.useState('/placeholder.svg')
  const [selectedOutline, setSelectedOutline] = React.useState('cover')
  const totalSlides = 5 // Assume 5 slides for pagination logic

  const slideImages = {
    cover:
      'https://t4.ftcdn.net/jpg/05/09/54/73/360_F_509547319_DXcMSYwKLE4ZTOrihwpHbUmHudVsHVqg.jpg',
    introduction:
      'https://thumbs.dreamstime.com/b/introduction-concept-word-cork-board-77226561.jpg',
    content:
      'https://searchengineland.com/wp-content/seloads/2015/11/content-marketing-idea-lightbulb-ss-1920.jpg',
    conclusion:
      'https://blog.mugafi.com/wp-content/uploads/2022/06/how-to-write-conclusion.jpg',
  }

  const handleSelectChange = (option: string) => {
    setSelectedOutline(option)
    setSelectedImage(
      slideImages[option as keyof typeof slideImages] || '/placeholder.svg'
    )
  }

  const handleShare = () => alert('Share functionality triggered.')
  const handleDownload = () => alert('Download functionality triggered.')
  const handleDelete = () => alert('Slide deleted.')
  const handleConfirm = () => alert('Changes confirmed.')

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto mt-6">
      {/* Sidebar for larger screens */}
      <Sidebar
        onOutlineSelect={handleSelectChange}
        selectedOutline={selectedOutline}
      />

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-7">
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

        <div className="border rounded-lg p-6 mb-6 bg-white">
          <div className="relative aspect-[5/3]">
            <img
              src={selectedImage}
              alt="Slide content"
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="hover:text-red-600 border border-gray-300 p-2 rounded-md flex items-center"
            >
              <FaTrash className="h-4 w-4 text-[#5D5F61]" />
            </button>
            <button
              onClick={handleConfirm}
              className="hover:text-green-600 border border-gray-300 p-2 rounded-md flex items-center"
            >
              <FaCheck className="h-4 w-4 text-[#5D5F61]" />
            </button>
            <button
              onClick={() => alert('Add new slide')}
              className="hover:text-blue-600 border border-gray-300 p-2 rounded-md flex items-center"
            >
              <FaPlus className="h-4 w-4 text-[#5D5F61]" />
            </button>
          </div>

          <div className="flex items-center gap-4">
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
  )
}
