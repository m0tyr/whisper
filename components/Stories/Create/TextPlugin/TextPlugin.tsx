import LexicalContentEditable from "@/components/LexicalContentEditable/LexicalContentEditable";
import {
  Line,
  MentionInstance,
  TextBgTypes,
  TextColors,
  TextFonts,
  TextInstances,
} from "@/lib/types/stories.types";
import { parsePath, roundCommands } from "svg-round-corners";
import Konva from "konva";
import { Rect } from "konva/lib/shapes/Rect";
import { Text } from "konva/lib/shapes/Text";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  ElementNode,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  TextNode,
} from "lexical";
import React, { RefObject, use, useEffect, useRef, useState } from "react";
import FontChooser from "./FontChooser/FontChooser";
import ColorChooser from "./ColorChooser/ColorChooser";
import { motion } from "framer-motion";
import { $patchStyleText } from "@lexical/selection";
import { Tween } from "konva/lib/Tween";
import RangeSelector from "../RangeSelector/RangeSelector";
import { useStoryTextPlugin } from "@/hooks/useStoryTextPlugin";
import TextBackground from "./TextBackgroundChooser/TextBackgroundChooser";

interface TextPluginProps {
  stageRef: RefObject<Konva.Stage | null>;
  layerRef: RefObject<Konva.Layer | null>;
  storyProperties: {
    width: number;
    height: number;
  };
  isAddingNewText: boolean;
  setIsInTextContext: (state: boolean) => void;
  setisAddingNewText: (state: boolean) => void;
  setIsInBaseContext: (state: boolean) => void;

  toRenderTextFont: string;
  setToRenderTextFont: (font: string) => void;
  textValue: string;
  setTextValue: (value: string) => void;
  transformerInstancesRef: RefObject<Konva.Transformer[]>;
  textInstancesRef: RefObject<TextInstances[]>;
  onTextInstancesChange: (
    finalInstance: TextInstances[],
    mentionFinalInstance: MentionInstance
  ) => void;
}

const CHANGE_TEXT_COLOR_COMMAND = createCommand<string>();
const CHANGE_TEXT_FONT_COMMAND = createCommand<string>();

