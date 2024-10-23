import React, { useRef, useEffect } from "react";
import { Stage, Layer, Rect, Text, Group, Path, Circle } from "react-konva";
import Konva from "konva";
import { RefObject } from "react";
import LexicalContentEditable from "@/components/LexicalContentEditable/LexicalContentEditable";
import { LexicalEditor } from "lexical";

interface MentionPluginProps {
  storyProperties: {
    width: number;
    height: number;
  };
  stageRef: RefObject<Konva.Stage | null>;
}

const MentionPlugin: React.FC<MentionPluginProps> = ({ storyProperties }) => {
  const editorRef: any = useRef<LexicalEditor | null>();
  const textArea = useRef<HTMLTextAreaElement | null>(null);
  const subLayerRef = useRef<Konva.Layer | null>(null);
  const mentionNodeRef = useRef<Konva.Text | null>(null);
  const subStageRef = useRef<Konva.Stage | null>(null);

  useEffect(() => {
    const stage = subStageRef.current;
    const layer = subLayerRef.current;

    if (stage && layer) {
      stage.draw();
    }
  }, [subStageRef]);

  useEffect(() => {
    const stage = subStageRef.current;
    const layer = subLayerRef.current;
    const mentionNode = mentionNodeRef.current;
    if (stage && layer && mentionNode) {
      mentionNode.on("dblclick dbltap", () => {
        // hide text node and transformer:
        mentionNode.hide();

        // create textarea over canvas with absolute position
        // first we need to find position for textarea
        // how to find it?

        // at first lets find position of text node relative to the stage:
        var textPosition = mentionNode.absolutePosition();

        // so position of textarea will be the sum of positions above:
        var areaPosition = {
          x: stage.container().offsetLeft + textPosition.x,
          y: stage.container().offsetTop + textPosition.y,
        };

        // create textarea and style it
        var textarea = document.createElement("textarea");
        var toAddTo = document.getElementById("base-container");
        toAddTo?.appendChild(textarea);

        // apply many styles to match text on canvas as close as possible
        // remember that text rendering on canvas and on the textarea can be different
        // and sometimes it is hard to make it 100% the same. But we will try...
        textarea.value = mentionNode.text();
        textarea.style.zIndex = "50";
        textarea.style.position = "absolute";
        textarea.style.top = areaPosition.y + "px";
        textarea.style.left = areaPosition.x + "px";
        textarea.style.width =
          mentionNode.width() - mentionNode.padding() * 2 + "px";
        textarea.style.height =
          mentionNode.height() - mentionNode.padding() * 2 + 5 + "px";
        textarea.style.fontSize = mentionNode.fontSize() + "px";
        textarea.style.border = "none";
        textarea.style.padding = "0px";
        textarea.style.margin = "0px";
        textarea.style.overflow = "hidden";
        textarea.style.background = "none";
        textarea.style.outline = "none";
        textarea.style.resize = "none";
        textarea.style.lineHeight = mentionNode.lineHeight().toString();
        textarea.style.fontFamily =
          "system-ui, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif";
        textarea.style.fontWeight = mentionNode.fontStyle();
        textarea.style.transformOrigin = "left top";
        textarea.style.textAlign = mentionNode.align();
        textarea.style.color = mentionNode.fill() as string;
        const rotation = mentionNode.rotation();
        var transform = "";
        if (rotation) {
          transform += "rotateZ(" + rotation + "deg)";
        }

        var px = 0;
        var isFirefox =
          navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
        var isChrome =
          navigator.userAgent.toLowerCase().indexOf("chrome") > -1 &&
          navigator.userAgent.toLowerCase().indexOf("edge") === -1 &&
          navigator.userAgent.toLowerCase().indexOf("opr") === -1;
        if (isFirefox) {
          px += 2 + Math.round(mentionNode.fontSize() / 20);
        }
        if (isChrome) {
          px += 1 + Math.round(mentionNode.fontSize() / 20);
        }
        transform += "translateY(-" + px + "px)";

        textarea.style.transform = transform;

        // reset height
        textarea.style.height = "auto";
        // after browsers resized it we can set actual value
        textarea.style.height = textarea.scrollHeight + 3 + "px";
        mentionNode.text(textarea.value);
        textArea.current = textarea;

        textarea.focus();
      });
    }
  }, []);

  /*  useEffect(() => {
    function handleOutsideClick(e: { target: any; }) {
      if (e.target !== textArea.current && textArea.current) {
        mentionNodeRef?.current?.text(textArea.current.value); 
        textArea.current.parentNode?.removeChild(textArea.current);
      }
    }
  
    window.addEventListener('click', handleOutsideClick);
  
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [textArea.current]); */

  return (
    <div
      style={{
        width: storyProperties.width,
        height: storyProperties.height,
      }}
      id="base-container"
      className=" flex relative bg-border rounded-lg w-full "
    >
      <div className="flex flex-col justify-center items-center w-full  h-full z-50 bg-[rgb(0,0,0,0.65)]">
        <Stage
          ref={subStageRef}
          width={storyProperties.width}
          height={storyProperties.height}
        >
          <Layer ref={subLayerRef}>
            <Group draggable>
              <Rect
                x={storyProperties.width / 2 - 90}
                y={storyProperties.height / 2 - 40}
                width={135}
                height={50}
                fill="lightgray"
                cornerRadius={10}
              />

              <Path
                data="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8Z"
                x={storyProperties.width / 2 - 80}
                y={storyProperties.height / 2 - 30}
                fill="#52489C"
                scale={{ x: 1.2, y: 1.2 }} 
              />
              <Circle
                x={storyProperties.width / 2 - 65.5}
                y={storyProperties.height / 2 - 19}
                radius={3} 
                fill="white"
              />
              <Text
                ref={mentionNodeRef}
                x={storyProperties.width / 2 - 45}
                y={storyProperties.height / 2 - 26.5}
                text={"paris".toUpperCase()}
                fontSize={28}
                fontStyle="600"
                letterSpacing={-0.1}
                fill="#52489C"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif"
              />
            </Group>
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default MentionPlugin;
