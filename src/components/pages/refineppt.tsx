import React, { useState, useRef, useEffect } from 'react';
import { DisplayMode } from '../../@types/presentationView';
import zynthtext from '../../assets/zynth-text.png';
import {
  MobileNewSlideVersion,
  DesktopNewSlideVersion,
} from '../inApp/NewSlideVersion';
import SlideNarrative from '../inApp/SlideNarrative';
import CustomBuilderMenu from '../inApp/CustomBuilderMenu';
import Points from '../inApp/Points';
import People from '../inApp/People';
import Phases from '../inApp/Timeline';
import Images from '../inApp/Images';
import Table from '../inApp/Table';
import Graphs from '../inApp/Graphs';
import Statistics from '../inApp/Statistics';

const RefinePPT: React.FC = () => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('slides');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [slideId, setSlideId] = useState<string | null>(null);
  const [outlineId, setOutlineId] = useState<string | null>(null);
  const [slideDataId, setSlideDataId] = useState<string | null>(null);
  const [sectionName, setSectionName] = useState<string | null>(null);
  const [formID, setFormID] = useState<string | null>(null); // Renamed
  const slidesArrayRef = useRef<Record<string, any>>({});
  //const documentID = sessionStorage.getItem('documentID') || '';
  const orgID = sessionStorage.getItem('orgId') || '';
  const authToken = sessionStorage.getItem('authToken') || '';
console.log("Token",authToken)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "slideId") {
        const receivedSlideId = event.data.slideId;
        console.log("Received Slide ID:", receivedSlideId);
        setSlideId(receivedSlideId);

        // Fetch additional data from backend
        fetch("https://d2bwumaosaqsqc.cloudfront.net/api/v1/data/slidedisplay/get-slide-info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`, // ✅ Add your token here
          },
          body: JSON.stringify({ GenSlideID: receivedSlideId }),
        })
          .then((response) => response.json())
          .then((data) => {
            setFormID(data.FormID);
            setOutlineId(data.outline_id);
            setSlideDataId(data.slideData_id);
            setSectionName(data.SectionName);
          })
          .catch((error) => {
            console.error("Error fetching slide info:", error);
          });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderContent = () => {
    switch (displayMode) {
      case 'slides':
        return (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Create a new slide</h2>
            <h1 className="text-blue-600 mt-1">{slideId || 'Waiting for Slide ID...'}</h1>
            <p className="text-gray-600 mt-2 text-center">How would you like to create a new slide?</p>
            <div className="mt-6 flex flex-col justify-center gap-3">
              {[
                { name: 'quick', icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435466780_points.svg' },
                { name: 'SlideNarrative', icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435399743_Presentation.svg' },
                { name: 'customBuilder', icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435517252_images.svg' },
              ].map((type) => (
                <button
                  key={type.name}
                  onClick={() => setDisplayMode(type.name as DisplayMode)}
                  className="flex flex-col items-center bg-white shadow-md rounded-lg px-8 py-6 w-48 transition hover:shadow-lg border border-gray-200"
                >
                  <img src={type.icon} alt={type.name} className="w-12 h-12 mb-3" />
                  <span className="text-gray-900 font-medium text-center">{type.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
        case 'Points':
          return <Points heading="Points Slide" setDisplayMode={setDisplayMode} slideType={""} documentID={formID || ''} orgId={orgID} authToken={authToken} outlineID={outlineId || ''} setIsSlideLoading={() => {}} setFailed={() => {}} />;
        case 'People':
          return <People heading="People Slide" setDisplayMode={setDisplayMode} slideType="" documentID={formID || ''} orgId={orgID} authToken={authToken} outlineID={outlineId || ''} setIsSlideLoading={() => {}} setFailed={() => {}} />;
        case 'Timeline':
          return <Phases heading="Timeline Slide" setDisplayMode={setDisplayMode} slideType="" documentID={formID || ''} orgId={orgID} authToken={authToken} outlineID={outlineId || ''} setIsSlideLoading={() => {}} setFailed={() => {}} />;
        case 'Images':
          return <Images heading="Images Slide" setDisplayMode={setDisplayMode} slideType="" documentID={formID || ''} orgId={orgID} authToken={authToken} outlineID={outlineId || ''} setIsSlideLoading={() => {}} setFailed={() => {}} />;
        case 'Table':
          return <Table heading="Table Slide" setDisplayMode={setDisplayMode} slideType="" documentID={formID || ''} orgId={orgID} authToken={authToken} outlineID={outlineId || ''} setIsSlideLoading={() => {}} setFailed={() => {}} />;
        case 'Graphs':
          return <Graphs heading="Graphs Slide" setDisplayMode={setDisplayMode} slideType="" documentID={formID || ''} orgId={orgID} authToken={authToken} outlineID={outlineId || ''} setIsSlideLoading={() => {}} setFailed={() => {}} />;
        case 'Statistics':
          return <Statistics heading="Statistics Slide" setDisplayMode={setDisplayMode} slideType="" documentID={formID || ''} orgId={orgID} authToken={authToken} outlineID={outlineId || ''} setIsSlideLoading={() => {}} setFailed={() => {}} />;
        case 'SlideNarrative':
          return <SlideNarrative heading={sectionName || 'Slide Title Here'} slideType="Points" documentID={formID || 'doc_1234555'} orgId={orgID} authToken={authToken} setDisplayMode={setDisplayMode} setIsSlideLoading={() => {}} outlineID={outlineId || 'abc123'} setFailed={() => {}} />;
        
      default:
        return <CustomBuilderMenu onTypeClick={setDisplayMode} setDisplayMode={setDisplayMode} />;
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 p-6">
      <div className="w-full flex flex-col items-center text-center mb-6">
        <img src={zynthtext} alt="Zynth Logo" className="h-10 mb-2" />
        <h3 className="text-lg text-gray-700">AI Slides and Presentation</h3>
      </div>
      <button className="w-full py-2 bg-gray-200 text-black font-semibold rounded-md mb-4">
        Add New Slide
      </button>
      <div className="w-full py-2 border-b mb-6 text-gray-500">{sectionName}</div>
      <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-6 w-full max-w-xl">
        {renderContent()}
      </div>

      <button
  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
  onClick={() => {
    window.parent.postMessage({ type: "refreshSlideId" }, "*");
  }}
>
  🔄 Refresh Slide ID
</button>
    </div>
  );
};

export default RefinePPT;


