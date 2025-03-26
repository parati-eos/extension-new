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
import TextPlusImage from '../inApp/TextPlusImage';


const RefinePPT: React.FC = () => {
  const outlineid = 'abc123';
  const [displayMode, setDisplayMode] = useState<DisplayMode>('slides');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const slidesArrayRef = useRef<Record<string, any>>({});
  const [outlineId, setOutlineId] = useState<string>('');
  const [slideDataId, setSlideDataId] = useState<string>('');
  const [sectionName, setSectionName] = useState<string>('');
  const [formID, setFormID] = useState<string | null>(null); 
  const [slideId, setSlideId] = useState<string | null>(null);
  const documentID = sessionStorage.getItem('documentID') || '';
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
      case'slides':
        return  <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-6 w-full max-w-xl text-sm">
        <div className=" flex flex-col items-center justify-center">
           <h2 className="text-base font-bold text-gray-900 text-center">Create a new slide</h2>
          
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
              className="flex flex-col items-center bg-white shadow-md rounded-lg px-8 py-6 w-25 transition hover:shadow-lg border border-gray-200 text-sm"
            >
              <img src={type.icon} alt={type.name} className="w-8 h-8 mb-3" />
              <span className="text-gray-900 font-medium text-center text-sm">{type.name}</span>
            </button> 
          ))}
       </div>
        </div>
        </div>
      case 'Points':
        return <div className="flex flex-col items-center  bg-white shadow-lg rounded-lg pt-1 w-full max-w-xl text-sm">
        <Points heading="Points Slide" setDisplayMode={setDisplayMode} slideType={""} documentID={documentID} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => {}} setFailed={() => {}} />
        </div>
      case 'People':
        return <div className="flex flex-col items-center  bg-white shadow-lg rounded-lg pt-6 w-full max-w-xl">
        <People heading="People Slide" setDisplayMode={setDisplayMode} slideType="" documentID={slideDataId} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => {}} setFailed={() => {}} />
        </div> 
      case 'Timeline':
        return <div className="flex flex-col items-center  bg-white shadow-lg rounded-lg p-2 w-full max-w-xl">
           <Phases heading="Timeline Slide" setDisplayMode={setDisplayMode} slideType="" documentID={slideDataId} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => {}} setFailed={() => {}} />
          </div>
      case 'Images':
        return  <div className="flex flex-col items-center  bg-white shadow-lg rounded-lg p-2 w-full max-w-xl">
         <Images heading="Images Slide" setDisplayMode={setDisplayMode} slideType="" documentID={slideDataId} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => {}} setFailed={() => {}} />
         </div>
      case 'Table':
        return  <div className="flex flex-col items-center  bg-white shadow-lg rounded-lg p-2 w-full max-w-xl">
         <Table heading="Table Slide" setDisplayMode={setDisplayMode} slideType="" documentID={slideDataId} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => {}} setFailed={() => {}} />
         </div>
      case 'Graphs':
        return  <div className="flex flex-col items-center  bg-white shadow-lg rounded-lg p-2 w-full max-w-xl">
         <Graphs heading="Graphs Slide" setDisplayMode={setDisplayMode} slideType="" documentID={slideDataId} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => {}} setFailed={() => {}} />
          </div>
      case 'TextandImage':
        return  <div className="flex flex-col items-center  bg-white shadow-lg rounded-lg p-2 w-full max-w-xl">
        <TextPlusImage heading="Graphs Slide" setDisplayMode={setDisplayMode} slideType="" documentID={slideDataId} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => {}} setFailed={() => {}} />
         </div>

      case 'Statistics':
        return  <div className="flex flex-col items-center  bg-white shadow-lg rounded-lg p-2 w-full max-w-xl">
          <Statistics heading="Statistics Slide" setDisplayMode={setDisplayMode} slideType="" documentID={slideDataId} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => {}} setFailed={() => {}} />
        </div>
       case 'quick':
        return  <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-6 w-full max-w-xl">
        <div className=" flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Create a new slide</h2>
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
           className="flex flex-col items-center bg-white shadow-md rounded-lg px-8 py-6 w-48 transition hover:shadow-lg border border-gray-200 "
         >
           <img src={type.icon} alt={type.name} className="w-12 h-12 mb-3" />
           <span className="text-gray-900 font-medium text-center">{type.name}</span>
         </button>
       ))}
    </div>
     </div>
     </div>
      case 'SlideNarrative':
        return  <div className="flex items-center bg-white shadow-lg rounded-lg pt-1 pb-1 pr-0 pl-0 w-full h-[60vh] max-w-xl mr-0 ml=0">
          <SlideNarrative
        heading={sectionName || 'Slide Title Here'}
                slideType="Points"
                documentID={documentID || 'doc_123'}
                orgId={orgID}
                authToken={authToken}
                setDisplayMode={setDisplayMode}
                setIsSlideLoading={() => {}}
                outlineID={outlineId || 'abc123'}
                setFailed={() => {}}
      />
      </div>
  
      // case 'customBuilder':
      //   return <CustomBuilderMenu onTypeClick={setDisplayMode} setDisplayMode={setDisplayMode} />;
      
      default:
        return  <div className="flex items-center bg-white shadow-lg rounded-lg p-2 w-full max-w-xl">
         <CustomBuilderMenu onTypeClick={setDisplayMode} setDisplayMode={setDisplayMode} />
         </div>
      
    }
  };

  return (
        <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 p-2.5 pl-0.5 pr-0.5">
      <div className="w-full flex flex-col items-center text-center mb-6">
        <img src={zynthtext} alt="Zynth Logo" className="h-5 mb-2" />
        <h3 className="text-sm text-gray-700">AI Slides and Presentation</h3>
      </div >

      <button className="w-full py-2 bg-gray-200 text-black font-semibold rounded-md mb-4 text-sm mr-3 ml-3 ">
        Add New Slide
      </button>
      <button
  className="mt-1 mb-1 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
  onClick={() => {
    window.parent.postMessage({ type: "refreshSlideId" }, "*");
  }}
>
  🔄 Refresh Slide ID
</button>

      <div className="w-full py-2 border-b mb-6 text-gray-500 text-sm">Title</div>

      {/* //<div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-6 w-full max-w-xl"> */}
        {renderContent()}
      {/* //</div> */}
      
    </div>
  );
};

