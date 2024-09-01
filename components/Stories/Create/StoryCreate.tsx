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
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import getFeaturedStickers from "@/lib/actions/stories.actions";
import { useQueryFeaturedStickers } from "@/hooks/queries/useQueryFeaturedStickers";

import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import GifPlugin from "./GifPlugin/GifPlugin";
import TextPlugin from "./TextPlugin/TextPlugin";
type TextFonts = {
  variable: string;
  renderedFont: string;
};

const StoryCreate = () => {
  const router = useRouter();
  const [storyProperties, setStoryProperties] = useState({
    width: 0,
    height: 0,
  });
  const [storyContainerProperties, setStoryContainerProperties] = useState({
    width: 0,
    height: 0,
  });

  const [hasPassedTemplateStep, setHasPassedTemplateStep] = useState(false);
  const [isInDrawingContext, setIsInDrawingContext] = useState(false);
  const [isInTextContext, setIsInTextContext] = useState(false);
  const [isAddingNewText, setisAddingNewText] = useState(false);
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

  const handleChooseTemplate = () => {
    setHasPassedTemplateStep(true);
  };

  const handleDrawingContext = () => {
    setIsInDrawingContext(!isInDrawingContext);
    setIsInBaseContext(!isInBaseContext);
  };

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


  
  const stageRef = useRef<Konva.Stage | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);
  const transformerInstancesRef = useRef<Konva.Transformer[]>([]);
  const textInstancesRef = useRef<Konva.Text[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [toRenderTextFont, setToRenderTextFont] = useState("Arial");
  const [textValue, setTextValue] = useState("");
  const [textNode, setTextNode] = useState<Konva.Text | null>(null);
  const [selectedTextFont, setSelectedTextFont] = useState("Arial");
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const textFonts = useRef<TextFonts[]>([
    { variable: "Arial", renderedFont: "Arial" },
    { variable: "Arial", renderedFont: "Arial" },
    { variable: "Arial", renderedFont: "Arial" },
    { variable: "Arial", renderedFont: "Arial" },
    { variable: "var(--font-code2001)", renderedFont: "__code2001_b724b6" },
    { variable: "var(--font-andalos)", renderedFont: "__peristiwa_df0a95" },
  ]);
  function whenFontIsLoaded(
    callback: () => void,
    attemptCount: number | undefined,
    text: string
  ) {
    if (attemptCount === undefined) {
      attemptCount = 0;
    }
    if (attemptCount >= 20) {
      callback();
      return;
    }
    if (isFontLoaded) {
      callback();
      return;
    }
    const ctx = document.createElement("canvas").getContext("2d");
    if (ctx) {
      var metrics = ctx.measureText(text);
      var initialMeasure = ctx.measureText(text);
      var initialWidth = initialMeasure.width;
      const width = metrics.width;
      if (width !== initialWidth) {
        setIsFontLoaded(true);
        callback();
      } else {
        setTimeout(function () {
          whenFontIsLoaded(callback, attemptCount + 1, text);
        }, 1000);
      }
    }
  }

  const handleTextNodeClick = (node: Konva.Text) => {
    if (transformerInstancesRef.current) {
      const id = node.id();
      console.log(
        transformerInstancesRef.current[parseInt(id)],
        transformerInstancesRef.current.length,
        parseInt(id)
      );
      transformerInstancesRef.current[parseInt(id)].nodes([node]);
      transformerInstancesRef.current[parseInt(id)].getLayer()?.batchDraw();
    }
  };

  const handleTextNodeDblClick = (node: Konva.Text) => {
    setTextValue(node.text());
    setToRenderTextFont(node.fontFamily());
    setSelectedTextFont(node.fontFamily());
    setTextNode(node);
    setisAddingNewText(false);
    setIsInTextContext(true);
    setIsInBaseContext(false);
  };

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (e.target === stage) {
      if (transformerInstancesRef.current) {
        transformerInstancesRef.current.forEach((element) => {
          element.nodes([]);
          element.getLayer()?.batchDraw();
        });
      }
    }
  };

  const calculateTextWidth = (text: string, fontFamily = "Arial") => {
    const context = document.createElement("canvas").getContext("2d");
    if (!context) return 200;
    context.font = `${16}px ${fontFamily}`;
    return context.measureText(text).width;
  };

  useEffect(() => {
    const stage = stageRef.current;

    if (stage) {
      stage.on("click", handleStageClick);
    }

    return () => {
      if (stage) {
        stage.off("click", handleStageClick);
      }
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleFinishEditing = () => {
    const stage = stageRef.current;
    const layer = layerRef.current;
    const padding = 5;
    if (stage && layer && textareaRef.current) {
      const textWidth = calculateTextWidth(textValue, "Arial");

      if (textNode === null) {
        const newText = new Konva.Text({
          text: textValue,
          x: storyProperties.width / 2,
          y: storyProperties.height / 2,
          fontSize: 16,
          fontFamily: toRenderTextFont,
          draggable: true,
          width:
            textWidth > textareaRef.current?.clientWidth
              ? textareaRef.current?.clientWidth + padding * 2
              : textWidth + padding * 2,
          align: "center",
          id: `${transformerInstancesRef.current.length}`, // unique ID
          fill: "white",
        });
        const transformerDependency = [] as any[];

        // Initialize the largest width with a small value
        let largestWidth = 0;

        newText.textArr.forEach((element) => {
          if (element.width > largestWidth) {
            largestWidth = element.width; // Update the largest width
          }
        });
        newText.textArr.forEach((element, index) => {
          const xPosition = storyProperties.width / 2 - largestWidth / 2;
          const yPosition = storyProperties.height / 2 - largestWidth / 2;
          var simpleLabel = new Konva.Label({
            x: xPosition + (largestWidth - element.width) / 2,
            y: yPosition + index * 15.75 + padding * 2,
            width: element.width + padding * 2,
            draggable: true,
            opacity: 1,
          });
          console.log(index, newText.textArr.length - 1);
          simpleLabel.add(
            new Konva.Rect({
              x: 0,
              y: 0,
              width: element.width + padding * 2,
              height: 16,
              cornerRadius:
                index === newText.textArr.length - 1 ? [0, 0, 20, 20] : 6,
              fill: "white",
            })
            /*      new Konva.Tag({
                cornerRadius: element.lastInParagraph ?  [0, 0, 20, 20] : 6,
                fill: "white",
              }) */
          );

          const konvaText = new Konva.Text({
            text: element.text,
            x: 0,
            y: 0,
            draggable: false,
            fontFamily: toRenderTextFont,
            fontSize: 16,
            fill: "black",
            width: element.width + padding * 2,
            align: "center",
          });

          simpleLabel.add(konvaText);

          transformerDependency.push(simpleLabel);
          layer.add(simpleLabel);
        });

        // Now, mostLargeText holds the Konva.Text element with the largest width

        console.log(newText.textArr);
        whenFontIsLoaded(
          function () {
            newText.fontFamily(toRenderTextFont);
          },
          20,
          textValue
        );
        const transformer = new Konva.Transformer({
          nodes: transformerDependency,
          anchorStroke: "#212121",
          anchorFill: "#434343",
          borderStroke: "#f1f1f1",
          anchorStyleFunc: (anchor) => {
            anchor.cornerRadius(10);
            anchor.fill("#2d2d2d");
            anchor.stroke("#212121");
            if (
              anchor.hasName("top-center") ||
              anchor.hasName("bottom-center")
            ) {
              anchor.height(6);
              anchor.offsetY(3);
              anchor.width(30);
              anchor.offsetX(15);
            }
            if (
              anchor.hasName("middle-left") ||
              anchor.hasName("middle-right")
            ) {
              anchor.height(30);
              anchor.offsetY(15);
              anchor.width(6);
              anchor.offsetX(3);
            }
          },
          keepRatio: true,
          enabledAnchors: [
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ],
          rotateEnabled: true,
          resizeEnabled: true,
          rotationSnaps: [0, 90, -90, 180, -180],
          rotationSnapTolerance: 10,
        });
        console.log(transformer.width());
        textInstancesRef.current.push(newText);
        transformerInstancesRef.current.push(transformer as Konva.Transformer);
        layer.clear();
        /*         layer.add(newText);
         */ layer.add(transformer);
        layer.draw();
        setTextNode(newText);
        setIsInTextContext(false);
        setIsInBaseContext(true);
      } else {
        if (isAddingNewText) {
          const newText = new Konva.Text({
            text: textValue,
            x: storyProperties.width / 2,
            y: storyProperties.height / 2,
            fontSize: 16,
            fontFamily: toRenderTextFont,
            draggable: true,
            sceneFunc: function (context, shape) {
              const width = shape.width() + padding * 2;
              const height = shape.height() + padding * 2;

              // Set the position to accommodate padding
              context.beginPath();
              const radius = 12; // Radius for rounded corners
              const x = -padding; // Offset by padding to align text
              const y = -padding;

              // Draw rounded rectangle background
              context.moveTo(x + radius, y);
              context.arcTo(x + width, y, x + width, y + height, radius);
              context.arcTo(x + width, y + height, x, y + height, radius);
              context.arcTo(x, y + height, x, y, radius);
              context.arcTo(x, y, x + width, y, radius);
              context.closePath();

              // Fill the background
              context.fillStyle = "rgb(100,100,0)";
              context.fill();

              // Draw the text
              (shape as Konva.Text)._sceneFunc(context);
            },
            width:
              textWidth > textareaRef.current?.clientWidth
                ? textareaRef.current?.clientWidth + padding * 2
                : textWidth + padding * 2,
            align: "center",
            id: `${transformerInstancesRef.current.length}`, // unique ID
            fill: "white",
          });
          whenFontIsLoaded(
            function () {
              newText.fontFamily(toRenderTextFont);
            },
            20,
            textValue
          );
          const transformer = new Konva.Transformer({
            nodes: [newText],
            keepRatio: true,
            anchorStroke: "#2d2d2d",
            anchorFill: "#434343",
            borderStroke: "#f1f1f1",
            anchorStyleFunc: (anchor) => {
              anchor.cornerRadius(10);
              anchor.fill("#434343");
              anchor.stroke("#2d2d2d");
              if (
                anchor.hasName("top-center") ||
                anchor.hasName("bottom-center")
              ) {
                anchor.height(6);
                anchor.offsetY(3);
                anchor.width(30);
                anchor.offsetX(15);
              }
              if (
                anchor.hasName("middle-left") ||
                anchor.hasName("middle-right")
              ) {
                anchor.height(30);
                anchor.offsetY(15);
                anchor.width(6);
                anchor.offsetX(3);
              }
            },
            enabledAnchors: [
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
            ],
            rotateEnabled: true,
            resizeEnabled: true,
            rotationSnaps: [0, 90, -90, 180, -180],
            rotationSnapTolerance: 10,
          });
          textInstancesRef.current.push(newText);
          transformerInstancesRef.current.push(
            transformer as Konva.Transformer
          );
          layer.add(newText);
          layer.add(transformer);
          layer.draw();
          setTextNode(newText);
          setIsInTextContext(false);
          setIsInBaseContext(true);
          setisAddingNewText(false);
          return;
        }
        layer.clear();
        textNode.width(
          textWidth > textareaRef.current?.clientWidth
            ? textareaRef.current?.clientWidth
            : textWidth
        );
        textNode.text(textValue);
        whenFontIsLoaded(
          function () {
            textNode.fontFamily(toRenderTextFont);
          },
          20,
          textValue
        );
        layer.draw();
        setIsInTextContext(false);
        setIsInBaseContext(true);
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  };

  useEffect(() => {
    const stage = stageRef.current;
    const layer = layerRef.current;

    if (stage && layer && textNode && textInstancesRef) {
      textInstancesRef.current.forEach((text) => {
        text.on("click", () => handleTextNodeClick(text));
        text.on("dblclick", () => handleTextNodeDblClick(text));
        text.on("dragmove", () => {
          if (text) {
            const nodePos = text.getPosition();
            const nodeWidth = text.width();
            const nodeHeight = text.height();

            const centerX = storyProperties.width / 2;
            const centerY = storyProperties.height / 2;

            if (Math.abs(nodePos.x + nodeWidth / 2 - centerX) < 10) {
              text.x(centerX - nodeWidth / 2);
            }

            if (Math.abs(nodePos.y + nodeHeight / 2 - centerY) < 10) {
              text.y(centerY - nodeHeight / 2);
            }
          }
        });
      });

      // Add listeners for textNode
      textNode.on("click", () => handleTextNodeClick(textNode));
      textNode.on("dblclick", () => handleTextNodeDblClick(textNode));
      textNode.on("dragmove", () => {
        if (textNode) {
          const nodePos = textNode.getPosition();
          const nodeWidth = textNode.width();
          const nodeHeight = textNode.height();

          const centerX = storyProperties.width / 2;
          const centerY = storyProperties.height / 2;

          if (Math.abs(nodePos.x + nodeWidth / 2 - centerX) < 10) {
            textNode.x(centerX - nodeWidth / 2);
          }

          if (Math.abs(nodePos.y + nodeHeight / 2 - centerY) < 10) {
            textNode.y(centerY - nodeHeight / 2);
          }
        }
      });
    }

    return () => {
      if (textInstancesRef.current) {
        textInstancesRef.current.forEach((text) => {
          text.off("click dblclick dragmove");
        });
      }

      if (textNode) {
        textNode.off("click dblclick dragmove");
      }
    };
  }, [
    textNode,
    textInstancesRef,
    storyProperties.width,
    storyProperties.height,
  ]);

  useEffect(() => {
    const stage = stageRef.current;

    if (stage) {
      stage.on("click", handleStageClick);
    }

    return () => {
      if (stage) {
        stage.off("click", handleStageClick);
      }
    };
  }, []);

  const AddTextOrModify = (isAddingNewText?: boolean) => {
    setisAddingNewText(true);
    setTextValue("");
    setIsInBaseContext(!isInBaseContext);
    setIsInTextContext(!isInTextContext);
  };

  const LayoutContainerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [snap, setSnap] = useState<number | string | null>(0.65);
  const [isDragging, setIsDragging] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isExtendedDrawer, setIsExtendedDrawer] = useState(false);
  function getTranslateYValue(transform: string) {
    const match = transform.match(/translateY\((-?\d+(\.\d+)?)px\)/); // Regex to find translateY value
    return match ? parseFloat(match[1]) : 0; // Return the numeric value, or 0 if not found
  }

  const [visibleAreaBeforeScroll, setVisibleAreaBeforeScroll] = useState(0);

  useEffect(() => {
    const transformValue = getTranslateYValue(
      drawerRef.current?.style.transform || ""
    );
    if (isDragging) {
      setVisibleAreaBeforeScroll(storyProperties.height - transformValue);
      return;
    }
    if (isExtendedDrawer) {
      setVisibleAreaBeforeScroll(storyProperties.height - 46);
      return;
    } else if (!isExtendedDrawer) {
      setVisibleAreaBeforeScroll(storyProperties.height / 1.66667 - 46);
    }
  }, [isDragging, storyProperties.height, drawerRef.current?.style.transform]);

  const { data, refetch } = useQueryFeaturedStickers();

  const [searchValue, setSearchValue] = useState("");

  const makeGIFSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
  };
  return (
    <>
      <AnimatePresence>
        {isInWidgetContext && (
          <div className=" min-h-screen absolute top-0 w-full flex items-center justify-center ">
            <div
              style={{
                width: storyContainerProperties.width,
                height: storyContainerProperties.height,
              }}
              className="absolute inset-0 bg-transparent z-[59]"
              onClick={() => {
                setIsInWidgetContext(false);
                setIsInWidgetGifContext(false);
                setIsExtendedDrawer(false);
              }}
            />
            <div
              className="flex items-center justify-center relative overflow-hidden"
              style={{
                width: storyContainerProperties.width,
                height: storyContainerProperties.height,
              }}
            >
              <div
                style={{
                  width: storyProperties.width,
                  height: storyProperties.height,
                }}
                className=" flex relative  rounded-lg overflow-hidden "
              >
                <motion.div
                  ref={drawerRef}
                  initial={{ y: 1000 }}
                  animate={{
                    y: isExtendedDrawer ? 0 : storyProperties.height / 2.5,
                  }}
                  exit={{ y: 1200 }}
                  drag="y"
                  dragConstraints={{
                    top: isExtendedDrawer ? 0 : storyProperties.height / 2.5,
                    bottom: isExtendedDrawer ? 0 : storyProperties.height / 2.5,
                  }}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={(event, info) => {
                    setIsDragging(false);
                    if (drawerRef.current) {
                      const translateY = getTranslateYValue(
                        drawerRef.current?.style.transform || ""
                      );
                      if (translateY >= storyProperties.height / 1.66667) {
                        setIsInWidgetContext(false);
                        setIsExtendedDrawer(false);
                        setIsInWidgetGifContext(false);
                        return;
                      }
                      if (
                        translateY <= storyProperties.height / 4 &&
                        !isExtendedDrawer
                      ) {
                        setIsExtendedDrawer(true);
                        return;
                      }
                      if (
                        translateY <= storyProperties.height / 2.6667 &&
                        translateY >= storyProperties.height / 7.33337 &&
                        isExtendedDrawer
                      ) {
                        setIsExtendedDrawer(false);
                        return;
                      }
                    }
                  }}
                  transition={{
                    duration: 0.475,
                    ease: [0.55, 0.79, 0.16, 0.99],
                  }}
                  style={{
                    width: storyProperties.width,
                  }}
                  className="backdrop-blur-[12px] bg-[#2d2d2d]/60 drawer-shadow flex flex-col flex-grow rounded-t-2xl z-[61] overflow-hidden h-[150%]"
                >
                  <div className="flex p-3 items-stretch ">
                    <div className=" mx-auto w-12 h-1 cursor-grab active:cursor-grabbing flex-shrink-0 rounded-full bg-zinc-300 " />
                  </div>
                  {isInWidgetGifContext && (
                    <div
                      style={{
                        width: storyProperties.width,
                        height: "40px",
                      }}
                      className="flex flex-row shadow-xl pr-[6px] bg-[#2d2d2d]"
                    >
                      <motion.div
                        whileTap={{ scale: 0.98, opacity: 0.6 }}
                        onClick={() => {
                          setIsInWidgetGifContext(false);
                          setIsInWidgetBaseContext(true);
                        }}
                        className="flex justify-center items-center ml-2 mr-1 py-1 rounded-full hover:opacity-80 cursor-pointer h-[35px]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill="currentColor"
                            fill-rule="evenodd"
                            d="M7.222 9.897c2.3-2.307 4.548-4.559 6.744-6.754a.65.65 0 0 0 0-.896c-.311-.346-.803-.316-1.027-.08c-2.276 2.282-4.657 4.667-7.143 7.156c-.197.162-.296.354-.296.574c0 .221.099.418.296.592l7.483 7.306a.749.749 0 0 0 1.044-.029c.358-.359.22-.713.058-.881a3407.721 3407.721 0 0 1-7.16-6.988Z"
                          />
                        </svg>
                      </motion.div>
                      <label
                        className={`bg-[#181818] z-[51] px-3 py-1.5 flex w-full h-[35px]  rounded-xl
                        border-x-[1px] border-y-[1px] border-x-border border-y-border`}
                      >
                        <input
                          id="search"
                          autoComplete="off"
                          placeholder="Rechercher"
                          type="search"
                          onChange={(e) => makeGIFSearch(e)}
                          className="search-cancel:bg-[url(https://picsum.photos/16/16)] placeholder:text-[13px] placeholder:font-[150] placeholder:text-white placeholder:opacity-50 w-full h-full outline-none bg-[#181818] font-light text-[13px] "
                        />
                      </label>
                    </div>
                  )}
                  <div className=" items-stretch flex flex-col flex-shrink-0 overflow-visible relative align-baseline">
                    <div
                      className={`overflow-y-auto ${
                        isInWidgetGifContext ? "flex justify-end" : ""
                      } `}
                      id="style-4"
                      style={{
                        height: isInWidgetGifContext
                          ? visibleAreaBeforeScroll - 23.333337
                          : visibleAreaBeforeScroll,
                      }}
                    >
                      {isInWidgetBaseContext && (
                        <>
                          <div className="w-full h-2 bg-transparent"></div>
                          <div className="flex translate-x-0 touch-pan-y">
                            <motion.div className="max-w-md mx-auto gap-4 grid-cols-auto">
                              <div className="flex flex-row justify-center items-center gap-3">
                                <motion.div
                                  whileTap={{ scale: 0.97, rotate: "2deg" }}
                                  style={{ rotate: "-2deg" }}
                                  className="text-[20px] cursor-pointer flex flex-row gap-1 justify-center items-center w-fit rounded-xl bg-white rotate-[3deg] px-1.5 py-0.5 text-black"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                  >
                                    <g
                                      fill="none"
                                      stroke="#52489C"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                    >
                                      <circle cx="12" cy="10" r="3" />
                                      <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8Z" />
                                    </g>
                                  </svg>
                                  <span className="text-[20px]  tracking-tight font-[450] ">
                                    LOCALISATION
                                  </span>
                                </motion.div>
                                <motion.div
                                  whileTap={{ scale: 0.98, rotate: "-3deg" }}
                                  style={{ rotate: "3deg" }}
                                  className="text-[20px]  cursor-pointer flex flex-row gap-1 justify-center items-center w-fit rounded-[10px] bg-white rotate-[3deg] px-1.5 py-0.5 text-black tracking-tight font-[450]"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                  >
                                    <g
                                      fill="none"
                                      stroke="#22C55E"
                                      stroke-width="2"
                                    >
                                      <circle cx="12" cy="12" r="4" />
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10c2.252 0 4.33-.744 6.001-2"
                                      />
                                      <path
                                        stroke-linecap="round"
                                        d="M16 8v4c0 1 .6 3 3 3s3-2 3-3"
                                      />
                                    </g>
                                  </svg>
                                  <span className="text-[20px]  tracking-tight font-[450] ">
                                    MENTION
                                  </span>
                                </motion.div>
                              </div>

                              <div className="flex flex-row justify-center items-center gap-3">
                                <motion.div
                                  whileTap={{ scale: 0.98, rotate: "-3deg" }}
                                  style={{ rotate: "3deg" }}
                                  className="text-[20px]  cursor-pointer flex flex-row gap-1 justify-center items-center w-fit rounded-[10px] bg-white rotate-[3deg] px-1.5 py-0.5 text-black tracking-tight font-[450]"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                  >
                                    <g
                                      fill="none"
                                      stroke="#465C69"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                    >
                                      <path d="m6.233 5.834l.445-2.226A2 2 0 0 1 8.64 2h6.72a2 2 0 0 1 1.962 1.608l.445 2.226a1.879 1.879 0 0 0 1.387 1.454A3.758 3.758 0 0 1 22 10.934V18a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-7.066a3.758 3.758 0 0 1 2.846-3.646a1.879 1.879 0 0 0 1.387-1.454Z" />
                                      <circle cx="12" cy="14" r="4" />
                                      <path d="M11 6h2" />
                                    </g>
                                  </svg>
                                  <span className="text-[20px]  tracking-tight font-[450] ">
                                    PHOTO
                                  </span>
                                </motion.div>
                                <motion.div
                                  whileTap={{ scale: 0.98, rotate: "3deg" }}
                                  style={{ rotate: "-3deg" }}
                                  className="text-[20px]  cursor-pointer flex flex-row gap-1 justify-center items-center w-fit rounded-[10px] bg-white rotate-[3deg] px-1.5 py-0.5 text-black tracking-tight font-[450]"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    className=" rotate-45"
                                  >
                                    <path
                                      fill="none"
                                      stroke="#A8201A"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M9 12h6m0-6h1a6 6 0 0 1 0 12h-1m-6 0H8A6 6 0 0 1 8 6h1"
                                    />
                                  </svg>
                                  <span className="text-[20px]  tracking-tight font-[450] ">
                                    LIEN
                                  </span>
                                </motion.div>
                              </div>
                              <div className="flex flex-row justify-center items-center gap-3">
                                <motion.div
                                  whileTap={{ scale: 0.98, rotate: "3deg" }}
                                  style={{ rotate: "-4deg" }}
                                  className="text-[18px]  cursor-pointer flex flex-row gap-1 justify-center items-center w-fit rounded-[10px] bg-white rotate-[3deg] px-1.5 py-0.5 text-black tracking-tight font-[450]"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      fill="none"
                                      stroke="#ED254E"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M10 3L6 21M18 3l-4 18M4 8h17M3 16h17"
                                    />
                                  </svg>
                                  <span className="text-[18px]  tracking-tight font-[450] ">
                                    HASHTAG
                                  </span>
                                </motion.div>
                                <motion.div
                                  whileTap={{
                                    scale: 0.93,
                                    rotate: "-2deg",
                                    opacity: 0.76667,
                                    background:
                                      "linear-gradient(95deg, rgb(153,51,255), rgb(97,87,255))",
                                  }}
                                  style={{
                                    rotate: "1deg",
                                    background:
                                      "linear-gradient(45deg, rgb(153,51,255), rgb(97,87,255))",
                                    animation:
                                      "gradientAnimation 5s ease infinite",
                                  }}
                                  onClick={() => {
                                    setIsInWidgetGifContext(true);
                                    setIsInWidgetBaseContext(false);
                                  }}
                                  className="text-[18px] cursor-pointer w-fit rounded-[10px] px-1.5 py-0.5 text-white tracking-tight font-[450] drop-shadow-glow"
                                >
                                  GIF
                                </motion.div>
                              </div>
                            </motion.div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 p-5 translate-x-0 touch-pan-y">
                            {data?.map((src, index) => (
                              <div
                                key={index}
                                className="mt-1.5 w-full h-fit rounded-lg bg-black"
                              >
                                <img
                                  className="rounded-lg"
                                  src={src}
                                  alt={`Image ${index + 1}`}
                                />
                              </div>
                            ))}
                          </div>
                          <div className="w-full h-2 bg-transparent"></div>
                        </>
                      )}
                      {isInWidgetGifContext && (
                        <GifPlugin
                          width={storyProperties.width}
                          searchValue={searchValue}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
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
          <TextPlugin storyProperties={storyProperties} isAddingNewText={isAddingNewText} setIsInTextContext={setIsInTextContext} setisAddingNewText={function (state: boolean): void {
              throw new Error("Function not implemented.");
            } } setIsInBaseContext={function (state: boolean): void {
              throw new Error("Function not implemented.");
            } } />
          )}

          <>
            <div
              style={{
                width: storyProperties.width,
                height: storyProperties.height,
              }}
              className={` ${
                isInBaseContext ? "" : "hidden"
              } flex relative bg-border rounded-lg`}
            >
              <div className="absolute top-0 flex z-40 flex-row w-full  justify-between">
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
                      className="w-[180px] drop-shadow-xl p-2 rounded-2xl bg-[#181818] border-x-[0.2333333px] border-b-[0.2333333px]  border-x-border border-y-border  text-small-semibold !text-[15px]"
                    >
                      <DropdownMenuGroup className="text-white text-[14px] flex flex-col gap-3 m-1">
                        <DropdownMenuItem>Enregistrer</DropdownMenuItem>

                        <DropdownMenuItem>Bloquer</DropdownMenuItem>

                        <DropdownMenuItem className="!text-[rgb(255,48,64)]">
                          Signaler
                        </DropdownMenuItem>

                        <DropdownMenuItem className="!text-[rgb(255,48,64)]">
                          Supprimer
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
              <Stage
                ref={stageRef}
                width={storyProperties.width}
                height={storyProperties.height}
              >
                <Layer ref={layerRef}>
                </Layer>
              </Stage>
              {!hasPassedTemplateStep && (
                <div className="w-full flex absolute h-full justify-center items-center flex-col rounded-lg z-50 bg-[rgb(0,0,0,0.4)]">
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ opacity: 0.8 }}
                    className=" cursor-pointer select-none"
                    onClick={handleChooseTemplate}
                  >
                    <span className="tracking-tighter">Ajoutez un media</span>
                  </motion.div>
                  <span className="tracking-tighter select-none pointer-events-none">
                    {" "}
                    ou{" "}
                  </span>
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ opacity: 0.8 }}
                    className=" cursor-pointer select-none"
                    onClick={handleChooseTemplate}
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
                className=" cursor-pointer select-none w-full absolute bottom-0 pb-4 flex justify-center items-center gap-2 flex-row"
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
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default StoryCreate;
