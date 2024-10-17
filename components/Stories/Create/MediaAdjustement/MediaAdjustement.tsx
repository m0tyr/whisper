import { Modal } from "@/components/Modal/Modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import RangeSelector from "../RangeSelector/RangeSelector";
import { StoryMediaData } from "@/lib/types/stories.types";

interface MediaAdjustementProps {
  StoryMediaUrl: string;
  StoryMediaData: StoryMediaData;
  setStoryMediaData: (data: StoryMediaData) => void;
  storyProperties: any;
  clearMediaImport: () => void;
  AddMediaToStory: (value: StoryMediaData) => void;
}

const MediaAdjustement = ({
  StoryMediaUrl,
  StoryMediaData,
  setStoryMediaData,
  storyProperties,
  clearMediaImport,
  AddMediaToStory,
}: MediaAdjustementProps) => {
  const mediaSelectionZone = useRef<HTMLDivElement | null>(null);

  const [finalStoryMediaDataForKonvaImg, setFinalStoryMediaDataForKonvaImg] =
    useState(StoryMediaData);

  useEffect(() => {
    const originalWidth = StoryMediaData.width;
    const originalHeight = StoryMediaData.height;

    const scaleX = storyProperties.width / originalWidth;
    const scaleY = storyProperties.height / originalHeight;
    const scale = Math.max(scaleX, scaleY);

    let newWidth = originalWidth * scale;
    let newHeight = originalHeight * scale;

    const x = (storyProperties.width - newWidth) / 2;
    const y = (storyProperties.height - newHeight) / 2;

    // Update StoryMediaData with new values
    setStoryMediaData({
      mediaImg: StoryMediaData.mediaImg,
      width: newWidth,
      height: newHeight,
      x: x,
      y: y,
    });

    // Cleanup function to run on unmount
    return () => {
      // Perform any cleanup if necessary here
      console.log("Component unmounted, effect deactivated.");
    };
  }, [storyProperties]);

  const [dragRange, setDragRange] = useState<[number, number]>([0, 500]);
  useEffect(() => {
    if (StoryMediaData?.width) {
      const newDragRange: [number, number] = [
        -(finalStoryMediaDataForKonvaImg.width - storyProperties.width) / 2,
        (finalStoryMediaDataForKonvaImg.width - storyProperties.width) / 2,
      ];
      setDragRange(newDragRange);
    } else {
      setDragRange([0, 500]); // Default fallback range
    }
  }, [finalStoryMediaDataForKonvaImg?.width, storyProperties.width]);

  const [rangeValue, setRangeValue] = useState(0);

  const recordMediaCoord = () => {
    if (mediaSelectionZone.current) {
      const style = window.getComputedStyle(mediaSelectionZone.current);
      const transform = style.transform;
      let translateX = 0;
      if (transform !== "none") {
        const matrix = new DOMMatrix(transform);
        translateX = matrix.m41;
      }
      const x = translateX;

      setFinalStoryMediaDataForKonvaImg((prevData) => ({
        ...prevData,
        x: -x,
      }));
    }
  };
  const handleAddMediaToStory = () => {
    const finalData = {
      ...StoryMediaData,
      x: finalStoryMediaDataForKonvaImg.x,
    };
    AddMediaToStory(finalData);
  };

  useEffect(() => {
    const scaleFactor = 1 + rangeValue / 100; // Scale from 0.0 (min) to 2.0 (max)

    setFinalStoryMediaDataForKonvaImg((prevData) => {
      const newWidth = Math.max(10, StoryMediaData.width * scaleFactor); // Prevent zero/negative width
      const newHeight = Math.max(10, StoryMediaData.height * scaleFactor); // Prevent zero/negative height

      return {
        ...prevData,
        width: newWidth,
        height: newHeight,
      };
    });
  }, [rangeValue]);

  const handleRangeChange = (e: { target: { value: any } }) => {
    const newValue = Number(e.target.value);
    setRangeValue(newValue);
    console.log("Range Value Changed:", newValue); // Debugging line
  };

  const resizeToFitToStory = () => {
    const { width: storyWidth, height: storyHeight } = storyProperties;
    const { width: mediaWidth, height: mediaHeight } = StoryMediaData;

    const storyAspectRatio = storyWidth / storyHeight;
    const mediaAspectRatio = mediaWidth / mediaHeight;

    let newWidth, newHeight;

    if (mediaAspectRatio > storyAspectRatio) {
      newWidth = storyWidth;
      newHeight = storyWidth / mediaAspectRatio;
    } else {
      newHeight = storyHeight;
      newWidth = storyHeight * mediaAspectRatio;
    }

    setFinalStoryMediaDataForKonvaImg({
      ...finalStoryMediaDataForKonvaImg,
      width: newWidth,
      height: newHeight,
    });
  };
  const resizeToOriginal = () => {
    setFinalStoryMediaDataForKonvaImg({
      ...finalStoryMediaDataForKonvaImg,
      width: StoryMediaData.width,
      height: StoryMediaData.height,
    });
  };
  const resizeToFitToTwoToThree = () => {
    const { width: mediaWidth, height: mediaHeight } = StoryMediaData;

    const targetAspectRatio = 2 / 3;

    const mediaAspectRatio = mediaWidth / mediaHeight;

    let newWidth, newHeight;

    if (mediaAspectRatio > targetAspectRatio) {
      newWidth = mediaHeight * targetAspectRatio;
      newHeight = mediaHeight;
    } else {
      newHeight = mediaWidth / targetAspectRatio;
      newWidth = mediaWidth;
    }

    setFinalStoryMediaDataForKonvaImg({
      ...finalStoryMediaDataForKonvaImg,
      width: newWidth,
      height: newHeight,
    });
  };
  return (
    <>
      <div
        style={{
          width: storyProperties.width,
          height: storyProperties.height,
        }}
        className=" flex relative bg-transparent rounded-lg w-full "
      >
        <>
          <motion.div
            className="cursor-grab active:cursor-grabbing absolute top-0 flex z-40 flex-row w-full h-full justify-between"
            drag={"x"}
            dragConstraints={{
              left: dragRange[0],
              right: dragRange[1],
            }}
            dragElastic={0}
            dragMomentum={false}
            dragTransition={{
              bounceStiffness: 0,
              bounceDamping: 0,
            }}
            onDragEnd={recordMediaCoord}
            ref={mediaSelectionZone}
            style={{ width: `${storyProperties.width}px` }}
          >
            <div className="border-2 rounded-sm border-[rgba(255,255,255,.3)] w-full h-full">
              <div
                style={{
                  position: "absolute",
                  height: "100%",
                  left: "33%",
                  top: "0%",
                  width: "1px",
                  backgroundColor: "rgba(255,255,255,.3)",
                  boxShadow: "0 0 4px 0 rgba(0,0,0,.5)",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  height: "100%",
                  right: "33%",
                  top: "0%",
                  width: "1px",
                  backgroundColor: "rgba(255,255,255,.3)",
                  boxShadow: "0 0 4px 0 rgba(0,0,0,.5)",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  height: "1px",
                  left: "0%",
                  top: "33%",
                  width: "100%",
                  backgroundColor: "rgba(255,255,255,.3)",
                  boxShadow: "0 0 4px 0 rgba(0,0,0,.5)",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  bottom: "33%",
                  height: "1px",
                  left: "0%",
                  width: "100%",
                  backgroundColor: "rgba(255,255,255,.3)",
                  boxShadow: "0 0 4px 0 rgba(0,0,0,.5)",
                }}
              ></div>
            </div>
            <div className="absolute top-0 left-[-60px] p-3 flex flex-col gap-2 z-50">
              <motion.div
                whileTap={{ backgroundColor: "rgb(40,40,40)" }}
                onClick={clearMediaImport}
                className=" cursor-pointer w-10 h-10 rounded-full bg-good-gray/70 backdrop-blur-xl flex justify-center items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="currentColor"
                    d="M7.293 8L3.146 3.854a.5.5 0 1 1 .708-.708L8 7.293l4.146-4.147a.5.5 0 0 1 .708.708L8.707 8l4.147 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708z"
                  />
                </svg>
              </motion.div>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className=" select-none cursor-pointer border-none outline-none">
                  <motion.div
                    whileTap={{ backgroundColor: "rgb(40,40,40)" }}
                    className=" cursor-pointer w-10 h-10 rounded-full border-none outline-none bg-good-gray/70 backdrop-blur-xl flex justify-center items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      className="border-none outline-none "
                    >
                      <path
                        fill="currentColor"
                        d="M5 2a3 3 0 0 0-3 3v3.5a.5.5 0 0 0 1 0V5a2 2 0 0 1 2-2h3.5a.5.5 0 0 0 0-1H5Zm6.5 0a.5.5 0 0 0 0 1H15a2 2 0 0 1 2 2v3.5a.5.5 0 0 0 1 0V5a3 3 0 0 0-3-3h-3.5Zm-9 9a.5.5 0 0 1 .5.5V15a2 2 0 0 0 2 2h3.5a.5.5 0 0 1 0 1H5a3 3 0 0 1-3-3v-3.5a.5.5 0 0 1 .5-.5Zm15.5.5a.5.5 0 0 0-1 0V15a2 2 0 0 1-2 2h-3.5a.5.5 0 0 0 0 1H15a3 3 0 0 0 3-3v-3.5Z"
                      />
                    </svg>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  side="left"
                  className="w-[150px] min-w-0 shadow-2xl p-1.5 rounded-2xl bg-[rgb(24,24,24,0.7)] backdrop-blur-xl border-none text-small-semibold !text-[15px]"
                >
                  <DropdownMenuGroup className="text-white  text-[12px] flex flex-col gap-2 m-1">
                    <DropdownMenuItem
                      onClick={resizeToOriginal}
                      className="bg-[rgb(30,30,30,0.7)] p-3 flex justify-center items-center"
                    >
                      <span className=" tracking-tighter font-semibold">
                        Original
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={resizeToFitToStory}
                      className="bg-[rgb(30,30,30,0.7)] p-3 flex justify-center items-center"
                    >
                      <span className=" tracking-tighter font-semibold">
                        Fit to Story
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={resizeToFitToTwoToThree}
                      className="bg-[rgb(30,30,30,0.7)] p-3 flex justify-center items-center"
                    >
                      <span className=" tracking-tighter font-semibold">
                        2:3
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className=" select-none cursor-pointer border-none outline-none">
                  <motion.div
                    whileTap={{ backgroundColor: "rgb(40,40,40)" }}
                    className=" cursor-pointer w-10 h-10 rounded-full border-none outline-none bg-good-gray/70 backdrop-blur-xl flex justify-center items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 56 56"
                    >
                      <path
                        fill="currentColor"
                        d="M23.957 41.77a18.02 18.02 0 0 0 10.477-3.376l11.109 11.11a2.658 2.658 0 0 0 1.898.773c1.524 0 2.625-1.172 2.625-2.672c0-.703-.234-1.359-.75-1.874L38.277 34.668c2.32-3.047 3.703-6.82 3.703-10.922c0-9.914-8.109-18.023-18.023-18.023c-9.937 0-18.023 8.109-18.023 18.023S14.02 41.77 23.957 41.77m0-3.891c-7.758 0-14.133-6.398-14.133-14.133c0-7.734 6.375-14.133 14.133-14.133c7.734 0 14.133 6.399 14.133 14.133c0 7.735-6.399 14.133-14.133 14.133m1.898-7.195v-5.18h4.735c.96 0 1.781-.82 1.781-1.758c0-.937-.82-1.758-1.781-1.758h-4.735v-5.18c0-1.124-.914-1.804-1.898-1.804c-.984 0-1.922.68-1.922 1.805v5.18h-4.734c-.961 0-1.758.82-1.758 1.757c0 .938.797 1.758 1.758 1.758h4.734v5.18c0 1.125.938 1.804 1.922 1.804s1.898-.68 1.898-1.804"
                      />
                    </svg>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  side="left"
                  className="w-[150px] min-w-0 h-[40px] shadow-2xl p-1.5 rounded-2xl bg-[rgb(24,24,24,0.7)] backdrop-blur-xl border-none text-small-semibold !text-[15px]"
                >
                  <DropdownMenuGroup className="text-white  text-[12px] flex flex-col gap-2 m-1">
                    <div className="relative  flex justify-center items-center">
                      <RangeSelector
                        rangeStyle="vertical-mini-white-1"
                        rangeValue={rangeValue}
                        handleRangeChange={handleRangeChange}
                        minValue={-100}
                        maxValue={100}
                      />
                    </div>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <motion.div
                whileTap={{ backgroundColor: "rgb(40,40,40)" }}
                onClick={handleAddMediaToStory}
                className=" cursor-pointer w-10 h-10 rounded-full bg-good-gray/70 backdrop-blur-xl flex justify-center items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M6.5 12a.502.502 0 0 1-.354-.146l-4-4a.502.502 0 0 1 .708-.708L6.5 10.793l6.646-6.647a.502.502 0 0 1 .708.708l-7 7A.502.502 0 0 1 6.5 12"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </>
      </div>
      <img
        src={StoryMediaUrl as string}
        className="pointer-events-none  select-none"
        style={{
          opacity: "100%",
          position: "absolute",
          maxWidth: "max-content",
          width: `${finalStoryMediaDataForKonvaImg?.width}px`,
          height: `${finalStoryMediaDataForKonvaImg?.height}px`,
        }}
        alt=""
      />
    </>
  );
};

export default MediaAdjustement;
