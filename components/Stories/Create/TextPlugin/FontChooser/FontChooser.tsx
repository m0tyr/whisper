import { TextFonts } from "@/lib/types/stories.types";
import { motion } from "framer-motion";
import { RefObject, useEffect, useRef, useState } from "react";

interface FontChooserProps {
  setSelectedTextFont: (font: string) => void;
  setToRenderTextFont: (font: string) => void;
  textFonts: RefObject<TextFonts[]>;
  storyProperties: {
    width: number;
    height: number;
  };
}

const FontChooser: React.FC<FontChooserProps> = ({
  setSelectedTextFont,
  setToRenderTextFont,
  textFonts,
  storyProperties,
}) => {
  const LayoutContainerRef = useRef<HTMLDivElement>(null);
  const [OverflowStories, setOverflowStories] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const [animationContainerValue, setAnimationContainerValue] = useState(
    storyProperties.width / 2 - 30
  );
  const [fontIndex, setFontIndex] = useState(0);
  const [scrollValue, setScrollValue] = useState(0);
  const step = 60;

  useEffect(() => {
    if (LayoutContainerRef.current && textFonts.current) {
      const isEnoughToDisplayButtons =
        storyProperties.width / 2.13337 >
        LayoutContainerRef.current.clientWidth;
      setOverflowStories(isEnoughToDisplayButtons);
      console.log(fontIndex);
      setShowLeftButton(fontIndex > 0);
      setShowRightButton(fontIndex < textFonts?.current?.length - 1);
    }
  }, [animationContainerValue]);

  const scrollLeft = () => {
    if (LayoutContainerRef.current && textFonts.current) {
      setFontIndex(fontIndex - 1);
      setScrollValue(scrollValue + step);
      setAnimationContainerValue(animationContainerValue + step);
      setShowLeftButton(fontIndex > 0);
      setShowRightButton(fontIndex <= textFonts?.current?.length);
    }
  };

  const scrollRight = () => {
    if (LayoutContainerRef.current && textFonts.current) {
      setFontIndex(fontIndex + 1);
      setScrollValue(scrollValue - step);
      setAnimationContainerValue(animationContainerValue - step);
      setShowLeftButton(fontIndex > 0);
      setShowRightButton(fontIndex <= textFonts?.current?.length);
    }
  };
  useEffect(() => {
    if (LayoutContainerRef.current && textFonts.current) {
      setAnimationContainerValue(storyProperties.width / 2 - 30 + scrollValue);
      setShowLeftButton(fontIndex > 0);
      setShowRightButton(fontIndex <= textFonts?.current?.length);
    }
  }, [storyProperties]);

  return (
    <div className="absolute bottom-4 right-0 text-[13px] z-[51] w-full overflow-x-hidden">
      {showLeftButton && !OverflowStories && (
        <div className="absolute z-50 left-0 h-14 w-9 cursor-pointer">
          <button
            onClick={scrollLeft}
            className="absolute   top-1/2 transform -translate-y-1/2 bg-border shadow-[0_7px_12px_0_rgba(0,0,0,0.3)] text-white ml-1.5 px-1 py-1 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
        <div className="absolute z-50 right-0 h-14 w-9 cursor-pointer">
          <button
            onClick={scrollRight}
            className="absolute z-50  top-1/2 transform -translate-y-1/2 bg-border shadow-[0_7px_12px_0_rgba(0,0,0,0.3)] text-white mr-1.5 px-1 py-1 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
      <div className="z-[49] absolute w-full h-14 bg-[linear-gradient(90deg,_rgba(27,27,27,1)_0%,_rgba(255,255,255,0)_50%,_rgba(27,27,27,1)_100%);]"></div>
      <motion.div
        ref={LayoutContainerRef}
        animate={{ x: animationContainerValue }}
        style={{ x: storyProperties.width / 2, scrollBehavior: "smooth" }}
        transition={{
            type: "tween",  
            duration: 0.2,  
            ease: [0.4, 0, 0.2, 1] 
          }}
        className="flex flex-row items-end gap-[10px] hide-scrollbar overflow-visible h-14 w-full "
      >
        <div className="flex flex-row gap-[12px] justify-center items-center p-1 ">
          {textFonts?.current?.map((font, index) => (
            <motion.div
              key={index}
              style={{
                fontFamily: font.variable,
              }}
              onClick={() => {
                setSelectedTextFont(font.variable);
                setToRenderTextFont(font.renderedFont);
              }}
              className="min-w-12 w-12 h-12 rounded-lg bg-[rgb(168,168,168,.3)] border border-[rgb(18,18,18,.65)] flex cursor-pointer text-[22px] text-center justify-center items-center"
              whileTap={{ scale: 0.97 }}
              transition={{
                type: "spring",
                stiffness: 700,
                damping: 20,
              }}
            >
              Aa
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FontChooser;
