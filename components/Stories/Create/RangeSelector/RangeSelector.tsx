interface RangeSelectorProps {
  rangeValue: number;
  handleRangeChange: (e: any) => void;
  minValue: number;
  maxValue: number;
}

const RangeSelector: React.FC<RangeSelectorProps> = ({
  rangeValue,
  handleRangeChange,
  maxValue,
  minValue,
}) => {
  return (
    <>
      <div className="absolute z-[60] top-[30%] left-0 translate-x-1/2">
        <div className="wrapper">
          <input
            type="range"
            min={minValue}
            max={maxValue}
            value={rangeValue}
            onChange={handleRangeChange}
          />
        </div>
      </div>
      <div className="absolute h-[16rem] w-[1.5rem]  top-[30%] left-0 translate-x-1/2 ">
        <div
          style={{
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderTop: "250px solid rgb(168,168,168,.3)",
          }}
          className=" h-full w-full relative"
        >
          <div
            style={{
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderTop: "250px solid rgb(18,18,18,.65 )",
            }}
            className=" h-full w-full absolute top-[-249px] left-[-12px]"
          ></div>
        </div>
      </div>
    </>
  );
};

export default RangeSelector;
