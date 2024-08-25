"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import StoriesGalleryViewer from "@/components/Stories/StoriesGalleryViewer";
import StoriesGalleryPlayer from "./StoriesGalleryPlayer";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import WhisperSignatureAnimation from "@/lib/css/lotties/whisper_signature_anim.json";

// Constants for the aspect ratios and scaling factors
const ASPECT_RATIOS = [
  { height: 1, width: 1 }, // 1:1
  { height: 9, width: 14 }, // 14:9
  { height: 9, width: 16 }, // 16:9
];
const STORY_VIEWER_LARGE_HEIGHT_PCT = 0.96;
const STORY_VIEWER_ASPECT_RATIO_W_H = 9 / 16;
const STORY_GALLERY_ITEM_SCALES = { preview: 0.4, viewer: 1 };

interface StoriesGalleryLayoutProps {}

const StoriesGalleryLayout: React.FC<StoriesGalleryLayoutProps> = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const closeAndGoBackInHistoryRoute = () => {
    router.back();
  };
  const [hasPreviousViewedStory, setHasPreviousViewedStory] = useState([]);
  const [config, setConfig] = useState<{
    gallery: { width: number; height: number };
    player: { height: number; width: number };
    preview: { height: number; width: number };
    previewCount: number;
    previewScale: number;
  } | null>(null);

  function calculateConfig(windowWidth: number, windowHeight: number) {
    const aspectRatio =
      ASPECT_RATIOS.find(
        (ratio) => windowWidth / windowHeight <= ratio.width / ratio.height
      ) || ASPECT_RATIOS[ASPECT_RATIOS.length - 1];

    // Calculate gallery dimensions
    const galleryWidth = Math.min(
      windowWidth,
      (aspectRatio.width / aspectRatio.height) * windowHeight
    );
    const galleryHeight = Math.min(
      windowHeight,
      (aspectRatio.height / aspectRatio.width) * windowWidth
    );

    // Calculate player dimensions
    const playerHeight = galleryHeight * STORY_VIEWER_LARGE_HEIGHT_PCT;
    const playerWidth = Math.round(
      playerHeight * STORY_VIEWER_ASPECT_RATIO_W_H
    );

    // Calculate preview dimensions
    const previewScale = STORY_GALLERY_ITEM_SCALES.preview;
    const previewWidth = Math.round(playerWidth * previewScale);
    const previewHeight = Math.round(playerHeight * previewScale);

    return {
      gallery: { width: galleryWidth, height: galleryHeight },
      player: { height: playerHeight, width: playerWidth },
      preview: { height: previewHeight, width: previewWidth },
      previewCount: windowWidth > 1429 ? 2 : 1.5,
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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!config) {
    return (
      <div className=" w-full h-screen flex justify-center items-center">
        <div className=" flex w-14 h-14">
          <Lottie animationData={WhisperSignatureAnimation} loop={true} />
        </div>
      </div>
    ); // Show loading message while calculating
  }

  const stories = [
    <StoriesGalleryPlayer name={"zy la pute"} key={1} />,
    <StoriesGalleryPlayer name={"gros connard de zy"} key={2} />,
    <StoriesGalleryPlayer name={"va faire foutre zy"} key={3} />,
    <StoriesGalleryPlayer name={"le gros nulos de atsuu"} key={4} />,
    <StoriesGalleryPlayer name={"shtjryjoyoo"} key={5} />,
    <StoriesGalleryPlayer name={"configured"} key={6} />,
    <StoriesGalleryPlayer name={"polito le gros gay de merde"} key={7} />,
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const goToStory = (forceGoToStory: number) => {
    setCurrentIndex(forceGoToStory);
  };

  const hasPreviousStories = currentIndex !== 0;
  const hasNextStories = currentIndex < stories.length - 1;

  const storyViewers = stories.map((story, index) => {
    return (
      <StoriesGalleryViewer
        isForegroundStory={index !== currentIndex}
        hasPreviousStories={hasPreviousStories}
        hasNextStories={hasNextStories}
        onClick={() => goToStory(index)}
        key={index}
        isPlayedStoryContext={index === currentIndex}
        isInRight={index < 0}
        index={index - currentIndex}
        config={config}
        story={story}
        handleNext={() => handleNext()}
        handlePrev={() => handlePrev()}
      />
    );
  });

  return (
    <>
      <motion.div
        whileTap={{ scale: 0.9 }}
        className=" cursor-pointer z-50 absolute right-0 top-0 p-3"
        onClick={closeAndGoBackInHistoryRoute}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </motion.div>
      <div className="min-h-screen w-full flex items-center justify-center relative">
        <div
          style={{
            width: `${config.gallery.width}px`,
            height: `${config.gallery.height}px`,
          }}
          className="flex items-center relative overflow-hidden"
        >
          {storyViewers}
        </div>
      </div>
    </>
  );
};

export default StoriesGalleryLayout;
