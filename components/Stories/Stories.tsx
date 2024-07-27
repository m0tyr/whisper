"use client";
import { useEffect, useRef, useState } from "react";
import StoryRing from "./StoryRing";
import { motion } from "framer-motion";

const Stories = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [animationContainerValue, setAnimationContainerValue] = useState(0);
  const scrollStep = 180;

  // Check if hitting the left limit
  const isHittingLeftLimit = () => {
    if (containerRef.current) {
      return containerRef.current.scrollLeft <= 0;
    }
    return true;
  };

  // Check if hitting the right limit
  const isHittingRightLimit = () => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = containerRef.current;
      return scrollLeft + clientWidth >= scrollWidth;
    }
    return true;
  };


  const updateButtonVisibility = () => {
    setShowLeftButton(!isHittingLeftLimit());
    setShowRightButton(!isHittingRightLimit());
  };

  useEffect(() => {
    // Initial update of button visibility
    updateButtonVisibility();

    // Update button visibility on resize
    window.addEventListener("resize", updateButtonVisibility);
    return () => {
      window.removeEventListener("resize", updateButtonVisibility);
    };
  }, []);

  useEffect(() => {
    // Update button visibility when content is loaded
    updateButtonVisibility();
  }, [containerRef.current?.scrollWidth, containerRef.current?.clientWidth]);

  const scrollLeft = () => {
    if (containerRef.current) {
      setShowLeftButton(true)
      const newScrollLeft = containerRef.current.scrollLeft - scrollStep;
      const maxScrollLeft = 0;
      containerRef.current.scrollTo({
        left: Math.max(newScrollLeft, maxScrollLeft),
        behavior: "smooth",
      });
      if(containerRef.current?.clientWidth <= animationContainerValue + scrollStep){
        updateButtonVisibility();
        return;
      }
      setAnimationContainerValue(animationContainerValue + scrollStep);
      updateButtonVisibility();
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const newScrollLeft = containerRef.current.scrollLeft + scrollStep;
      const maxScrollLeft = containerRef.current.scrollWidth - containerRef.current.clientWidth;
      containerRef.current.scrollTo({
        left: Math.min(newScrollLeft, maxScrollLeft),
        behavior: "smooth",
      });
      if(-containerRef.current?.clientWidth >= animationContainerValue - scrollStep){
        updateButtonVisibility();
        return;
      }
      setAnimationContainerValue(animationContainerValue - scrollStep);
      updateButtonVisibility();
    }
  };

  return (
    <>
      <motion.div className="w-full h-24 mt-4 mb-3 relative overflow-hidden">
        {/* Buttons */}
        {showLeftButton && (
          <div className=" absolute left-3 z-50 h-11 w-11 bottom-3 transform -translate-y-1/2 hover:opacity-90 cursor-pointer">
            <button
              onClick={scrollLeft}
              className="absolute   top-1/2 transform -translate-y-1/2 bg-white text-white ml-1.5 px-1 py-1 rounded-full shadow-lg "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 15 15"
              >
                <path
                  fill="none"
                  stroke="black"
                  stroke-linecap="square"
                  d="m8.5 4.5l-3 3l3 3"
                />
              </svg>
            </button>
          </div>
        )}
        {showRightButton && (
          <div className=" absolute z-50 bottom-3 transform -translate-y-1/2 right-0 h-11 w-11 hover:opacity-90 cursor-pointer">
            <button
              onClick={scrollRight}
              className="absolute z-50  top-1/2 transform -translate-y-1/2 bg-white text-white mr-1.5 px-1 py-1 rounded-full shadow-lg hover:opacity-90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 15 15"
              >
                <path
                  fill="none"
                  stroke="black"
                  stroke-linecap="square"
                  d="m6.5 10.5l3-3l-3-3"
                />
              </svg>
            </button>
          </div>
        )}

        <motion.div
          ref={containerRef}
          className="flex flex-row gap-[25px] hide-scrollbar relative overflow-x-visible"
          animate={{
            x: animationContainerValue,
          }}
          style={{ scrollBehavior: "smooth" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="w-1.5"></div>
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 select-none cursor-pointer h-24 justify-center items-center"
            >
              <div className="flex relative">
                <StoryRing />
                <img
                  src="/profil.png"
                  alt="profile_icon"
                  width={56}
                  height={56}
                  className="rounded-full"
                />
              </div>
              <div className="text-[13px] max-w-[64px] text-ellipsis whitespace-nowrap overflow-hidden">
                {index % 2 === 0 ? "tesaefaefaefaft" : "configured"}
              </div>
            </div>
          ))}
          <div className="w-1.5"></div>
        </motion.div>
      </motion.div>
      <hr className="border-x-2 border-border rounded-full" />
    </>
  );
};

export default Stories;