const TextPlugin: React.FC<TextPluginProps> = ({
  isAddingNewText,
  storyProperties,
  setIsInTextContext,
  setIsInBaseContext,
  setisAddingNewText,
  stageRef,
  layerRef,
  toRenderTextFont,
  setToRenderTextFont,
  textValue,
  setTextValue,
  transformerInstancesRef,
  textInstancesRef,
  onTextInstancesChange,
}) => {
  const editorRef: any = useRef<LexicalEditor | null>();
  const playgroundRef: any = useRef<HTMLDivElement | null>();
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [previewBgPath, setPreviewBgPath] = useState("");
  const [color, setColor] = useState<string>("rgb(255 255 255)");
  const [fontSavedIndex, setFontSavedIndex] = useState<number | null>(0);
  const [backgroundSavedIndex, setBackgroundSavedIndex] = useState<
    number | null
  >(0);
  const [toRenderTextBackground, setToRenderTextBackground] = useState<
    string | null
  >(null);
  const [colorSavedIndex, setColorSavedIndex] = useState<number | null>(0);
  const [isChoosingFont, setIsChoosingFont] = useState(false);
  const [isChoosingColor, setIsChoosingColor] = useState(false);
  const [isChoosingBgTypes, setIsChoosingBgTypes] = useState(false);
  const [isTextBackgroundSelected, setIsTextBackgroundSelected] =
    useState(false);
  const [rangeValue, setRangeValue] = useState(22);
  const handleRangeChange = (e: any) => {
    setRangeValue(e.target.value);
  };

  const {
    textColors,
    textFonts,
    textBgTypes,
    generateBackgroundShape,
    convertLinesWithMention,
    generatePreviewBgPath,
    makeLineBreakerMeasurer,
  } = useStoryTextPlugin({
    toRenderTextFont: toRenderTextFont,
    layerRef,
    playgroundRef,
    setPreviewBgPath,
    rangeValue,
  });

  function makeFinalText(pos: {
    text: any;
    padding: { left: number; top: number; right: any; bottom: any };
    margin: { left: number; top: number; right: any; bottom: any };
    x: number;
    y: number;
    angle: any;
  }) {
    setTimeout(() => {
      const stage = stageRef.current;
      const layer = layerRef.current;
      if (stage && layer) {
        layer.clear();

        var textMeasure = new Konva.Text({
          text: pos.text,
          fontFamily: toRenderTextFont,
          fontSize: rangeValue,
          fontStyle: "600",
          letterSpacing: -0.5,
          shadowColor: "rgba(0, 0, 0, 1)",
          shadowBlur: 1.5,
          shadowOffset: { x: 0, y: 2 },
          shadowOpacity: 0.3,
          fill: "#ffffff",
          visible: false,
        });

        layer.add(textMeasure);

        var top = pos.padding.top;
        var shapes: (Text | Rect)[] = [];
        const text = convertLinesWithMention(textMeasure);
        var mentionTextNode: Konva.Text[] = [];
        text.forEach((line, index) => {
          line.text = line.text.trimEnd();
          console.log(line.text);
          if (line.mentionNodesAnchorPosition)
            if (line.mentionNodesAnchorPosition?.length > 0) {
              let currentX = 0;
              const lineMeasurement = new Konva.Text({
                text: line.text,
                fontFamily: toRenderTextFont,
                fontSize: rangeValue,
                fontStyle: "600",
                letterSpacing: -0.5,
                shadowColor: "rgba(0, 0, 0, 1)",
                shadowBlur: 1.5,
                shadowOffset: { x: 0, y: 2 },
                shadowOpacity: 0.3,
                fill: color,
                visible: false,
                x: 0,
                y: top,
              });
              line.mentionNodesAnchorPosition.forEach((mentionLine) => {
                const beforeMention = line.text.substring(0, mentionLine.start);
                const mentionText = line.text.substring(
                  mentionLine.start,
                  mentionLine.end
                );
                const afterMention = line.text.substring(mentionLine.end);

                if (beforeMention) {
                  const beforeText = new Konva.Text({
                    text: beforeMention,
                    fontFamily: toRenderTextFont,
                    fontSize: rangeValue,
                    fontStyle: "600",
                    letterSpacing: -0.5,
                    shadowColor: "rgba(150, 150, 150, 1)",
                    shadowBlur: 2,
                    shadowOffset: { x: 0, y: 1 },
                    shadowOpacity: 0.3,
                    fill: color,
                    x: currentX,
                    y: top,
                  });
                  const beforeTextWidth = beforeText.width();
                  beforeText.x(
                    (textMeasure.width() - lineMeasurement.width()) / 2 +
                      currentX
                  );
                  shapes.push(beforeText);
                  currentX += beforeTextWidth;
                }

                const mention = new Konva.Text({
                  text: mentionText,
                  fontFamily: toRenderTextFont,
                  fontSize: rangeValue,
                  fontStyle: "600",
                  letterSpacing: -0.5,
                  textDecoration: "underline",
                  shadowColor: "rgba(150, 150, 150, 1)",
                  shadowBlur: 2,
                  shadowOffset: { x: 0, y: 1 },
                  shadowOpacity: 0.3,
                  fill: color,
                  x: currentX,
                  y: top,
                });
                mentionTextNode.push(mention);
                // Measure the mention text width
                const mentionTextWidth = mention.width();
                mention.x(
                  (textMeasure.width() - lineMeasurement.width()) / 2 + currentX
                );
                shapes.push(mention); // Add it to the shapes array

                // Update current X position
                currentX += mentionTextWidth;

                // Create the Konva.Text object for the text after the mention (normal style)
                if (afterMention) {
                  const afterText = new Konva.Text({
                    text: afterMention,
                    fontFamily: toRenderTextFont,
                    fontSize: rangeValue,
                    fontStyle: "600",
                    letterSpacing: -0.5,
                    shadowColor: "rgba(150, 150, 150, 1)",
                    shadowBlur: 2,
                    shadowOffset: { x: 0, y: 1 },
                    shadowOpacity: 0.3,
                    fill: color,
                    x: currentX, // Position at current X
                    y: top,
                  });

                  const afterTextWidth = afterText.width();
                  afterText.x(
                    (textMeasure.width() - lineMeasurement.width()) / 2 +
                      currentX
                  );
                  shapes.push(afterText); // Add it to the shapes array

                  // Update current X position
                  currentX += afterTextWidth;
                }
              });
            } else {
              var textWithNoMention = new Konva.Text({
                text: line.text,
                fontFamily: toRenderTextFont,
                fontSize: rangeValue,
                fontStyle: "600",
                letterSpacing: -0.5,
                shadowColor: "rgba(0, 0, 0, 1)",
                shadowBlur: 1.5,
                shadowOffset: { x: 0, y: 2 },
                shadowOpacity: 0.3,
                fill: color,
                x: 0,
                y: top,
              });
              textWithNoMention.x(
                (textMeasure.width() - textWithNoMention.width()) / 2
              );
              shapes.push(textWithNoMention);
            }
          top += parseInt(rangeValue.toString()) + 0.75;
        });

        // Group all shapes into a single group
        var group = new Konva.Group({
          x: pos.x,
          y: pos.y,
          rotation: pos.angle,
          draggable: true,

          id: `${transformerInstancesRef?.current?.length}`,
        });
        if (isTextBackgroundSelected) {
          const path = generateBackgroundShape({
            lines: JSON.parse(
              JSON.stringify(textMeasure.textArr as unknown as Line[])
            ),
            lineHeight: parseInt(rangeValue.toString()) + 0.75,
            width: textMeasure.width(),
            align: "center",
            padding: pos.padding.top * 2,
            cornerRadius: 8,
          });

          const konvaPath = new Konva.Path({
            data: path,
            fill: "#000",
            stroke: "#000",
          });
          group.add(konvaPath);
        }

        const transformer = new Konva.Transformer({
          nodes: [group],
          anchorStroke: "#21212100",
          borderStroke: "#f1f1f100",
          anchorFill: "#21212100",
          draggable: true,
          anchorStyleFunc: (anchor) => {
            anchor.stroke("#21212100");
            if (anchor.hasName("rotater")) {
              anchor.cornerRadius(30);
              anchor.width(28);
              anchor.height(28);
              anchor.offsetX(14.2);
              anchor.offsetY(-16.5);
            }
          },
          keepRatio: true,
          enabledAnchors: ["rotater"],
          rotateEnabled: true,
          resizeEnabled: true,
          rotationSnaps: [0, 90, -90, 180, -180],
          rotationSnapTolerance: 15,
        });

        shapes.forEach((shape) => group.add(shape));
        group.offsetX(textMeasure.width() / 2);
        group.offsetY(textMeasure.height() / 2);
        layer.add(group);

        layer.add(transformer);

        const dataPathShapes: any = {
          rotater: {
            path: `<svg id="Layer_1" data-name="Layer 1" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'>
              <path fill="currentColor" d="M16.25 18.48V15a.75.75 0 1 0-1.5 0v4c0 .97.78 1.75 1.75 1.75h4a.75.75 0 1 0 0-1.5h-2.6a8.75 8.75 0 0 0-2.07-15.53.75.75 0 1 0-.49 1.42 7.25 7.25 0 0 1 .91 13.34zM8.75 5.52V9a.75.75 0 0 0 1.5 0V5c0-.97-.78-1.75-1.75-1.75h-4a.75.75 0 0 0 0 1.5h2.6a8.75 8.75 0 0 0 2.18 15.57.75.75 0 0 0 .47-1.43 7.25 7.25 0 0 1-1-13.37z"></path>   
            </svg>`,
            shape: transformer.findOne(".rotater"),
          },
        };
        for (var path in dataPathShapes) {
          var shape = dataPathShapes[path].shape;
          var selector = path.replace("_", "-");
          if (shape) {
            var bgCircle = new Konva.Circle({
              radius: Math.max(shape.width(), shape.height()) / 2, // Set radius to fit the shape
              fill: "#212121", // Set background color
              listening: false,
              x: shape.x() + 14,
              y: shape.y() + 44,
              offsetX: shape.width() / 2, // Center horizontally
              offsetY: shape.height() / 2, // Center vertically
            });

            var icon = new Konva.Path({
              fill: "white",
              data: dataPathShapes[path].path,
              listening: false,
              name: selector + "-icon",
              scaleX: selector === "rotater" ? 0.7 : 1,
              scaleY: selector === "rotater" ? 0.7 : 1,
              x: shape.x() + 1, // Set x to the shape's x position
              y: shape.y() + 32, // Set y to the shape's y position
              offsetX: shape.width() / 2,
              offsetY: shape.height() / 2,
            });

            transformer.add(bgCircle);
            transformer.add(icon);
          }
        }

        transformerInstancesRef?.current?.push(
          transformer as Konva.Transformer
        );
        textInstancesRef?.current?.push({
          textsGroup: group,
          width: textMeasure.width(),
          height: textMeasure.height(),
        });
        const mentionInstanceLinked: MentionInstance = {
          fromGroup: group,
          mentionInstances: mentionTextNode,
        };
        onTextInstancesChange(
          textInstancesRef?.current as TextInstances[],
          mentionInstanceLinked
        );

        layer.draw();
      }
    }, 0);
  }

  const handleFinishEditing = () => {
    const stage = stageRef.current;
    const layer = layerRef.current;
    if (stage && layer && editorRef.current) {
      setTimeout(() => {
        const textBuild = makeLineBreakerMeasurer()?.join("\n");
        console.log(textBuild);
        makeFinalText({
          text: textBuild,
          x: storyProperties.width / 2,
          y: storyProperties.height / 2,
          angle: 0,
          padding: { left: 3, top: 3, right: 3, bottom: 3 },
          margin: { left: 5, top: 0, right: 5, bottom: 0 },
        });
        setIsInTextContext(false);
        setIsInBaseContext(true);
      }, 0);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  };

  const onContentChange = () => {
    const stringifiedEditorState = JSON.stringify(
      editorRef.current.getEditorState().toJSON()
    );
    const parsedEditorState = editorRef.current.parseEditorState(
      stringifiedEditorState
    );

    const editorStateTextString = parsedEditorState.read(() =>
      $getRoot().getTextContent()
    );
    setTextValue(editorStateTextString);
    if (isTextBackgroundSelected) {
      generatePreviewBgPath();
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (isTextBackgroundSelected) {
      generatePreviewBgPath();
    }
  }, [playgroundRef.current, toRenderTextFont]);

  useEffect(() => {
    if (color) {
      editorRef.current.registerCommand(
        CHANGE_TEXT_COLOR_COMMAND,
        (payload: any) => {
          setColorSavedIndex(() => {
            const index = textColors.current.findIndex(
              (color) => color.renderedColor === payload
            );
            return index >= 0 ? index : null; // If found, return index; otherwise, return null
          });
          // Getting the all the text and changing color.
          const rootNode = $getRoot();
          const allTextNodes = rootNode.getAllTextNodes();
          allTextNodes.forEach((node) => {
            node.setStyle(`
              font-family: ${toRenderTextFont};
              color: ${payload}
              `);
          });
          // Getting the current text and changing color.
          const selection = $getSelection();
          if (selection)
            $patchStyleText(selection, {
              "font-family": toRenderTextFont,
              color: payload,
            });
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );
      editorRef.current.dispatchCommand(CHANGE_TEXT_COLOR_COMMAND, color);
    }
  }, [color, editorRef.current]);

  useEffect(() => {
    if (editorRef.current && toRenderTextFont) {
      editorRef.current.update(() => {
        setFontSavedIndex(() => {
          const index = textFonts.current.findIndex(
            (font) => font.renderedFont === toRenderTextFont
          );
          return index >= 0 ? index : null;
        });
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const rootNode = $getRoot();
          const allTextNodes = rootNode.getAllTextNodes();
          allTextNodes.forEach((node) => {
            node.setStyle(`
              font-family: ${toRenderTextFont};
              color: ${color}
              `);
          });
          $patchStyleText(selection, {
            "font-family": toRenderTextFont,
            color: color,
          });
        }
        editorRef.current.dispatchCommand(CHANGE_TEXT_FONT_COMMAND, {
          styleKey: "fontFamily",
          styleValue: toRenderTextFont,
        });
        editorRef.current.focus();
      });
    }
  }, [toRenderTextFont, editorRef.current]);

  useEffect(() => {
    if (isTextBackgroundSelected) {
      generatePreviewBgPath();
    } else {
      setPreviewBgPath("");
    }
  }, [isTextBackgroundSelected]);

  return (
    <>
      <div
        style={{
          width: storyProperties.width,
          height: storyProperties.height,
        }}
        className=" flex relative bg-border rounded-lg w-full "
      >
        <div className="flex flex-col justify-center items-center w-full  h-full z-50 bg-[rgb(0,0,0,0.65)]">
          <div
            ref={playgroundRef}
            id="text-playground"
            className="min-w-[22px] max-w-[calc(100%_-_128px)]"
          >
            <div className="relative h-0 w-full">
              <div className=" absolute inset-0 z-0 h-full w-full">
                <svg className="h-fit w-full z-0 overflow-visible">
                  <path fill="black" fillOpacity={1} d={previewBgPath}></path>
                </svg>
              </div>
            </div>
            <LexicalContentEditable
              isRequestingFromStories={true}
              value={textValue}
              onChange={handleTextChange}
              watchtext={onContentChange}
              ref={editorRef}
              className="absolute top-20"
              style={{
                position: "relative",
                zIndex: 10,
                fontFamily: toRenderTextFont,
                textAlign: "center",
                width: "100%",
                height: textValue.trim() === "" ? "22px" : "auto",
                letterSpacing: "-0.5px",
                fontSize: `${rangeValue}px`,
                fontWeight: "600",
                textShadow: "rgba(0, 0, 0, 0.3) 0px 2px 1.5px",
                border: "none",
                resize: "none",
                background: "transparent",
                outline: "none",
                boxShadow: "none",
                lineHeight: `${rangeValue}px`,
              }}
            />
            <span
              id="to-render"
              style={{
                fontFamily: toRenderTextFont,
                textAlign: "center",
                display: "inline-block",
                width: "100%",
                letterSpacing: "-0.5px",
                verticalAlign: "baseline",
                marginTop: "72px",
                overflowWrap: "break-word",
                zIndex: -999,
                color: "white",
                fontSize: `${rangeValue}px`,
                fontWeight: "600",
                lineHeight: `${rangeValue}px`,
              }}
            ></span>
          </div>
        </div>
        <div className="absolute top-0 pt-4 right-0 text-[13px] z-[51]">
          <button className="mr-4" onClick={handleFinishEditing}>
            Terminer
          </button>
        </div>
        <motion.div
          className={` absolute  right-0 text-[13px] z-[51] w-full overflow-x-hidden`}
          initial={{ bottom: "60px" }}
          animate={{ bottom: isChoosingBgTypes ? "100px" : "60px" }}
          transition={{
            duration: 0.475,
            ease: [0.55, 0.79, 0.16, 0.99],
          }}
        >
          <div className="flex flex-row w-full justify-center items-center gap-2 mb-5">
            <motion.div
              whileTap={{ opacity: 0.7, scale: 0.9 }}
              whileHover={{ opacity: 0.9 }}
              onClick={() => {
                setIsChoosingBgTypes(false);
                setIsChoosingColor(false);
                setIsChoosingFont(true);
              }}
              className="bg-insanedark/70  flex justify-center items-center cursor-pointer p-1 rounded-lg select-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 16 16"
              >
                <path
                  fill="white"
                  fill-rule="evenodd"
                  d="M10 2.25a.75.75 0 0 1 .75-.75c.576 0 1.102.217 1.5.573a2.242 2.242 0 0 1 1.5-.573a.75.75 0 0 1 0 1.5a.75.75 0 0 0-.75.75v8.75c0 .414.336.75.75.75a.75.75 0 0 1 0 1.5a2.242 2.242 0 0 1-1.5-.573a2.242 2.242 0 0 1-1.5.573a.75.75 0 0 1 0-1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75a.75.75 0 0 1-.75-.75M5.75 3c-.618 0-1.168.39-1.374.972L1.543 12a.75.75 0 1 0 1.414.5L3.84 10h3.82l.883 2.5a.75.75 0 1 0 1.414-.5L7.124 3.972A1.457 1.457 0 0 0 5.75 3m1.381 5.5L5.75 4.587L4.369 8.5H7.13Z"
                  clip-rule="evenodd"
                />
              </svg>
            </motion.div>
            <motion.div
              whileTap={{ opacity: 0.7, scale: 0.9 }}
              whileHover={{ opacity: 0.9 }}
              onClick={() => {
                setIsChoosingBgTypes(false);
                setIsChoosingColor(true);
                setIsChoosingFont(false);
              }}
              className="bg-insanedark/70  flex justify-center items-center cursor-pointer p-1 rounded-lg select-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 100 100"
              >
                <g
                  id="gisColor0"
                  transform="translate(-27.789 -4888.35) scale(4.7619)"
                >
                  <g
                    id="gisColor1"
                    display="inline"
                    transform="translate(-318 -262)"
                  >
                    <g id="gisColor2">
                      <path
                        id="gisColor3"
                        fill="white"
                        fill-opacity="1"
                        stroke="none"
                        stroke-width="1.105"
                        d="M333.191 1290.764c-5.526 0-9.355 4.421-9.355 6.632c0 2.21 1.105 3.868 3.315 3.868s3.316.553 3.316 2.21c0 2.211 1.658 3.869 3.869 3.869c7.184 0 10.5-3.869 10.5-7.737c0-6.632-5.013-8.842-11.645-8.842zm-1.475 2.21a1.382 1.382 0 1 1 0 2.764a1.382 1.382 0 0 1 0-2.764zm4.421 0a1.382 1.382 0 1 1 0 2.764a1.382 1.382 0 0 1 0-2.764zm4.001 2.211a1.382 1.382 0 1 1 0 2.763a1.382 1.382 0 0 1 0-2.763zm-12.29.265a1.382 1.382 0 1 1 0 2.764a1.382 1.382 0 0 1 0-2.764zm7.328 6.367c.915 0 1.658.742 1.658 1.657c0 .916-1.163 1.658-2.078 1.658a1.658 1.658 0 0 1-1.658-1.658c0-.915 1.162-1.657 2.078-1.657z"
                        color="currentColor"
                        display="inline"
                        visibility="visible"
                      />
                    </g>
                  </g>
                </g>
              </svg>
            </motion.div>
            <motion.div
              whileTap={{ opacity: 0.7, scale: 0.9 }}
              whileHover={{ opacity: 0.9 }}
              onClick={() => {
                setIsChoosingBgTypes(true);
                setIsChoosingColor(false);
                setIsChoosingFont(false);
              }}
              className={` ${
                isTextBackgroundSelected ? "bg-insanedark/70" : ""
              } flex justify-center items-center cursor-pointer p-1 rounded-lg select-none`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 16 16"
              >
                <path
                  fill={`${
                    isTextBackgroundSelected ? "currentColor" : "white"
                  }`}
                  fill-rule="evenodd"
                  d="M8 2.25c-.618 0-1.169.39-1.373.974l-3.335 9.528a.75.75 0 0 0 1.416.496L5.845 10h4.31l1.137 3.248a.75.75 0 0 0 1.416-.496L9.373 3.224A1.455 1.455 0 0 0 8 2.25M9.63 8.5L8 3.842L6.37 8.5z"
                  clip-rule="evenodd"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
        {isChoosingColor && (
          <ColorChooser
            colorSavedIndex={colorSavedIndex}
            setColor={setColor}
            textColors={textColors}
            storyProperties={storyProperties}
          />
        )}
        {isChoosingFont && (
          <FontChooser
            fontSavedIndex={fontSavedIndex}
            setToRenderTextFont={setToRenderTextFont}
            textFonts={textFonts}
            storyProperties={storyProperties}
          />
        )}
        {isChoosingBgTypes && (
          <TextBackground
            backgroundSavedIndex={backgroundSavedIndex}
            setToRenderTextBackground={setToRenderTextBackground}
            textBgTypes={textBgTypes}
            storyProperties={storyProperties}
          />
        )}
        <RangeSelector
          rangeStyle="horizontal-dark-1"
          rangeValue={rangeValue}
          handleRangeChange={handleRangeChange}
          minValue={12}
          maxValue={60}
        />
      </div>
    </>
  );
};

export default TextPlugin;
