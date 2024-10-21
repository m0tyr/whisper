"use client";

import {
  ASPECT_RATIOS,
  STORY_VIEWER_ASPECT_RATIO_W_H,
  STORY_VIEWER_LARGE_HEIGHT_PCT,
} from "@/constants/constants";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import DrawPlugin from "./DrawPlugin/DrawPlugin";
import { Layer, Stage, Transformer } from "react-konva";
import Konva from "konva";
import "../../../app/globals.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import getFeaturedStickers from "@/lib/actions/stories.actions";
import { useQueryFeaturedStickers } from "@/hooks/queries/useQueryFeaturedStickers";

import GifPlugin from "./DrawerPlugin/GifPlugin/GifPlugin";
import TextPlugin from "./TextPlugin/TextPlugin";
import {
  MentionInstance,
  StoryKonvaMediaData,
  StoryMediaData,
  TextInstances,
} from "@/lib/types/stories.types";
import ToolBar from "./ToolBar/ToolBar";
import MediaAdjustement from "./MediaAdjustement/MediaAdjustement";
import { listeners } from "process";
import DrawerPlugin from "./DrawerPlugin/DrawerPlugin";

const StoryCreate = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [storyProperties, setStoryProperties] = useState({
    width: 0,
    height: 0,
  });
  const [storyContainerProperties, setStoryContainerProperties] = useState({
    width: 0,
    height: 0,
  });

  const [StoryMediaUrl, setStoryMediaUrl] = useState<string>("");
  const [StoryMediaData, setStoryMediaData] = useState<StoryMediaData>({
    mediaImg: undefined,
    width: 0,
    height: 0,
    isVideo: false,
    x: 0,
    y: 0,
  });
  const [StoryKonvaMedia, setStoryKonvaMedia] =
    useState<StoryKonvaMediaData | null>(null);

  const stageRef = useRef<Konva.Stage | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);
  const transformerInstancesRef = useRef<Konva.Transformer[]>([]);
  const textInstancesRef = useRef<TextInstances[]>([]);
  const [selectedItemCoord, setSelectedItemCoord] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const selectedItemCoordRef = useRef({ x: 0, y: 0 }); // To access synchronously
  const [toRenderTextFont, setToRenderTextFont] = useState(
    "system-ui, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif"
  );
  const [textValue, setTextValue] = useState("");

  const [hasPassedTemplateStep, setHasPassedTemplateStep] = useState(false);
  const [isInDrawingContext, setIsInDrawingContext] = useState(false);
  const [isInTextContext, setIsInTextContext] = useState(false);
  const [isAddingNewText, setisAddingNewText] = useState(false);
  const [isAdjustingImage, setisAdjustingImage] = useState(false);
  const [isInBaseContext, setIsInBaseContext] = useState(true);
  const [isInWidgetContext, setIsInWidgetContext] = useState(false);
  const [isInWidgetBaseContext, setIsInWidgetBaseContext] = useState(false);
  const [isInWidgetGifContext, setIsInWidgetGifContext] = useState(false);

  const getStoryProperties = (windowWidth: number, windowHeight: number) => {
    const aspectRatio =
      ASPECT_RATIOS.find(
        (ratio) => windowWidth / windowHeight <= ratio.width / ratio.height
      ) || ASPECT_RATIOS[ASPECT_RATIOS.length - 1];

    const galleryWidth = Math.min(
      windowWidth,
      (aspectRatio.width / aspectRatio.height) * windowHeight
    );
    const galleryHeight = Math.min(
      windowHeight,
      (aspectRatio.height / aspectRatio.width) * windowWidth
    );

    const playerHeight = galleryHeight * STORY_VIEWER_LARGE_HEIGHT_PCT;
    const playerWidth = Math.round(
      playerHeight * STORY_VIEWER_ASPECT_RATIO_W_H
    );
    setStoryContainerProperties({ width: galleryWidth, height: galleryHeight });
    return {
      width: playerWidth,
      height: playerHeight,
    };
  };

  const handleChooseTemplate = (chooseKey: string) => {
    if (chooseKey === "from-media") {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      } else {
        console.error("File input ref is not available.");
      }
    } else if (chooseKey === "from-base-model") {
      setHasPassedTemplateStep(true);
    }
  };

  const AddMediaToStory = (value: StoryMediaData) => {
    const stage = stageRef.current;
    const layer = layerRef.current;

    if (stage && layer) {
      const hasBgFill =
        StoryMediaData.width > value.width ||
        StoryMediaData.height > value.height;

      if (!value.isVideo) {
        if (hasBgFill) {
          const bgImage = new window.Image();
          bgImage.src = StoryMediaUrl;
          bgImage.onload = function () {
            const bgImageNode = new Konva.Image({
              x: 0,
              y: 0,
              width: StoryMediaData.width,
              height: storyProperties.height,
              image: bgImage,
              blurRadius: 140,
              opacity: 0.75,
              listening: false,
            });

            bgImageNode.zIndex(-100);
            bgImageNode.cache();
            bgImageNode.filters([Konva.Filters.Blur]);
            layer.add(bgImageNode);
            bgImageNode.moveToBottom();
            layer.batchDraw();

            setStoryKonvaMedia((prevState) => ({
              konvaMedia: prevState?.konvaMedia || null,
              konvabgFillMedia: bgImageNode,
              hasBgFill: prevState?.hasBgFill ?? false,
              isVideo: value.isVideo,
            }));
          };
        }
        const mainImage = new window.Image();
        mainImage.src = StoryMediaUrl;
        mainImage.onload = function () {
          const x = (storyProperties.width - value.width) / 2 + value.x;

          const imageNode = new Konva.Image({
            x: x,
            y: value.y,
            width: value.width,
            height: value.height,
            image: mainImage,
            listening: false,
          });
          imageNode.zIndex(-99);

          layer.add(imageNode);
          imageNode.moveToBottom();
          imageNode.moveUp();
          layer.batchDraw();

          setStoryKonvaMedia((prevState) => ({
            konvabgFillMedia: prevState?.konvabgFillMedia || null,
            konvaMedia: imageNode,
            hasBgFill: prevState?.hasBgFill ?? false,
            isVideo: value.isVideo,
          }));
        };

        setisAdjustingImage(false);
        setIsInBaseContext(true);
      } else {
        if (hasBgFill) {
          const bgVideo = document.createElement("video");
          bgVideo.src = StoryMediaUrl;

          bgVideo.addEventListener("loadedmetadata", () => {
            bgVideo.currentTime = 0;

            bgVideo.addEventListener("seeked", () => {
              bgVideo.play();

              const bgVideoNode = new Konva.Image({
                x: 0,
                y: 0,
                width: StoryMediaData.width,
                height: storyProperties.height,
                image: bgVideo,
                blurRadius: 140,
                opacity: 0.75,
                listening: false,
              });

              bgVideoNode.cache();
              bgVideoNode.filters([Konva.Filters.Blur]);
              layer.add(bgVideoNode);
              bgVideoNode.moveToBottom();
              layer.batchDraw();

              setStoryKonvaMedia((prevState) => ({
                konvaMedia: prevState?.konvaMedia || null,
                konvabgFillMedia: bgVideoNode,
                hasBgFill: prevState?.hasBgFill ?? false,
                isVideo: value.isVideo,
              }));
            });
          });
        }

        const mainVideo = document.createElement("video");
        mainVideo.src = StoryMediaUrl;
        mainVideo.loop = true;
        mainVideo.play();

        mainVideo.addEventListener("loadedmetadata", () => {
          const x = (storyProperties.width - value.width) / 2 + value.x;
          const videoNode = new Konva.Image({
            x: x,
            y: value.y,
            width: value.width,
            height: value.height,
            image: mainVideo,
            listening: false,
          });

          layer.add(videoNode);
          videoNode.moveToBottom();
          videoNode.moveUp();
          layer.batchDraw();

          const anim = new Konva.Animation(() => {
            layer.batchDraw();
          }, layer);
          anim.start();

          setStoryKonvaMedia((prevState) => ({
            konvabgFillMedia: prevState?.konvabgFillMedia || null,
            konvaMedia: videoNode,
            hasBgFill: prevState?.hasBgFill ?? false,
            isVideo: value.isVideo,
          }));
        });

        setisAdjustingImage(false);
        setIsInBaseContext(true);
      }
    }
  };

  const handleFileChange = () => {
    const stage = stageRef.current;
    const layer = layerRef.current;
    if (fileInputRef.current && fileInputRef.current.files && stage && layer) {
      const fileRead = fileInputRef.current.files[0] as File;
      const cachedBlobUrl = URL.createObjectURL(fileRead);
      const mimeType = fileRead.type;
      if (mimeType.includes("image")) {
        const image = new window.Image();
        image.src = cachedBlobUrl;

        image.onload = () => {
          const originalWidth = image.width;
          const originalHeight = image.height;

          const scaleX = storyProperties.width / originalWidth;
          const scaleY = storyProperties.height / originalHeight;
          const scale = Math.max(scaleX, scaleY);

          const newWidth = originalWidth * scale;
          const newHeight = originalHeight * scale;

          const x = (storyProperties.width - newWidth) / 2;
          const y = (storyProperties.height - newHeight) / 2;
          setStoryMediaData({
            mediaImg: image,
            width: newWidth,
            height: newHeight,
            isVideo: false,
            x: x,
            y: y,
          });
          setStoryMediaUrl(cachedBlobUrl);
          setisAdjustingImage(true);
          setIsInBaseContext(false);
          setHasPassedTemplateStep(true);
        };
      } else if (mimeType.includes("video")) {
        const video = document.createElement("video");
        video.src = cachedBlobUrl;
        video.addEventListener("loadedmetadata", () => {
          const originalWidth = video.videoWidth;
          const originalHeight = video.videoHeight;

          const scaleX = storyProperties.width / originalWidth;
          const scaleY = storyProperties.height / originalHeight;
          const scale = Math.max(scaleX, scaleY);

          const newWidth = originalWidth * scale;
          const newHeight = originalHeight * scale;

          const x = (storyProperties.width - newWidth) / 2;
          const y = (storyProperties.height - newHeight) / 2;
          setStoryMediaData({
            mediaImg: video,
            width: newWidth,
            height: newHeight,
            isVideo: true,
            x: x,
            y: y,
          });
          setStoryMediaUrl(cachedBlobUrl);
          setisAdjustingImage(true);
          setIsInBaseContext(false);
          setHasPassedTemplateStep(true);
        });
      }
    }
  };

  const clearMediaImport = () => {
    setStoryMediaData({
      mediaImg: undefined,
      width: 0,
      height: 0,
      isVideo: false,
      x: 0,
      y: 0,
    });
    setStoryMediaUrl("");
    setisAdjustingImage(false);
    setIsInBaseContext(true);
  };

  useEffect(() => {
    const stage = stageRef.current;
    console.log(stage);
    if (stage) {
      stage.on("click", handleStageClick);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const currentStoryProperties = getStoryProperties(width, height);
      setStoryProperties(currentStoryProperties);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDrawingContext = () => {
    setIsInDrawingContext(!isInDrawingContext);
    setIsInBaseContext(!isInBaseContext);
  };

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    console.log(stage);
    if (e.target === stage) {
      console.log("test");
      if (transformerInstancesRef.current) {
        transformerInstancesRef.current.forEach((element) => {
          element.nodes([]);
          setSelectedItemCoord({ x: 0, y: 0 });
          element.getLayer()?.batchDraw();
        });
      }
    }
  };
  useEffect(() => {
    selectedItemCoordRef.current = selectedItemCoord;
  }, [selectedItemCoord]);

  const handleTextNodeClick = (
    node: Konva.Group,
    computedWidth: number,
    computedHeight: number
  ) => {
    if (transformerInstancesRef.current) {
      transformerInstancesRef.current.forEach((element) => {
        element.nodes([]);
        setSelectedItemCoord({ x: 0, y: 0 });
        element.getLayer()?.batchDraw();
      });
      const id = node.id();
      const transformer = transformerInstancesRef.current[parseInt(id)];

      transformer.nodes([node]);

      const { x, y, width, height } = node.getClientRect();
      console.log(x, y, width, height);
      transformer.x(x + node.width() / 2);
      transformer.y(y + node.height() / 2);
      const calNode = calculateCenteredCoords(
        node,
        computedWidth,
        computedHeight
      );

      setSelectedItemCoord({
        x: calNode.x,
        y: calNode.y,
      });

      if (!layerRef.current?.children.includes(transformer)) {
        layerRef.current?.add(transformer);
      }

      layerRef.current?.batchDraw();
    }
  };

  const handleTextNodeDblClick = (node: Konva.Group) => {
    setisAddingNewText(false);
    setIsInTextContext(true);
    setIsInBaseContext(false);
  };

  const AddTextOrModify = (isAddingNewText?: boolean) => {
    setisAddingNewText(true);
    setTextValue("");
    setIsInBaseContext(!isInBaseContext);
    setIsInTextContext(!isInTextContext);
  };

  function getNodePositionAtRotationZero(
    node: Konva.Group,
    width: number,
    height: number
  ) {
    const rotation = (node.rotation() * Math.PI) / 180;
    const unrotatedX =
      node.x() +
      (width / 2 - node.offsetX()) * Math.cos(rotation) +
      (height / 2 - node.offsetY()) * Math.sin(-rotation);
    return unrotatedX;
  }

  function calculateCenteredCoords(
    node: Konva.Group,
    width: number,
    height: number
  ) {
    const boundingBox = node.getClientRect();
    const rotation = node.rotation();

    const centerX = getNodePositionAtRotationZero(node, width, height);

    let centerY;

    if (rotation === 0 || rotation === 180 || rotation === -180) {
      centerY = boundingBox.y - 60;
    } else {
      const radians = (rotation * Math.PI) / 180;

      const rotatedHeight = (height / 6) * Math.cos(radians);

      centerY = boundingBox.y + rotatedHeight / 6 - 60;
    }
    return {
      x: centerX,
      y: rotation === 0 ? centerY - 28 : centerY,
    };
  }

  const [isSelectionHittingXCenter, setIsSelectionHittingXCenter] =
    useState(false);
  const [isSelectionHittingYCenter, setIsSelectionHittingYCenter] =
    useState(false);
  const [isDraggingText, setIsDraggingText] = useState(false);

  const handleTextInstancesUpdate = (
    newInstances: TextInstances[],
    newMentionInstances: MentionInstance
  ) => {
    transformerInstancesRef.current.forEach((element) => {
      element.nodes([]);
      setSelectedItemCoord({ x: 0, y: 0 });
      element.getLayer()?.batchDraw();
    });
    const id = newInstances[newInstances.length - 1].textsGroup.id();
    const transformer = transformerInstancesRef.current[parseInt(id)];
    transformer.nodes([newInstances[newInstances.length - 1].textsGroup]);
    const calNode = calculateCenteredCoords(
      newInstances[newInstances.length - 1].textsGroup,
      newInstances[newInstances.length - 1].width,
      newInstances[newInstances.length - 1].height
    );
    setSelectedItemCoord({
      x: calNode.x,
      y: calNode.y,
    });
    textInstancesRef.current = newInstances;
    const stage = stageRef.current;
    const layer = layerRef.current;

    if (stage && layer && textInstancesRef) {
      newInstances.forEach((instance) => {
        const text = instance.textsGroup;
        text.on("transform", () => {
          const id = text.id();
          const transformer = transformerInstancesRef.current[parseInt(id)];
          transformer.visible(false);
          const rotation = text.rotation();
          if (rotation !== 0) {
            setSelectedItemCoord({
              x: 0,
              y: 0,
            });
          }
        });
        text.on("transformend", () => {
          const id = text.id();
          const transformer = transformerInstancesRef.current[parseInt(id)];
          transformer.visible(true);
          const newCoords = calculateCenteredCoords(
            text,
            instance.width,
            instance.height
          );
          setSelectedItemCoord(newCoords);
        });

        text.on("dragend", () => {
          setIsDraggingText(false);
          const newCoords = calculateCenteredCoords(
            text,
            instance.width,
            instance.height
          );
          setSelectedItemCoord(newCoords);
          setIsSelectionHittingXCenter(false);
          setIsSelectionHittingYCenter(false);
        });
        text.on("click", () => {
          if (transformerInstancesRef.current) {
            transformerInstancesRef.current.forEach((element) => {
              element.nodes([]);
              setSelectedItemCoord({ x: 0, y: 0 });
              element.getLayer()?.batchDraw();
            });
            const id = text.id();
            const transformer = transformerInstancesRef.current[parseInt(id)];
            transformer.to({
              duration: 0.05,
              easing: Konva.Easings.EaseInOut,
              opacity: 0.7,
              scaleX: 0.95,
              scaleY: 0.95,
              onFinish: function () {
                transformer.to({
                  duration: 0.15,
                  easing: Konva.Easings.EaseInOut,
                  opacity: 1,
                  scaleX: 1,
                  scaleY: 1,
                });
              },
            });
            text.to({
              duration: 0.05,
              easing: Konva.Easings.EaseInOut,
              opacity: 0.7,
              scaleX: 0.95,
              scaleY: 0.95,
              onFinish: function () {
                text.to({
                  duration: 0.15,
                  easing: Konva.Easings.EaseInOut,
                  opacity: 1,
                  scaleX: 1,
                  scaleY: 1,
                });
              },
            });
          }
          handleTextNodeClick(text, instance.width, instance.height);
        });
        text.on("dblclick", () => handleTextNodeDblClick(text));
        text.on("dragmove", () => {
          if (text) {
            setSelectedItemCoord({
              x: 0,
              y: 0,
            });
            setIsDraggingText(true);
            transformerInstancesRef.current.forEach((element) => {
              element.nodes([]);
              setSelectedItemCoord({ x: 0, y: 0 });
              element.getLayer()?.batchDraw();
            });
            const id = text.id();
            const transformer = transformerInstancesRef.current[parseInt(id)];
            transformer.nodes([text]);
            const nodePos = text.getPosition();
            newMentionInstances.mentionInstances.forEach((mention) => {
              if (mention) {
                const mentionNodePos = mention.getPosition();
                const computedMentionPos = {
                  x: mentionNodePos.x + nodePos.x,
                  y: nodePos.y + mentionNodePos.y,
                };
              }
            });
            const nodeWidth = text.width();
            const nodeHeight = text.height();
            const centerX = storyProperties.width / 2;
            const centerY = storyProperties.height / 2;

            if (Math.abs(nodePos.x + nodeWidth / 2 - centerX) < 10) {
              setIsSelectionHittingXCenter(true);
              text.x(centerX - nodeWidth / 2);
            } else {
              setIsSelectionHittingXCenter(false);
            }

            if (Math.abs(nodePos.y + nodeHeight / 2 - centerY) < 10) {
              setIsSelectionHittingYCenter(true);
              text.y(centerY - nodeHeight / 2);
            } else {
              setIsSelectionHittingYCenter(false);
            }
          }
        });
      });
    }

    return () => {
      if (textInstancesRef.current) {
        textInstancesRef.current.forEach((instance) => {
          const text = instance.textsGroup;
          text.off("click dblclick dragmove");
        });
      }

      
    };
  };

  return (
    <>
        {isInWidgetContext && (
          <DrawerPlugin
            storyContainerProperties={storyContainerProperties}
            storyProperties={storyProperties}
            isInWidgetGifContext={isInWidgetGifContext}
            isInWidgetBaseContext={isInWidgetBaseContext}
            setIsInWidgetContext={setIsInWidgetContext}
            setIsInWidgetGifContext={setIsInWidgetGifContext}
            setIsInWidgetBaseContext={setIsInWidgetBaseContext}
          />
        )}
      <div
        className={` min-h-screen w-full flex items-center justify-center relative`}
      >
        <div
          className="flex items-center justify-center relative overflow-hidden"
          style={{
            width: storyContainerProperties.width,
            height: storyContainerProperties.height,
          }}
        >
          {isInDrawingContext && (
            <DrawPlugin
              width={storyProperties.width}
              height={storyProperties.height}
            />
          )}
          {isInTextContext && (
            <TextPlugin
              storyProperties={storyProperties}
              isAddingNewText={isAddingNewText}
              setIsInTextContext={setIsInTextContext}
              setisAddingNewText={setisAddingNewText}
              setIsInBaseContext={setIsInBaseContext}
              stageRef={stageRef}
              layerRef={layerRef}
              toRenderTextFont={toRenderTextFont}
              setToRenderTextFont={setToRenderTextFont}
              textValue={textValue}
              setTextValue={setTextValue}
              transformerInstancesRef={transformerInstancesRef}
              textInstancesRef={textInstancesRef}
              onTextInstancesChange={handleTextInstancesUpdate}
            />
          )}
          {isAdjustingImage && (
            <MediaAdjustement
              AddMediaToStory={AddMediaToStory}
              StoryMediaUrl={StoryMediaUrl}
              StoryMediaData={StoryMediaData}
              setStoryMediaData={setStoryMediaData}
              storyProperties={storyProperties}
              clearMediaImport={clearMediaImport}
            />
          )}

          <input
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
            id="file"
            accept="image/jpeg,image/png,video/mp4,video/quicktime"
            type="file"
          />

          <div
            style={{
              width: storyProperties.width,
              height: storyProperties.height,
            }}
            className={` ${!isInBaseContext ? "bg-transparent" : "bg-border"} ${
              isInWidgetContext ? "opacity-50" : ""
            } flex absolute  rounded-lg`}
          >
            <>
              <div
                className={` ${isInBaseContext ? "" : "hidden"} ${
                  isDraggingText ? "hidden" : ""
                }  absolute top-0 flex z-40 flex-row w-full  justify-between`}
              >
                <motion.div
                  whileTap={{ opacity: 0.75 }}
                  whileHover={{ opacity: 0.9 }}
                  onClick={() => {
                    router.back();
                  }}
                  className=" cursor-pointer flex pt-5 pl-6 z-[41]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 15 15"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      d="m1.5 1.5l12 12m-12 0l12-12"
                    />
                  </svg>
                </motion.div>
                <div className="flex pt-5 pr-6 gap-5 flex-row">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className=" select-none cursor-pointer ">
                      <motion.div
                        whileTap={{ scale: 0.97, opacity: 0.75 }}
                        whileHover={{ opacity: 0.9 }}
                        className=" cursor-pointer flex flex-row justify-center items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="26"
                          height="26"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M4 16.004V17a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1M12 4.5v11m3.5-3.5L12 15.5L8.5 12"
                          />
                        </svg>
                      </motion.div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="center"
                      className="w-[210px] drop-shadow-xl p-0.5 rounded-2xl bg-[#181818]/65 backdrop-blur-[12px] border-x-[0.2333333px] border-b-[0.2333333px]  border-x-border border-y-border  text-small-semibold !text-[15px]"
                    >
                      <DropdownMenuGroup className="text-white text-[12px] flex flex-col gap-0.5 m-1">
                        {StoryKonvaMedia ? (
                          <DropdownMenuItem>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                            >
                              <g
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                              >
                                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                <path d="M5 13V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2h-5.5M2 19h7m-3-3l3 3l-3 3" />
                              </g>
                            </svg>
                            <div className="ml-2 text-[14px]">
                              Changer de media
                            </div>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleChooseTemplate("from-media")}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                            >
                              <g
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                              >
                                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                <path d="M5 13V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2h-5.5M2 19h7m-3-3l3 3l-3 3" />
                              </g>
                            </svg>
                            <div className="ml-2 text-[14px]">
                              Importer un media
                            </div>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="33"
                            height="33"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="none"
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                            />
                          </svg>
                          <div className="ml-2 text-[14px]">
                            Sauvegarder dans les brouillons
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ opacity: 0.8 }}
                    onClick={() => {
                      setIsInWidgetContext(true);
                      setIsInWidgetBaseContext(true);
                    }}
                    className=" cursor-pointer flex flex-row justify-center items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                    >
                      <g fill="currentColor">
                        <path d="M16 10.5c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5s.448-1.5 1-1.5s1 .672 1 1.5Zm-6 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S8.448 9 9 9s1 .672 1 1.5Z" />
                        <path
                          fill-rule="evenodd"
                          d="M11.943 1.25h.114c2.309 0 4.118 0 5.53.19c1.444.194 2.584.6 3.479 1.494c.895.895 1.3 2.035 1.494 3.48c.19 1.411.19 3.22.19 5.529V15A7.75 7.75 0 0 1 15 22.75h-3.057c-2.309 0-4.118 0-5.53-.19c-1.444-.194-2.584-.6-3.479-1.494c-.895-.895-1.3-2.035-1.494-3.48c-.19-1.411-.19-3.22-.19-5.529v-.114c0-2.309 0-4.118.19-5.53c.194-1.444.6-2.584 1.494-3.479c.895-.895 2.035-1.3 3.48-1.494c1.411-.19 3.22-.19 5.529-.19Zm-5.33 1.676c-1.278.172-2.049.5-2.618 1.069c-.57.57-.897 1.34-1.069 2.619c-.174 1.3-.176 3.008-.176 5.386s.002 4.086.176 5.386c.172 1.279.5 2.05 1.069 2.62c.57.569 1.34.896 2.619 1.068c1.3.174 3.008.176 5.386.176h2.25c.004-1.366.034-2.264.281-3.027a5.75 5.75 0 0 1 .741-1.496A5.755 5.755 0 0 1 12 17.75a5.766 5.766 0 0 1-3.447-1.148a.75.75 0 1 1 .894-1.204c.728.54 1.607.852 2.553.852s1.825-.313 2.553-.852a.75.75 0 0 1 1.183.744a5.749 5.749 0 0 1 2.487-1.61c.763-.248 1.66-.278 3.027-.282V12c0-2.378-.002-4.086-.176-5.386c-.172-1.279-.5-2.05-1.069-2.62c-.57-.569-1.34-.896-2.619-1.068c-1.3-.174-3.008-.176-5.386-.176s-4.086.002-5.386.176Zm14.592 12.825c-1.357.006-1.999.038-2.518.207a4.25 4.25 0 0 0-2.729 2.729c-.169.52-.2 1.161-.207 2.518a6.253 6.253 0 0 0 5.454-5.454Z"
                          clip-rule="evenodd"
                        />
                      </g>
                    </svg>
                  </motion.div>
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ opacity: 0.8 }}
                    onClick={handleDrawingContext}
                    className=" cursor-pointer flex flex-row justify-center items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M9.75 20.85c1.78-.7 1.39-2.63.49-3.85c-.89-1.25-2.12-2.11-3.36-2.94A9.817 9.817 0 0 1 4.54 12c-.28-.33-.85-.94-.27-1.06c.59-.12 1.61.46 2.13.68c.91.38 1.81.82 2.65 1.34l1.01-1.7C8.5 10.23 6.5 9.32 4.64 9.05c-1.06-.16-2.18.06-2.54 1.21c-.32.99.19 1.99.77 2.77c1.37 1.83 3.5 2.71 5.09 4.29c.34.33.75.72.95 1.18c.21.44.16.47-.31.47c-1.24 0-2.79-.97-3.8-1.61l-1.01 1.7c1.53.94 4.09 2.41 5.96 1.79m11.09-15.6c.22-.22.22-.58 0-.79l-1.3-1.3a.562.562 0 0 0-.78 0l-1.02 1.02l2.08 2.08M11 10.92V13h2.08l6.15-6.15l-2.08-2.08L11 10.92Z"
                      />
                    </svg>
                  </motion.div>
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ opacity: 0.8 }}
                    onClick={() => {
                      AddTextOrModify();
                    }}
                    className=" cursor-pointer flex flex-row justify-center items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill="currentColor"
                        d="M6.71 10H2.332l-.874 2.498a.75.75 0 0 1-1.415-.496l3.39-9.688a1.217 1.217 0 0 1 2.302.018l3.227 9.681a.75.75 0 0 1-1.423.474Zm3.13-4.358C10.53 4.374 11.87 4 13 4c1.5 0 3 .939 3 2.601v5.649a.75.75 0 0 1-1.448.275C13.995 12.82 13.3 13 12.5 13c-.77 0-1.514-.231-2.078-.709c-.577-.488-.922-1.199-.922-2.041c0-.694.265-1.411.887-1.944C11 7.78 11.88 7.5 13 7.5h1.5v-.899c0-.54-.5-1.101-1.5-1.101c-.869 0-1.528.282-1.84.858a.75.75 0 1 1-1.32-.716ZM6.21 8.5L4.574 3.594L2.857 8.5Zm8.29.5H13c-.881 0-1.375.22-1.637.444c-.253.217-.363.5-.363.806c0 .408.155.697.39.896c.249.21.63.354 1.11.354c.732 0 1.26-.209 1.588-.449c.35-.257.412-.495.412-.551Z"
                      />
                    </svg>
                  </motion.div>
                </div>
              </div>
              {isSelectionHittingXCenter && (
                <div className="flex justify-center items-center absolute top-0 left-[50%] z-50 h-full w-[1px] bg-[rgb(60,60,60)] shadow-xl"></div>
              )}
              {isSelectionHittingYCenter && (
                <div className="flex justify-center items-center absolute top-[50%] left-0 z-50 h-[1px] w-full bg-[rgb(60,60,60)] shadow-xl"></div>
              )}

              <Stage
                ref={stageRef}
                width={storyProperties.width}
                height={storyProperties.height}
              >
                <Layer ref={layerRef}></Layer>
              </Stage>
              {isInBaseContext &&
              selectedItemCoord.x !== 0 &&
              selectedItemCoord.y !== 0 ? (
                <ToolBar x={selectedItemCoord.x} y={selectedItemCoord.y} />
              ) : null}
              {!hasPassedTemplateStep && (
                <div className="w-full flex absolute h-full justify-center items-center flex-col rounded-lg z-50 bg-[rgb(0,0,0,0.4)]">
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ opacity: 0.8 }}
                    className=" cursor-pointer select-none relative"
                    onClick={() => handleChooseTemplate("from-media")}
                  >
                    <span className="tracking-tighter cursor-pointer">
                      Ajoutez un media
                    </span>
                  </motion.div>
                  <span className="tracking-tighter select-none pointer-events-none">
                    {" "}
                    ou{" "}
                  </span>
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ opacity: 0.8 }}
                    className=" cursor-pointer select-none"
                    onClick={() => handleChooseTemplate("from-base-model")}
                  >
                    <span className="tracking-tighter">
                      {" "}
                      Continuez avec le modèle de base{" "}
                    </span>
                  </motion.div>
                </div>
              )}
              <motion.div
                whileTap={{ scale: 0.97 }}
                whileHover={{ opacity: 0.8 }}
                className={` ${isInBaseContext ? "" : "hidden"} ${
                  isDraggingText ? "hidden" : ""
                }  cursor-pointer select-none w-full absolute bottom-0 pb-4 flex justify-center items-center gap-2 flex-row`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="currentColor"
                    d="M8 15c-3.86 0-7-3.14-7-7s3.14-7 7-7s7 3.14 7 7s-3.14 7-7 7ZM8 2C4.69 2 2 4.69 2 8s2.69 6 6 6s6-2.69 6-6s-2.69-6-6-6Z"
                  />
                  <path
                    fill="currentColor"
                    d="M8 11.5c-.28 0-.5-.22-.5-.5V5c0-.28.22-.5.5-.5s.5.22.5.5v6c0 .28-.22.5-.5.5Z"
                  />
                  <path
                    fill="currentColor"
                    d="M11 8.5H5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h6c.28 0 .5.22.5.5s-.22.5-.5.5Z"
                  />
                </svg>
                <span className=" text-[13px] ">Ajoutez à votre story</span>
              </motion.div>
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoryCreate;
