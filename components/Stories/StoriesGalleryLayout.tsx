'use client'

import { useEffect, useState } from 'react';
import StoriesGalleryViewer from '@/components/Stories/StoriesGalleryViewer';

// Constants for the aspect ratios and scaling factors
const ASPECT_RATIOS = [
  { height: 1, width: 1 },  // 1:1
  { height: 9, width: 14 }, // 14:9
  { height: 9, width: 16 }  // 16:9
];
const STORY_VIEWER_LARGE_HEIGHT_PCT = 0.96;
const STORY_VIEWER_ASPECT_RATIO_W_H = 9 / 16;
const STORY_GALLERY_ITEM_SCALES = { preview: 0.4, viewer: 1 };

interface StoriesGalleryLayoutProps {}

const StoriesGalleryLayout: React.FC<StoriesGalleryLayoutProps> = () => {
  const [config, setConfig] = useState<{
    gallery: { width: number; height: number };
    player: { height: number; width: number };
    preview: { height: number; width: number };
    previewCount: number;
    previewScale: number;
  } | null>(null);

  function calculateConfig(windowWidth: number, windowHeight: number) {
    // Find the appropriate aspect ratio
    const aspectRatio = ASPECT_RATIOS.find(ratio => windowWidth / windowHeight <= ratio.width / ratio.height) || ASPECT_RATIOS[ASPECT_RATIOS.length - 1];

    // Calculate gallery dimensions
    const galleryWidth = Math.min(windowWidth, (aspectRatio.width / aspectRatio.height) * windowHeight);
    const galleryHeight = Math.min(windowHeight, (aspectRatio.height / aspectRatio.width) * windowWidth);

    // Calculate player dimensions
    const playerHeight = galleryHeight * STORY_VIEWER_LARGE_HEIGHT_PCT;
    const playerWidth = Math.round(playerHeight * STORY_VIEWER_ASPECT_RATIO_W_H);

    // Calculate preview dimensions
    const previewScale = STORY_GALLERY_ITEM_SCALES.preview;
    const previewWidth = Math.round(playerWidth * previewScale);
    const previewHeight = Math.round(playerHeight * previewScale);

    return {
      gallery: { width: galleryWidth, height: galleryHeight },
      player: { height: playerHeight, width: playerWidth },
      preview: { height: previewHeight, width: previewWidth },
      previewCount: 5, // Default value
      previewScale,
    };
  }

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const newConfig = calculateConfig(width, height);
      setConfig(newConfig);
    };

    // Initialize the configuration
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!config) {
    return <div>Loading...</div>; // Show loading message while calculating
  }

  const stories = [
    <div key="1" className="story-item">Story 1</div>,
    <div key="2" className="story-item">Story 2</div>,
    <div key="3" className="story-item">Story 3</div>,
  ];

  return (
    <StoriesGalleryViewer config={config} stories={stories} />
  );
}

export default StoriesGalleryLayout;
