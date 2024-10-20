import Konva from "konva";

export type MentionInstance = {
  fromGroup: Konva.Group;
  mentionInstances: Konva.Text[];
};

export type TextInstances =  {
  textsGroup: Konva.Group;
  width: number;
  height: number;
}

export type TextFonts = {
  variable: string;
  renderedFont: string;
  name: string;
};


export type TextColors = {
  renderedColor: string;
  name: string;
};

export type StoryMediaData = {
  mediaImg: HTMLImageElement | undefined;
  width: number;
  height: number;
  x: number;
  y: number;
}

export type StoryKonvaMediaData = {
  konvaMedia: Konva.Image | null;
  konvabgFillMedia?: Konva.Image | null;
  hasBgFill: boolean;
  isVideo: boolean;
}