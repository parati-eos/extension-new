import React, { useCallback, useEffect, useRef, useState } from "react";
// ... existing imports remain the same

export default function ViewPresentation() {
  // ... keep existing state variables
  
  // Add new state to track loaded slides
  const [loadedSlides, setLoadedSlides] = useState<{ [key: string]: boolean }>({});
  const [loadingTimers, setLoadingTimers] = useState<{ [key: string]: NodeJS.Timeout }>({});
  const [slideLoadAttempts, setSlideLoadAttempts] = useState<{ [key: string]: boolean }>({});

  // Modified socket connection effect
  useEffect(() => {
    if (currentOutline !== "" && documentID !== null) {
      // Check if slides are already loaded for this section
      const sectionName = currentOutline.replace(/^\d+\.\s*/, "");
      
      if (loadedSlides[sectionName]) {
        setIsSlideLoading(false);
        return; // Skip socket connection if slides are already loaded
      }

      // Only attempt to load slides once per section
      if (slideLoadAttempts[sectionName]) {
        return;
      }

      setSlideLoadAttempts(prev => ({ ...prev, [sectionName]: true }));
      
      const socket = io(SOCKET_URL, { transports: ["websocket"] });
      console.info("Connecting to WebSocket server for section:", sectionName);

      const processSlides = (newSlides: any[]) => {
        if (newSlides.length > 0) {
          const firstSlide = newSlides[0];
          
          if (firstSlide.SectionName === sectionName) {
            if (firstSlide.PresentationID && firstSlide.GenSlideID) {
              // Valid slide data received
              const ids = newSlides.map((slide: any) => slide.GenSlideID);
              
              setTimeout(() => {
                if (!presentationID) {
                  setPresentationID(firstSlide.PresentationID);
                }
                setSlidesId(ids);
                setSlidesArray(prev => ({ ...prev, [sectionName]: ids[0] }));
                setLoadedSlides(prev => ({ ...prev, [sectionName]: true }));
                setIsSlideLoading(false);
                setIsNoGeneratedSlide(false);
                setTotalSlides(ids.length);
                
                // Clear loading timer if exists
                if (loadingTimers[sectionName]) {
                  clearTimeout(loadingTimers[sectionName]);
                }
              }, 2000);
            } else if (!loadingTimers[sectionName]) {
              // Start 90-second timer for this section
              const timer = setTimeout(() => {
                setIsSlideLoading(false);
                setIsNoGeneratedSlide(true);
                setLoadingTimers(prev => {
                  const newTimers = { ...prev };
                  delete newTimers[sectionName];
                  return newTimers;
                });
              }, 90000);
              
              setLoadingTimers(prev => ({
                ...prev,
                [sectionName]: timer
              }));
            }
          }
        }
      };

      socket.on("slidesData", processSlides);
      socket.on("error", (error) => {
        console.error("Error:", error.message);
      });

      socket.emit("fetchSlides", {
        slideType: sectionName,
        formID: documentID,
      });

      return () => {
        socket.off("slidesData", processSlides);
        socket.off("error");
        socket.disconnect();
        
        // Clear timer on cleanup
        if (loadingTimers[sectionName]) {
          clearTimeout(loadingTimers[sectionName]);
        }
      };
    }
  }, [currentOutline, documentID, loadedSlides, loadingTimers, slideLoadAttempts]);

  // Modified renderContent function
  const renderContent = ({
    displayMode,
    isMobile,
    index,
    GenSlideID
  }: {
    displayMode: string;
    isMobile: boolean;
    index?: number;
    GenSlideID: string;
  }) => {
    const sectionName = currentOutline.replace(/^\d+\.\s*/, "");
    
    if (displayMode === "slides") {
      if (loadedSlides[sectionName] && GenSlideID) {
        return (
          <iframe
            src={`https://docs.google.com/presentation/d/${presentationID}/embed?rm=minimal&start=false&loop=false&slide=id.${GenSlideID}`}
            title={`Slide ${index ? index + 1 : currentSlideIndex + 1}`}
            className="w-full h-full pointer-events-none"
            style={{ border: 0 }}
          />
        );
      }
      
      if (isNoGeneratedSlide || (loadingTimers[sectionName] && Date.now() - loadingTimers[sectionName].valueOf() > 90000)) {
        return (
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-red-500">Sorry! Slide Could Not Be Generated</h1>
          </div>
        );
      }
      
      return (
        <div className="w-full h-full flex flex-col gap-y-3 items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
          <h1>Generating Slide Please Wait...</h1>
        </div>
      );
    }
    
    // Rest of the renderContent cases remain the same
    // ... 
  };

  // Rest of the component remains the same
  return (
    // ... existing JSX
  );
}