export default RefinePPT;

// import React, { useState, useRef, useEffect } from 'react';
// import { DisplayMode } from '../../@types/presentationView';
// import zynthtext from '../../assets/zynth-text.png';
// import {
//   MobileNewSlideVersion,
//   DesktopNewSlideVersion,
// } from '../inApp/NewSlideVersion';
// import SlideNarrative from '../inApp/SlideNarrative';
// import CustomBuilderMenu from '../inApp/CustomBuilderMenu';
// import Points from '../inApp/Points';
// import People from '../inApp/People';
// import Phases from '../inApp/Timeline';
// import Images from '../inApp/Images';
// import Table from '../inApp/Table';
// import Graphs from '../inApp/Graphs';
// import Statistics from '../inApp/Statistics';

// const RefinePPT: React.FC = () => {
//   const [displayMode, setDisplayMode] = useState<DisplayMode>('slides');
//   const [outlineId, setOutlineId] = useState<string>('');
//   const [slideDataId, setSlideDataId] = useState<string>('');
//   const [sectionName, setSectionName] = useState<string>('');

//   const documentID = sessionStorage.getItem('documentID') || '';
//   const orgID = sessionStorage.getItem('orgId') || '';
//   const authToken = sessionStorage.getItem('authToken') || '';

//   const handleQuickGenerate = () => {
//     setDisplayMode('newContent');
//   };

//   useEffect(() => {
//     const queryParams = new URLSearchParams(window.location.search);
//     const presId = queryParams.get("presentationID");
//     const slideId = queryParams.get("slideId");

//     if (presId) {
//       sessionStorage.setItem("presentationId", presId);
//     }

//     if (slideId) {
//       sessionStorage.setItem("activeSlideId", slideId);
//     }

//     if (presId) {
//       fetch('http://localhost:5001/api/v1/data/slidedisplay/get-slide-info', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ GenSlideID: slideId }),
//       })
//         .then(response => response.json())
//         .then(data => {
//           setOutlineId(data.outline_id);
//           setSlideDataId(data.slideData_id);
//           setSectionName(data.SectionName);
//         })
//         .catch(error => {
//           console.error('Error fetching slide info:', error);
//         });
//     }
//   }, []);

//   const handleCustomBuilderClick = () => {
//     setDisplayMode('customBuilder');
//   };

//   const handleSlideNarrative = () => {
//     setDisplayMode('slideNarrative');
//   };

//   const handleBack = () => {
//     setDisplayMode('slides');
//   };

