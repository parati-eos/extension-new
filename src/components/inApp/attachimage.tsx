import React, { useState, useRef, useEffect } from 'react'
import { FaPaperclip } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'

interface AttachImageProps {
  onFileSelected: (file: File | null) => void
  buttonText?: string
  isLoading: boolean
  fileName: string | null
  uploadCompleted: boolean
  selectedImage?: string | null // New prop for pre-fetched image
  
}

const AttachImage: React.FC<AttachImageProps> = ({
  onFileSelected,
  buttonText = 'Attach Image',
  isLoading,  // <-- Use this prop instead of local state
  fileName,
  uploadCompleted,
  selectedImage, // Receive selected image from parent
 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
 // Update the useEffect to handle null/undefined cases
useEffect(() => {
  // Clear preview when selectedImage is cleared from parent
  setImagePreview(selectedImage || null)
}, [selectedImage]) // Now properly responds to parent image changes

  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      onFileSelected(file) // Let the parent handle upload state

      // Generate local image preview
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '' // Reset input to allow re-uploading the same image
    }
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onFileSelected(null)
    // Add this line to ensure parent state clears completely
    if (!selectedImage) return
    setImagePreview(null)
  }


  return (
    <div className="lg:flex lg:items-center gap-x-2">
      {imagePreview && (
        <div className="relative hidden lg:block">
          <img src={imagePreview} alt="Uploaded" className="w-10 h-10 object-cover rounded-md" />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 text-sm hover:bg-gray-200"
          >
            <IoClose className="text-gray-600" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={triggerFileInput}
        disabled={isLoading} // Use parent-controlled loading state
        className={`hidden lg:flex items-center justify-center py-2 border border-gray-300 rounded-md w-full sm:w-full md:w-full lg:w-[180px] cursor-pointer ${
          isLoading
            ? 'bg-white text-gray-700 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <FaPaperclip />
        <span className="ml-2">
          {isLoading ? 'Loading...' : fileName ? 'Upload Again' : buttonText}
        </span>
      </button>
        {/* File attachment button (Mobile) */}
        <button
  type="button"
  onClick={triggerFileInput}
  disabled={isLoading}
  className={`relative flex items-center lg:hidden justify-center h-10 border border-gray-300 rounded-md w-full sm:w-full md:w-full lg:w-[180px] cursor-pointer px-2 ${
    isLoading
      ? 'bg-white text-gray-700 cursor-not-allowed'
      : 'bg-white text-gray-700 hover:bg-gray-100'
  }`}
>
  {imagePreview ? (
    <>
      {/* Thumbnail on the left */}
      <img src={imagePreview} alt="Uploaded" className="w-8 h-8 object-cover rounded-md" />
      
      {/* "Upload Again" text on the right */}
      <span className="ml-2">{isLoading ? 'Loading...' : 'Upload Again'}</span>

      {/* Remove Image Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          removeImage()
        }}
        className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 text-sm hover:bg-gray-200"
      >
        <IoClose className="text-gray-600" />
      </button>
    </>
  ) : (
    <>
      <FaPaperclip />
      <span className="ml-2">{isLoading ? 'Loading...' : buttonText}</span>
    </>
  )}
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
