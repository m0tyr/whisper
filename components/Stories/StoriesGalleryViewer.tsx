"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect, useMemo, useRef } from "react";

interface Config {
  gallery: {
    width: number;
    height: number;
  };
  player: {
    height: number;
    width: number;
  };
  preview: {
    height: number;
    width: number;
  };
  previewCount: number;
  previewScale: number;
}

interface StoriesGalleryViewerProps {
  hasPreviousStories: boolean;
  hasNextStories: boolean;
  onClick: () => void;
  isInRight: boolean;
  config: Config;
  story: JSX.Element;
  index: number;
  isPlayedStoryContext: boolean;
  handleNext: any;
  handlePrev: any;
  isForegroundStory:boolean;
}

const StoriesGalleryViewer: React.FC<StoriesGalleryViewerProps> = ({
  hasPreviousStories,
  hasNextStories,
  onClick,
  isInRight,
  config,
  story,
  index,
  isPlayedStoryContext,
  isForegroundStory,
  handleNext,
  handlePrev,
}) => {
  const [prevIndex, setPrevIndex] = useState<number>(index);
  const [prevTransform, setPrevTransform] = useState<string>("");
  const [currentTransform, setCurrentTransform] = useState<string>("");
  const divRef = useRef<HTMLDivElement>(null);

  const calculatePositionV2 = (
    a: {
      gallery: { width: number };
      player: { width: number };
      previewCount: number;
      preview: { width: number };
    },
    b: number
  ) => {
    const direction = isInRight ? -1 : 1;
    const adjustedDirection = direction * b;
    const galleryCenter = a.gallery.width / 2;
    const previewSpacing =
      (galleryCenter - a.player.width / 2 - a.previewCount * a.preview.width) /
      Math.ceil(a.previewCount + 0.5);

    if (b === 0) {
      return galleryCenter;
    } else {
      const offset =
        a.player.width / 2 +
        Math.abs(adjustedDirection) * previewSpacing +
        (Math.abs(adjustedDirection) - 0.5) * a.preview.width;
      return galleryCenter + (adjustedDirection < 0 ? -1 : 1) * offset;
    }
  };

  const getTransform = (index: number) => {
    const position = calculatePositionV2(config, index);
    return `translateX(calc(${Math.round(position)}px - 50%))`;
  };

  useEffect(() => {
    let scale;

    if (prevIndex === 0) {
      scale = 1 / config.previewScale;
    } else if (index === 0) {
      scale = config.previewScale;
    } else {
      scale = 1;
    }

    const newTransform = getTransform(index);

    if (divRef.current && prevIndex !== index) {
      divRef.current.animate(
        [
          { transform: `${prevTransform} scale(${scale})` },
          { transform: `${newTransform} scale(1)` },
        ],
        {
          duration: 650, // Duration in ms
          easing: "cubic-bezier(0.34, 0.84, 0.17, 1)",
        }
      );
    }

    setPrevTransform(newTransform);
    setCurrentTransform(newTransform);
    setPrevIndex(index);
  }, [index, config]);
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target === e.currentTarget) {
          onClick();
        }
      }}
      ref={divRef}
      style={{
        height:
          isPlayedStoryContext && config.player.height
            ? `${config.player.height}px`
            : `${config.preview.height}px`,
        width:
          isPlayedStoryContext && config.player.width
            ? `${config.player.width}px`
            : `${config.preview.width}px`,
        transform: currentTransform,
      }}
      className={`absolute left-0 bg-border rounded-lg ${
        !isPlayedStoryContext ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {isPlayedStoryContext && (
        <div className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
          {hasNextStories && (
            <div className="flex justify-center flex-col absolute top-0 right-[-48px] bottom-0 ">
              <button
                onClick={handleNext}
                className=" bg-white shadow-[0_7px_12px_0_rgba(0,0,0,0.8)] text-border m-2.5 px-0.5 py-0.5 rounded-full z-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 15 15"
                >
                  <path
                    fill="none"
                    stroke="black"
                    strokeLinecap="square"
                    d="m6.5 10.5l3-3l-3-3"
                  />
                </svg>
              </button>
            </div>
          )}
          {hasPreviousStories && (
            <div className="flex justify-center flex-col absolute top-0 left-[-48px] bottom-0 ">
              <button
                onClick={handlePrev}
                className=" bg-white shadow-[0_7px_12px_0_rgba(0,0,0,0.8)] text-border m-2.5 px-0.5 py-0.5 rounded-full z-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 15 15"
                >
                  <path
                    fill="none"
                    stroke="black"
                    strokeLinecap="square"
                    d="m8.5 4.5l-3 3l3 3"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {React.cloneElement(story, { isForegroundStory: isForegroundStory })}
    </div>
  );
};

export default StoriesGalleryViewer;
