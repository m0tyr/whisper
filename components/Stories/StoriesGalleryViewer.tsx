"use client";

import React, { useState, useEffect, useMemo } from "react";

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
  config: Config;
  stories: Array<JSX.Element>; // Dynamic content
}

const StoriesGalleryViewer: React.FC<StoriesGalleryViewerProps> = ({
  config,
  stories,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const updateDimensions = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Calculate computed dimensions
  const computedDimensions = useMemo(() => {
    const aspectRatio = 800 / 600; // Maintain aspect ratio
    const maxHeight = dimensions.height;
    const calculatedWidth = Math.min(Math.max(dimensions.width, 768), 1400);
    const calculatedHeight = Math.min(calculatedWidth / aspectRatio, maxHeight);
    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  }, [dimensions]);

  // Calculate the position of each story
  const calculatePosition = (index: number) => {
    const centerX = config.gallery.width / 2;
    const previewWidth = config.preview.width;
    const previewCount = config.previewCount;

    // Offsets for immediate adjacent stories
    const immediateOffset = 260;
    // Offsets for stories further away
    const distantOffset = 160;

    if (index === currentIndex) {
      return centerX;
    } else if (Math.abs(index - currentIndex) === 1) {
      // Adjacent stories (left or right)
      return (
        centerX + (index > currentIndex ? immediateOffset : -immediateOffset)
      );
    } else {
      // More distant stories (left or right)
      const offset = (Math.abs(index - currentIndex) - 1) * distantOffset;
      return (
        centerX +
        (index > currentIndex
          ? immediateOffset + offset
          : -immediateOffset - offset)
      );
    }
  };

  // Position transformations
  const getTransform = (index: number) => {
    const position = calculatePosition(index);
    return `translateX(calc(${position}px - 50%))`;
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : stories.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < stories.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative">
      <div
        style={{
          width: `${config.gallery.width}px`,
          height: `${config.gallery.height}px`,
        }}
        className="flex items-center relative overflow-hidden"
      >
        {/* Previous-previous item */}
        <div
          style={{
            height: `${config.preview.height}px`,
            width: `${config.preview.width}px`,
            transform: getTransform(
              (currentIndex - 2 + stories.length) % stories.length
            ),
          }}
          className="absolute left-0 bg-border rounded-lg"
        >
          {stories[(currentIndex - 1 + stories.length) % stories.length]}
        </div>
        {/* Previous item */}
        <div
          style={{
            height: `${config.preview.height}px`,
            width: `${config.preview.width}px`,
            transform: getTransform(
              (currentIndex - 1 + stories.length) % stories.length
            ),
          }}
          className="absolute left-0 bg-border rounded-lg"
        >
          {stories[(currentIndex - 1 + stories.length) % stories.length]}
        </div>

        {/* Current item */}
        <div
          style={{
            height: `${config.player.height}px`,
            width: `${config.player.width}px`,
            transform: getTransform(currentIndex),
          }}
          className="absolute left-0 bg-border rounded-lg"
        >
          <div className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
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
                    stroke-linecap="square"
                    d="m6.5 10.5l3-3l-3-3"
                  />
                </svg>
              </button>
            </div>
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
                    stroke-linecap="square"
                    d="m8.5 4.5l-3 3l3 3"
                  />
                </svg>
              </button>
            </div>
          </div>
          {stories[currentIndex]}
        </div>

        {/* Next item */}
        <div
          style={{
            height: `${config.preview.height}px`,
            width: `${config.preview.width}px`,
            transform: getTransform((currentIndex + 1) % stories.length),
          }}
          className="absolute left-0 bg-border rounded-lg"
        >
          {stories[(currentIndex + 1) % stories.length]}
        </div>

        {/* Next-next item */}
        <div
          style={{
            height: `${config.preview.height}px`,
            width: `${config.preview.width}px`,
            transform: getTransform((currentIndex + 2) % stories.length),
          }}
          className="absolute left-0 bg-border rounded-lg"
        >
          {stories[(currentIndex + 2) % stories.length]}
        </div>
      </div>
    </div>
  );
};

export default StoriesGalleryViewer;
