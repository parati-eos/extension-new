import React, { useState, useRef, useEffect } from 'react';
import { DisplayMode } from '../../@types/presentationView';
import zynthtext from '../../assets/zynth-text.png';
import SlideNarrative from '../inApp/SlideNarrative';
import CustomBuilderMenu from '../inApp/CustomBuilderMenu';
import Points from '../inApp/Points';
import People from '../inApp/People';
import Phases from '../inApp/Timeline';
import Images from '../inApp/Images';
import Table from '../inApp/Table';
import Graphs from '../inApp/Graphs';
import Statistics from '../inApp/Statistics';
import TextPlusImage from '../inApp/TextPlusImage';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { toast } from 'react-toastify';

const RefinePPT: React.FC = () => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('slides');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [quickLoading, setQuickLoading] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const slidesArrayRef = useRef<Record<string, any>>({});
  const [outlineId, setOutlineId] = useState<string>('');
  const [slideDataId, setSlideDataId] = useState<string>('');
  const [sectionName, setSectionName] = useState<string>('');
  const [formID, setFormID] = useState<string | null>(null);
  const [slideId, setSlideId] = useState<string | null>(null);
  const [slideType, setSlideType] = useState<string>('Points');

  const documentID = sessionStorage.getItem('documentID') || '';
  const orgID = sessionStorage.getItem('orgId') || '';
  const authToken = sessionStorage.getItem('authToken') || '';
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === "slideId") {
        const receivedSlideId = event.data.slideId;
        setSlideId(receivedSlideId);

        try {
          const slideInfoResponse = await fetch("https://d2bwumaosaqsqc.cloudfront.net/api/v1/data/slidedisplay/get-slide-info", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
            body: JSON.stringify({ GenSlideID: receivedSlideId }),
          });

          const slideInfoData = await slideInfoResponse.json();

          setFormID(slideInfoData.FormID);
          setOutlineId(slideInfoData.outline_id);
          setSlideDataId(slideInfoData.slideData_id);
          setSectionName(slideInfoData.SectionName);

          const slideTypeResponse = await fetch("https://d2bwumaosaqsqc.cloudfront.net/api/v1/data/slidedisplay/slide-type", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
            body: JSON.stringify({ slideData_id: slideInfoData.slideData_id }),
          });

          const slideTypeData = await slideTypeResponse.json();
          if (slideTypeData?.slide_type) {
            setSlideType(slideTypeData.slide_type);
          }

          if (slideTypeData?.slide_type === "cover" || slideTypeData?.slide_type === "contact") {
            setDisplayMode("customBuilder");
          }
        } catch (error) {
          console.error("Error in chained slide fetch:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    const fallbackTimeout = setTimeout(() => {
      setLoading(false);
    }, 10000);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = sessionStorage.getItem("authToken");
      if (!token) return navigate("/login");

      try {
        const decoded: { exp?: number } = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (!decoded.exp || decoded.exp <= currentTime) {
          sessionStorage.clear();
          navigate("/login");
        } else {
          const timeoutDuration = (decoded.exp - currentTime) * 1000;
          setTimeout(() => {
            sessionStorage.clear();
            navigate("/login");
          }, timeoutDuration);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        sessionStorage.clear();
        navigate("/login");
      }
    };

    checkTokenExpiry();
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderContent = () => {
    switch (displayMode) {
      case 'slides':
        return (
          <div className="flex flex-col justify-center bg-white shadow-lg rounded-lg  w-full h-[80vh] ">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <h2 className="text-xl font-bold text-gray-900 text-center">Create a new slide</h2>
            <p className="text-gray-600 mt-2 text-center text-xl">How would you like to create a new slide?</p>
            <div className="mt-6 flex flex-row justify-between gap-3 w-[80%] h-[30%]">
                {[
                  {
                    name: 'Quick Generate',
                    icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435466780_points.svg',
                    onClick: async () => {
                      try {
                        setQuickLoading(true);

                        const title = sectionName || 'Slide Title Here';
                        await axios.post(
                          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/generate-document/${orgID}`,
                          {
                            type: slideType,
                            title,
                            documentID: formID,
                            outlineID: outlineId,
                          },
                          {
                            headers: { Authorization: `Bearer ${authToken}` },
                          }
                        );

                        toast.success(`Slide Generation Started for ${title}`, {
                          position: 'top-right',
                          autoClose: 3000,
                        });
                      } catch (err) {
                        toast.error("Slide generation failed", {
                          position: 'top-right',
                          autoClose: 3000,
                        });
                      } finally {
                        setQuickLoading(false);
                      }
                    },
                  },
                  {
                    name: 'Slide Narrative',
                    icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435399743_Presentation.svg',
                    onClick: () => setDisplayMode('SlideNarrative'),
                  },
                  {
                    name: 'Custom Builder',
                    icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435517252_images.svg',
                    onClick: () => setDisplayMode('customBuilder'),
                  },
                ].map((type) => (
                  <button
                    key={type.name}
                    onClick={type.onClick}
                    disabled={quickLoading && type.name === 'quick'}
                    className="flex flex-col items-center bg-white shadow-md rounded-lg px-8 py-6 w-[30%] h-[100%] transition hover:shadow-lg border border-gray-200"
                  >
                    <img src={type.icon} alt={type.name} className="w-16 h-16 mb-3" />
                    <span className="text-gray-900 font-medium text-center text-xl">
                      {quickLoading && type.name === 'quick' ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500" />
                      ) : (
                        type.name
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Points':
        return <Points heading="Points Slide" setDisplayMode={setDisplayMode} slideType="" documentID={formID || ''} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => { }} setFailed={() => { }} />;
      case 'People':
        return <People heading="People Slide" setDisplayMode={setDisplayMode} slideType="" documentID={formID || ''} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => { }} setFailed={() => { }} />;
      case 'Timeline':
        return <Phases heading="Timeline Slide" setDisplayMode={setDisplayMode} slideType="" documentID={formID || ''} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => { }} setFailed={() => { }} />;
      case 'Images':
        return <Images heading="Images Slide" setDisplayMode={setDisplayMode} slideType="" documentID={formID || ''} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => { }} setFailed={() => { }} />;
      case 'Table':
        return <Table heading="Table Slide" setDisplayMode={setDisplayMode} slideType="" documentID={formID || ''} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => { }} setFailed={() => { }} />;
      case 'Graphs':
        return <Graphs heading="Graphs Slide" setDisplayMode={setDisplayMode} slideType="" documentID={formID || ''} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => { }} setFailed={() => { }} />;
      case 'TextandImage':
        return <TextPlusImage heading="Text + Image Slide" setDisplayMode={setDisplayMode} slideType="" documentID={formID || ''} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => { }} setFailed={() => { }} />;
      case 'Statistics':
        return <Statistics heading="Statistics Slide" setDisplayMode={setDisplayMode} slideType="" documentID={formID || ''} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => { }} setFailed={() => { }} />;
      case 'SlideNarrative':
        return <SlideNarrative heading={sectionName || 'Slide Title Here'} slideType="Points" documentID={formID || 'doc_123'} orgId={orgID} authToken={authToken} setDisplayMode={setDisplayMode} setIsSlideLoading={() => { }} outlineID={outlineId || 'abc123'} setFailed={() => { }} />;
      default:
        return <CustomBuilderMenu onTypeClick={setDisplayMode} setDisplayMode={setDisplayMode} />;
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 p-2.5">
      <div className="w-full flex flex-col items-center text-center mb-6">
        <img src={zynthtext} alt="Zynth Logo" className="h-5 mb-2" />
        <h3 className="text-sm text-gray-700">AI Slides and Presentation</h3>
      </div>
      <div className="w-full py-2 border-b mb-6 text-gray-500 text-sm">{sectionName}</div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" />
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
};

export default RefinePPT;