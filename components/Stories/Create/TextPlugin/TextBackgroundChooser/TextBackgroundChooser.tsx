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
        index={BackgroundTypeIndex}
        setindex={setBackgroundTypeIndex}
        containerRef={storyProperties}
        itemsCarousel={textBgTypes}
        isDisplayingTextBackgroundTypes={true}
      >
        {textBgTypes?.current?.map((bgTypeItem, index) => (
          <div
            key={index}
            className={`cursor-pointer border overflow-hidden text-[20px] font-bold tracking-tight leading-[14px] transition-all duration-300 border-white rounded-lg h-[78px] w-[78px] flex justify-center items-center`}
            style={{
              scale: index === BackgroundTypeIndex ? "115%" : "100%",
            }}
            title={bgTypeItem.name}
          >
            abc
            <br />
            def
            <br />
            ghi
          </div>
        ))}
      </ItemChooserCarousel>
    </div>
  );
};

export default TextBackground;
