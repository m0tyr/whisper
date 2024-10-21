import Konva from "konva";

export type MentionInstance = {
  fromGroup: Konva.Group;
  mentionInstances: Konva.Text[];
};

export type TextInstances = {
  textsGroup: Konva.Group;
  width: number;
  height: number;
};

export type TextFonts = {
  variable: string;
  renderedFont: string;
  name: string;
};

export type TextColors = {
  renderedColor: string;
  name: string;
};

export type Line =  {
  cx: number;
  text: string;
  width: number;
  lastInParagraph?: boolean;
  mentionNodesRegistered?: number;
  mentionNodesAnchorPosition?: MentionAnchorData[];
}

export type MentionAnchorData =  {
  word: string;
  start: number;
  end: number;
  numberOfLetter: number;
}

export type BackgroundShapeParams = {
  lines: Line[];
  lineHeight: number;
  width: number;
  align?: "left" | "right" | "justify" | "center";
  padding?: number;
  cornerRadius?: number;
}

export type StoryMediaData = {
  mediaImg: HTMLImageElement | HTMLVideoElement | undefined;
  isVideo: boolean;
  width: number;
  height: number;
  x: number;
  y: number;
};

export type StoryKonvaMediaData = {
  konvaMedia: Konva.Image | null;
  konvabgFillMedia?: Konva.Image | null;
  hasBgFill: boolean;
  isVideo: boolean;
};
