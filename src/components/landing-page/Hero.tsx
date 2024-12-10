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
  { title: 'Product 1', link: '#', thumbnail: productIcon },
  { title: 'Product 2', link: '#', thumbnail: productIcon },
  { title: 'Product 3', link: '#', thumbnail: productIcon },
  { title: 'Product 4', link: '#', thumbnail: productIcon },
  { title: 'Product 5', link: '#', thumbnail: productIcon },
  { title: 'Product 6', link: '#', thumbnail: productIcon },
  { title: 'Product 7', link: '#', thumbnail: productIcon },
  { title: 'Product 8', link: '#', thumbnail: productIcon },
]
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
    <div>
      <PresentationGrid />
      <motion.h2
        className="text-2xl  md:text-4xl font-bold text-white text-center bg-gray-50 py-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
      >
        <span className="text-gray-800 text-4xl font-bold">Built On Zynth</span>
      </motion.h2>
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
