import { FaBolt, FaBookOpen, FaSlidersH } from "react-icons/fa";
import { motion } from "framer-motion";
import { useIsSmallScreen } from "../../utils/useBreakPoint";


const slideOptions = [
  {
    icon: <FaBolt className="text-[#0A8568] text-xl mr-2" />,
    title: "Quick Generate",
    bullets: [
      "Create a slide with AI in a single click",
      "Instantly create polished, structured slides",
      "Best for: speed, ideation, rough drafts",
    ],
  },
  {
    icon: <FaBookOpen className="text-[#0A8568] text-xl mr-2" />,
    title: "Slide Narrative",
    bullets: [
      "Transform your idea into complete slides",
      "Drop in a few lines or a paragraph as context",
      "Best for: storytelling, clarity, structure",
    ],
  },
  {
    icon: <FaSlidersH className="text-[#0A8568] text-xl mr-2" />,
    title: "Custom Builder",
    bullets: [
      "Choose a slide type (points, tables, charts, etc.)",
      "Provide structured content input block-by-block",
      "Best for: precision, formatting, content control",
    ],
  },
];
const verticalPositionsTop = ["left-[25%]", "left-[50%]", "left-[75%]"];
const lineVariants = {
  hidden: { opacity: 0, scaleY: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scaleY: 1,
    transition: {
      duration: 1.7,
      delay: i * 0.5,
      ease: "easeOut",
    },
  }),
};

const horizontalVariants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: {
      duration: 1.5,
      delay: 1.5,
      ease: "easeOut",
    },
  },
};

export default function SlideCreationOptions() {
  const isSmall = useIsSmallScreen();
  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-[#f5fcf9] to-white py-16 px-4">
      <div className="text-center z-10 mb-1">
        <h1 className="text-4xl font-bold mb-2">Three Smart Ways to</h1>
        <h1 className="text-4xl font-bold mb-2">Create Slides</h1>
        <p className="text-gray-600 md:max-w-lg  mx-auto">
          Zynth adapts to your workflow—whether you want lightning-fast
          generation or complete creative control. Choose the method that fits
          your needs.
        </p>
      </div>

      {/* <div className="hidden sm:block"> */}
       {!isSmall &&(
        <>
        <motion.div
          className="relative w-full max-w-6xl h-6 flex justify-between items-center mt-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.div
            className="absolute left-[50%] top-1/2 w-0.5 h-10 bg-[#0A8568] transform translate-x-[-50%] "
            variants={lineVariants}
          />
        </motion.div>

        <motion.div
          className="relative w-full max-w-6xl h-6 flex justify-between items-center mb-7"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.div
            className="absolute top-1/2 left-1/4 w-[50%] h-[2px] bg-[#0A8568]s transform -translate-y-1/2 rounded-full"
            variants={horizontalVariants}
          />
          <motion.div
            className="absolute left-[25%] top-1/2 w-0.5 h-10 bg-[#0A8568]s transform -translate-x-1/2"
            variants={lineVariants}
          />
          <motion.div
            className="absolute left-[50%] top-1/2 w-0.5 h-10 bg-[#0A8568]s transform -translate-x-1/2"
            variants={lineVariants}
          />
          <motion.div
            className="absolute left-[75%] top-1/2 w-0.5 h-10 bg-[#0A8568]s transform -translate-x-1/2"
            variants={lineVariants}
          />
        </motion.div>
        </>
       )
      }
    
      {/* </div> */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-6 mt-10 sm:mt-0">
        {slideOptions.map((option, idx) => (
          <div
            key={idx}
            className="flex-1 bg-white border border-gray-500 rounded-md p-6 shadow-md"
          >
            <div className="flex items-center mb-3">
              {option.icon}
              <h3 className="text-lg font-semibold text-[#0A8568]">
                {option.title}
              </h3>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {option.bullets.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* <div className="hidden sm:block mt-6 sm:mt-0"> */}
       {!isSmall &&(
        <>
        <motion.div
          className="relative w-full max-w-6xl h-6 flex justify-between items-center mb-4 mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          {/* {verticalPositionsTop.map((posClass, idx) => (
  <motion.div
    key={idx}
    className={`absolute ${posClass} bottom-1/2 w-0.5 h-11 bg-gray-500 transform translate-x-[-50%]`}
    variants={lineVariants}
  />
))} */}
          <motion.div
            className="absolute left-[25%] bottom-1/2 w-0.5 h-11 bg-[#0A8568] transform -translate-x-1/2"
            variants={lineVariants}
          />
          <motion.div
            className="absolute left-[50%] bottom-1/2 w-0.5 h-11 bg-[#0A8568] transform -translate-x-1/2"
            variants={lineVariants}
          />
          <motion.div
            className="absolute left-[75%] bottom-1/2 w-0.5 h-11 bg-[#0A8568] transform -translate-x-1/2"
            variants={lineVariants}
          />

          <motion.div
            className="absolute bottom-2/5 left-1/4 w-[50%] h-[2px] bg-[#0A8568] transform translate-y-1/2 rounded-full"
            variants={horizontalVariants}
          />
          <motion.div
            className="absolute left-[50%] top-1/2 w-0.5 h-10 bg-[#0A8568] transform -translate-x-1/2"
            variants={lineVariants}
          />
        </motion.div>
        </>
       )
      }

      {/* </div> */}

      <div className="relative z-10 px-6 py-4 mt-5 sm:mt-0 border border-gray-500 text-center rounded-md max-w-3xl mx-auto bg-white shadow-sm text-gray-800 text-sm">
        This flexibility makes Zynth the most powerful AI presentation tool and
        online PPT maker available.
        <br />
        Designed for founders, operators, and teams that need beautiful results
        without wasting time.
      </div>
    </div>
  );
}
