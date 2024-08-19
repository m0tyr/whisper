"use client";
import { useEffect, useRef, useState } from "react";
import StoryRing from "./StoryRing";
import { motion } from "framer-motion";
import { useDialog } from "@/hooks/useDialog";
import {
  DELETE_WHPR_TITLE,
  DELETE_WHPR_CONTENT,
  DELETE_WHPR_ACTION,
} from "@/constants/message";
import { useRouter } from "next/navigation";

const Stories = () => {
  const LayoutContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const StoriesContainerWidthRef = useRef<HTMLDivElement>(null);
  const [OverflowStories, setOverflowStories] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const [animationContainerValue, setAnimationContainerValue] = useState(0);
  const scrollStep = 180;
  const offset = 20; // offseting of 20 pixels accordingly to margins
  const { CreateActionDialog } = useDialog();

  const DeleteWhisper = () => {
    window.alert("deleted whisper");
  };

  useEffect(() => {
    if (StoriesContainerWidthRef.current && LayoutContainerRef.current) {
      const isEnoughToDisplayButtons = StoriesContainerWidthRef.current.clientWidth < LayoutContainerRef.current.clientWidth;
      setOverflowStories(isEnoughToDisplayButtons);
    }
  }, [animationContainerValue]);


  const scrollLeft = () => {
    if (LayoutContainerRef.current) {
      const scrollWidth = LayoutContainerRef.current.scrollWidth;
      const clientWidth = LayoutContainerRef.current.clientWidth;
      const newAnimationValue = Math.min(
        animationContainerValue + scrollStep,
        0
      );
      setAnimationContainerValue(newAnimationValue);
      setShowLeftButton(newAnimationValue < 0);
      setShowRightButton(
        newAnimationValue > -(scrollWidth - clientWidth + offset)
      );
    }
  };

  const scrollRight = () => {
    if (LayoutContainerRef.current) {
      const scrollWidth = LayoutContainerRef.current.scrollWidth;
      const clientWidth = LayoutContainerRef.current.clientWidth;
      const maxScroll = -(scrollWidth - clientWidth + offset);
      const newAnimationValue = Math.max(
        animationContainerValue - scrollStep,
        maxScroll
      );
      setAnimationContainerValue(newAnimationValue);
      setShowLeftButton(newAnimationValue < 0);
      setShowRightButton(newAnimationValue < maxScroll);
    }
  };


  useEffect(() => {
    if (LayoutContainerRef.current) {
      const scrollWidth = LayoutContainerRef.current.scrollWidth;
      const clientWidth = LayoutContainerRef.current.clientWidth;
      const maxScroll = -(scrollWidth - clientWidth + offset);
      const isAtStart = animationContainerValue === 0;
      const isAtEnd = animationContainerValue <= maxScroll;
      setShowLeftButton(!isAtStart);
      setShowRightButton(!isAtEnd);
    }
  }, [animationContainerValue]);

  return (
    <>
      <motion.div className="w-full h-24 mt-4 mb-3 relative overflow-hidden">
        {/* Buttons */}
        {showLeftButton && !OverflowStories && (
          <div className=" absolute left-3 z-50 h-11 w-11 bottom-3 transform -translate-y-1/2 cursor-pointer">
            <button
              onClick={scrollLeft}
              className="absolute   top-1/2 transform -translate-y-1/2 bg-border shadow-[0_7px_12px_0_rgba(0,0,0,0.8)] text-white ml-1.5 px-1 py-1 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 15 15"
              >
                <path
                  fill="none"
                  stroke="white"
                  strokeLinecap="square"
                  d="m8.5 4.5l-3 3l3 3"
                />
              </svg>
            </button>
          </div>
        )}
        {showRightButton && !OverflowStories && (
          <div className=" absolute z-50 bottom-3 transform -translate-y-1/2 right-0 h-11 w-11 cursor-pointer">
            <button
              onClick={scrollRight}
              className="absolute z-50  top-1/2 transform -translate-y-1/2 bg-border shadow-[0_7px_12px_0_rgba(0,0,0,0.8)] text-white mr-1.5 px-1 py-1 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 15 15"
              >
                <path
                  fill="none"
                  stroke="white"
                  strokeLinecap="square"
                  d="m6.5 10.5l3-3l-3-3"
                />
              </svg>
            </button>
          </div>
        )}

        <motion.div
          ref={LayoutContainerRef}
          className="flex flex-row gap-[25px] hide-scrollbar relative overflow-x-visible"
          animate={{ x: animationContainerValue }}
          style={{ scrollBehavior: "smooth" }}
          transition={{ type: "spring", stiffness: 300, damping: 40 }}
        >
          <div ref={StoriesContainerWidthRef} className="flex flex-row gap-[25px]">
            <div className="w-1.5"></div>
            {Array.from({ length: 13 }).map((_, index) => (
              <motion.div
                whileTap={{scale: .97}}
                onClick={() => {
                    router.prefetch("/stories")
                    router.push("/stories")
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
              </motion.div>
            ))}
            <div className="w-1.5"></div>
          </div>
        </motion.div>
      </motion.div>
      <hr className="border-x-2 border-border rounded-full" />
    </>
  );
};

export default Stories;
