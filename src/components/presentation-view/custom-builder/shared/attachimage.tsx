import React, { useState } from 'react'
import { FaPaperclip } from 'react-icons/fa'

interface AttachImageProps {
  onFileSelected: (file: File | null) => void
  buttonText?: string
}

const AttachImage: React.FC<AttachImageProps> = ({ onFileSelected, buttonText = 'Attach Image' }) => {
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null) // Ref for file input

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFileName(file.name)
      onFileSelected(file)
    } else {
      setFileName(null)
      onFileSelected(null)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click() // Programmatically trigger the file input
  }

  return (
    <div className="lg:flex lg:items-center gap-x-2">
      <div className='hidden lg:block'>
      {/* Display file name if selected */}
      {fileName && (
        <span className="text-black text-sm font-medium truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
          {fileName}
        </span>
      )}
      </div>
  
   
      {/* File attachment button */}
      <button
        type="button"
        onClick={triggerFileInput} // Trigger file input click
        className="flex items-center justify-center py-2 border border-gray-300 rounded-md text-gray-700 bg-white w-full sm:w-full md:w-full lg:w-[180px] cursor-pointer"
      >
        <FaPaperclip />
        <span className="ml-2">{fileName ? 'Upload Again' : buttonText}</span>
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        id="attachImage"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

export default AttachImage
