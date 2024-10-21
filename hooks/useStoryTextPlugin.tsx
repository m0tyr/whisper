import {
  BackgroundShapeParams,
  TextColors,
  TextFonts,
  Line,
  TextBgTypes,
} from "@/lib/types/stories.types";
import Konva from "konva";
import { RefObject, useRef } from "react";
import { parsePath, roundCommands } from "svg-round-corners";

interface UseStoryTextPluginProps {
  toRenderTextFont: string;
  layerRef: RefObject<Konva.Layer | null>;
  playgroundRef: RefObject<HTMLDivElement | null>;
  setPreviewBgPath: (value: string) => void;
  rangeValue: number;
}

export const useStoryTextPlugin = ({
  toRenderTextFont,
  layerRef,
  playgroundRef,
  setPreviewBgPath,
  rangeValue,
}: UseStoryTextPluginProps) => {

  const textBgTypes = useRef<TextBgTypes[]>([
    {renderedBackgroundType: 'line_by_line', name: 'Follow Text Curve'},
    {renderedBackgroundType: 'block', name: 'Rectangle Block'},
    {renderedBackgroundType: 'block', name: 'Rectangle Block'},
    {renderedBackgroundType: 'block', name: 'Rectangle Block'},
    {renderedBackgroundType: 'block', name: 'Rectangle Block'},
  ]);



  const textColors = useRef<TextColors[]>([
    { renderedColor: "rgb(255 255 255)", name: "white" },
    { renderedColor: "rgb(220 38 38)", name: "red" },
    { renderedColor: "rgb(0 0 0)", name: "black" },
    { renderedColor: "rgb(0 149 246)", name: "blue" },
    { renderedColor: "rgb(250 204 21)", name: "yellow" },
    { renderedColor: "rgb(22 163 74)", name: "green" },
    { renderedColor: "rgb(128 128 128)", name: "gray" },
    { renderedColor: "rgb(255 165 0)", name: "orange" },
    { renderedColor: "rgb(75 0 130)", name: "indigo" },
    { renderedColor: "rgb(238 130 238)", name: "violet" },
    { renderedColor: "rgb(128 0 128)", name: "purple" },
    { renderedColor: "rgb(255 182 193)", name: "pink" },
    { renderedColor: "rgb(255 69 0)", name: "orangered" },
    { renderedColor: "rgb(64 224 208)", name: "turquoise" },
    { renderedColor: "rgb(47 79 79)", name: "darkslategray" },
    { renderedColor: "rgb(165 42 42)", name: "brown" },
    { renderedColor: "rgb(255 20 147)", name: "deeppink" },
    { renderedColor: "rgb(255 215 0)", name: "gold" },
    { renderedColor: "rgb(60 179 113)", name: "mediumseagreen" },
    { renderedColor: "rgb(0 191 255)", name: "deepskyblue" },
    { renderedColor: "rgb(102 205 170)", name: "mediumaquamarine" },
    { renderedColor: "rgb(210 105 30)", name: "chocolate" },
    { renderedColor: "rgb(85 107 47)", name: "darkolivegreen" },
    { renderedColor: "rgb(128 0 0)", name: "maroon" },
    { renderedColor: "rgb(72 61 139)", name: "darkslateblue" },
    { renderedColor: "rgb(50 205 50)", name: "limegreen" },
    { renderedColor: "rgb(255 99 71)", name: "tomato" },
    { renderedColor: "rgb(245 222 179)", name: "wheat" },
    { renderedColor: "rgb(240 230 140)", name: "khaki" },
    { renderedColor: "rgb(127 255 0)", name: "chartreuse" },
    { renderedColor: "rgb(255 218 185)", name: "peachpuff" },
    { renderedColor: "rgb(154 205 50)", name: "yellowgreen" },
    { renderedColor: "rgb(70 130 180)", name: "steelblue" },
    { renderedColor: "rgb(255 240 245)", name: "lavenderblush" },
    { renderedColor: "rgb(244 164 96)", name: "sandybrown" },
    { renderedColor: "rgb(230 230 250)", name: "lavender" },
    { renderedColor: "rgb(0 255 127)", name: "springgreen" },
    { renderedColor: "rgb(0 128 128)", name: "teal" },
    { renderedColor: "rgb(25 25 112)", name: "midnightblue" },
    { renderedColor: "rgb(255 222 173)", name: "navajowhite" },
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
        path += ` L ${cx - line.width / 2 - padding} ${
          i * lineHeight - padding / 3
        }`;
      }
    }

    path += " Z";

    const parsedPath = parsePath(path);
    return roundCommands(parsedPath, 4).path;
  }

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
      if (playgroundElement)
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
      console.log(rangeValue);
      var textMeasure = new Konva.Text({
        text: makeLineBreakerMeasurer()?.join("\n"),
        width: width,
        align: "center",
        fontFamily: toRenderTextFont,
        fontSize: parseInt(rangeValue.toString(), 10), // Ensure `fontSize` is a number
        fontStyle: "600",
        letterSpacing: -0.5,
        lineHeight: parseFloat(rangeValue.toString()) + lineHeightFix, // Ensure `lineHeight` is a number
        shadowColor: "rgba(150, 150, 150, 1)",
        shadowBlur: 2,
        shadowOffset: { x: 0, y: 1 },
        shadowOpacity: 0.3,
        fill: "#ffffff",
        visible: false,
      });
      console.log(textMeasure.lineHeight(), textMeasure.fontSize());
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
  return {
    textColors: textColors,
    textFonts: textFonts,
    textBgTypes: textBgTypes,
    generateBackgroundShape,
    generateTextNodes,
    splitLines,
    convertLinesWithMention,
    generatePreviewBgPath,
    findMentionNodeInText,
    makeLineBreakerMeasurer,
  };
};
