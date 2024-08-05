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

  const [computedDimensions, setComputedDimensions] = useState({
    width: Math.min(Math.max(dimensions.width, 768), 1065),
    height: window.innerHeight,
  });

  const updateDimensions = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const aspectRatio = 800 / 600;
    const maxHeight = dimensions.height;
    const calculatedWidth = Math.min(Math.max(dimensions.width, 768), 1065);
    const calculatedHeight = Math.min(calculatedWidth / aspectRatio, maxHeight);
    setComputedDimensions({
      width: calculatedWidth,
      height: calculatedHeight
    });
  };

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [dimensions]);

  const calculatePosition = (config: Config, index: number) => {
    const direction = 1;
    const centerX = config.gallery.width / 2;
    const previewOffset =
      (centerX -
        config.player.width / 2 -
        config.previewCount * config.preview.width) /
      Math.ceil(config.previewCount + 0.5);

    if (index === 0) {
      return centerX;
    } else {
      const offsetX =
        config.player.width / 2 +
        Math.abs(direction * index) * previewOffset +
        (Math.abs(direction * index) - 0.5) * config.preview.width;
      return centerX + (direction < 0 ? -1 : 1) * offsetX;
    }
  };

  const getSize = (config: Config, index: number) =>
    index === 0 ? config.player : config.preview;

  const size = useMemo(() => getSize(config, currentIndex), [config, currentIndex]);
  const position = Math.round(calculatePosition(config, currentIndex)) - 60;

  const finalTransform = `translateX(calc(${position}px - 50%))`;
  const prevfinalTransform = `translateX(calc(${position - 260}px - 50%))`;
  const nextfinalTransform = `translateX(calc(${position + 260}px - 50%))`;
  const nextnextfinalTransform = `translateX(calc(${position + 260 + 180}px - 50%))`;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : stories.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < stories.length - 1 ? prevIndex + 1 : 0));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div
        style={{
          width: `${computedDimensions.width}px`,
          height: `${computedDimensions.height}px`,
        }}
        className="flex items-center relative border-border border"
      >
        {/* Previous item */}
        <div
          style={{
            height: `${230}px`, // Adjusted height for inner div
            transform: prevfinalTransform,
          }}
          className="absolute left-0 w-[130px] bg-slate-600 rounded-lg"
        >
          {stories[(currentIndex - 1 + stories.length) % stories.length]}
        </div>

        {/* Current item */}
        <div
          style={{
            height: `${computedDimensions.height - 20}px`, // Adjusted height for inner div
            transform: finalTransform,
          }}
          className="absolute left-0 w-[323px] bg-slate-600 rounded-lg"
        >
          {stories[currentIndex]}
        </div>

        {/* Next item */}
        <div
          style={{
            height: `${230}px`, // Adjusted height for inner div
            transform: nextfinalTransform,
          }}
          className="absolute left-0 w-[130px] bg-slate-600 rounded-lg"
        >
          {stories[(currentIndex + 1) % stories.length]}
        </div>

        {/* Next-next item */}
        <div
          style={{
            height: `${230}px`, // Adjusted height for inner div
            transform: nextnextfinalTransform,
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
