import Konva from "konva";

export type MentionInstance = {
  fromGroup: Konva.Group;
  mentionInstances: Konva.Text[];
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