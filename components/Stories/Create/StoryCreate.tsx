"use client";

import {
  ASPECT_RATIOS,
  STORY_VIEWER_ASPECT_RATIO_W_H,
  STORY_VIEWER_LARGE_HEIGHT_PCT,
} from "@/constants/constants";
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import DrawPlugin from "./DrawPlugin/DrawPlugin";
import { Layer, Stage, Transformer } from "react-konva";
import Konva from "konva";
import "../../../app/globals.css";
import { Drawer } from "vaul";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

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
  const textFonts = useRef<TextFonts[]>([
    { variable: "Arial", renderedFont: "Arial" },
    { variable: "var(--font-code2001)", renderedFont: "__code2001_b724b6" },
    { variable: "var(--font-andalos)", renderedFont: "__peristiwa_df0a95" },
  ]);
  const [hasPassedTemplateStep, setHasPassedTemplateStep] = useState(false);
  const [isInDrawingContext, setIsInDrawingContext] = useState(false);
  const [isInTextContext, setIsInTextContext] = useState(false);
  const [isAddingNewText, setisAddingNewText] = useState(false);
  const [isInBaseContext, setIsInBaseContext] = useState(true);
  const [isInWidgetContext, setIsInWidgetContext] = useState(false);
  const transformerInstancesRef = useRef<Konva.Transformer[]>([]);
  const textInstancesRef = useRef<Konva.Text[]>([]);
  const [toRenderTextFont, setToRenderTextFont] = useState("Arial");

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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [textValue, setTextValue] = useState("");
  const [textNode, setTextNode] = useState<Konva.Text | null>(null);
  const [selectedTextNode, setSelectedTextNode] = useState<Konva.Text | null>(
    null
  );
  const transformerRef = useRef<Konva.Transformer>(null);
  const [selectedTextFont, setSelectedTextFont] = useState("Arial");
  const [isFontLoaded, setIsFontLoaded] = useState(false);

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
    console.log(node);
    setSelectedTextNode(node);
    const transformer = transformerRef.current;
    if (transformer) {
      transformer.nodes([node]);
      transformer.getLayer()?.batchDraw();
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
      setSelectedTextNode(null);
      const transformer = transformerRef.current;
      if (transformer) {
        console.log(transformerInstancesRef, textInstancesRef);
        transformerInstancesRef.current.forEach((element) => {
          element.nodes([]);
          element.getLayer()?.batchDraw();
        });
        transformer.nodes([]);
        transformer.getLayer()?.batchDraw();
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
    console.log(stage, layer);
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
              ? textareaRef.current?.clientWidth
              : textWidth,
          align: "center",
          id: `${new Date().getTime()}`, // unique ID
          fill: "white",
        });
        whenFontIsLoaded(
          function () {
            newText.fontFamily(toRenderTextFont);
          },
          20,
          textValue
        );
        textInstancesRef.current.push(newText);
        layer.clear();
        layer.add(newText);
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
            width:
              textWidth > textareaRef.current?.clientWidth
                ? textareaRef.current?.clientWidth
                : textWidth,
            align: "center",
            id: `${new Date().getTime()}`, // unique ID
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
  return (
    <>
      <Drawer.Root direction="bottom">
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
              <div
                style={{
                  width: storyProperties.width,
                  height: storyProperties.height,
                }}
                className=" flex relative bg-border rounded-lg "
              >
                <div className="flex justify-center items-center w-full h-full z-50 bg-[rgb(0,0,0,0.4)]">
                  <textarea
                    value={textValue}
                    onChange={handleTextChange}
                    ref={textareaRef}
                    className="text-center absolute top-20"
                    style={{
                      fontFamily: selectedTextFont,
                      width: "50%",
                      height: "100%",
                      fontSize: "16px",
                      border: "none",
                      resize: "none",
                      background: "transparent",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  />
                </div>
                <div className="absolute top-0 pt-4 px-5 right-0 text-[13px] z-[51]">
                  <button onClick={handleFinishEditing}>Terminer</button>
                  <div className="relative mt-6">
                    <motion.div
                      ref={LayoutContainerRef}
                      animate={controls}
                      className="flex flex-col gap-[10px] hide-scrollbar relative overflow-y-auto max-h-[250px]"
                      style={{ scrollBehavior: "smooth" }}
                    >
                      <div className="flex flex-col gap-[8px] justify-center items-center p-1">
                        {textFonts.current.map((font, index) => (
                          <motion.div
                            key={index}
                            style={{
                              fontFamily: font.variable,
                            }}
                            onClick={() => {
                              setSelectedTextFont(font.variable);
                              setToRenderTextFont(font.renderedFont);
                            }}
                            className="w-9 h-9 rounded-lg bg-[rgb(168,168,168,.3)] border border-[rgb(18,18,18,.65)] flex cursor-pointer text-[20px] text-center justify-center items-center"
                            whileTap={{ scale: 0.97 }}
                            transition={{
                              type: "spring",
                              stiffness: 700,
                              damping: 20,
                            }}
                          >
                            Aa
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}

            <Drawer.Portal>
              <div className=" min-h-screen absolute top-0 w-full flex items-center justify-center ">
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
                    {isInWidgetContext && (
                      <>
                        <Drawer.Overlay
                          style={{
                            width: storyProperties.width,
                            height: storyProperties.height,
                          }}
                          className="absolute inset-0 bg-black/20 z-[59]"
                          onClick={() => {
                            setIsInWidgetContext(false);
                          }}
                        />
                        <Drawer.Content
                          style={{
                            transform: "translate3d(0,0,0)",
                            width: storyProperties.width,
                          }}
                          className=" overflow-hidden backdrop-blur-[6px] flex flex-col flex-grow  rounded-t-[16px] h-[80%] z-[61] absolute bottom-0"
                        >
                          <div className="p-4 bg-good-gray/50 rounded-t-[16px] flex-1 overflow-hidden ">
                            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
                            <div className="max-w-md grid grid-cols-3 gap-4 mx-auto">
                              <div className="w-full h-12 rounded-lg bg-black"></div>
                              <div className="w-full h-12 rounded-lg bg-black"></div>
                              <div className="w-full h-12 rounded-lg bg-black"></div>
                              <div className="w-full h-12 rounded-lg bg-black"></div>
                              <div className="w-full h-12 rounded-lg bg-black"></div>
                              <div className="w-full h-12 rounded-lg bg-black"></div>
                              <div className="w-full h-12 rounded-lg bg-black"></div>
                              <div className="w-full h-12 rounded-lg bg-black"></div>
                              <div className="w-full h-12 rounded-lg bg-black"></div>
                              <div className="w-full h-12 rounded-lg bg-black"></div>
                              <div className="w-full h-12 rounded-lg bg-black"></div>
                              <div className="w-full h-12 rounded-lg bg-black"></div>
                            </div>
                          </div>
                        </Drawer.Content>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Drawer.Portal>
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
                            whileTap={{ opacity: 0.75 }}
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
                            alignOffset={-17}
                            className="w-[180px] drop-shadow-xl rounded-2xl bg-[#181818] border-x-[0.2333333px] border-b-[0.2333333px]  border-x-border border-y-border  text-small-semibold !text-[15px]"
                          >
                            <DropdownMenuGroup className="text-white text-[14px] m-1">
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
                    <Drawer.Trigger asChild>
                      <motion.div
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ opacity: 0.8 }}
                        onClick={() => {
                          setIsInWidgetContext(true);
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
                    </Drawer.Trigger>

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
                    <Transformer
                      ref={transformerRef}
                      flipEnabled={false}
                      boundBoxFunc={(oldBox, newBox) => {
                        if (
                          Math.abs(newBox.width) < 5 ||
                          Math.abs(newBox.height) < 5
                        ) {
                          return oldBox;
                        }
                        return newBox;
                      }}
                      keepRatio={true}
                      enabledAnchors={[
                        "top-left",
                        "top-right",
                        "bottom-left",
                        "bottom-right",
                      ]}
                      rotateEnabled={true}
                      resizeEnabled={true}
                      rotationSnaps={[0, 90, -90, 180, -180]}
                      rotationSnapTolerance={10}
                    />
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
      </Drawer.Root>
    </>
  );
};

export default StoryCreate;
