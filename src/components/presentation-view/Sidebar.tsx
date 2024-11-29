import React, { useState, useEffect } from 'react'
import { FaPlus, FaCheck, FaTimes } from 'react-icons/fa'

interface Outlines {
  title: string
  type: string
  _id: string
}

interface SidebarProps {
  onOutlineSelect: (option: string) => void
  selectedOutline: string
  fetchedOutlines: Outlines[]
}

const Sidebar: React.FC<SidebarProps> = ({
  onOutlineSelect,
  selectedOutline,
  fetchedOutlines,
}) => {
  const [outlines, setOutlines] = useState<Outlines[]>([])
  const [isInputVisible, setIsInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setOutlines(fetchedOutlines)
  }, [fetchedOutlines])

  const handleAddOutline = async () => {
    // try {
    //   const response = await axios.post(
    //     'https://microservice-v1.onrender.com/api/v1/outline',
    //     { title: inputValue },
    //     {
    //     }
    //   )
    //   setOutlines([...outlines, response.data.outline])
    //   setInputValue('')
    //   setIsInputVisible(false)
    // } catch (error) {
    //   console.error('Error adding outline:', error)
    // }
  }

  const slideOptions = outlines.map((outline) => outline.title)

  return (
    // <div className="hidden lg:block w-1/8 h-fit p-4 bg-gray-50 ml-4 rounded-lg border border-gray-300 max-h-screen overflow-y-auto">
    //   <ul className="space-y-2">
    //     {slideOptions.map((option, index) => (
    //       <React.Fragment key={option}>
    //         <li>
    //           <button
    //             onClick={() => onOutlineSelect(option)}
    //             className={`block w-full text-left p-2 rounded-lg ${
    //               selectedOutline === option
    //                 ? 'bg-blue-50 text-[#3667B2]'
    //                 : 'hover:bg-gray-200 text-gray-600'
    //             }`}
    //           >
    //             {option.charAt(0).toUpperCase() + option.slice(1)}
    //           </button>
    //         </li>
    //         {index === 1 && (
    //           <li className="flex items-center justify-center space-x-2">
    //             <hr className="flex-grow border-gray-300" />
    //             {isInputVisible ? (
    //               <div className="flex items-center w-full">
    //                 <input
    //                   type="text"
    //                   value={inputValue}
    //                   onChange={(e) => setInputValue(e.target.value)}
    //                   className="flex-grow p-2 border border-gray-300 rounded-l-lg"
    //                 />
    //                 <button
    //                   onClick={handleAddOutline}
    //                   className="p-2 bg-green-500 text-white rounded-r-lg"
    //                 >
    //                   <FaCheck />
    //                 </button>
    //                 <button
    //                   onClick={() => setIsInputVisible(false)}
    //                   className="p-2 bg-red-500 text-white rounded-r-lg"
    //                 >
    //                   <FaTimes />
    //                 </button>
    //               </div>
    //             ) : (
    //               <button
    //                 onClick={() => setIsInputVisible(true)}
    //                 className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-full"
    //               >
    //                 <FaPlus className="text-gray-400" />
    //               </button>
    //             )}
    //             <hr className="flex-grow border-gray-300" />
    //           </li>
    //         )}
    //       </React.Fragment>
    //     ))}
    //   </ul>
    // </div>
    <div className="hidden lg:block w-1/8 h-fit p-4 bg-gray-50 ml-4 rounded-lg border border-gray-300 max-h-screen overflow-y-auto">
      <ul className="space-y-2">
        {outlines.map((outline) => (
          <li key={outline._id}>
            <button
              onClick={() => onOutlineSelect(outline.title)}
              className={`block w-full text-left p-2 rounded-lg ${
                selectedOutline === outline.title
                  ? 'bg-blue-50 text-[#3667B2]'
                  : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              {outline.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
