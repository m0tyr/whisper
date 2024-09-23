import ItemChooserCarousel from "@/components/ItemChooserCarousel/ItemChooserCarousel";
import { TextColors } from "@/lib/types/stories.types";
import { RefObject, useEffect, useRef, useState } from "react";

interface ColorChooserProps {
  colorSavedIndex: number | null;
  setColor: (color: string) => void;
  textColors: RefObject<TextColors[]>;
  storyProperties: {
    width: number;
    height: number;
  };
}

const ColorChooser: React.FC<ColorChooserProps> = ({
  colorSavedIndex,
  setColor,
  textColors,
  storyProperties,
}) => {
  const [colorIndex, setColorIndex] = useState(colorSavedIndex as number);
  
  useEffect(() => {
    setColor(textColors?.current?.[colorIndex].renderedColor as string)
  }, [colorIndex])

  return (
    <div className="absolute bottom-4 right-0 text-[13px] z-[51] w-full overflow-x-hidden">
      <ItemChooserCarousel
        index={colorIndex}
        setindex={setColorIndex}
        containerRef={storyProperties}
        itemsCarousel={textColors}
      >
        {textColors?.current?.map((colorItem, index) => (
          <div
            key={index}
            className={`cursor-pointer border transition-all duration-300 border-white rounded-lg h-12 w-12 justify-center items-center`}
            style={{ backgroundColor: colorItem.renderedColor, scale: index === colorIndex ? '115%' : '100%' }}
            title={colorItem.name}
          ></div>
        ))}
      </ItemChooserCarousel>
    </div>
  );
};

export default ColorChooser;
