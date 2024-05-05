// types.ts

export const TabNames = {
  text: "text",
  layer: "layer",
  color: "color",
  font: "font",
  instance: "instance",
} as const;

export type TabName = keyof typeof TabNames;

export interface SearchParams {
  query: string;
  caseSensitive?: boolean;
  matchWholeWord?: boolean;
  type: TabName;
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
    searchList: any;
  };
};

export interface ResultBaseNode {
  id: string;
  type: string; // 明确指定可能的类型
  name?: string;
  characters?: string;
  fills?: string; // 添加颜色属性示例
  fontName?: string; // 添加字体族属性示例
}

// 搜索结果的类型
export interface SearchResults {
  type: TabName;
  data: ResultBaseNode[]; // 使用BaseNode数组来存储所有类型的节点
}

export interface HighlightParams {
  nodeId: string;
}

export interface ColorInfo {
  color: string; // HEX颜色值
  fillCount: number;
  strokeCount: number;
  totalCount: number;
}
