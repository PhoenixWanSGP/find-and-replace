// import { ModifiedNodeInfo } from "@/types";

import { ModifiedNodeInfo } from "./types";

export async function replaceAllNodes(
  nodes: readonly SceneNode[] | PageNode[],
  query: string,
  caseSensitive: boolean,
  matchWholeWord: boolean,
  newValue: string,
  currentTab: string
): Promise<ModifiedNodeInfo[]> {
  const regexFlags = caseSensitive ? "g" : "gi";
  const regexPattern = matchWholeWord ? `\\b${query}\\b` : query;
  const regex = new RegExp(regexPattern, regexFlags);
  const modifiedNodes: ModifiedNodeInfo[] = [];

  for (const node of nodes) {
    if (currentTab === "text" && node.type === "TEXT") {
      try {
        await figma.loadFontAsync(node.fontName as FontName);
        const newCharacters = node.characters.replace(regex, newValue);
        if (newCharacters !== node.characters) {
          node.characters = newCharacters;
          modifiedNodes.push({
            id: node.id,
            type: node.type,
            name: node.name,
            characters: newCharacters,
          });
        }
      } catch (error) {
        console.error("Failed to load font for text replacement:", error);
      }
    } else if (currentTab === "layer" && node.type !== "TEXT") {
      const newName = node.name.replace(regex, newValue);
      if (newName !== node.name) {
        node.name = newName;
        modifiedNodes.push({
          id: node.id,
          type: node.type,
          name: newName,
        });
      }
    }

    if ("children" in node) {
      const childModifiedNodes = await replaceAllNodes(
        node.children as readonly SceneNode[],
        query,
        caseSensitive,
        matchWholeWord,
        newValue,
        currentTab
      );
      modifiedNodes.push(...childModifiedNodes);
    }
  }

  return modifiedNodes;
}
