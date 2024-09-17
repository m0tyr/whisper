import ItemChooserCarousel from "@/components/ItemChooserCarousel/ItemChooserCarousel";
import { TextColors } from "@/lib/types/stories.types";
import { RefObject, useRef, useState } from "react";

interface ColorChooserProps {
  setColor: (color: string) => void;
  textColors: RefObject<TextColors[]>;
  storyProperties: {
    width: number;
    height: number;
  };
}

const ColorChooser: React.FC<ColorChooserProps> = ({
  setColor,
  textColors,
  storyProperties,
}) => {
  const [colorIndex, setColorIndex] = useState(0);
  const itemRef = useRef<any>()
  return (
    <div className="absolute bottom-4 right-0 text-[13px] z-[51] w-full overflow-x-hidden">
      <ItemChooserCarousel
        index={colorIndex}
        setindex={setColorIndex}
        containerRef={storyProperties}
        itemsCarousel={textColors}
        itemRef={itemRef}
      >
        <div className="flex flex-row gap-[12px] justify-center items-center p-1 ">
          {textColors?.current?.map((colorItem, index) => (
            <div
              key={index}
              ref={itemRef}
              onClick={() => setColor(colorItem.renderedColor)}
              className={`cursor-pointer border border-white rounded-lg h-12 w-12 justify-center items-center`}
              style={{ backgroundColor: colorItem.renderedColor }}
              title={colorItem.name}
            ></div>
          ))}
        </div>
      </ItemChooserCarousel>
    </div>
  );
};

export default ColorChooser;
