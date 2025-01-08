import React, { useState, useEffect } from "react";
import { FaLink } from "react-icons/fa";
import Joyride, { Step, Placement, STATUS } from "react-joyride";

const GuidedTour: React.FC = () => {
  const [run, setRun] = useState(false); 
  const [steps, setSteps] = useState<Step[]>([]);


  useEffect(() => {
    const tourSteps: Step[] = [
     
      {disableBeacon:true,
        target: "#history",
        content: (
          <div style={{ textAlign: "center" }}>
            <strong>Step 8 of 9</strong> <br />
            Access history to view or edit past presentations.
          </div>
        ),
        placement: "top" as Placement,
      },
      {disableBeacon:true,
        target: "#organization-profile",
        content: (
          <div style={{ textAlign: "center" }}>
            <strong>Step 9 of 9</strong> <br />
            Access organization profile, subscription plans, and other account details here
          </div>
        ),
        placement: "top" as Placement,
      },
    ];

    // Filter steps to include only those with valid DOM elements
    const filteredSteps = tourSteps.filter((step) => {
      return typeof step.target === "string" && document.querySelector(step.target);
    });

    setSteps(filteredSteps);
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setRun(true); // Start the tour
   
     
    }
  }, []);

const handleCallback = (data: any) => {
    const { status, action } = data;

    if (status === STATUS.FINISHED) {
      // Set localStorage only after completing the tour
      localStorage.setItem("hasVisited", "true");
      setRun(false);
    } else if (status === STATUS.SKIPPED || action === "close") {
      setRun(false); // Stop the tour if skipped or closed
    }
  };


  return (
    <div>
      {/* Joyride Component */}
      <Joyride
        steps={steps}
        continuous={true}
        scrollToFirstStep={true}
        showSkipButton={true}
        run={run}
        callback={handleCallback}
        styles={{
          options: {
            arrowColor: "#3667B2",
            backgroundColor: "#3667B2",
            overlayColor: "rgba(79, 26, 0, 0.4)",
            primaryColor: "#496999",
            textColor: "#fff",
            width: 300,
            zIndex: 1000,
          },
          buttonNext: {
            backgroundColor: "blue", // Green Next button
            color: "#fff", // White text for Next button
          },
          buttonBack: {
            color: "white", // Blue text for Back button
          },
        }}
        locale={{
          last: "Finish",
          skip: "Skip",
        }}
      />
    </div>
  );
};

export default GuidedTour;
