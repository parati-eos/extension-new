import React, { useState, useRef } from 'react';
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
  const outlineid = 'abc123';
  const [displayMode, setDisplayMode] = useState<DisplayMode>('slides');

  const slidesArray = {};
  const slidesArrayRef = useRef<Record<string, any>>({});

  const handleQuickGenerate = async () => {
    setDisplayMode('newContent');
  };

  const handleCustomBuilderClick = () => {
    setDisplayMode('customBuilder');
  };

  const handleSlideNarrative = () => {
    setDisplayMode('slideNarrative');
  };

  const handleBack = () => {
    setDisplayMode('slides');
  };

  // ✅ **View for Custom Builder**
  if (displayMode === 'customBuilder') {
    return <CustomBuilderMenu onTypeClick={setDisplayMode} setDisplayMode={setDisplayMode} />;
  }

  // ✅ **View for Slide Narrative**
  if (displayMode === 'slideNarrative') {
    return (
      <SlideNarrative
        heading="Slide Title Here"
        slideType="Points"
        documentID="doc_123"
        orgId="org_abc"
        authToken="fake_token"
        setDisplayMode={setDisplayMode}
        setIsSlideLoading={() => {}}
        outlineID={outlineid}
        setFailed={() => {}}
      />
    );
  }

  // ✅ **New Slide Creation View**
  if (displayMode === 'newContent') {
    const NewSlideVersion = window.innerWidth < 768 ? MobileNewSlideVersion : DesktopNewSlideVersion;
    return (
      <NewSlideVersion
        isLoading={false}
        subscriptionId="sub_123"
        handleBack={handleBack}
        setDisplayMode={setDisplayMode}
        handleQuickGenerate={handleQuickGenerate}
        handleCustomBuilderClick={handleCustomBuilderClick}
        handleSlideNarrative={handleSlideNarrative}
        userPlan="free"
        customBuilderDisabled={false}
        monthlyPlanAmount={9}
        yearlyPlanAmount={90}
        currency="USD"
        yearlyPlanId="year_001"
        monthlyPlanId="month_001"
        authToken="fake_token"
        orgId="org_abc"
        backDisabled={false}
      />
    );
  }

  // ✅ **Handle Different Slide Types from Custom Builder**
  switch (displayMode) {
    case 'Points':
      return <Points heading="Points Slide" setDisplayMode={setDisplayMode} slideType={''} documentID={''} orgId={''} authToken={''} outlineID={''} setIsSlideLoading={function (): void {
        throw new Error('Function not implemented.');
      } } setFailed={function (): void {
        throw new Error('Function not implemented.');
      } } />;
      
    case 'People':
      return <People heading="People Slide" setDisplayMode={setDisplayMode} slideType={''} documentID={''} orgId={''} authToken={''} outlineID={''} setIsSlideLoading={function (): void {
        throw new Error('Function not implemented.');
      } } setFailed={function (): void {
        throw new Error('Function not implemented.');
      } } />;
    case 'Timeline':
      return <Phases heading="Timeline Slide" setDisplayMode={setDisplayMode} slideType={''} documentID={''} orgId={''} authToken={''} outlineID={''} setIsSlideLoading={function (): void {
        throw new Error('Function not implemented.');
      } } setFailed={function (): void {
        throw new Error('Function not implemented.');
      }
      } />;  
    case 'Images':
      return <Images heading="Images Slide" setDisplayMode={setDisplayMode} slideType={''} documentID={''} orgId={''} authToken={''} outlineID={''} setIsSlideLoading={function (): void {
        throw new Error('Function not implemented.');
      } } setFailed={function (): void {
        throw new Error('Function not implemented.');
      } } />;
    case 'Table':
      return <Table heading="Table Slide" setDisplayMode={setDisplayMode} slideType={''} documentID={''} orgId={''} authToken={''} outlineID={''} setIsSlideLoading={function (): void {
        throw new Error('Function not implemented.');
      }
      } setFailed={function (): void {
        throw new Error('Function not implemented.');
      } } />;
    case 'Graphs':
      return <Graphs heading="Graphs Slide" setDisplayMode={setDisplayMode} slideType={''} documentID={''} orgId={''} authToken={''} outlineID={''} setIsSlideLoading={function (): void {
        throw new Error('Function not implemented.');
      }
      } setFailed={function (): void {
        throw new Error('Function not implemented.');
      } } />;
    case 'Statistics':
      return <Statistics heading="Statistics Slide" setDisplayMode={setDisplayMode} slideType={''} documentID={''} orgId={''} authToken={''} outlineID={''} setIsSlideLoading={function (): void {
        throw new Error('Function not implemented.');
      }
      } setFailed={function (): void {
        throw new Error('Function not implemented.');
      } } />;
      
      
    // Add more cases for "Images", "Graphs", etc.

    default:
      break;
  }

  // ✅ **Default View: Slide Type Selection**
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 p-6">
      <div className="w-full flex flex-col items-center text-center mb-6">
        <img src={zynthtext} alt="Zynth Logo" className="h-10 mb-2" />
        <h3 className="text-lg text-gray-700">AI Slides and Presentation</h3>
      </div>

      <button className="w-full py-2 bg-gray-200 text-black font-semibold rounded-md mb-4">
        Add New Slide
      </button>

      <div className="w-full py-2 border-b mb-6 text-gray-500">Title</div>

      <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Create a new slide</h2>
        <p className="text-gray-600 mt-2 text-center">How would you like to create a new slide?</p>

        <div className="mt-6 flex flex-col justify-center gap-3">
          {[
            { name: 'quick', icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435466780_points.svg' },
            { name: 'slideNarrative', icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435399743_Presentation.svg' },
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
    </div>
  );
};

export default RefinePPT;
