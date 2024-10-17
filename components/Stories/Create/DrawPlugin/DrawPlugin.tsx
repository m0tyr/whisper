import { useState, useRef } from "react";
import { Stage, Layer, Line as KonvaLine } from "react-konva";
import RangeSelector from "../RangeSelector/RangeSelector";

type Line = {
  tool: string;
  points: number[];
  color: string;
  strokeWidth: number;
};

interface DrawPluginProps {
  width: number;
  height: number;
}

const DrawPlugin: React.FC<DrawPluginProps> = ({ width, height }) => {
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState<Line[]>([]);
  const [currentColor, setCurrentColor] = useState("rgb(255 255 255)");
  const [rangeValue, setRangeValue] = useState(100);
  const [isCurrentlyDrawing, setIsCurrentlyDrawing] = useState(false);
  const isDrawing = useRef(false);

  const handleMouseDown = (e: any) => {
    setIsCurrentlyDrawing(true);
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([
      ...lines,
      {
        tool,
        points: [pos.x, pos.y],
        color: currentColor,
        strokeWidth: rangeValue / 10,
      },
    ]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    setIsCurrentlyDrawing(false);
    isDrawing.current = false;
  };
  const handleRangeChange = (e: any) => {
    setRangeValue(e.target.value);
  };

  const setColor = (color: string) => {
    setCurrentColor(color);
  };

  return (
    <div
      style={{
        width: width,
        height: height,
      }}
      className="flex flex-col h-10 relative bg-border rounded-lg cursor-cell"
    >
      {!isCurrentlyDrawing && (
        <>
          <div className="w-full pt-5 px-6 h-10 z-50 bg-[linear-gradient(to_top,rgba(255,0,0,0),rgba(0,0,0,0.5))] rounded-lg absolute top-0 flex flex-row justify-between items-center">
            <div className="flex flex-row gap-1">
              <div
                onClick={() => setColor("rgb(220 38 38)")}
                className="bg-red-600 cursor-pointer border border-good-gray rounded-full h-6 w-6"
              ></div>
              <div
                onClick={() => setColor("rgb(0 0 0)")}
                className="bg-black cursor-pointer border border-good-gray rounded-full h-6 w-6"
              ></div>
              <div
                onClick={() => setColor("rgb(0 149 246)")}
                className="bg-blue cursor-pointer border border-good-gray rounded-full h-6 w-6"
              ></div>
              <div
                onClick={() => setColor("rgb(250 204 21)")}
                className="bg-yellow-400 cursor-pointer border border-good-gray rounded-full h-6 w-6"
              ></div>
              <div
                onClick={() => setColor("rgb(22 163 74)")}
                className="bg-green-600 cursor-pointer border border-good-gray rounded-full h-6 w-6"
              ></div>
              <div
                onClick={() => setColor("rgb(255 255 255)")}
                className="bg-white cursor-pointer border border-good-gray rounded-full h-6 w-6"
              ></div>
            </div>
            <div className="flex flex-row gap-2">
              <div
                className="flex justify-center items-center cursor-pointer"
                onClick={() => {
                  setTool("eraser");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 17 16"
                >
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M9.932 13.014L3.958 7.039L10.84.158c.322-.325.856-.314 1.191.022l4.762 4.759c.334.336.345.869.021 1.191l-6.882 6.884zm-.969 1.096c-1.582 1.583-5.434.3-7.102-1.368c-1.666-1.667-.52-3.087 1.063-4.67l6.039 6.038z"
                  />
                </svg>
              </div>
              <div
                className="flex justify-center items-center  cursor-pointer"
                onClick={() => {
                  setTool("pen");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                >
                  <g fill="none" fill-rule="evenodd">
                    <path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                    <path
                      fill="currentColor"
                      d="M18.293 17.293a1 1 0 0 1 1.498 1.32l-.084.094l-1.5 1.5a3.121 3.121 0 0 1-4.414 0a1.122 1.122 0 0 0-1.488-.087l-.098.087l-.5.5a1 1 0 0 1-1.497-1.32l.083-.094l.5-.5a3.121 3.121 0 0 1 4.414 0a1.122 1.122 0 0 0 1.488.087l.098-.087zm-1.81-13.31a2.5 2.5 0 0 1 3.657 3.405l-.122.131L8.443 19.094a1.5 1.5 0 0 1-.506.333l-.145.05l-2.837.807a1.001 1.001 0 0 1-1.261-1.13l.024-.107l.807-2.838a1.5 1.5 0 0 1 .28-.537l.102-.113zm2.12 1.415a.5.5 0 0 0-.637-.058l-.07.058L6.414 16.88l-.28.988l.987-.28L18.604 6.104a.5.5 0 0 0 0-.707"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <RangeSelector
            rangeStyle="horizontal-dark-1"
            rangeValue={rangeValue}
            handleRangeChange={handleRangeChange}
            minValue={5}
            maxValue={200}
          />
        </>
      )}

      <Stage
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <KonvaLine
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.tool === "eraser" ? 60 : line.strokeWidth}
              tension={0.1}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default DrawPlugin;
