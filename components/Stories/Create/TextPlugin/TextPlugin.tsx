import LexicalContentEditable from "@/components/LexicalContentEditable/LexicalContentEditable";
import {
  MentionInstance,
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

  // Transferred states and refs
  toRenderTextFont: string;
  setToRenderTextFont: (font: string) => void;
  textValue: string;
  setTextValue: (value: string) => void;
  textNode: Konva.Text | null;
  setTextNode: (node: Konva.Text | null) => void;
  transformerInstancesRef: RefObject<Konva.Transformer[]>;
  textInstancesRef: RefObject<TextInstances[]>;
  onTextInstancesChange: (
    finalInstance: TextInstances[],
    mentionFinalInstance: MentionInstance
  ) => void;
}

interface Line {
  cx: number;
  text: string;
  width: number;
  lastInParagraph?: boolean;
  mentionNodesRegistered?: number;
  mentionNodesAnchorPosition?: MentionAnchorData[];
}

interface MentionAnchorData {
  word: string;
  start: number;
  end: number;
  numberOfLetter: number;
}

interface BackgroundShapeParams {
  lines: Line[];
  lineHeight: number;
  width: number;
  align?: "left" | "right" | "justify" | "center";
  padding?: number;
  cornerRadius?: number;
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
  textNode,
  setTextNode,
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
  const [colorSavedIndex, setColorSavedIndex] = useState<number | null>(0);
  const [isChoosingFont, setIsChoosingFont] = useState(false);
  const [isChoosingColor, setIsChoosingColor] = useState(false);
  const [isTextBackgroundSelected, setIsTextBackgroundSelected] =
    useState(true);

  const textColors = useRef<TextColors[]>([
    { renderedColor: "rgb(255 255 255)", name: "white" },
    { renderedColor: "rgb(220 38 38)", name: "red" },
    { renderedColor: "rgb(0 0 0)", name: "black" },
    { renderedColor: "rgb(0 149 246)", name: "blue" },
    { renderedColor: "rgb(250 204 21)", name: "yellow" },
    { renderedColor: "rgb(22 163 74)", name: "green" },
  ]);

  const textFonts = useRef<TextFonts[]>([
    {
      variable: "Whisper Font",
      renderedFont:
        "system-ui, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif",
      name: "Basic",
    },
    { variable: "Chakra Petch", renderedFont: "Chakra Petch", name: "Dirty" },
    {
      variable: "var(--font-code2001)",
      renderedFont: "__code2001_b724b6",
      name: "Freaky",
    },
    {
      variable: "var(--font-andalos)",
      renderedFont: "__peristiwa_df0a95",
      name: "Graphic",
    },
  ]);

  function generateBackgroundShape({
    lines,
    lineHeight,
    width,
    align = "left",
    padding = 0,
    cornerRadius = 0,
  }: BackgroundShapeParams): string {
    lineHeight = lineHeight;

    for (let i = 0; i < lines.length; i++) {
      let group = [lines[i]];

      while (
        i + 1 < lines.length &&
        Math.abs(lines[i + 1].width - lines[i].width) <= 10
      ) {
        group.push(lines[i + 1]);
        i++;
      }

      const maxWidth = Math.max(...group.map((line) => line.width));

      group.forEach((line) => {
        line.width = maxWidth;
      });
    }

    lines.forEach((line, index) => {
      line.cx = width / 2;

      if (align === "right") {
        line.cx = width - line.width / 2;
      } else if (align === "left") {
        line.cx = line.width / 2;
      }

      if (align === "justify" && !line.lastInParagraph) {
        line.width = width;
      }

      if (align === "justify") {
        line.cx = line.width / 2;
      }
    });

    let path = `M ${lines[0]?.cx ?? 0} ${-(padding / 3)}`;

    lines.forEach((line, index) => {
      const { cx } = line;
      const prevLine = lines[index - 1];
      if (prevLine && prevLine.width > line.width) {
        path += ` L ${cx + line.width / 2 + padding} ${
          index * lineHeight + padding 
        }`;
      } else {
        path += ` L ${cx + line.width / 2 + padding} ${
          index * lineHeight - padding / 3
        }`;
      }

      const nextLine = lines[index + 1];
      if (nextLine && nextLine.width > line.width) {
        path += ` L ${cx + line.width / 2 + padding} ${
          (index + 1) * lineHeight - padding / 3
        }`;
      } else {
        path += ` L ${cx + line.width / 2 + padding} ${
          (index + 1) * lineHeight + padding 
        }`;
      }
    });

    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      const { cx } = line;
      const nextLine = lines[i + 1];

      if (nextLine && nextLine.width > line.width) {
        path += ` L ${cx - line.width / 2 - padding} ${
          (i + 1) * lineHeight - padding / 3 
        }`;
      } else {
        path += ` L ${cx - line.width / 2 - padding} ${
          (i + 1) * lineHeight + padding 
        }`;
      }

      const prevLine = lines[i - 1];
      if (prevLine && prevLine.width > line.width) {
        path += ` L ${cx - line.width / 2 - padding} ${
          i * lineHeight + padding 
        }`;
      } else {
        path += ` L ${cx - line.width / 2 - padding } ${
          i * lineHeight - padding / 3
        }`;
      }
    }

