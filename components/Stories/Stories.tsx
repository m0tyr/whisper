"use client";
import { useEffect, useRef, useState } from "react";
import StoryRing from "./StoryRing";
import { motion } from "framer-motion";
import { useDialog } from "@/hooks/useDialog";
import { DELETE_WHPR_TITLE, DELETE_WHPR_CONTENT, DELETE_WHPR_ACTION } from "@/constants/message";

const Stories = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [animationContainerValue, setAnimationContainerValue] = useState(0);
  const scrollStep = 180;
  const { CreateActionDialog } = useDialog()
  const DeleteWhisper = () => {
    window.alert("deleted whisper")
}

  const scrollLeft = () => {
    if (containerRef.current) {
      const diff =
        containerRef.current?.clientWidth -
        (animationContainerValue + scrollStep);
      setShowRightButton(true);
      console.log(diff);
      if (diff <= containerRef.current.clientWidth) {
        setAnimationContainerValue(0);
        console.log(animationContainerValue)
        console.log("test");
        setShowLeftButton(false);
        return;
      }

      if (
        -containerRef.current?.clientWidth >=
        animationContainerValue + scrollStep
      ) {
        setShowLeftButton(true);
        return;
      }
      setAnimationContainerValue(animationContainerValue + scrollStep);
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const diff =
        -containerRef.current?.clientWidth -
        (animationContainerValue - scrollStep);
      setShowLeftButton(true);
      console.log(diff);
      if (diff >= -100) {
        setAnimationContainerValue(containerRef.current.clientWidth);
        console.log("test");
        setShowRightButton(false);
        return;
      }

      if (
        -containerRef.current?.clientWidth >=
        animationContainerValue - scrollStep
      ) {
        setShowRightButton(true);
        return;
      }
      setAnimationContainerValue(animationContainerValue - scrollStep);
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
          {Array.from({ length: 8 }).map((_, index) => (
            <div
            onClick={
              () => {
                  CreateActionDialog(
                      DELETE_WHPR_TITLE,
                      DELETE_WHPR_CONTENT,
                      DELETE_WHPR_ACTION,
                      DeleteWhisper
                  )
              }}
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
