export const TabNames = {
  text: "text",
  layer: "layer",
  color: "color",
  font: "font",
  instance: "instance",
  // style: "style",
} as const;

export type TabName = keyof typeof TabNames;

export interface UserInfo {
  uuid: string;
  email: string;
  created_at: string;
  nickname: string;
  avatar_url: string;
  locale?: string;
  signin_type: string;
  signin_ip?: string;
}

export type QueryType =
  | string
  | ColorInfo
  | FontInfo
  | ComponentInfo
  | StyleInfo;

export interface SearchParams {
  query: QueryType;
  caseSensitive?: boolean;
  matchWholeWord?: boolean;
  type: TabName;
  includeFills?: boolean;
  includeStrokes?: boolean;
  includeNormalFont?: boolean;
  includeMissingFont?: boolean;
  includeNormalComponent?: boolean;
  includeMissingComponent?: boolean;
  includeExternalComponent?: boolean;
}

export interface ReplaceParams {
  type: TabName;
  nodeId?: string | null;
  newValue: string;
}

export type TabData = {
  [key in TabName]: {
    currentSearchParams: SearchParams;
    lastSearchParams: SearchParams;
    replaceParams: ReplaceParams;
    selectedIndex: number;
    searchResults: ResultBaseNode[];
    selectedNodeId: string | null;
    searchList?: any | null;
  };
};

export interface ResultBaseNode {
  id: string;
  type: string;
  name?: string;
  characters?: string;
  fills?: string;
  fontName?: string;
}

export interface SearchResults {
  type: TabName;
  data: ResultBaseNode[];
}

export interface ColorInfo {
  r: number;
  g: number;
  b: number;
  a: any | undefined;
}

export interface FontInfo {
  fontFamily: string;
  fontStyle: string;
  isMissing: boolean;
}

export interface ComponentInfo {
  id: string;
  name: string;
  description: string;
  isMissing?: boolean;
  isExternal?: boolean | undefined | null | "";
}

export interface StyleInfo {
  id: string;
  styleType: "PaintStyle" | "TextStyle";
  name: string;
  description: string;
  properties: any;
  isMissing?: boolean;
  isExternal?: boolean;
}

export interface VariableInfo {
  id: string;
  type: string;
  name: string;
}
