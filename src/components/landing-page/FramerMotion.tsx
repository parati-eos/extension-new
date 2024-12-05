"use client";
import React, { useState } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ThirdPage from "./ThirdPage";
import productIcon from "../../assets/image1.png";
// AnimatedButton Component
const AnimatedButton = ({ onclicked, name }: { onclicked: () => void; name: string }) => {
  return (
    <button
      onClick={onclicked}
      className="button-85 relative overflow-hidden bg-transparent hover:bg-yellow-500 text-white py-2 px-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full transition duration-300 ease-in-out transform hover:translate-y-1"
    >
      {name}
      <span className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-fuchsia-500 blur opacity-0 transition duration-300 rounded-full"></span>
      <span className="absolute inset-0 border-2 border-yellow-500 rounded-full animate-pulse"></span>
    </button>
  );
};

// HeroParallax Component
const products = [
  { title: "Product 1", link: "#", thumbnail: productIcon },
  { title: "Product 2", link: "#", thumbnail: productIcon },
  { title: "Product 3", link: "#", thumbnail: productIcon },
  { title: "Product 4", link: "#", thumbnail: productIcon },
    { title: "Product 5", link: "#", thumbnail: productIcon },
    { title: "Product 6", link: "#", thumbnail: productIcon },
    { title: "Product 7", link: "#", thumbnail: productIcon },
    { title: "Product 8", link: "#", thumbnail: productIcon },
  ];
export const HeroParallax = () => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };
  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 20]), springConfig);
 

  return (
    <div ref={ref} className="h-max pt-20 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]">
      <Header />
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
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

// Header Component
export const Header = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/auth/login");
  };

  return (
    <div>
      {/* <div className="flex flex-col md:h-[80vh] h-[70vh]">
        <div className="h-[100%]">
          <h1 className="text-5xl md:text-7xl font-bold text-white opacity-100">
            Generate Your Investor Pitch
            <br />
            <span style={{ color: "#e6a500" }}>Deck in Just 5 Minutes</span>
          </h1>
        </div>
        <div className="h-[100%]">
          <p className="max-w-2xl text-base md:text-xl mt-8 text-neutral-200 opacity-100">
            The AI-powered presentation builder for startups and entrepreneurs.
            <br />
            Create your pitch deck presentation instantly and impress investors!
          </p>
        </div>
        <div className="h-[100%]">
          <div className="z-10 absolute w-max h-max">
            <AnimatedButton onclicked={handleClick} name="Sign Up for Free" />
          </div>
        </div>
      </div> */}
      
      <ThirdPage/>
   
      <motion.h2
        className="text-2xl mt-20 md:text-4xl font-bold text-white text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
      >
       
        <span className="text-[#e6a500]">Built On Zynth</span>
      </motion.h2>
      
    </div>
  
  );
};

// ProductCard Component
export const ProductCard = ({
  product,
  translate,
}: {
  product: { title: string; link: string; thumbnail: string };
  translate: MotionValue<number>;
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
      className="group/product h-80 w-[35rem] relative flex-shrink-0 "
    >
      <a href={product.link} className="block group-hover/product:shadow-2xl">
        <img
          src={product.thumbnail}
          className="object-fill object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">{product.title}</h2>
    </motion.div>
  );
};