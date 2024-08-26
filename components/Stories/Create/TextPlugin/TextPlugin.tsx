import React, { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Stage, Layer, Text, Transformer } from "react-konva";

interface TextPluginProps {
  width: number;
  height: number;
}

const TextPlugin: React.FC<TextPluginProps> = ({ width, height }) => {
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  const handleStageDblClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    const layer = layerRef.current;

    if (!stage || !layer) return;

    // Check if the double-click was on an existing text node
    const clickedOnEmptySpace = e.target === stage;

    if (clickedOnEmptySpace) {
      // Get click position relative to the stage
      const pointerPosition = stage.getPointerPosition();
      if (!pointerPosition) return;

      // Create a new text node at the click position
      const newText = new Konva.Text({
        text: "New text here",
        x: pointerPosition.x,
        y: pointerPosition.y,
        fontSize: 20,
        draggable: true,
        width: 200,
        id: `${new Date().getTime()}`, // unique ID
      });

      layer.add(newText);
      layer.draw();

      // Set the newly created text node as selected
      setSelectedTextId(newText.id());
    }
  };

  const handleTextDblClick = (textNode: Konva.Text) => {
    const layer = layerRef.current;
    if (!layer) return;

    const textPosition = textNode.getAbsolutePosition();
    const stageBox = stageRef.current!.container().getBoundingClientRect();
    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };

    // Hide the text node and transformer
    textNode.hide();
    const transformer = layer.findOne(`Transformer`) as Konva.Transformer;
    if (transformer) {
      transformer.hide();
    }

    // Create and style the textarea
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    textarea.value = textNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${textNode.width() - textNode.padding() * 2}px`;
    textarea.style.height = `${
      textNode.height() - textNode.padding() * 2 + 5
    }px`;
    textarea.style.fontSize = `${textNode.fontSize()}px`;
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = `${textNode.lineHeight()}`;
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill() as string;

    // Rotation handling
    let rotation = textNode.rotation();
    let transform = "";
    if (rotation) {
      transform += `rotateZ(${rotation}deg)`;
    }

    let px = 0;
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    if (isFirefox) {
      px += 2 + Math.round(textNode.fontSize() / 20);
    }
    transform += `translateY(-${px}px)`;

    textarea.style.transform = transform;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 3}px`;

    textarea.focus();

    function removeTextarea() {
      textarea.parentNode?.removeChild(textarea);
      textNode.show();
      transformer?.show();
      transformer?.forceUpdate();
      if (layer) layer.draw();
    }

    textarea.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        textNode.text(textarea.value);
        removeTextarea();
      }
      if (e.key === "Escape") {
        removeTextarea();
      }
    });

    textarea.addEventListener("keydown", function () {
      const scale = textNode.getAbsoluteScale().x;
      textarea.style.width = `${textNode.width() * scale}px`;
      textarea.style.height = "auto";
      textarea.style.height = `${
        textarea.scrollHeight + textNode.fontSize()
      }px`;
    });

    function handleOutsideClick(e: MouseEvent) {
      if (e.target !== textarea) {
        textNode.text(textarea.value);
        removeTextarea();
      }
    }

    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    });

    textarea.addEventListener("blur", () => {
      removeTextarea();
    });
  };

  useEffect(() => {
    const stage = stageRef.current;
    const layer = layerRef.current;

    if (!stage || !layer) return;

    stage.on("dblclick", handleStageDblClick);

    layer.on("dblclick", (e) => {
      const clickedTextNode = e.target as Konva.Text;
      if (clickedTextNode && clickedTextNode.className === "Text") {
        handleTextDblClick(clickedTextNode);
      }
    });

    return () => {
      stage.off("dblclick", handleStageDblClick);
      layer.off("dblclick");
    };
  }, []);

  useEffect(() => {
    const layer = layerRef.current;
    const transformer = new Konva.Transformer();

    if (!layer) return;

    if (selectedTextId) {
      const selectedTextNode = layer.findOne(`#${selectedTextId}`);
      if (selectedTextNode) {
        layer.add(transformer);
        transformer.nodes([selectedTextNode]);

        selectedTextNode.on("transform", () => {
          selectedTextNode.setAttrs({
            width: selectedTextNode.width() * selectedTextNode.scaleX(),
            scaleX: 1,
          });
        });

        layer.draw();
      }
    } else {
      transformer.detach();
      transformer.destroy();
      layer.draw();
    }
  }, [selectedTextId]);

  return (
    <div
      style={{
        width: width,
        height: height,
      }}
      className="flex flex-col h-10 relative bg-border rounded-lg cursor-cell"
    >
      <Stage ref={stageRef} width={width} height={height}>
        <Layer ref={layerRef}></Layer>
      </Stage>
    </div>
  );
};

export default TextPlugin;
