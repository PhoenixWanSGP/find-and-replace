if (figma.editorType === "figma") {
  figma.showUI(__html__, {
    height: 528,
    width: 400,
  });

  interface Message {
    type: string;
    payload: any;
  }

  let inFigmaCurrentNode: string | null = null; // 存储全局节点ID
  let currentNodeFocused: boolean = false; // 节点是否聚焦

  function isTextNode(node: SceneNode | PageNode): node is TextNode {
    return node.type === "TEXT";
  }

  function isFrameLikeNode(
    node: SceneNode | PageNode
  ): node is FrameNode | ComponentNode | InstanceNode {
    return ["FRAME", "COMPONENT", "INSTANCE"].includes(node.type);
  }

  function searchNodes(
    node: SceneNode | PageNode,
    query: string,
    textCaseSensitive: boolean = false,
    textMatchWholeWord: boolean = false,
    category: string
  ): any[] {
    const results: any[] = [];
    const regex = new RegExp(
      `${textMatchWholeWord ? "\\b" : ""}${query}${
        textMatchWholeWord ? "\\b" : ""
      }`,
      textCaseSensitive ? "g" : "gi"
    );

    function traverse(node: SceneNode | PageNode) {
      if (category === "text" && isTextNode(node)) {
        if (
          regex.test(
            textCaseSensitive ? node.characters : node.characters.toLowerCase()
          )
        ) {
          results.push({
            id: node.id,
            type: node.type,
            characters: node.characters,
          });
        }
      } else if (category === "layer" && isFrameLikeNode(node)) {
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
      console.log(`操作节点ID: ${nodeId}, 是否创建框架: ${shouldCreate}`);
      console.log("开始加载所有页面...");
      await figma.loadAllPagesAsync(); // 确保所有页面加载完成
      console.log("所有页面加载完成");

      console.log("查找现有的高亮框以删除...");
      const frames = figma.currentPage.findAll(
        (frame) => frame.name === "Highlight Frame"
      );
      frames.forEach((frame) => {
        console.log(`删除高亮框: ${frame.id}`);
        frame.remove();
      });

      // 如果 nodeId 为空，则不执行创建高亮框的操作
      if (!nodeId) {
        console.log("No node ID provided, skipping highlight frame creation.");
        return;
      }

      if (shouldCreate) {
        console.log(`正在尝试通过ID获取节点: ${nodeId}`);
        const targetNode = (await figma.getNodeByIdAsync(
          nodeId
        )) as SceneNode | null;
        if (targetNode) {
          console.log("找到节点，正在移动视图以聚焦该节点...");
          figma.viewport.scrollAndZoomIntoView([targetNode]);

          const x = targetNode.absoluteTransform[0][2];
          const y = targetNode.absoluteTransform[1][2];
          console.log(`节点位置: x=${x}, y=${y}`);

          const highlightFrame = figma.createRectangle();
          highlightFrame.name = "Highlight Frame";
          highlightFrame.resize(targetNode.width, targetNode.height);
          highlightFrame.x = x;
          highlightFrame.y = y;
          highlightFrame.fills = [];
          highlightFrame.strokes = [
            { type: "SOLID", color: { r: 1, g: 0, b: 0 } },
          ];
          highlightFrame.strokeWeight = 2;
          figma.currentPage.appendChild(highlightFrame);
          console.log("高亮框创建完成，已添加到页面.");
        } else {
          console.error("未找到节点或无法访问节点: ", nodeId);
        }
      }
    } catch (error) {
      console.error("Error in toggleHighlightFrame:", error);
    }
  }

  figma.ui.onmessage = async (msg: Message) => {
    console.log("get message:", msg);
    switch (msg.type) {
      case "search":
        const { currentTab, query, caseSensitive, matchWholeWord } =
          msg.payload;
        if (!query) {
          figma.ui.postMessage({
            type: "search-results",
            payload: { category: currentTab, data: [] },
          });
          console.log("====search result:====\nnull");
          return;
        }

        const nodesToSearch = figma.currentPage.selection.length
          ? figma.currentPage.selection
          : [figma.currentPage];
        const searchResults = nodesToSearch.flatMap((node) =>
          searchNodes(node, query, caseSensitive, matchWholeWord, currentTab)
        );
        figma.ui.postMessage({
          type: "search-results",
          payload: { category: currentTab, data: searchResults },
        });
        break;

      case "select-node":
        inFigmaCurrentNode = msg.payload.nodeId;
        console.log("inFigmaCurrentNode 赋值完毕:", inFigmaCurrentNode);
        // 检查节点ID是否为空，如果为空，则取消创建高亮框
        if (inFigmaCurrentNode) {
          toggleHighlightFrame(inFigmaCurrentNode, true);
        } else {
          console.log("Received empty node ID, clearing any highlights...");
          toggleHighlightFrame(inFigmaCurrentNode, false);
        }
        break;

      case "activate-view":
        currentNodeFocused = true;
        console.log("activate-view赋值完毕", currentNodeFocused);
        if (inFigmaCurrentNode) {
          toggleHighlightFrame(inFigmaCurrentNode, true);
        }
        break;

      case "deactivate-view":
        currentNodeFocused = false;
        console.log("deactivate-view赋值完毕", currentNodeFocused);
        if (inFigmaCurrentNode) {
          toggleHighlightFrame(inFigmaCurrentNode, false);
        }
        break;

      case "replace":
        console.log("====收到replace消息====：", msg);
        break;

      case "replace-all":
        console.log("====收到replace消息====：", msg);
        break;

      default:
        console.log("Unhandled message type:", msg.type);
        break;
    }
  };
}