import { TextColors } from "@/lib/types/stories.types";
import { RefObject } from "react";

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
    return (
        <div className="absolute bottom-4 right-0 text-[13px] h-14 z-[51] w-full overflow-x-hidden">
        <div className="flex flex-row gap-[8px] mx-3  w-full overflow-visible">
          {textColors?.current?.map((colorItem, index) => (
            <div
              key={index}
              onClick={() => setColor(colorItem.renderedColor)}
              className={`cursor-pointer border border-white rounded-lg h-12 w-12`}
              style={{ backgroundColor: colorItem.renderedColor }}
              title={colorItem.name}
            ></div>
          ))}
        </div>
      </div>
    )
};

export default ColorChooser;