//   if (displayMode === 'customBuilder') {
//     return <CustomBuilderMenu onTypeClick={setDisplayMode} setDisplayMode={setDisplayMode} />;
//   }

//   if (displayMode === 'slideNarrative') {
//     return (
//       <SlideNarrative
//         heading={sectionName || 'Slide Title Here'}
//         slideType="Points"
//         documentID={documentID || 'doc_123'}
//         orgId={orgID}
//         authToken={authToken}
//         setDisplayMode={setDisplayMode}
//         setIsSlideLoading={() => {}}
//         outlineID={outlineId || 'abc123'}
//         setFailed={() => {}}
//       />
//     );
//   }

//   if (displayMode === 'newContent') {
//     const NewSlideVersion = window.innerWidth < 768 ? MobileNewSlideVersion : DesktopNewSlideVersion;
//     return (
//       <NewSlideVersion
//         isLoading={false}
//         subscriptionId="sub_123"
//         handleBack={handleBack}
//         setDisplayMode={setDisplayMode}
//         handleQuickGenerate={handleQuickGenerate}
//         handleCustomBuilderClick={handleCustomBuilderClick}
//         handleSlideNarrative={handleSlideNarrative}
//         userPlan="free"
//         customBuilderDisabled={false}
//         monthlyPlanAmount={9}
//         yearlyPlanAmount={90}
//         currency="USD"
//         yearlyPlanId="year_001"
//         monthlyPlanId="month_001"
//         authToken={authToken}
//         orgId={orgID}
//         backDisabled={false}
//       />
//     );
//   }

//   const SlideComponentMap: Record<string, JSX.Element> = {
//     Points: <Points heading="Points Slide" setDisplayMode={setDisplayMode} slideType="" documentID={documentID} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => {}} setFailed={() => {}} />,
//     People: <People heading="People Slide" setDisplayMode={setDisplayMode} slideType="" documentID={slideDataId} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => {}} setFailed={() => {}} />,
//     Timeline: <Phases heading="Timeline Slide" setDisplayMode={setDisplayMode} slideType="" documentID={slideDataId} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => {}} setFailed={() => {}} />,
//     Images: <Images heading="Images Slide" setDisplayMode={setDisplayMode} slideType="" documentID={slideDataId} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => {}} setFailed={() => {}} />,
//     Table: <Table heading="Table Slide" setDisplayMode={setDisplayMode} slideType="" documentID={slideDataId} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => {}} setFailed={() => {}} />,
//     Graphs: <Graphs heading="Graphs Slide" setDisplayMode={setDisplayMode} slideType="" documentID={slideDataId} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => {}} setFailed={() => {}} />,
//     Statistics: <Statistics heading="Statistics Slide" setDisplayMode={setDisplayMode} slideType="" documentID={slideDataId} orgId={orgID} authToken={authToken} outlineID={outlineId} setIsSlideLoading={() => {}} setFailed={() => {}} />,
//   };

//   if (SlideComponentMap[displayMode]) return SlideComponentMap[displayMode];

//   return (
//     <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 p-6">
//       <div className="w-full flex flex-col items-center text-center mb-6">
//         <img src={zynthtext} alt="Zynth Logo" className="h-10 mb-2" />
//         <h3 className="text-lg text-gray-700">AI Slides and Presentation</h3>
//       </div>

//       <button className="w-full py-2 bg-gray-200 text-black font-semibold rounded-md mb-4">
//         Add New Slide
//       </button>

//       <div className="w-full py-2 border-b mb-6 text-gray-500">Title</div>

//       <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl mx-auto">
//         <h2 className="text-2xl font-bold text-gray-900 text-center">Create a new slide</h2>
//         <p className="text-gray-600 mt-2 text-center">How would you like to create a new slide?</p>

//         <div className="mt-6 flex flex-col justify-center gap-3">
//           {[
//             { name: 'quick', icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435466780_points.svg' },
//             { name: 'slideNarrative', icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435399743_Presentation.svg' },
//             { name: 'customBuilder', icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435517252_images.svg' },
//           ].map((type) => (
//             <button
//               key={type.name}
//               onClick={() => setDisplayMode(type.name as DisplayMode)}
//               className="flex flex-col items-center bg-white shadow-md rounded-lg px-8 py-6 w-48 transition hover:shadow-lg border border-gray-200"
//             >
//               <img src={type.icon} alt={type.name} className="w-12 h-12 mb-3" />
//               <span className="text-gray-900 font-medium text-center">{type.name}</span>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RefinePPT;