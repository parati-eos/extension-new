import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import uploadFileToS3 from './uploadfiletoS3'
import { BackButton } from './BackButton'
import { DisplayMode } from '../../@types/presentationView'
import { toast } from 'react-toastify';

interface TextPlusImageProps {
  heading: string;
  slideType: string;
  documentID: string;
  orgId: string;
  authToken: string;
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>;
  outlineID: string;
  setIsSlideLoading: () => void;
  setFailed: () => void;
}

export default function TextPlusImage({
  heading,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
  outlineID,
  setIsSlideLoading,
  setFailed,
}: TextPlusImageProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [slideTitle, setSlideTitle] = useState('');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [refineLoadingSlideTitle, setRefineLoadingSlideTitle] = useState(false);
  const [refineLoadingText, setRefineLoadingText] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isButtonActive = text.trim() !== '';

  const transformData = (imageUrl: string | null) => {
    const headers: Record<string, string> = {};
    if (imageUrl) {
      const filename = imageUrl.split('/').pop()?.replace(/^[0-9]+_/, '').split('.')[0] || 'Image';
      headers['header1'] = filename;
    }
    return { ...headers, image };
  };

  const handleMouseEnter = () => {
    if (!image || slideTitle.trim() === '') setShowTooltip(true);
  };

  const handleMouseLeave = () => setShowTooltip(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setImage(null);
    try {
      const uploadedImageUrl = await uploadFileToS3({ name: file.name, type: file.type, body: file });
      setImage(uploadedImageUrl);
      toast.success('Image uploaded successfully!', { position: 'top-right', autoClose: 2000 });
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReuploadClick = () => fileInputRef.current?.click();

  const handleSubmit = async () => {
    toast.info(`Request sent to generate new version for ${heading}`, { position: 'top-right', autoClose: 3000 });
    setIsSlideLoading();
    setIsLoading(true);

    try {
      const transformedHeaders = transformData(image);
      const payload = {
        type: 'TextandImage',
        documentID,
        data: {
          slideName: heading,
          ...transformedHeaders,
          overview: text,
          title: slideTitle,
        },
        outlineID,
      };

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/textandimage`,
        payload,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      toast.info(`Data submitted successfully for ${heading}`, { position: 'top-right', autoClose: 3000 });
      setDisplayMode('slides');
    } catch (error) {
      toast.error('Error submitting data!', { position: 'top-right', autoClose: 3000 });
      setFailed();
    } finally {
      setIsLoading(false);
    }
  };

  const refineText = async (type: string, textToRefine: string) => {
    if (type === 'slideTitle') setRefineLoadingSlideTitle(true);
    if (type === 'overview') setRefineLoadingText(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/refineText`,
        { type, textToRefine },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (response.status === 200) {
        if (type === 'slideTitle') setSlideTitle(response.data.refinedText);
        if (type === 'overview') setText(response.data.refinedText);
      }
    } catch (error) {
      toast.error('Error refining text!', { position: 'top-right', autoClose: 3000 });
    } finally {
      if (type === 'slideTitle') setRefineLoadingSlideTitle(false);
      if (type === 'overview') setRefineLoadingText(false);
    }
  };

  const fetchSlideData = async () => {
    const payload = {
      type: 'TextandImage',
      title: slideTitle,
      documentID,
      outlineID,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/fetch-document/${orgId}/textandimage`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        const slideData = response.data;
        if (slideData.title) setSlideTitle(slideData.title);
        if (slideData.overview) setText(slideData.overview);
        if (slideData.image) setImage(slideData.image);
      }
    } catch (error) {
      console.error('Error fetching slide data:', error);
    }
  };

  useEffect(() => {
    fetchSlideData();
  }, []);

  return (
    <div className="flex flex-col w-full h-full  sm:px-6 md:px-8 lg:px-12 xl:px-16 gap-y-4 overflow-hidden">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between w-full">
            <h3 className="font-semibold ">Text + Image</h3>
            <BackButton onClick={() => setDisplayMode('customBuilder')} />
          </div>

          <div className="w-full">
            <div className="relative">
              <input
                type="text"
                value={slideTitle}
                onChange={(e) => setSlideTitle(e.target.value)}
                placeholder="Add Slide Title"
                maxLength={50}
                className="border w-full text-sm text-[#091220] md:text-lg rounded-md font-semibold bg-transparent p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-ellipsis whitespace-nowrap overflow-hidden"
              />
              {refineLoadingSlideTitle ? (
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                </div>
              ) : (
                slideTitle && (
                  <div className="absolute top-1/2 right-2 transform -translate-y-1/2 group">
                    <FontAwesomeIcon
                      icon={faWandMagicSparkles}
                      onClick={() => refineText('slideTitle', slideTitle)}
                      className="hover:scale-105 cursor-pointer active:scale-95 text-[#3667B2]"
                    />
                    <span className="absolute top-[-35px] left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to refine text.
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-1/2 flex flex-col gap-1 relative">
              <textarea
                className="w-full h-28 lg:h-64 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none pr-10 text-sm"
                placeholder="Type something..."
                maxLength={300}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <span className="text-xs text-right text-gray-500">{text.length}/300</span>
              {text && (
                <div className="absolute top-2 right-3">
                  {refineLoadingText ? (
                    <div className="w-4 h-4 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                  ) : (
                    <div className="absolute top-1/2 right-2 transform -translate-y-1/2 group">
                      <FontAwesomeIcon
                        icon={faWandMagicSparkles}
                        onClick={() => refineText('overview', text)}
                        className="hover:scale-105 cursor-pointer active:scale-95 text-[#3667B2]"
                      />
                      <span className="absolute top-[-35px] left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to refine text.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="hidden lg:flex w-full lg:w-1/2 border border-dashed border-gray-300 p-3 rounded-lg bg-white shadow-sm items-center justify-center relative h-64">
              {isUploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
                  <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                </div>
              ) : image ? (
                <>
                  <img src={image} alt="Uploaded" className="w-full h-full object-contain rounded-lg" />
                  <button
                    onClick={handleReuploadClick}
                    className="absolute top-1 right-1 bg-gray-800 text-white text-xs py-1 px-2 rounded-md hover:bg-gray-600"
                  >
                    Re-upload
                  </button>
                </>
              ) : (
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-gray-600 flex items-center justify-center w-full h-full"
                >
                  Tap to upload an image
                </label>
              )}
            </div>
          </div>

          {image && (
            <div className="lg:hidden w-full flex items-center justify-center">
              {isUploading ? (
                <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
              ) : (
                <img src={image} alt="Uploaded" className="w-1/2 h-auto max-h-32 object-contain rounded-lg" />
              )}
            </div>
          )}

          <div className="flex flex-col align-center items-center justify-center lg:hidden gap-2 w-full mt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-1/2 border border-dashed border-gray-300 py-3 text-gray-700 font-medium rounded-md shadow-sm flex items-center justify-center gap-2"
            >
              📎 Attach Image
            </button>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={handleSubmit}
              disabled={!isButtonActive || !slideTitle}
              className={`w-1/2 py-3 rounded-md transition-all duration-200 transform font-medium shadow-sm flex items-center justify-center gap-2 ${
                isButtonActive && slideTitle
                  ? 'bg-[#3667B2] text-white hover:bg-[#2c56a0] hover:shadow-lg active:scale-95'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Generate Slide
            </button>
          </div>

          <div className="hidden lg:flex justify-end">
            <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <button
                onClick={handleSubmit}
                disabled={!isButtonActive || !slideTitle}
                className={`px-6 py-2 rounded-md transition-all duration-200 transform ${
                  isButtonActive && slideTitle
                    ? 'bg-[#3667B2] text-white hover:bg-[#2c56a0] hover:shadow-lg active:scale-95'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Generate Slide
              </button>
              {showTooltip && (
                <div className="absolute top-[-35px] left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap">
                  {!isButtonActive ? 'Please enter some text' : 'Slide title is required.'}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
