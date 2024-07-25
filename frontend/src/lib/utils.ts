import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TabData, TabName, SearchParams, ReplaceParams } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getGoogleToken() {
  return await figma.clientStorage.getAsync("google-token");
}

export const updateSearchParams = (
  setTabData: React.Dispatch<React.SetStateAction<TabData>>,
  type: TabName,
  newParams: Partial<SearchParams>
) => {
  setTabData((prevState: TabData) => ({
    ...prevState,
    [type]: {
      ...prevState[type],
      currentSearchParams: {
        ...prevState[type].currentSearchParams,
        ...newParams,
      },
    },
  }));
};

export const updateReplaceParams = (
  setTabData: React.Dispatch<React.SetStateAction<TabData>>,
  type: TabName,
  newParams: Partial<ReplaceParams>
) => {
  setTabData((prevState: TabData) => ({
    ...prevState,
    [type]: {
      ...prevState[type],
      replaceParams: {
        ...prevState[type].replaceParams,
        ...newParams,
      },
    },
  }));
};

export const updateSelectedNodeId = (
  setTabData: React.Dispatch<React.SetStateAction<TabData>>,
  type: TabName,
  nodeId: string | null
) => {
  setTabData((prevState: TabData) => ({
    ...prevState,
    [type]: {
      ...prevState[type],
      selectedNodeId: nodeId,
    },
  }));
};
