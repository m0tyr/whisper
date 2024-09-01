import { motion, useAnimation } from "framer-motion";
import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";

interface TextPluginProps {
  storyProperties: {
    width: number,
    height: number,
  }
  isAddingNewText: boolean;
  setIsInTextContext: (state: boolean) => void;
  setisAddingNewText: (state: boolean) => void;
  setIsInBaseContext:  (state: boolean) => void;
}

type TextFonts = {
  variable: string;
  renderedFont: string;
};

const TextPlugin: React.FC<TextPluginProps> = ({ isAddingNewText, storyProperties, setIsInTextContext, setIsInBaseContext, setisAddingNewText }) => {
  
  const LayoutContainerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
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
  return (
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
  );
};

export default TextPlugin;
