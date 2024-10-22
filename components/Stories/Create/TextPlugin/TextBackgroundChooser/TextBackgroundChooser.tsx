import ItemChooserCarousel from "@/components/ItemChooserCarousel/ItemChooserCarousel";
import { TextBgTypes } from "@/lib/types/stories.types";
import { RefObject, useEffect, useState } from "react";

interface TextBackgroundProps {
  backgroundSavedIndex: number | null;
  setToRenderTextBackground: (bgType: string) => void;
  textBgTypes: RefObject<TextBgTypes[]>;
  storyProperties: {
    width: number;
    height: number;
  };
}

const TextBackground: React.FC<TextBackgroundProps> = ({
  backgroundSavedIndex,
  setToRenderTextBackground,
  textBgTypes,
  storyProperties,
}) => {
  const [BackgroundTypeIndex, setBackgroundTypeIndex] = useState(
    backgroundSavedIndex as number
  );

  useEffect(() => {
    setToRenderTextBackground(
      textBgTypes?.current?.[BackgroundTypeIndex]
        .renderedBackgroundType as string
    );
  }, [BackgroundTypeIndex]);

  return (
    <div className="absolute bottom-4 right-0 text-[13px] z-[51] w-full overflow-hidden">
      <ItemChooserCarousel
        desiredSize={96}
        index={BackgroundTypeIndex}
        setindex={setBackgroundTypeIndex}
        containerRef={storyProperties}
        itemsCarousel={textBgTypes}
        isDisplayingTextBackgroundTypes={true}
      >
        {textBgTypes?.current?.map((bgTypeItem, index) => (
          <div className="relative">
            <div
              key={index}
              className={`cursor-pointer text-center border overflow-hidden text-[17.5px] font-bold tracking-tight leading-[18px] transition-all duration-300 border-white/20 rounded-lg h-[78px] w-[86px] flex justify-center items-center`}
              style={{
                scale: index === BackgroundTypeIndex ? "115%" : "100%",
              }}
              title={bgTypeItem.name}
            >
              ab
              <br />
              cdefghik
              <br />
              lmn
            </div>
            <svg className="h-full w-full z-[-50] absolute top-2 left-0 overflow-visible">
              <path
                fill="black"
                fillOpacity={1}
                d={bgTypeItem.previewRender}
              ></path>
            </svg>
          </div>
        ))}
      </ItemChooserCarousel>
    </div>
  );
};

export default TextBackground;