    path += " Z";

    const parsedPath = parsePath(path);
    return roundCommands(parsedPath, 4).path;
  }

  function buildCustomText(pos: {
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

        var top = pos.padding.top / 2;
        var shapes: (Text | Rect)[] = [];
        const text = convertLinesWithMention(textMeasure);
        var mentionTextNode: Konva.Text[] = [];
        text.forEach((line,index) => {
          
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
                    y: top
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
            top += parseInt(rangeValue.toString()) ;
        });

        // Group all shapes into a single group
        var group = new Konva.Group({
          x: pos.x - (pos.padding.left - pos.margin.left),
          y: pos.y - (pos.padding.top - pos.margin.top),
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
            padding: 8,
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
          anchorStroke: "#212121",
          borderStroke: "#f1f1f100",
          anchorFill: "#212121",
          draggable: true,
          centeredScaling: true,
          anchorStyleFunc: (anchor) => {
            anchor.stroke("#212121");
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
            var icon = new Konva.Path({
              fill: "white",
              data: dataPathShapes[path].path,
              name: selector + "-icon",
              scaleX: selector === "rotater" ? 0.7 : 1,
              scaleY: selector === "rotater" ? 0.7 : 1,
              x: isTextBackgroundSelected
                ? textMeasure.width() / 2
                : textMeasure.width() / 2 - 9,
              y: shape.y() + 22,
            });
            transformer.add(icon);
          }
        }

        shapes.forEach((shape) => group.add(shape));
        layer.add(group);

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

  const handleFinishEditing = () => {
    const stage = stageRef.current;
    const layer = layerRef.current;
    const padding = 5;
    if (stage && layer && editorRef.current) {
      const textWidth = calculateTextWidth(textValue, "Arial");
      if (textNode === null) {
        setTimeout(() => {
          const textBuild = makeLineBreakerMeasurer()?.join("\n");
          buildCustomText({
            text: textBuild,
            x: storyProperties.width / 2,
            y: storyProperties.height / 2,
            angle: 0,
            padding: { left: 8, top: 8, right: 8, bottom: 8 },
            margin: { left: 5, top: 0, right: 5, bottom: 0 },
          });
          setIsInTextContext(false);
          setIsInBaseContext(true);
        }, 0);
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

              context.beginPath();
              const radius = 12;
              const x = -padding;
              const y = -padding;

              context.moveTo(x + radius, y);
              context.arcTo(x + width, y, x + width, y + height, radius);
              context.arcTo(x + width, y + height, x, y + height, radius);
              context.arcTo(x, y + height, x, y, radius);
              context.arcTo(x, y, x + width, y, radius);
              context.closePath();

              context.fillStyle = "rgb(100,100,0)";
              context.fill();

              (shape as Konva.Text)._sceneFunc(context);
            },
            width:
              textWidth > editorRef.current?.clientWidth
                ? editorRef.current?.clientWidth + padding * 2
                : textWidth + padding * 2,
            align: "center",
            id: `${transformerInstancesRef?.current?.length}`,
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
          /*           textInstancesRef?.current?.push(newText);
           */ transformerInstancesRef?.current?.push(
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
          textWidth > editorRef.current?.clientWidth
            ? editorRef.current?.clientWidth
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

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
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

  function generateTextNodes(
    element: Node,
    clone?: HTMLElement
  ): HTMLElement[] {
    const nodes: HTMLElement[] = [];

    function processNode(
      node: Node,
      parent: HTMLElement | undefined | null
    ): HTMLElement[] {
      if (node.nodeType === Node.TEXT_NODE) {
        const textNodes: HTMLElement[] = [];
        const text = Array.from(node.textContent ?? "");
        text.forEach((char) => {
          const span = document.createElement("span");
          span.style.fontFamily = toRenderTextFont;
          span.textContent = char;
          textNodes.push(span);
          nodes.push(span);
        });
        return textNodes;
      }

      let newElement: HTMLElement | null;

      if (parent) {
        newElement =
          clone ?? ((node as HTMLElement).cloneNode(false) as HTMLElement);
      } else {
        newElement = null;
      }

      // Process child nodes
      const childNodes = node.childNodes;
      const childNodesArray = Array.isArray(childNodes)
        ? childNodes
        : Array.from(childNodes);
      for (let i = 0; i < childNodesArray.length; i++) {
        const childNode = childNodesArray[i];
        if (childNode.nodeType !== Node.TEXT_NODE) {
          newElement?.appendChild(childNode);
          continue;
        }
        const processedChildNodes = processNode(childNode, newElement);
        processedChildNodes.forEach((child) => {
          if (newElement) {
            newElement.appendChild(child as Node);
          }
        });
      }

      if (parent) {
        return [newElement as HTMLDivElement];
      } else {
        return [];
      }
    }

    processNode(element, clone);
    return nodes;
  }

  function splitLines(elements: HTMLElement[]): string[] {
    const lines: string[] = [];
    if (elements.length === 0) return lines;

    let currentLine = "";
    let previousTop = elements[0].getBoundingClientRect().top;
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top > previousTop) {
        lines.push(currentLine);
        const lineHeight =
          Math.ceil((rect.top - previousTop) / rect.height) - 1;
        lines.push(...Array(lineHeight).fill(""));
        previousTop = rect.top;
        currentLine = element.innerText || "";
      } else {
        currentLine += element.innerText || "";
      }
    });

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    return lines;
  }

  function convertLinesWithMention(textInstance: Konva.Text) {
    let computedLines: Line[] = [];

    textInstance.textArr.forEach((line) => {
      const lineWithMention: Line = {
        cx: 0,
        text: line.text,
        width: line.width,
        lastInParagraph: line.lastInParagraph,
        mentionNodesAnchorPosition: [],
      };
      let foundMentionInsideLine = 0;
      findMentionNodeInText().forEach((text) => {
        if (line.text.includes(text)) {
          const startIndex = line.text.indexOf(text);
          const endIndex = startIndex + text.length;
          lineWithMention.mentionNodesAnchorPosition?.push({
            word: text,
            start: startIndex,
            end: endIndex,
            numberOfLetter: text.length,
          });
          foundMentionInsideLine += 1;
        }
      });
      lineWithMention.mentionNodesRegistered = foundMentionInsideLine;
      computedLines.push(lineWithMention);
    });
    return computedLines;
  }

  function generatePreviewBgPath() {
    setTimeout(() => {
      const layer = layerRef.current;
      let width;
      let lineHeightFix = 0;
      const playgroundElement = playgroundRef.current;

      if (toRenderTextFont === textFonts.current[1].renderedFont) {
        lineHeightFix = 1;
        width = playgroundElement.offsetWidth + 2;
      } else if (toRenderTextFont === textFonts.current[2].renderedFont) {
        lineHeightFix = 1;
        width = playgroundElement.offsetWidth + 2;
      } else if (toRenderTextFont === textFonts.current[3].renderedFont) {
        lineHeightFix = 2;
        width = playgroundElement.offsetWidth + 3;
      } else {
        width = playgroundElement.offsetWidth + 1;
      }
      console.log(rangeValue)
      var textMeasure = new Konva.Text({
        text: makeLineBreakerMeasurer()?.join("\n"),
        width: width,
        align: "center",
        fontFamily: toRenderTextFont,
        fontSize: parseInt(rangeValue.toString(), 10),  // Ensure `fontSize` is a number
        fontStyle: "600",
        letterSpacing: -0.5,
        lineHeight: parseFloat(rangeValue.toString()) + lineHeightFix,  // Ensure `lineHeight` is a number
        shadowColor: "rgba(150, 150, 150, 1)",
        shadowBlur: 2,
        shadowOffset: { x: 0, y: 1 },
        shadowOpacity: 0.3,
        fill: "#ffffff",
        visible: false,
    });
    console.log(textMeasure.lineHeight(),textMeasure.fontSize())
      layer?.add(textMeasure);
      setPreviewBgPath(
        generateBackgroundShape({
          lines: JSON.parse(
            JSON.stringify(textMeasure.textArr as unknown as Line[])
          ),
          lineHeight: parseFloat(rangeValue.toString()) + lineHeightFix,
          width: textMeasure.width(),
          align: "center",
          padding: 8,
          cornerRadius: 8,
        })
      );
    }, 0);
  }

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

  const findMentionNodeInText = (): string[] => {
    const pElementToConvert = document.querySelector("p");
    let foundMentionNodeToRegister: any[] = [];
    if (pElementToConvert) {
      pElementToConvert.childNodes.forEach((node: any) => {
        if (node instanceof HTMLElement && node.className === "mention-node") {
          foundMentionNodeToRegister.push(node.textContent);
        }
      });
    }
    return foundMentionNodeToRegister;
  };

  const makeLineBreakerMeasurer = () => {
    const PlaygroundText = document.getElementById("text-playground");
    const pElementToConvert = document.querySelector("p");
    if (pElementToConvert) {
      const tempSpanContent = document.createElement("span");
      pElementToConvert.childNodes.forEach((node: any) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "SPAN") {
          // If the node is a <span>, clone its text content and append it to the new <span>
          const textNode = document.createTextNode(node.textContent || "");
          tempSpanContent.appendChild(textNode);
        } else if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.tagName === "BR"
        ) {
          // If the node is a <br>, append a <br> element to the new <span>
          const br = document.createElement("br");
          tempSpanContent.appendChild(br);
        }
      });
      tempSpanContent.style.textAlign = "center";
      tempSpanContent.style.position = "absolute";
      tempSpanContent.id = "temp-content";
      PlaygroundText?.appendChild(tempSpanContent);
      const content = document.getElementById("temp-content");
      const torender = document.getElementById("to-render");
      if (
        content &&
        torender &&
        tempSpanContent &&
        tempSpanContent.parentNode
      ) {
        const spans = generateTextNodes(content, torender);
        const lines = splitLines(spans);
        tempSpanContent.parentNode.removeChild(tempSpanContent);
        while (torender.firstChild) {
          torender.removeChild(torender.firstChild);
        }
        return lines;
      } else {
        console.error("Element with ID 'content' not found.");
      }
    } else {
      console.error("Element not found");
    }
  };

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

  const [rangeValue, setRangeValue] = useState(22);
  const handleRangeChange = (e: any) => {
    setRangeValue(e.target.value);
  };
  return (
    <>
      <div
        style={{
          width: storyProperties.width,
          height: storyProperties.height,
        }}
        className=" flex relative bg-border rounded-lg w-full "
      >
        <div className="flex flex-col justify-center items-center w-full  h-full z-50 bg-[rgb(0,0,0,0.4)]">
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
        <div className="absolute bottom-[60px] right-0 text-[13px] z-[51] w-full overflow-x-hidden">
          <div className="flex flex-row w-full justify-center items-center gap-2 mb-5">
            <motion.div
              whileTap={{ opacity: 0.7, scale: 0.9 }}
              whileHover={{ opacity: 0.9 }}
              onClick={() => {
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
                setIsTextBackgroundSelected(!isTextBackgroundSelected);
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
        </div>
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
        <RangeSelector
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
