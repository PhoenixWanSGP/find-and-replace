if (figma.editorType === "figma") {
  figma.showUI(__html__, {
    height: 528,
    width: 400,
  });

  const textNodes: any = [];
  const nonTextNodes: any = [];
  let selectedNodeId: string | null = null;
  let shouldHighlight = false; // 默认不显示红色框

  //处理高亮框的创建和移除的函数
  async function toggleHighlightFrame(nodeId: string, shouldCreate: boolean) {
    try {
      // console.log("在toggle函数内");
      // 确保所有页面都被加载
      await figma.loadAllPagesAsync();
      // console.log("所有页面加载完成");

      const frames = figma.currentPage.findAll(
        (node) => node.name === "Highlight Frame"
      );
      // console.log("figma findALL运行成功");
      frames.forEach((frame) => frame.remove());
      // console.log("删除原有的所有框");

      // 如果应该创建新的高亮框
      if (shouldCreate) {
        // console.log("开始创建框");
        const node = (await figma.getNodeByIdAsync(nodeId)) as SceneNode;
        // console.log("找到了目标节点");
        if (node) {
          // 将视图移动到该节点
          figma.viewport.scrollAndZoomIntoView([node]);

          // 计算节点全局位置的函数
          function computeGlobalPosition(node: SceneNode): {
            x: number;
            y: number;
          } {
            // 使用 absoluteTransform 获取全局位置
            // absoluteTransform 是一个 3x2 的矩阵，我们只关心平移部分（第三列）
            const transform = node.absoluteTransform;
            const x = transform[0][2];
            const y = transform[1][2];

            return { x, y };
          }

          const { x, y } = computeGlobalPosition(node);

          // 创建红色矩形框并定位到计算出的位置
          const frame = figma.createRectangle();
          frame.name = "Highlight Frame";
          frame.resize(node.width, node.height);
          frame.x = x;
          frame.y = y;
          frame.fills = [];
          frame.strokes = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 } }];
          frame.strokeWeight = 2;

          // 将红色矩形框添加到当前页面
          figma.currentPage.appendChild(frame);
          // console.log("确实画出了框,并添加了子节点");
        }
      }
    } catch (error) {
      // console.error("在 findAll 或删除框时发生错误:", error);
    }
  }

  figma.ui.onmessage = async (msg: {
    type: string;
    message: string;
    caseSensitive?: boolean;
    matchWholeWord?: boolean;
    replaceText?: string;
    selectedNodeId: string; // 添加当前选中节点的id
  }) => {
    if (msg.type === "find-next") {
      // console.log("收到 find-next 消息:", msg, "\n");
      textNodes.length = 0;
      nonTextNodes.length = 0;
      // const searchMessage = msg.message.toLowerCase();
      // 获取 caseSensitive 和 matchWholeWord 参数的值
      const caseSensitive = msg.caseSensitive;
      const matchWholeWord = msg.matchWholeWord;

      await figma.currentPage.loadAsync();

      function findText(
        node: SceneNode,
        caseSensitive: boolean,
        matchWholeWord: boolean
      ) {
        // 根据 caseSensitive 参数决定是否区分大小写
        const flags = caseSensitive ? "g" : "gi";
        // 如果 matchWholeWord 为 true，则只匹配整个单词
        const wordBoundary = matchWholeWord ? "\\b" : "";
        // 根据 caseSensitive 参数决定是否转换 searchMessage 为小写
        const searchString = caseSensitive
          ? msg.message
          : msg.message.toLowerCase();
        const searchRegex = new RegExp(
          wordBoundary + searchString + wordBoundary,
          flags
        );

        if ("characters" in node) {
          const nodeText = caseSensitive
            ? node.characters
            : node.characters.toLowerCase();
          if (nodeText.match(searchRegex)) {
            textNodes.push({
              id: node.id,
              type: node.type,
              characters: node.characters,
            });
          }
        } else {
          // 对于非文本节点，我们也需要根据 caseSensitive 来处理 node.name
          const nodeName = caseSensitive ? node.name : node.name.toLowerCase();
          if (nodeName.match(searchRegex)) {
            nonTextNodes.push({
              id: node.id,
              type: node.type,
              name: node.name,
            });
          }
        }
        if ("children" in node) {
          for (const child of node.children) {
            findText(child as SceneNode, caseSensitive, matchWholeWord);
          }
        }
      }

      // 确定查找范围：如果有选中区域，只查找选中的节点；否则，查找整个页面
      const nodesToSearch =
        figma.currentPage.selection.length > 0
          ? figma.currentPage.selection
          : figma.currentPage.children;

      // 遍历查找范围内的每个节点
      // 遍历查找范围内的每个节点
      for (const node of nodesToSearch) {
        findText(
          node as SceneNode,
          caseSensitive === true,
          matchWholeWord === true
        );
      }

      // console.log("Text nodes containing the message:", textNodes);
      // console.log("Non-text nodes containing the message:", nonTextNodes);
      figma.ui.postMessage({ type: "found-text-nodes", data: textNodes });
      // console.log("找完了所有节点,同时发送 found-text-nodes消息:", textNodes);

      // 如果搜索结果为空，清除已有的高亮框，并确保没有节点被选中
      if (textNodes.length === 0) {
        selectedNodeId = null; // 清除选中节点的ID
        toggleHighlightFrame("", false); // 调用函数移除高亮框，传入空字符串作为nodeId
        // console.log("搜索结果为空，已清除高亮框并重置选中节点");
      }
    }

    if (msg.type === "selected-result") {
      // console.log("收到selected-result消息:", textNodes);

      selectedNodeId = msg.message; // 存储nodeId到外部变量
      // console.log("收到selected-result消息:", msg.message);
      // 根据当前高亮状态决定是否立即创建红色框
      if (shouldHighlight && selectedNodeId !== null) {
        toggleHighlightFrame(selectedNodeId, true);
        // console.log("创建红色框成功");
      }
    } else if (msg.type === "highlight-nodes") {
      shouldHighlight = msg.message === "true"; // 更新高亮状态
      if (selectedNodeId !== null) {
        toggleHighlightFrame(selectedNodeId, shouldHighlight);
      }
      // console.log("更新红色框成功");
    }
    if (msg.type === "replace-all") {
      const findText = msg.message;
      const replaceText = msg.replaceText || "";
      const caseSensitive = msg.caseSensitive === true;
      const matchWholeWord = msg.matchWholeWord === true;

      // 使用正则表达式来匹配查找的文本
      const searchRegex = new RegExp(
        matchWholeWord ? `\\b${findText}\\b` : findText,
        caseSensitive ? "g" : "gi"
      );

      // 确定搜索范围：如果有选中的节点，只搜索这些节点；否则，搜索整个页面
      const nodesToSearch =
        figma.currentPage.selection.length > 0
          ? figma.currentPage.selection
          : [figma.currentPage];

      // 遍历所有节点并查找文本节点
      const findAllTextNodes = (node: SceneNode): TextNode[] => {
        let textNodes: TextNode[] = [];
        if (node.type === "TEXT") {
          textNodes.push(node);
        } else if ("children" in node) {
          for (const child of node.children) {
            textNodes = textNodes.concat(findAllTextNodes(child as SceneNode));
          }
        }
        return textNodes;
      };

      let allTextNodes: TextNode[] = [];
      nodesToSearch.forEach((node) => {
        allTextNodes = allTextNodes.concat(findAllTextNodes(node as SceneNode));
      });

      // 对每个文本节点进行处理
      for (const textNode of allTextNodes) {
        // 检查文本节点是否包含查找的文本
        if (
          caseSensitive
            ? textNode.characters.includes(findText)
            : textNode.characters.toLowerCase().includes(findText.toLowerCase())
        ) {
          // 确保加载了文本节点使用的字体
          await figma.loadFontAsync(textNode.fontName as FontName);
          // 替换文本
          const newCharacters = textNode.characters.replace(
            searchRegex,
            replaceText
          );
          textNode.characters = newCharacters;
        }
      }

      // console.log("所有匹配的文本已被替换");
    }
    if (msg.type === "replace") {
      const {
        selectedNodeId,
        message: findText,
        replaceText,
        caseSensitive,
        matchWholeWord,
      } = msg;
      // console.log("收到replace消息：", msg);
      // console.log(
      //   "变量为：",
      //   selectedNodeId,
      //   " ",
      //   findText,
      //   " ",
      //   replaceText,
      //   " ",
      //   caseSensitive,
      //   " ",
      //   matchWholeWord
      // );

      // 确保 selectedNodeId 是有效的，并且 replaceText 不是 undefined
      if (selectedNodeId && replaceText !== undefined) {
        try {
          const node = (await figma.getNodeByIdAsync(
            selectedNodeId
          )) as TextNode; // 使用异步方法
          // console.log("找到节点：", node);

          if (node && node.type === "TEXT") {
            // 确保加载了文本节点使用的字体
            // console.log("进入text节点");

            await figma.loadFontAsync(node.fontName as FontName);

            // 构造正则表达式，考虑大小写敏感性和完整单词匹配
            const flags = caseSensitive ? "g" : "gi";
            const wordBoundary = matchWholeWord ? "\\b" : "";
            const searchRegex = new RegExp(
              wordBoundary + findText + wordBoundary,
              flags
            );

            // 检查文本节点的 characters 属性中是否包含 findText 关键词
            if (searchRegex.test(node.characters)) {
              // console.log("包含关键词");

              // 执行替换操作
              const newCharacters = node.characters.replace(
                searchRegex,
                replaceText
              );
              node.characters = newCharacters;

              // 替换逻辑结束，发送消息通知 UI
              figma.ui.postMessage({ type: "replace-end", message: "true" });
              // console.log("替换成功");
            } else {
              // 如果没有找到匹配项，也发送消息通知 UI
              figma.ui.postMessage({ type: "replace-end", message: "false" });
              // console.log("没有匹配的");
            }
          }
        } catch (error) {
          // console.error("在获取节点或加载字体时发生错误:", error);
          // 发送错误消息通知 UI
          figma.ui.postMessage({ type: "replace-end", message: "false" });
        }
      }
    }
  };
}
