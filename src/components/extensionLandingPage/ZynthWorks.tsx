import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export type Slide = {
  imageUrl: string;
  dotPosition: {
    top: string;
    left: string;
  };
  caption?: string;
  show?: boolean;
};

type YouTubeSliderProps = {
  slides: Slide[];
  bgColor: string;
};

export default function ZynthWorks({ slides, bgColor }: YouTubeSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const current = slides[currentIndex];

  return (
    <div
      className={`rounded-2xl shadow-lg overflow-hidden border border-blue-200 ${bgColor} text-white  space-y-6 flex flex-col  w-full h-full`}
    >
      <div className="relative  rounded-lg overflow-hidden">
        <img
          src={current.imageUrl}
          alt="Slide"
          className="w-full h-[22rem] md:h-[30rem] object-cover"
        />

        {/* Blinking Dot */}
        {current.show !== false && (
          <div
            className="absolute w-3.5 h-3.5 bg-purple-600 rounded-full animate-ping"
            style={{
              top: current.dotPosition.top,
              left: current.dotPosition.left,
            }}
            title="Click here"
          />
        )}

        <button
          title="prevSlide"
          onClick={prevSlide}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-[#1549B7] p-2 rounded-full shadow hover:bg-gray-100 z-10"
        >
          <FaChevronLeft />
        </button>
        <button
          title="nextSlide"
          onClick={nextSlide}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-[#1549B7] p-2 rounded-full shadow hover:bg-gray-100 z-10"
        >
          <FaChevronRight />
        </button>
      </div>
      {/* <p className="text-center text-sm text-white mb-4">{current.caption}</p> */}
    </div>
  );
}
