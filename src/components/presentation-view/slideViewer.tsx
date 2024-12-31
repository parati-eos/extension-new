import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./viewpresentation.css"; // CSS file provided for styling

const SlideViewer = ({
  outlines,
  currentOutline,
  documentID,
}: {
  outlines: { title: string }[];
  currentOutline: string;
  documentID: string;
}) => {
  const SOCKET_URL = "your_socket_server_url";
  const [slidesState, setSlidesState] = useState<{ [key: number]: any }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.info("Connected to WebSocket server", socket.id);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error.message);
    });

    socket.on("slideData", ({ slideIndex, slideContent }: any) => {
      setSlidesState((prevState) => ({
        ...prevState,
        [slideIndex]: slideContent,
      }));
      setIsLoading(false);
    });

    return () => {
      console.info("Disconnecting from WebSocket server...");
      socket.disconnect();
    };
  }, []);

  const fetchSlide = (slideIndex: number) => {
    if (!slidesState[slideIndex]) {
      setIsLoading(true);
      setIsError(false);

      socketRef.current.emit("fetchSlide", {
        slideIndex,
        outline: currentOutline,
        documentID,
      });
    }
  };

  const renderSlide = (slideIndex: number) => {
    const slideData = slidesState[slideIndex];

    if (slideData) {
      return (
        <iframe
          src={`https://docs.google.com/presentation/d/${slideData.presentationID}/embed?rm=minimal&start=false&loop=false&slide=id.${slideData.genSlideID}`}
          title={`Slide ${slideIndex + 1}`}
          className="w-full h-full pointer-events-none transition-opacity duration-500 opacity-100"
          style={{ border: 0 }}
        />
      );
    } else if (isLoading) {
      return (
        <div className="w-full h-full flex flex-col gap-y-3 items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
          <h1>Loading Slide {slideIndex + 1}...</h1>
        </div>
      );
    } else if (isError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="text-red-500">Failed to load Slide {slideIndex + 1}</h1>
        </div>
      );
    } else {
      fetchSlide(slideIndex);
      return null;
    }
  };

  return (
    <div className="flex-1">
      <div
        className="no-scrollbar rounded-sm shadow-lg relative w-[90%] bg-white border border-gray-200 mb-2 ml-12 overflow-y-scroll snap-y scroll-smooth snap-mandatory"
        style={{ height: "calc(100vh - 200px)" }}
      >
        {outlines.map((outline, index) => (
          <div
            key={outline.title}
            className="snap-center scroll-smooth w-full h-full mb-4"
          >
            {renderSlide(index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlideViewer;
