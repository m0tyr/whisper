"use client";

import React, { useState, useEffect, useMemo } from "react";

interface Config {
  gallery: {
    width: number;
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
    const aspectRatio = 800 / 600;
    const maxHeight = dimensions.height;
    const calculatedWidth = Math.min(Math.max(dimensions.width, 768), 1065);
    const calculatedHeight = Math.min(calculatedWidth / aspectRatio, maxHeight);
    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  }, [dimensions]);

  // Calculate the position of each story
  const calculatePosition = (index: number) => {
    const centerX = computedDimensions.width / 2;
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
      return centerX + (index > currentIndex ? immediateOffset : -immediateOffset);
    } else {
      // More distant stories (left or right)
      const offset = (Math.abs(index - currentIndex) - 1) * distantOffset;
      return centerX + (index > currentIndex ? immediateOffset + offset : -immediateOffset - offset);
    }
  };

  // Position transformations
  const getTransform = (index: number) => {
    const position = calculatePosition(index);
    return `translateX(calc(${position}px - 50%))`;
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : stories.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < stories.length - 1 ? prevIndex + 1 : 0));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative">
      <div
        style={{
          width: `${computedDimensions.width}px`,
          height: `${computedDimensions.height}px`,
        }}
        className="flex items-center relative border border-gray-300"
      >
        {/* Previous item */}
        <div
          style={{
            height: `${config.preview.height}px`,
            transform: getTransform((currentIndex - 1 + stories.length) % stories.length),
          }}
          className="absolute left-0 w-[130px] bg-slate-600 rounded-lg"
        >
          {stories[(currentIndex - 1 + stories.length) % stories.length]}
        </div>

        {/* Current item */}
        <div
          style={{
            height: `${computedDimensions.height - 20}px`,
            transform: getTransform(currentIndex),
          }}
          className="absolute left-0 w-[323px] bg-slate-600 rounded-lg"
        >
          {stories[currentIndex]}
        </div>

        {/* Next item */}
        <div
          style={{
            height: `${config.preview.height}px`,
            transform: getTransform((currentIndex + 1) % stories.length),
          }}
          className="absolute left-0 w-[130px] bg-slate-600 rounded-lg"
        >
          {stories[(currentIndex + 1) % stories.length]}
        </div>

        {/* Next-next item */}
        <div
          style={{
            height: `${config.preview.height}px`,
            transform: getTransform((currentIndex + 2) % stories.length),
          }}
          className="absolute left-0 w-[130px] bg-slate-600 rounded-lg"
        >
          {stories[(currentIndex + 2) % stories.length]}
        </div>
      </div>

      {/* Navigation buttons */}
      <button onClick={handlePrev} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded">
        Prev
      </button>
      <button onClick={handleNext} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded">
        Next
      </button>
    </div>
  );
};

export default StoriesGalleryViewer;