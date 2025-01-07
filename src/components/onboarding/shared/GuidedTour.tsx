import React, { useState, useMemo } from "react";
import Joyride, { CallBackProps, Placement, STATUS, } from "react-joyride";

interface GuidedTourProps {}

const GuidedTour: React.FC<GuidedTourProps> = () => {
  const [run, setRun] = useState(false);

  const steps = useMemo(() => {
    const rawSteps = [
      {
        target: "#generate-presentation",
        content: "Click here to generate a new presentation.",
        placement: "bottom" as Placement,
      },
      {
        target: "#refine-presentation",
        content: "Alternatively, upload an existing document to convert it into a newly written and designed presentation.",
        placement: "bottom" as Placement,
      },
      {
        target: "#outline",
        content: "Add new sections to the outline to generate new slides.",
        placement: "bottom" as Placement,
      },
      {
        target: "#new-outline",
        content: "Generate a new slide version for the selected section in the outline.",
        placement: "bottom" as Placement,
      },
      {
        target: "#arrows",
        content: "Navigate between different slide versions of the same section.",
        placement: "top" as Placement,
      },
      {
        target: "#finalize",
        content: "Finalize the selected slide version to add it to the final presentation. Only one slide version can be finalized within a section.",
        placement: "top" as Placement,
      },
      {
        target: "#delete",
        content: "Delete the selected slide version from the presentation.",
        placement: "top" as Placement,
      },
      {
        target: "#share",
        content: "Share the presentation as a weblink. Only finalized slide versions are added to the final presentation link.",
        placement: "top" as Placement,
      },
      {
        target: "#export",
        content: "Export the presentation to Google Slides to make further edits. All slide versions are exported.",
        placement: "top" as Placement,
      },
      {
        target: "#history",
        content: "Access history to view or edit past presentations.",
        placement: "top" as Placement,
      },
      {
        target: "#organization-profile",
        content: "Access organization profile, subscription plans, and other account details here.",
        placement: "top" as Placement,
      },
    ];
  
    // Add step number dynamically with step indication on top
    return rawSteps.map((step, index) => ({
      ...step,
      content: (
        <div>
          <div style={{ marginBottom: "10px", fontSize: "12px", color: "black" ,fontWeight:'bold'}}>
            Step {index + 1} of {rawSteps.length}
          </div>
          <div>{step.content}</div>
        </div>
      ),
    }));
  }, []);
  

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false); // Stop the tour when finished or skipped
    }
  };

  const startTour = () => {
    setRun(true); // Start the tour
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

      {/* Start Tour Button */}
      <button
        id="start-tour-button"
        onClick={startTour}
        style={{
          position: "fixed",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 20px",
          backgroundColor: "#3667B2",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Start Tour
      </button>
    </div>
  );
};

export default GuidedTour;
