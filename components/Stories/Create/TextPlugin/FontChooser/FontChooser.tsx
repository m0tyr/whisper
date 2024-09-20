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
                    scale: index === fontIndex ? '110%' : '100%'
                  }}
                  onClick={() => {
                    setSelectedTextFont(font.variable);
                    setToRenderTextFont(font.renderedFont);
                  }}
                  className="min-w-12 w-fit px-2 h-12 transition-all duration-300 rounded-lg bg-[rgb(168,168,168,.3)] whitespace-nowrap border border-[rgb(18,18,18,.65)] flex cursor-pointer text-[22px] text-center justify-center items-center"
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
    </>
  );
};

export default FontChooser;
