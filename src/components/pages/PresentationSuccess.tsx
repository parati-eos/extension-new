import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PresentationSuccess = () => {
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("Generating presentation...");
  const [pollingStarted, setPollingStarted] = useState(false);

  useEffect(() => {
    let localProgress = 0;

    const progressInterval = setInterval(() => {
      localProgress += 10;

      if (localProgress >= 100) {
        localProgress = 100;
        clearInterval(progressInterval);
      }

      setProgress(localProgress);

      // Start polling once progress hits 50%, only once
      if (localProgress >= 50 && !pollingStarted) {
        setPollingStarted(true);

        const pollInterval = setInterval(async () => {
          try {
            const res = await axios.post("https://d2bwumaosaqsqc.cloudfront.net/api/v1/data/slidedisplay/check-slide", {
              formId: localStorage.getItem("form_id"), // or get from context/props if preferred
            });

            if (res.data?.message === "Slide found") {
              setProgress(100);
              setStatusMsg("🎉 Presentation Generated!");
              clearInterval(pollInterval);
              clearInterval(progressInterval);
            }
          } catch (err) {
            // Silent retry
            console.log("Polling failed, retrying...");
          }
        }, 10000);
      }
    }, 10000); // Increment progress every 10s

    return () => {
      clearInterval(progressInterval);
    };
  }, [pollingStarted]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        {statusMsg}
      </h1>
      <p className="text-gray-700 mb-6 text-center">
        Slides are on the way! Please wait while we finish generating your presentation.
      </p>
      <div className="w-full max-w-xl h-4 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-green-500 transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-gray-600">{progress}%</p>
    </div>
  );
};

export default PresentationSuccess;
