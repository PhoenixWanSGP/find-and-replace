import {
  ColorInfo,
  ComponentInfo,
  FontInfo,
  QueryType,
  StyleInfo,
} from "@/types";

if (figma.editorType === "figma") {
  figma.showUI(__html__, {
    height: 528,
    width: 400,
  });

  interface Message {
    type: string;
    payload: any;
  }

  enum TabName {
    COLOR = "color",
    FONT = "font",
    COMPONENT = "instance",
    STYLE = "style",
    VARIABLE = "variable",
  }

  let inFigmaCurrentNode: string | null = null; // 存储全局节点ID
  // let currentNodeFocused: boolean = false; // 节点是否聚焦

  function isTextNode(node: SceneNode | PageNode): node is TextNode {
    return node.type === "TEXT";
  }

  function searchNodes(
    node: SceneNode | PageNode,
    query: QueryType,
    textCaseSensitive: boolean = false,
    textMatchWholeWord: boolean = false,
    category: string,
    includeFills: boolean = false,
    includeStrokes: boolean = false
  ): any[] {
    const results: any[] = [];

    function isColorMatch(colorA: RGBA, colorB: RGBA): boolean {
      return (
        Math.abs(colorA.r - colorB.r) < 0.01 &&
        Math.abs(colorA.g - colorB.g) < 0.01 &&
        Math.abs(colorA.b - colorB.b) < 0.01 &&
        Math.abs(colorA.a - colorB.a) < 0.01
      );
    }

    function traverse(node: SceneNode | PageNode) {
      if (category === "color" && (includeFills || includeStrokes)) {
        const processColorProperty = (property: any[]) => {
          property.forEach((item) => {
            if (item.type === "SOLID" && item.visible !== false) {
              const queryColor = query as ColorInfo; // 假定query已经是ColorInfo类型
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
        if (
          includeStrokes &&
          "strokes" in node &&
          Array.isArray(node.strokes)
        ) {
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
            name: node.name, // Assume nodes of type TEXT also have 'name'
            characters: node.characters,
          });
        }
      } else if (category === "layer" && node.type !== "TEXT") {
        const regex = new RegExp(
          `${textMatchWholeWord ? "\\b" : ""}${query}${
            textMatchWholeWord ? "\\b" : ""
          }`,
          textCaseSensitive ? "g" : "gi"
        );
        const nodeName = textCaseSensitive
          ? node.name
          : node.name.toLowerCase();
        if (regex.test(nodeName)) {
          results.push({ id: node.id, type: node.type, name: node.name });
        }
      }

      if ("children" in node) {
        (node.children as SceneNode[]).forEach(traverse);
      }
    }

    traverse(node);
    return results;
  }

  async function toggleHighlightFrame(
    nodeId: string | null,
    shouldCreate: boolean
  ) {
    try {
      await figma.loadAllPagesAsync(); // 确保所有页面加载完成
      const frames = figma.currentPage.findAll(
        (frame) => frame.name === "Highlight Frame"
      );
      frames.forEach((frame) => {
        frame.remove();
      });

      // 如果 nodeId 为空，则不执行创建高亮框的操作
      if (!nodeId) {
        return;
      }

      if (shouldCreate) {
        const targetNode = (await figma.getNodeByIdAsync(
          nodeId
        )) as SceneNode | null;
        if (targetNode) {
          figma.viewport.scrollAndZoomIntoView([targetNode]);

          // 设定高亮框的边距
          const padding = 10; // 高亮框与节点边缘的距离（像素）

          // 计算高亮框的位置和尺寸
          const x = targetNode.absoluteTransform[0][2] - padding;
          const y = targetNode.absoluteTransform[1][2] - padding;
          const width = targetNode.width + padding * 2;
          const height = targetNode.height + padding * 2;

          // 创建并设置高亮框
          const highlightFrame = figma.createRectangle();
          highlightFrame.name = "Highlight Frame";
          highlightFrame.resize(width, height);
          highlightFrame.x = x;
          highlightFrame.y = y;
          highlightFrame.fills = []; // 无填充
          highlightFrame.strokes = [
            { type: "SOLID", color: { r: 1, g: 0, b: 0 } },
          ]; // 红色边框
          highlightFrame.strokeWeight = 2; // 边框厚度
          highlightFrame.strokeAlign = "OUTSIDE"; // 边框在矩形的外侧
          figma.currentPage.appendChild(highlightFrame);
        } else {
          console.error("No node found: ", nodeId);
        }
      }
    } catch (error) {
      console.error("Error in toggleHighlightFrame:", error);
    }
  }

  interface ModifiedNodeInfo {
    id: string;
    type: string;
    name: string;
    characters?: string;
  }

  // Function that replaces text or names within nodes based on provided criteria and returns an array of modified node information.
  async function replaceAllNodes(
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

  async function handleSelectAllNodes(payload: { nodeIds: any }) {
    const { nodeIds } = payload;

    // 异步获取所有节点，使用 getNodeByIdAsync 替代 getNodeById
    const nodes = await Promise.all(
      nodeIds.map(async (id: string) => {
        try {
          const node = await figma.getNodeByIdAsync(id);
          return node;
        } catch (error) {
          console.error("Failed to retrieve node:", error);
          return null;
        }
      })
    ).then((results) => results.filter((node) => node !== null)); // 过滤掉未找到或获取失败的节点

    // 检查获取的节点数量，如果为空则可能需要通知用户
    if (nodes.length === 0) {
      figma.notify("No nodes found with the provided IDs.");
      return;
    }

    // 设置 Figma 的当前选区
    figma.currentPage.selection = nodes;

    // 将视图滚动到选中的节点
    figma.viewport.scrollAndZoomIntoView(nodes);
    figma.notify("Selected all specified nodes.");
  }

  async function collectColors(nodes: any) {
    await figma.loadAllPagesAsync(); // 确保所有页面都被加载
    const colorSet = new Set<{
      color: { r: number; g: number; b: number; a: number };
      key: string;
    }>();

    function processNode(node: any) {
      const addColor = (colorInfo: any, opacity: number) => {
        const { r, g, b } = colorInfo;
        const a = opacity !== undefined ? opacity : 1; // 如果未定义则默认为1
        const rgbaObject = { r, g, b, a };
        const rgbaString = `rgba(${r}, ${g}, ${b}, ${a})`; // 用于生成唯一字符串，以防止重复颜色
        colorSet.add({ color: rgbaObject, key: rgbaString });
      };

      if ("fills" in node && Array.isArray(node.fills)) {
        node.fills.forEach((fill: any) => {
          if (fill.type === "SOLID" && fill.visible !== false) {
            const opacity = fill.opacity !== undefined ? fill.opacity : 1; // 获取填充的透明度
            addColor(fill.color, opacity); // 传入填充的透明度
          }
        });
      }

      if ("strokes" in node && Array.isArray(node.strokes)) {
        node.strokes.forEach((stroke: any) => {
          if (stroke.type === "SOLID" && stroke.visible !== false) {
            const opacity = stroke.opacity !== undefined ? stroke.opacity : 1; // 获取描边的透明度
            addColor(stroke.color, opacity); // 传入描边的透明度
          }
        });
      }

      if ("children" in node) {
        node.children.forEach(processNode);
      }
    }

    nodes.forEach(processNode);

    // 使用Map结构来确保颜色的唯一性，然后返回一个数组
    const uniqueColors = new Map<
      string,
      { r: number; g: number; b: number; a: number }
    >();
    colorSet.forEach((item) => {
      if (!uniqueColors.has(item.key)) {
        uniqueColors.set(item.key, item.color);
      }
    });

    // 计算亮度
    const brightness = (r: number, g: number, b: number) =>
      r * 255 * 0.299 + g * 255 * 0.587 + b * 255 * 0.114;

    // 将颜色由浅到深排序，并在 RGB 相同的情况下按透明度降序排列
    const sortedColors = Array.from(uniqueColors.values()).sort(
      (colorA, colorB) => {
        const brightnessA = brightness(colorA.r, colorA.g, colorA.b);
        const brightnessB = brightness(colorB.r, colorB.g, colorB.b);
        if (brightnessA === brightnessB) {
          // 如果亮度相同，则按透明度降序排列
          return colorB.a - colorA.a;
        }
        return brightnessB - brightnessA; // 亮度大的颜色排在前面
      }
    );

    return sortedColors;
  }

  async function collectFonts(nodes: any): Promise<FontInfo[]> {
    // 查找所有文本节点，只在支持 findAll 方法的选中节点中查找
    const textNodes = nodes.flatMap((node: any) =>
      "findAll" in node ? node.findAll((n: any) => n.type === "TEXT") : []
    ) as TextNode[];

    // 收集字体信息并去重
    const fontsUsed = textNodes
      .map((node) => {
        // 检查 fontName 是否为 FontName 类型
        if (typeof node.fontName !== "symbol") {
          return {
            fontFamily: (node.fontName as FontName).family,
            fontStyle: (node.fontName as FontName).style,
            // fontSize: node.fontSize,
            isMissing: node.hasMissingFont,
          };
        }
        return undefined;
      })
      .filter((fontInfo): fontInfo is FontInfo => fontInfo !== undefined)
      .reduce<FontInfo[]>((uniqueFonts, fontInfo) => {
        const fontExists = uniqueFonts.some(
          (existingFont) =>
            existingFont.fontFamily === fontInfo.fontFamily &&
            existingFont.fontStyle === fontInfo.fontStyle &&
            // existingFont.fontSize === fontInfo.fontSize &&
            existingFont.isMissing === fontInfo.isMissing
        );
        if (!fontExists) {
          uniqueFonts.push(fontInfo);
        }
        return uniqueFonts;
      }, []);

    // 排序字体信息
    fontsUsed.sort((a, b) => {
      // 首先按 isMissing 排序，isMissing 为 false 的排前面
      if (a.isMissing === false && b.isMissing === true) return -1;
      if (a.isMissing === true && b.isMissing === false) return 1;

      // 按 fontFamily 升序排序
      if (a.fontFamily < b.fontFamily) return -1;
      if (a.fontFamily > b.fontFamily) return 1;

      // 如果 fontFamily 相同，则按 fontStyle 升序排序
      if (a.fontStyle < b.fontStyle) return -1;
      if (a.fontStyle > b.fontStyle) return 1;

      // 所有排序条件都相同，返回0
      return 0;
    });

    return fontsUsed;
  }

  async function collectComponents(nodes: any): Promise<ComponentInfo[]> {
    // 查找所有组件节点，只在支持 findAll 方法的选中节点中查找
    const componentNodes = nodes.flatMap((node: any) =>
      "findAll" in node
        ? node.findAll(
            (n: any) => n.type === "COMPONENT" || n.type === "COMPONENT_SET"
          )
        : []
    ) as (ComponentNode | ComponentSetNode)[]; // 使用更具体的类型代替 SceneNode

    // 收集组件信息并去重
    const componentsUsed = componentNodes
      .map((node) => {
        return {
          id: node.id,
          name: node.name,
          description: "description" in node ? node.description : "", // 使用类型守卫来检查 description 属性是否存在
        };
      })
      .reduce<ComponentInfo[]>((uniqueComponents, componentInfo) => {
        const componentExists = uniqueComponents.some(
          (existingComponent) => existingComponent.id === componentInfo.id
        );
        if (!componentExists) {
          uniqueComponents.push(componentInfo);
        }
        return uniqueComponents;
      }, []);

    // 对组件信息进行排序，先按 name 升序排序
    componentsUsed.sort((a, b) => a.name.localeCompare(b.name));

    return componentsUsed;
  }

  async function collectStyles(): Promise<StyleInfo[]> {
    const paintStyles = await figma.getLocalPaintStylesAsync();
    const textStyles = await figma.getLocalTextStylesAsync();

    const stylesUsed: StyleInfo[] = [];

    // 收集绘画样式
    paintStyles.forEach((style) => {
      stylesUsed.push({
        id: style.id,
        styleType: "PaintStyle", // 明确指定为 'PaintStyle'
        name: style.name,
        description: style.description || "",
        properties: {
          colors: style.paints
            .map((paint: SolidPaint | GradientPaint | ImagePaint | any) => {
              if (paint.type === "SOLID") {
                // 注意：对于填充颜色，透明度通常是颜色属性的一部分
                return {
                  r: paint.color.r,
                  g: paint.color.g,
                  b: paint.color.b,
                  a: paint.opacity || 1,
                };
              }
              return null; // 只处理 SOLID 类型的颜色
            })
            .filter((color: any) => color !== null),
        },
      });
    });

    // 收集文本样式
    textStyles.forEach((style) => {
      stylesUsed.push({
        id: style.id,
        styleType: "TextStyle", // 明确指定为 'TextStyle'
        name: style.name,
        description: style.description || "",
        properties: {
          fontFamily: style.fontName.family,
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
        },
      });
    });

    return stylesUsed;
  }

  figma.ui.onmessage = async (msg: Message) => {
    switch (msg.type) {
      case "search":
        {
          const {
            currentTab,
            query,
            caseSensitive,
            matchWholeWord,
            includeFills,
            includeStrokes,
          } = msg.payload;
          const nodesToSearch = figma.currentPage.selection.length
            ? figma.currentPage.selection
            : [figma.currentPage];
          const searchResults = nodesToSearch.flatMap((node) =>
            searchNodes(
              node,
              query,
              caseSensitive,
              matchWholeWord,
              currentTab,
              includeFills,
              includeStrokes
            )
          );
          figma.ui.postMessage({
            type: "search-results",
            payload: { category: currentTab, data: searchResults },
          });
          console.log("====搜索结果是====", currentTab, searchResults);
        }
        break;

      case "select-node":
        inFigmaCurrentNode = msg.payload.nodeId;
        // 检查节点ID是否为空，如果为空，则取消创建高亮框
        if (inFigmaCurrentNode) {
          toggleHighlightFrame(inFigmaCurrentNode, true);
        } else {
          toggleHighlightFrame(inFigmaCurrentNode, false);
        }
        break;

      case "activate-view":
        // currentNodeFocused = true;
        if (inFigmaCurrentNode) {
          toggleHighlightFrame(inFigmaCurrentNode, true);
        }
        break;

      case "deactivate-view":
        // currentNodeFocused = false;
        if (inFigmaCurrentNode) {
          toggleHighlightFrame(inFigmaCurrentNode, false);
        }
        break;

      case "replace":
        {
          const {
            nodeId,
            newValue,
            query,
            caseSensitive,
            matchWholeWord,
            currentTab,
          } = msg.payload;
          const regexFlags = caseSensitive ? "g" : "gi";
          const regexPattern = matchWholeWord ? `\\b${query}\\b` : query;
          const regex = new RegExp(regexPattern, regexFlags);

          const targetNode = (await figma.getNodeByIdAsync(
            nodeId
          )) as SceneNode;
          if (!targetNode) {
            console.error("Node not found:", nodeId);
            return;
          }

          if (targetNode.type === "TEXT") {
            // 在替换文本前确保字体已加载
            try {
              await figma.loadFontAsync(
                (targetNode as TextNode).fontName as FontName
              );
              // 替换字符中匹配的部分
              targetNode.characters = targetNode.characters.replace(
                regex,
                newValue
              );
            } catch (error) {
              console.error("Failed to load font:", error);
              return;
            }
          } else if (targetNode.name) {
            // 简化条件，检查是否存在name属性
            // 替换节点名称中匹配的部分
            targetNode.name = targetNode.name.replace(regex, newValue);
          }

          // 向前端发送替换完成的消息
          figma.ui.postMessage({
            type: "replace-done",
            payload: {
              nodeId: nodeId,
              currentTab: currentTab,
              newData:
                targetNode.type === "TEXT"
                  ? { characters: targetNode.characters }
                  : { name: targetNode.name },
            },
          });
        }
        break;

      case "replace-all":
        const { query, caseSensitive, matchWholeWord, newValue, currentTab } =
          msg.payload;
        const nodesToReplace =
          figma.currentPage.selection.length > 0
            ? figma.currentPage.selection
            : [figma.currentPage];
        await figma.loadAllPagesAsync();
        const modifiedNodes = await replaceAllNodes(
          nodesToReplace,
          query,
          caseSensitive,
          matchWholeWord,
          newValue,
          currentTab
        );
        figma.ui.postMessage({
          type: "search-results",
          payload: { category: currentTab, data: modifiedNodes },
        });
        // console.log("All replacements done and results sent back to the UI.");
        break;

      case "select-all":
        console.log("后端收到信息:select-all", msg.payload);
        handleSelectAllNodes(msg.payload);

        break;

      case "get-searchlist":
        console.log(
          `后端收到信息: get-searchlist for tab ${msg.payload.currentTab}`
        );
        try {
          let results;
          const nodesToProcess =
            figma.currentPage.selection.length > 0
              ? figma.currentPage.selection
              : [figma.currentPage];

          switch (msg.payload.currentTab) {
            case TabName.COLOR:
              const colorsData = await collectColors(nodesToProcess);
              results = {
                type: "searchlist",
                payload: {
                  dataType: "color-results",
                  data: colorsData,
                },
              };
              break;

            case TabName.FONT:
              const fontsData = await collectFonts(nodesToProcess);
              results = {
                type: "searchlist",
                payload: {
                  dataType: "font-results",
                  data: fontsData,
                },
              };
              break;

            case TabName.COMPONENT:
              const componentsData = await collectComponents(nodesToProcess);
              results = {
                type: "searchlist",
                payload: {
                  dataType: "component-results",
                  data: componentsData,
                },
              };
              break;

            case TabName.STYLE:
              const stylesData = await collectStyles();
              results = {
                type: "searchlist",
                payload: {
                  dataType: "style-results",
                  data: stylesData,
                },
              };
              break;

            // ... (处理其他 TabName 的 case)

            default:
              throw new Error(`Unsupported tab: ${msg.payload.currentTab}`);
          }

          figma.ui.postMessage(results);
        } catch (error) {
          console.error("Error processing search list:", error);
          // 发送错误消息到 UI
          figma.ui.postMessage({
            type: "searchlist",
            payload: {
              dataType: "error",
              data: {},
            },
          });
        }
        break;

      default:
        console.log("Unhandled message type:", msg.type);
        break;
    }
  };
}
