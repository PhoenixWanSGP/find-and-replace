export interface ColorInfo {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface ComponentInfo {
  id: string;
  name: string;
  description: string;
  isMissing: boolean;
  isExternal: boolean;
}

export interface FontInfo {
  fontFamily: string;
  fontStyle: string;
  isMissing: boolean;
}

export interface StyleInfo {
  id: string;
  styleType: string;
  name: string;
  description: string;
  properties: any;
}

export type QueryType = string | ColorInfo | ComponentInfo | FontInfo;

export interface Message {
  type: string;
  payload: any;
}

export enum TabName {
  COLOR = "color",
  FONT = "font",
  COMPONENT = "instance",
  STYLE = "style",
  VARIABLE = "variable",
}

export interface ModifiedNodeInfo {
  id: string;
  type: string;
  name: string;
  characters?: string;
}
