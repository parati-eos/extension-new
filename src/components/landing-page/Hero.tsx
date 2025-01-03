import React from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from 'framer-motion'
import PresentationGrid from './PresentationGrid'
import productIcon from '../../assets/image1.png'

// HeroParallax Component
const products = [
  {
    title: "Facebook",
    link: "https://zynth.ai/share?submissionId=Parati-1713502679562",
    thumbnail:
      "https://d2zu6flr7wd65l.cloudfront.net/uploads/Facebook+Team+5.png",
  },
  {
    title: "Delhivery",
    link: "https://zynth.ai/share?submissionId=Parati-1713430410967",
    thumbnail:
      "https://d2zu6flr7wd65l.cloudfront.net/uploads/Delhivery+Product+5.png",
  },
  {
    title: "Tesla",
    link: "https://zynth.ai/share?submissionId=Parati-1713506221153",
    thumbnail:
      "https://d2zu6flr7wd65l.cloudfront.net/uploads/Tesla+GTM+3.png",
  },
  {
     title: "Apple",
    link: "https://zynth.ai/share?submissionId=Parati-1713424380332",
    thumbnail:
      "https://d2zu6flr7wd65l.cloudfront.net/uploads/Apple+Product+6.png",
  },
  {
    title: "Nykaa",
    link: "https://zynth.ai/share?submissionId=Parati-1713426656376",
    thumbnail:
      "https://d2zu6flr7wd65l.cloudfront.net/uploads/Nykaa+business+model+4.png",
  },
  {
    title: "Duolingo",
    link: "https://zynth.ai/share?submissionId=Parati-1713521432288",
    thumbnail:
      "https://d2zu6flr7wd65l.cloudfront.net/uploads/Duolingo+Financials+Use+of+Funds.png",
  },
  {
     title: "Blinkit",
    link: "https://zynth.ai/share?submissionId=Parati-1713510136883",
    thumbnail:
      "https://d2zu6flr7wd65l.cloudfront.net/uploads/Blinkit+Track+Record.png",
  },
  {
     title: "Open AI",
    link: "https://zynth.ai/share?submissionId=Parati-1713450564562",
    thumbnail:
      "https://d2zu6flr7wd65l.cloudfront.net/uploads/Open+AI+Problem+5.png",
  },
  {
    title: "Paytm",
    link: "https://zynth.ai/share?submissionId=Parati-1713877444343",
    thumbnail:
      "https://d2zu6flr7wd65l.cloudfront.net/uploads/Paytm+Mobile+App+screenshots+3.png",
  },
  {
    title: "NVIDIA",
    link: "https://zynth.ai/share?submissionId=Parati-1713523086905",
    thumbnail:
      "https://d2zu6flr7wd65l.cloudfront.net/uploads/NVIDIA+Product+RoadMap.png",
  },
  {
   title: "DailyHunt",
    link: "https://zynth.ai/share?submissionId=Parati-1713511811562",
    thumbnail:
      "https://d2zu6flr7wd65l.cloudfront.net/uploads/DailyHunt+Solutions+4.png",
  },
  {
    title: "Cred",
    link: "https://zynth.ai/share?submissionId=Parati-1713509226838",
    thumbnail:
      "https://d2zu6flr7wd65l.cloudfront.net/uploads/Cred+About+5.png",
  },
  {
    title: "Zerodha",
    link: "https://zynth.ai/share?submissionId=Parati-1713873123080",
    thumbnail:
      "https://d2zu6flr7wd65l.cloudfront.net/uploads/Zerodha+GTM+5.png",
  },
  {
    title: "Paytm",
    link: "https://zynth.ai/share?submissionId=Parati-1713877444343",
    thumbnail:
      "https://d2zu6flr7wd65l.cloudfront.net/uploads/Paytm+Product+Architecture.png",
  },
  {
   title: "Duolingo",
    link: "https://zynth.ai/share?submissionId=Parati-1713521432288",
    thumbnail:
    "https://d2zu6flr7wd65l.cloudfront.net/uploads/Duolingo+Case+Study.png",
  },


];
export const Hero = () => {
  const firstRow = products.slice(0, 5)
  const secondRow = products.slice(5, 10)
  const ref = React.useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 }
  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  )
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  )
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  )
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  )
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  )
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 20]),
    springConfig
  )

  return (
    <div
      ref={ref}
      className="h-max overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <div className=" bg-gray-50 ">
        <motion.div
          style={{
            rotateX,
            rotateZ,
            translateY,
            opacity,
          }}
          className="div"
        >
          <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
            {firstRow.map((product) => (
              <ProductCard
                product={product}
                translate={translateX}
                key={product.title}
              />
            ))}
          </motion.div>
          <motion.div className="flex flex-row mb-20 space-x-20 ">
            {secondRow.map((product) => (
              <ProductCard
                product={product}
                translate={translateXReverse}
                key={product.title}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// Header Component
export const Header = () => {
  return (
    <div   >
      <PresentationGrid 
      
      
      />
      <div  id=
    "sample-presentation">
      <motion.h2
     
        className="text-2xl  md:text-4xl font-bold text-white text-center bg-gray-50 py-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
      >
        
        <span 
        
        
        className="text-gray-800 text-4xl  font-bold">Built On Zynth</span>
      </motion.h2>
    </div>
    </div>
  )
}

// ProductCard Component
export const ProductCard = ({
  product,
  translate,
}: {
  product: { title: string; link: string; thumbnail: string }
  translate: MotionValue<number>
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-80 w-[35rem] relative flex-shrink-0  "
    >
      <a href={product.link} className="block group-hover/product:shadow-2xl">
        <img
          src={product.thumbnail}
          className="object-fill object-left-top absolute h-full w-full inset-0 bg-white "
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  )
}
