import LexicalContentEditable from "@/components/LexicalContentEditable/LexicalContentEditable";
import { TextInstance } from "@/lib/types/stories.types";
import { extractElements } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { parsePath, roundCommands, roundCorners } from "svg-round-corners";
import Konva from "konva";
import { Rect } from "konva/lib/shapes/Rect";
import { Text } from "konva/lib/shapes/Text";
import { LexicalEditor } from "lexical";
import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type TextFonts = {
  variable: string;
  renderedFont: string;
};

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
  selectedTextFont: string;
  setSelectedTextFont: (font: string) => void;
  transformerInstancesRef: RefObject<Konva.Transformer[]>;
  textInstancesRef: RefObject<Konva.Text[]>;
  textCustomInstancesRef: RefObject<TextInstance[]>;
}

interface Line {
  cx: number; // Center x-coordinate of the line
  width: number; // Width of the line
  lastInParagraph?: boolean; // Optional flag indicating if it's the last line in a paragraph
}

interface BackgroundShapeParams {
  lines: Line[]; // Array of line objects
  lineHeight: number; // Height between lines
  width: number; // Width of the shape
  align?: "left" | "right" | "justify" | "center"; // Alignment of lines, default is "left"
  padding?: number; // Padding around the shape, default is 0
  cornerRadius?: number; // Corner radius for rounded edges, default is 0
}

