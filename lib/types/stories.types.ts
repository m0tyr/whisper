import Konva from "konva";

export type TextInstance = {
  textInstances: Konva.Label[];
};

export type TextFonts = {
  variable: string;
  renderedFont: string;
};

export type TextColors = {
  renderedColor: string;
  name: string;
};