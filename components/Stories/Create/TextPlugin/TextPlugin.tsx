import React, { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Stage, Layer, Text, Transformer } from "react-konva";

interface TextPluginProps {
  width: number;
  height: number;
}

const TextPlugin: React.FC<TextPluginProps> = ({ width, height }) => {
  const stageRef = useRef<Konva.Stage | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [textValue, setTextValue] = useState("");
  const [textNode, setTextNode] = useState<Konva.Text | null>(null);
  const [selectedTextNode, setSelectedTextNode] = useState<Konva.Text | null>(
    null
  );

  const handleTextNodeClick = (node: Konva.Text) => {
    setSelectedTextNode(node);
  };

  const handleTextNodeDblClick = (node: Konva.Text) => {
    setTextValue(node.text());
    setTextNode(node);
    setIsEditing(true);
  };

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Deselect text if clicked outside
    if (e.target === stageRef.current) {
      setSelectedTextNode(null);
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
    const layer = layerRef.current;

    if (stage && layer && textNode) {
      textNode.on("click", () => handleTextNodeClick(textNode));
      textNode.on("dblclick", () => handleTextNodeDblClick(textNode));
      textNode.on("dragmove", () => {
        if (textNode) {
          const nodePos = textNode.getPosition();
          const nodeWidth = textNode.width();
          const nodeHeight = textNode.height();

          const centerX = width / 2;
          const centerY = height / 2;

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
      if (textNode) {
        textNode.off("click dragmove transformend");
      }
    };
  }, [textNode, width, height]);

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
      textareaRef.current.focus(); // Automatically focus the textarea on mount
    }
  }, []);

  const handleFinishEditing = () => {
    const stage = stageRef.current;
    const layer = layerRef.current;

    if (stage && layer) {
      const pointerPosition = stage.getPointerPosition() || {
        x: width / 2,
        y: height / 2,
      };
      const textWidth = calculateTextWidth(textValue, "Arial");
      console.log(textValue, textWidth, textNode);
      if (textNode === null) {
        const newText = new Konva.Text({
          text: textValue,
          x: pointerPosition.x,
          y: pointerPosition.y,
          fontSize: 16,
          draggable: true,
          width: textWidth,
          id: `${new Date().getTime()}`, // unique ID
          fill: "white",
        });
        layer.clear();
        layer.add(newText);
        layer.draw();
        setTextNode(newText);
        setIsEditing(false);
      } else {
        layer.clear();
        textNode.width(textWidth)
        textNode.text(textValue)
        layer.draw();
        setIsEditing(false);
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  };

  return (
    <div
      style={{
        width: width,
        height: height,
      }}
      className="flex flex-col h-10 relative bg-border rounded-lg cursor-default"
    >
      {isEditing && (
        <>
          <div className="flex justify-center items-center w-full h-full z-50 bg-[rgb(0,0,0,0.4)]">
            <textarea
              value={textValue}
              onChange={handleTextChange}
              ref={textareaRef}
              className="absolute top-20"
              style={{
                fontFamily: "Arial",
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
          </div>
        </>
      )}
    </div>
  );
};

export default TextPlugin;