interface GetLineHeightParams {
  fontLoaded: boolean; // This parameter is included but not used in the function; consider removing if unnecessary
  fontFamily: string;
  fontSize: number;
  lineHeight: string | number;
}

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
  selectedTextFont,
  setSelectedTextFont,
  transformerInstancesRef,
  textInstancesRef,
  textCustomInstancesRef,
}) => {
  const LayoutContainerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const editorRef: any = useRef<LexicalEditor | null>();
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const textFonts = useRef<TextFonts[]>([
    { variable: "Arial", renderedFont: "Arial" },
    { variable: "Arial", renderedFont: "Arial" },
    { variable: "Arial", renderedFont: "Arial" },
    { variable: "Arial", renderedFont: "Arial" },
    { variable: "var(--font-code2001)", renderedFont: "__code2001_b724b6" },
    { variable: "var(--font-andalos)", renderedFont: "__peristiwa_df0a95" },
  ]);

  function generateBackgroundShape({
    lines,
    lineHeight,
    width,
    align = "left",
    padding = 0,
    cornerRadius = 0,
  }: BackgroundShapeParams): string {
    // Set initial positions for each line based on alignment
    lines.forEach((line, index) => {
      // Center the line horizontally by default
      line.cx = width / 2;

      // Adjust position based on alignment
      if (align === "right") {
        line.cx = width - line.width / 2;
      } else if (align === "left") {
        line.cx = line.width / 2;
      }

      // If alignment is justify and it's not the last line in a paragraph, stretch the line to full width
      if (align === "justify" && !line.lastInParagraph) {
        line.width = width;
      }

      // For justified lines, adjust the center position
      if (align === "justify") {
        line.cx = line.width / 2;
      }
    });

    // Initialize the path string with the starting point
    let path = `M ${lines[0]?.cx ?? 0} ${-padding}`;

    // Draw the right side of the shape
    lines.forEach((line, index) => {
      const { cx } = line;
      const prevLine = lines[index - 1];
      // Draw line to the current point based on line width comparison with the previous line
      if (prevLine && prevLine.width > line.width) {
        path += ` L ${cx + line.width / 2 + padding} ${
          index * lineHeight + padding
        }`;
      } else {
        path += ` L ${cx + line.width / 2 + padding} ${
          index * lineHeight - padding
        }`;
      }

      // Draw line to the next point
      const nextLine = lines[index + 1];
      if (nextLine && nextLine.width > line.width) {
        path += ` L ${cx + line.width / 2 + padding} ${
          (index + 1) * lineHeight - padding
        }`;
      } else {
        path += ` L ${cx + line.width / 2 + padding} ${
          (index + 1) * lineHeight + padding
        }`;
      }
    });

    // Draw the left side of the shape by iterating backward
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      const { cx } = line;
      const nextLine = lines[i + 1];

      // Draw line to the current point based on line width comparison with the next line
      if (nextLine && nextLine.width > line.width) {
        path += ` L ${cx - line.width / 2 - padding} ${
          (i + 1) * lineHeight - padding
        }`;
      } else {
        path += ` L ${cx - line.width / 2 - padding} ${
          (i + 1) * lineHeight + padding
        }`;
      }

      // Draw line to the previous point
      const prevLine = lines[i - 1];
      if (prevLine && prevLine.width > line.width) {
        path += ` L ${cx - line.width / 2 - padding} ${
          i * lineHeight + padding
        }`;
      } else {
        path += ` L ${cx - line.width / 2 - padding} ${
          i * lineHeight - padding
        }`;
      }
    }

    // Close the path
    path += " Z";

    // Parse and round the corners of the path using external functions
    const parsedPath = parsePath(path);
    return roundCommands(parsedPath, cornerRadius).path;
  }

  function buildCustomText(pos: {
    text: any;
    padding: { left: number; top: number; right: any; bottom: any };
    margin: { left: number; top: number; right: any; bottom: any };
    x: number;
    y: number;
    angle: any;
  }) {
    const stage = stageRef.current;
    const layer = layerRef.current;
    if (stage && layer) {
      layer.destroyChildren();

      var textMeasure = new Konva.Text({
        text: pos.text,
        fontFamily: selectedTextFont,
        fontSize: 20,
        fontWeight: "600",
        textShadow: "rgba(150, 150, 150, 0.3) 0px 1px 2px",
        fill: "#ffffff",
        visible: false,
      });

      // Add textMeasure to the layer temporarily to measure text lines
      layer.add(textMeasure);

      var top = 0;
      var shapes: (Text | Rect)[] = [];

      textMeasure.textArr.forEach((line) => {
        var text = new Konva.Text({
          text: line.text,
          fontFamily: selectedTextFont,
          fontSize: 20,
          fontWeight: "600",
          textShadow: "rgba(150, 150, 150, 0.3) 0px 1px 2px",
          fill: "#ffffff",
          x: 0,
          y: top,
        });

        // Measure text dimensions
        var textWidth = text.width();
        var textHeight = text.height();
        text.x((textMeasure.width() - textWidth) / 2);
        shapes.push(text);

        // Update the top position for the next line
        top += textHeight + 2;
      });

      const path = generateBackgroundShape({
        lines: JSON.parse(
          JSON.stringify(textMeasure.textArr as unknown as Line[])
        ),
        lineHeight: textMeasure.fontSize(),
        width: textMeasure.width(),
        align: "center",
        padding: pos.padding.top,
        cornerRadius: 5,
      });

      const konvaPath = new Konva.Path({
        data: path,
        fill: "#000",
        stroke: "#000",
      });

      // Group all shapes into a single group
      var group = new Konva.Group({
        x: pos.x - (pos.padding.left - pos.margin.left),
        y: pos.y - (pos.padding.top - pos.margin.top),
        rotation: pos.angle,
        draggable: true,
      });

      const transformer = new Konva.Transformer({
        nodes: [group],
        anchorStroke: "#212121",
        anchorFill: "#434343",
        borderStroke: "#f1f1f1",
        draggable: true,
        anchorStyleFunc: (anchor) => {
          anchor.cornerRadius(10);
          anchor.fill("#2d2d2d");
          anchor.stroke("#212121");
          if (anchor.hasName("top-center") || anchor.hasName("bottom-center")) {
            anchor.height(6);
            anchor.offsetY(3);
            anchor.width(30);
            anchor.offsetX(15);
          }
          if (anchor.hasName("middle-left") || anchor.hasName("middle-right")) {
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

      group.add(konvaPath);
      // Add each shape to the group
      shapes.forEach((shape) => group.add(shape));
      // Add the group to the layer
      layer.add(group);

      layer.add(transformer);

      transformerInstancesRef?.current?.push(transformer as Konva.Transformer);

      // Draw the layer
      layer.draw();
    }
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
    const temp = JSON.stringify(editorRef.current.getEditorState());
    const datas = JSON.parse(temp);
    console.log(datas);
    const stage = stageRef.current;
    const layer = layerRef.current;
    const padding = 5;
    if (stage && layer && editorRef.current) {
      const textWidth = calculateTextWidth(textValue, "Arial");

      if (textNode === null) {
        buildCustomText({
          text: makeLineBreakerMeasurer()?.join("\n"),
          x: storyProperties.width / 2,
          y: storyProperties.height / 2,
          angle: 0,
          padding: { left: 10, top: 10, right: 10, bottom: 10 },
          margin: { left: 5, top: 0, right: 5, bottom: 0 },
        });
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
          textInstancesRef?.current?.push(newText);
          transformerInstancesRef?.current?.push(
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
    console.log(e.target.value);
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

  const [lineBreaks, setLineBreaks] = useState(0);

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
      console.log(childNodesArray);
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

  // Utility function to split text into lines
  function splitLines(elements: HTMLElement[]): string[] {
    const lines: string[] = [];
    if (elements.length === 0) return lines;

    let currentLine = "";
    let previousTop = elements[0].getBoundingClientRect().top;
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      console.log(element);
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

  const onContentChange = () => {
    if (!editorRef.current) return;
    const lineHeight = 20; // Approximate line height in pixels; adjust as needed
    const newLineCount = Math.floor(
      editorRef.current.scrollHeight / lineHeight
    );
    const boundingRect = editorRef.current
      .getRootElement()
      .getBoundingClientRect();
    const width = boundingRect.right - boundingRect.left;
    const height = boundingRect.bottom - boundingRect.top;
    console.log(
      boundingRect,
      width,
      height,
      editorRef.current.getRootElement().textContent
    );
    // Set line breaks if they have increased

    // Split those spans into lines of text
    if (newLineCount > lineBreaks) {
      setLineBreaks(newLineCount);
      console.log("Line break detected!");
    }
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
      // Check if the element exists
      if (
        content &&
        torender &&
        tempSpanContent &&
        tempSpanContent.parentNode
      ) {
        // Call the function only if content is not null
        const spans = generateTextNodes(content, torender);
        const lines = splitLines(spans);
        /*           tempSpanContent.parentNode.removeChild(tempSpanContent);
         */ return lines;
      } else {
        console.error("Element with ID 'content' not found.");
      }
    } else {
      console.error("Element not found");
    }
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
          <div id="text-playground" className="max-w-[calc(100%_-_128px)]">
            <LexicalContentEditable
              value={textValue}
              onChange={handleTextChange}
              watchtext={onContentChange}
              ref={editorRef}
              className="absolute top-20"
              style={{
                fontFamily: selectedTextFont,
                textAlign: "center",
                width: "100%",
                height: "auto",
                fontSize: "20px",
                fontWeight: "600",
                textShadow: "rgba(150, 150, 150, 0.3) 0px 1px 2px",
                border: "none",
                resize: "none",
                background: "transparent",
                outline: "none",
                boxShadow: "none",
                lineHeight: "22px",
              }}
            />
            <span
              id="to-render"
              style={{
                display: "inline-block",
                width: "100%",
                textAlign: "center",
                verticalAlign: "baseline",
                marginTop: "72px",
                overflowWrap: "break-word",
                zIndex: -999,
                color: "white",
                fontSize: "20px",
                fontWeight: 600,
                lineHeight: "22px",
              }}
            ></span>
          </div>
        </div>
        <div className="absolute top-0 pt-4 right-0 text-[13px] z-[51]">
          <button className="mr-4" onClick={handleFinishEditing}>
            Terminer
          </button>

          {/*    <div className="relative mt-5 mr-3">
          <motion.div
            ref={LayoutContainerRef}
            animate={controls}
            className="flex flex-col items-end gap-[10px] hide-scrollbar relative overflow-y-auto max-h-[250px]"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="flex flex-col gap-[8px] justify-center items-center p-1 w-9">
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
        </div> */}
        </div>
      </div>
    </>
  );
};

export default TextPlugin;
