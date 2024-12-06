import React, { useState } from 'react'
import { FaPaperclip } from 'react-icons/fa'

interface AttachImageProps {
  onFileSelected: (file: File | null) => void
  buttonText?: string
}

const AttachImage: React.FC<AttachImageProps> = ({ onFileSelected, buttonText = 'Attach Image' }) => {
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFileName(file.name) // Update the file name
      onFileSelected(file) // Pass the file to the parent component
    } else {
      setFileName(null)
      onFileSelected(null)
    }
  }

  return (
    
    <div className="flex items-center gap-x-2">
  {/* Display file name on the left side if file is selected */}
  {fileName && (
    <span className="text-black text-sm font-medium truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
      {fileName}
    </span>
  )}

  {/* File attachment button */}
  <label
    htmlFor="attachImage"
    className="flex items-center justify-center py-2 border border-gray-300 rounded-md text-gray-700 bg-white w-full sm:w-[60%] md:w-[45%] lg:w-[180px] cursor-pointer"
  >
    <FaPaperclip />
    <span className="ml-2">{fileName ? 'Upload Again' : buttonText}</span>
  </label>

  <input
    type="file"
    id="attachImage"
    accept="image/*"
    className="hidden"
    onChange={handleFileChange}
  />
</div>

  
  )
}

export default AttachImage
