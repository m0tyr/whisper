type RangeStyles = "horizontal-dark-1" | "vertical-mini-white-1";

interface RangeSelectorProps {
  rangeStyle: RangeStyles;
  rangeValue: number;
  handleRangeChange: (e: any) => void;
  minValue: number;
  maxValue: number;
}

const RangeSelector: React.FC<RangeSelectorProps> = ({
  rangeStyle,
  rangeValue,
  handleRangeChange,
  maxValue,
  minValue,
}) => {
  const percentage = ((rangeValue - minValue) / (maxValue - minValue)) * 100;

  // Set the gradient for the filled (left) and unfilled (right) parts of the slider
  const gradientStyle = {
    background: `linear-gradient(to right, #d3d3d3 ${percentage}%, #1f1f1f  ${percentage}%)`,
  };
  return (
    <>
      <div
        className={`${
          rangeStyle === "horizontal-dark-1"
            ? "absolute z-[60] top-[30%] left-0 translate-x-1/2"
            : " absolute top-[-0.2rem]"
        }`}
      >
        <div className={rangeStyle}>
          <input
            id={rangeStyle}
            type="range"
            min={minValue}
            max={maxValue}
            value={rangeValue}
            onChange={handleRangeChange}
            style={rangeStyle === "vertical-mini-white-1" ? gradientStyle : undefined}
          />
        </div>
      </div>
      {rangeStyle === "horizontal-dark-1" ? (
        <div className="absolute h-[16rem] w-[1.5rem] z-[51]  top-[30%] left-0 translate-x-1/2 ">
          <div
            style={{
              borderLeft: "14px solid transparent",
              borderRight: "14px solid transparent",
              borderTop: "250px solid rgb(200,200,200,.3)",
            }}
            className=" h-full w-full relative"
          >
            <div
              style={{
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderTop: "250px solid rgb(8,8,8,.65 )",
              }}
              className=" h-full w-full absolute top-[-249px] left-[-12px]"
            ></div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default RangeSelector;
