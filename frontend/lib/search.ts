import { QueryType, ColorInfo, ComponentInfo, FontInfo } from "@/types";

function isTextNode(node: SceneNode | PageNode): node is TextNode {
  return node.type === "TEXT";
}

function isColorMatch(colorA: RGBA, colorB: RGBA): boolean {
  return (
    Math.abs(colorA.r - colorB.r) < 0.01 &&
    Math.abs(colorA.g - colorB.g) < 0.01 &&
    Math.abs(colorA.b - colorB.b) < 0.01 &&
    Math.abs(colorA.a - colorB.a) < 0.01
  );
}

export async function searchNodes(
  node: SceneNode | PageNode,
  query: QueryType,
  textCaseSensitive: boolean = false,
  textMatchWholeWord: boolean = false,
  category: string,
  includeFills: boolean = false,
  includeStrokes: boolean = false,
  includeNormalFont: boolean = false,
  includeMissingFont: boolean = false,
  includeNormalComponent: boolean = false,
  includeExternalComponent: boolean = false
): Promise<any[]> {
  const results: any[] = [];

  async function traverse(node: SceneNode | PageNode) {
    if (category === "instance" && node.type === "INSTANCE") {
      let mainComponent = null;
      try {
        mainComponent = await node.getMainComponentAsync();
        if (mainComponent) {
          console.log("Main Component:", mainComponent.id, mainComponent.name);
        } else {
          console.log("Main Component is null");
        }
      } catch (error) {
        console.error("Error getting main component:", error);
      }

      const queryComponent = query as ComponentInfo;
      if (mainComponent) {
        const isExternal = mainComponent.remote;
        const componentMatch = mainComponent.id === queryComponent.id;

        if (componentMatch) {
          const result = {
            id: node.id,
            name: node.name,
            type: node.type,
            mainComponentId: mainComponent ? mainComponent.id : "null",
            isExternal: isExternal,
          };
          console.log("Matching node:", result);

          if (isExternal && includeExternalComponent) {
            results.push(result);
          } else if (!isExternal && includeNormalComponent) {
            results.push(result);
          }
        }
      }
    } else if (category === "color" && (includeFills || includeStrokes)) {
      const processColorProperty = (property: any[]) => {
        property.forEach((item) => {
          if (item.type === "SOLID" && item.visible !== false) {
            const queryColor = query as ColorInfo;
            const itemOpacity = item.opacity !== undefined ? item.opacity : 1;
            if (
              isColorMatch(
                {
                  r: item.color.r,
                  g: item.color.g,
                  b: item.color.b,
                  a: itemOpacity,
                },
                queryColor
              )
            ) {
              results.push({
                id: node.id,
                type: node.type,
                name: node.name,
              });
            }
          }
        });
      };

      if (includeFills && "fills" in node && Array.isArray(node.fills)) {
        processColorProperty(node.fills);
      }
      if (includeStrokes && "strokes" in node && Array.isArray(node.strokes)) {
        processColorProperty(node.strokes);
      }
    } else if (category === "text" && isTextNode(node)) {
      const regex = new RegExp(
        `${textMatchWholeWord ? "\\b" : ""}${query}${
          textMatchWholeWord ? "\\b" : ""
        }`,
        textCaseSensitive ? "g" : "gi"
      );
      if (
        regex.test(
          textCaseSensitive ? node.characters : node.characters.toLowerCase()
        )
      ) {
        results.push({
          id: node.id,
          type: node.type,
          name: node.name,
          characters: node.characters,
        });
      }
    } else if (category === "font" && isTextNode(node)) {
      if (typeof node.fontName !== "symbol") {
        const fontFamily = node.fontName.family;
        const fontStyle = node.fontName.style;
        const isMissing = node.hasMissingFont;
        const queryFont = query as FontInfo;

        if (
          fontFamily === queryFont.fontFamily &&
          fontStyle === queryFont.fontStyle &&
          ((isMissing && includeMissingFont) ||
            (!isMissing && includeNormalFont))
        ) {
          results.push({
            id: node.id,
            type: node.type,
            name: node.name,
            characters: node.characters,
          });
        }
      }
    } else if (category === "layer" && node.type !== "TEXT") {
      const regex = new RegExp(
        `${textMatchWholeWord ? "\\b" : ""}${query}${
          textMatchWholeWord ? "\\b" : ""
        }`,
        textCaseSensitive ? "g" : "gi"
      );
      const nodeName = textCaseSensitive ? node.name : node.name.toLowerCase();
      if (regex.test(nodeName)) {
        results.push({ id: node.id, type: node.type, name: node.name });
      }
    }

    if ("children" in node && node.children) {
      for (let child of node.children) {
        await traverse(child);
      }
    }
  }

  await traverse(node);
  return results;
}
