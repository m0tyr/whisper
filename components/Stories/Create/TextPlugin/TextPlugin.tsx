import { TextInstance } from "@/lib/types/stories.types";
import { motion, useAnimation } from "framer-motion";
import Konva from "konva";
import React, { RefObject, useEffect, useRef, useState } from "react";

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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
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
    if (stage && layer && textareaRef.current) {
      const textWidth = calculateTextWidth(textValue, "Arial");

      if (textNode === null) {
        const newText = new Konva.Text({
          text: textValue,
          x: storyProperties.width / 2,
          y: storyProperties.height / 2,
          fontSize: 16,
          fontFamily: toRenderTextFont,
          draggable: false,
          width:
            textWidth > textareaRef.current?.clientWidth
              ? textareaRef.current?.clientWidth + padding * 2
              : textWidth + padding * 2,
          align: "center",
          id: `${transformerInstancesRef?.current?.length}`,
          fill: "white",
        });
        const transformerDependency = [] as any[];

        let largestWidth = 0;

        const registeredLabelFromInitialText: TextInstance = {
          textInstances: [], // Correct initialization
        };

        newText.textArr.forEach((element) => {
          if (element.width > largestWidth) {
            largestWidth = element.width;
          }
        });
        newText.textArr.forEach((element, index) => {
          const xPosition = storyProperties.width / 2 - largestWidth / 2;
          const yPosition = storyProperties.height / 2 - largestWidth / 2;
          var simpleLabel = new Konva.Label({
            x: xPosition + (largestWidth - element.width) / 2,
            y: yPosition + index * 15.75 + padding * 2,
            width: element.width + padding * 2,
            draggable: false,
            id: `${transformerInstancesRef?.current?.length}`,
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
          registeredLabelFromInitialText.textInstances.push(simpleLabel);
          layer.add(simpleLabel);
        });
        textCustomInstancesRef?.current?.push(registeredLabelFromInitialText);

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
          draggable: true,
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
        transformerInstancesRef?.current?.push(
          transformer as Konva.Transformer
        );
        layer.clear();
        layer.add(transformer);
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
              textWidth > textareaRef.current?.clientWidth
                ? textareaRef.current?.clientWidth + padding * 2
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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
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
