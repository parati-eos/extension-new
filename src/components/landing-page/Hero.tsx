import React from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from 'framer-motion'
import PresentationGrid from './PresentationGrid'

// HeroParallax Component
const products = [
  {
    title: 'Ola Electric',
    link: 'https://zynth.ai/presentation-share?formId=Document-1736753397973',
    thumbnail:
      'https://d2zu6flr7wd65l.cloudfront.net/uploads/1738073641839_ola.png',
  },
  {
    title: 'Whatfix',
    link: 'https://zynth.ai/presentation-share?formId=Document-1736757094125',
    thumbnail:
      'https://d2zu6flr7wd65l.cloudfront.net/uploads/1738073837415_whatfix.png',
  },
  {
    title: 'Zomato',
    link: 'https://zynth.ai/presentation-share?formId=Document-1736761113709',
    thumbnail: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1738073881562_zomato.png',
  },
  {
    title: 'Razorpay',
    link: 'https://zynth.ai/presentation-share?formId=Document-1736763499534',
    thumbnail:
      'https://d2zu6flr7wd65l.cloudfront.net/uploads/1738073931871_razorpay.png',
  },
  {
    title: 'Cult.fit',
    link: 'https://zynth.ai/presentation-share?formId=Document-1736831397485',
    thumbnail:
      'https://d2zu6flr7wd65l.cloudfront.net/uploads/1738073971986_cult.fit.png',
  },
  {
    title: 'GoMechanic',
    link: 'https://zynth.ai/presentation-share?formId=Document-1736851283267',
    thumbnail:
      'https://d2zu6flr7wd65l.cloudfront.net/uploads/1738074058408_gomechanic.png',
  },
  {
    title: 'Licious',
    link: 'https://zynth.ai/presentation-share?formId=Document-1736919070264',
    thumbnail:
      'https://d2zu6flr7wd65l.cloudfront.net/uploads/1738074097043_licious.png',
  },
  {
    title: 'Digit Insurance ',
    link: 'https://zynth.ai/presentation-share?formId=Document-1737625933129',
    thumbnail:
      'https://d2zu6flr7wd65l.cloudfront.net/uploads/1738074136376_digit.png',
  },
  {
    title: 'MyGlamm ',
    link: 'https://zynth.ai/presentation-share?formId=Document-1737696537896',
    thumbnail:
      'https://d2zu6flr7wd65l.cloudfront.net/uploads/1738074167423_MyGlamm.png',
  },
  {
    title: 'Urban Company ',
    link: 'https://zynth.ai/presentation-share?formId=Document-1737706157139',
    thumbnail:
      'https://d2zu6flr7wd65l.cloudfront.net/uploads/1738074497622_image.png',
  },
  {
    title: 'EcoKadai',
    link: 'https://zynth.ai/presentation-share?formId=Document-1737710890505',
    thumbnail:
      'https://d2zu6flr7wd65l.cloudfront.net/uploads/1738074267645_Ecokadai.png',
  },
  {
    title: 'Paytm',
    link: 'https://zynth.ai/presentation-share?formId=Document-1737958705672',
    thumbnail: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1738074303714_paytm.png',
  },
  {
    title: 'Namo ewaste',
    link: 'https://zynth.ai/presentation-share?formId=Document-1737722102025',
    thumbnail:
      'https://d2zu6flr7wd65l.cloudfront.net/uploads/1738074320178_e-namo.png',
  },
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

      <section id="sample-presentation" className=" bg-gray-50 ">
        <motion.div
          style={{
            rotateX,
            rotateZ,
            translateY,
            opacity,
          }}
          className="section"
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
      </section>
    </div>
  )
}

// Header Component
export const Header = () => {
  return (
    <div>
      <PresentationGrid />
      <div id="sample-presentations">
        <motion.h2
          className="text-2xl  md:text-4xl font-bold text-white text-center bg-gray-50 py-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
        >
          <span className="text-gray-800 text-4xl  font-bold">
            Built On Zynth
          </span>
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
    <div>
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
    </div>
  )
}
