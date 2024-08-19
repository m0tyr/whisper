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
  story: JSX.Element;
  index: number;
  isPlayedStoryContext: boolean;
}

const StoriesGalleryViewer: React.FC<StoriesGalleryViewerProps> = ({
  config,
  story,
  index,
  isPlayedStoryContext,
}) => {
  const calculatePositionV2 = (
    a: {
      gallery: { width: number };
      player: { width: number };
      previewCount: number;
      preview: { width: number };
    },
    b: number
  ) => {
    const direction = 1;
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
      return galleryCenter + (adjustedDirection < 0 ? -1 : 1) * offset ;/* + 85 * b; FIND HOW THEY DID THAT */
    }
  };

  const getTransform = (index: number) => {
    const position = calculatePositionV2(config, index);
    return `translateX(calc(${Math.round(position)}px - 50%))`;
  };
  return (
    <div
    style={{
      height: isPlayedStoryContext && config.player.height
        ? `${config.player.height}px`
        : `${config.preview.height}px`,
      width: isPlayedStoryContext && config.player.width
        ? `${config.player.width}px`
        : `${config.preview.width}px`,
      transform: getTransform(index),
    }}
      className="absolute left-0 bg-border rounded-lg"
    >
      {story}
    </div>
  );
};

export default StoriesGalleryViewer;
