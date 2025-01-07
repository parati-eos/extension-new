import React, { useState } from "react";
import Joyride, { CallBackProps, Placement, STATUS } from "react-joyride";

interface GuidedTourProps {
  active: boolean; // Defining the 'active' prop
}

const GuidedTour: React.FC<GuidedTourProps> = ({ active }) => {
  // Move useState hook to the top level of the component to avoid conditional calls
  const [run, setRun] = useState(true);

  if (!active) return null; // If the tour is not active, render nothing

  const steps = [
    {
      target: "#generate-presentation", // Target the button in SelectPresentationType
      content: "Click here to generate a new presentation.",
      placement: "bottom" as Placement, // Correctly typed placement
    },
  ];

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false); // Stop the tour when finished or skipped
    }
  };

  return (
    <Joyride
      steps={steps}
      continuous={true}
      scrollToFirstStep={true}
      showSkipButton={true}
      run={run}
      callback={handleCallback}
      styles={{
        options: {
          arrowColor: "#E6A500",
          backgroundColor: "#E6A500",
          overlayColor: "rgba(79, 26, 0, 0.4)",
          primaryColor: "#002B41",
          textColor: "#fff",
          width: 300,
          zIndex: 1000,
        },
      }}
      locale={{
        last: "Finish",
        skip: "Skip",
      }}
    />
  );
};

export default GuidedTour;
