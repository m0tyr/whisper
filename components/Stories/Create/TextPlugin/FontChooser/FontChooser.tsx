import ItemChooserCarousel from "@/components/ItemChooserCarousel/ItemChooserCarousel";
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
  const [fontIndex, setFontIndex] = useState(0);
  useEffect(() => {
    setToRenderTextFont(textFonts.current?.[fontIndex].renderedFont as string)
    setSelectedTextFont(textFonts.current?.[fontIndex].renderedFont as string)
  }, [fontIndex])
  return (
    <>
      <div className="absolute bottom-4 right-0 text-[13px] z-[51] w-full overflow-x-hidden">
        <ItemChooserCarousel
          index={fontIndex}
          setindex={setFontIndex}
          containerRef={storyProperties}
          itemsCarousel={textFonts}
        >
            {textFonts?.current?.map((font, index) => (
              <div className="flex flex-col gap-1">
                <motion.div
                  key={index}
                  style={{
                    fontFamily: font.variable,
                  }}
                  onClick={() => {
                    setSelectedTextFont(font.variable);
                    setToRenderTextFont(font.renderedFont);
                  }}
                  className="min-w-12 w-fit px-2 h-12  rounded-lg bg-[rgb(168,168,168,.3)] whitespace-nowrap border border-[rgb(18,18,18,.65)] flex cursor-pointer text-[22px] text-center justify-center items-center"
                  whileTap={{ scale: 0.97 }}
                  transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 20,
                  }}
                >
                  {font.name}
                </motion.div>
              </div>
            ))}
        </ItemChooserCarousel>
      </div>
   {/*    <span className=" font-semibold tracking-tighter text-[12px] absolute bottom-[-5px] z-[100] right-[calc(50%_+_2px)] transform translate-x-1/2 flex flex-row gap-[12px] justify-center items-center pb-2">
        {textFonts.current?.[fontIndex].name}
      </span> */}
    </>
  );
};

export default FontChooser;
