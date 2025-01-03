import React, { useState } from 'react';
import { FaPaperclip } from 'react-icons/fa';

interface AttachImageProps {
  onFileSelected: (file: File | null) => void;
  buttonText?: string;
  isLoading: boolean;
  fileName: string | null; // Added to display the uploaded file name
  uploadCompleted: boolean; // Track if the upload is complete
}

const AttachImage: React.FC<AttachImageProps> = ({
  onFileSelected,
  buttonText = 'Attach Image',
  isLoading,
  fileName,
  uploadCompleted,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null); // Ref for file input

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onFileSelected(file);
    } else {
      onFileSelected(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click(); // Programmatically trigger the file input
  };

  const truncateFileName = (name: string, maxLength: number) => {
    const nameWithoutExtension = name.replace(/\.[^/.]+$/, ''); // Remove file extension
    return nameWithoutExtension.length > maxLength
      ? `${nameWithoutExtension.slice(0, maxLength)}...`
      : nameWithoutExtension;
  };

  return (
    <div className="lg:flex lg:items-center gap-x-2">
      {/* Display file name for large screens */}
      {uploadCompleted && fileName && (
        <div className="hidden lg:block">
          <span className="text-black text-sm font-medium truncate max-w-[250px]">
            {truncateFileName(fileName, 30)}
          </span>
        </div>
      )}

      {/* File attachment button */}
      <button
        type="button"
        onClick={triggerFileInput} // Trigger file input click
        disabled={isLoading}
        className={`flex items-center justify-center py-2 border border-gray-300 rounded-md w-full sm:w-full md:w-full lg:w-[180px] cursor-pointer ${
          isLoading
            ? 'bg-white text-gray-700 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <FaPaperclip />
        <span className="hidden lg:block ml-2">
          {isLoading
            ? 'Loading...'
            : fileName && uploadCompleted
            ? 'Upload Again'
            : buttonText}
        </span>
        <span className="lg:hidden ml-2">
          {isLoading
            ? 'Loading...'
            : fileName && uploadCompleted
            ? truncateFileName(fileName, 15)
            : buttonText}
        </span>
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
