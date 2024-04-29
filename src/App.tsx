import { useState, useEffect, useRef } from "react";
import { FaTwitter, FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FigmaTextIcon, FigmaComponentIcon } from "./icons/FigmaIcons";

// import { Checkbox } from "./components/ui/checkbox";
// import { ScrollArea } from "./components/ui/scroll-area";
// import { ScrollAreaViewport } from "@radix-ui/react-scroll-area";

// const tags = Array.from({ length: 50 }).map(
//   (_, i, a) => `v1.2.0-beta.${a.length - i}`
// );
interface TextNode {
  id: string;
  type: string;
  characters: string;
}

function highlightText(text: string, highlight: string) {
  if (!highlight.trim()) {
    return text;
  }

  const matchIndexes = [...text.matchAll(new RegExp(highlight, "gi"))].map(
    (match) => match.index
  );
  const highlightedTextParts = [];
  let prevIndex = 0;

  matchIndexes.forEach((matchIndex, i) => {
    // 添加匹配前的文本（如果有）
    if (matchIndex > prevIndex) {
      highlightedTextParts.push(text.substring(prevIndex, matchIndex));
    }
    // 添加高亮的匹配文本
    highlightedTextParts.push(
      <span key={i} className="bg-yellow-200">
        {text.substring(matchIndex, matchIndex + highlight.length)}
      </span>
    );
    prevIndex = matchIndex + highlight.length;
  });

  // 添加最后一个匹配之后的文本（如果有）
  if (prevIndex < text.length) {
    highlightedTextParts.push(text.substring(prevIndex));
  }

  // 裁剪处理
  const resultText = highlightedTextParts.reduce<(string | JSX.Element)[]>(
    (acc, part) => {
      if (typeof part === "string") {
        // 对于字符串部分，检查长度并可能裁剪
        const beforeTextCut = part.length > 30 ? "..." + part.slice(-30) : part;
        acc.push(beforeTextCut);
      } else {
        // 对于React元素（高亮部分），直接添加
        acc.push(part);
      }
      return acc;
    },
    []
  );

  return <>{resultText}</>;
}

function App() {
  // const [selectedTag, setSelectedTag] = useState(null);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [textNodeCharacters, setTextNodeCharacters] = useState<TextNode[]>([]);
  const [lastFindText, setLastFindText] = useState("");
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  // const scrollAreaRef = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [matchWholeWord, setMatchWholeWord] = useState(false);
  const [lastCaseSensitive, setLastCaseSensitive] = useState(false);
  const [lastMatchWholeWord, setLastMatchWholeWord] = useState(false);
  // 假设viewportRef是用来引用一个特定的滚动容器的，这里我们假设它是一个div
  // const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 当窗口获得焦点时发送true消息
    const handleFocus = () => {
      parent.postMessage(
        { pluginMessage: { type: "highlight-nodes", message: "true" } },
        "*"
      );
      // console.log("高亮中");
    };

    // 当窗口失去焦点时发送false消息
    const handleBlur = () => {
      parent.postMessage(
        { pluginMessage: { type: "highlight-nodes", message: "false" } },
        "*"
      );
      // console.log("失去高亮");
    };

    // 绑定事件监听器
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    // 监听来自插件代码的消息
    window.onmessage = (event) => {
      const { type, data } = event.data.pluginMessage;
      if (type === "found-text-nodes") {
        setTextNodeCharacters(data as TextNode[]);
        // console.log("received found-text-message");

        // 如果有搜索结果，选中第一个并发送 selected-result 消息
        console.log("收到found-text-nodes消息:", data);
        if (data && data.length > 0) {
          setSelectedNode(0); // 选择第一个结果
          const selectedNodeData = data[0];
          parent.postMessage(
            {
              pluginMessage: {
                type: "selected-result",
                message: selectedNodeData.id,
              },
            },
            "*"
          );
          // console.log("发送selected-result消息:", selectedNodeData.id);
        } else {
          // 如果搜索结果为空，重置选中节点计数并清除UI上的高亮显示
          setSelectedNode(null);
        }
      } else if (type === "replace-end") {
        // console.log("收到 replace-end 消息，message:", data);
        // 在这里添加逻辑来处理替换后的继续查找操作

        // 检查是否有选中的节点
        if (selectedNode !== null && textNodeCharacters.length > 0) {
          // 获取当前选中的节点
          const currentNode = textNodeCharacters[selectedNode];

          // 替换当前节点中的findText为replaceText
          const updatedCharacters = currentNode.characters.replace(
            new RegExp(findText, "gi"),
            replaceText
          );
          // 更新当前节点的characters
          currentNode.characters = updatedCharacters;

          // 更新textNodeCharacters数组
          const updatedTextNodes = [...textNodeCharacters];
          updatedTextNodes[selectedNode] = currentNode;
          setTextNodeCharacters(updatedTextNodes);

          // 执行findNext操作
          handleFindNext();
        }
      }
    };
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [
    findText,
    caseSensitive,
    matchWholeWord,
    selectedNode,
    textNodeCharacters.length,
  ]);

  useEffect(() => {
    if (selectedNode !== null) {
      scrollToNode(selectedNode);
    }
  }, [selectedNode]);

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    setFindText(inputValue);

    // 如果搜索框被清空，则同时重置 lastFindText 状态
    if (!inputValue.trim()) {
      setLastFindText("");
      // 可选：如果你希望立即清除搜索结果，也可以在这里操作
      setTextNodeCharacters([]);
      setSelectedNode(null);
    }
  };

  const handleNodeClick = (index: any) => {
    setSelectedNode(index);
    scrollToNode(index); // 新增：滚动到选中的节点
    const selectedNodeData = textNodeCharacters[index];
    parent.postMessage(
      {
        pluginMessage: {
          type: "selected-result",
          message: selectedNodeData.id,
        },
      },
      "*"
    );
  };

  const handleFindNext = () => {
    if (!findText.trim()) {
      // 如果搜索框为空，清除搜索结果并重置相关状态
      setTextNodeCharacters([]);
      setSelectedNode(null);
      setLastFindText("");
      // console.log("搜索文本为空。已清除搜索结果。");
      return;
    }

    // 如果 findText 与 lastFindText 不同，或者搜索条件有变化，发送 find-next 消息
    // 如果 findText 与 lastFindText 不同，或者搜索条件有变化，发送 find-next 消息
    if (
      findText !== lastFindText ||
      caseSensitive !== lastCaseSensitive ||
      matchWholeWord !== lastMatchWholeWord
    ) {
      parent.postMessage(
        {
          pluginMessage: {
            type: "find-next",
            message: findText,
            caseSensitive: caseSensitive,
            matchWholeWord: matchWholeWord,
          },
        },
        "*"
      );
      // console.log(
      //   "发送find-next请求:",
      //   findText,
      //   caseSensitive,
      //   matchWholeWord
      // );
      setLastFindText(findText);
      setLastCaseSensitive(caseSensitive);
      setLastMatchWholeWord(matchWholeWord);
    } else {
      // 如果 findText 与 lastFindText 相同，且textNodeCharacters不为空，选择下一个节点并发送 selected-result 消息
      if (textNodeCharacters.length > 0) {
        const nextSelectedNode =
          selectedNode !== null
            ? (selectedNode + 1) % textNodeCharacters.length
            : 0;
        // console.log(`handleFindNext: 尝试滚动到节点 ${nextSelectedNode}`);

        setSelectedNode(nextSelectedNode); // 设置新选择的节点
        scrollToNode(nextSelectedNode); // 滚动到选中的节点
        // console.log("移动到新的节点:", nextSelectedNode);

        // 如果有选中的节点，发送 selected-result 消息
        const selectedNodeData = textNodeCharacters[nextSelectedNode];
        parent.postMessage(
          {
            pluginMessage: {
              type: "selected-result",
              message: selectedNodeData.id,
            },
          },
          "*"
        );
        // console.log("发送select-result消息:", selectedNodeData.id);
      } else {
        // 如果textNodeCharacters为空，说明没有找到匹配的节点
        // console.log("没有找到匹配的节点。");
      }
    }
  };

  const scrollToNode = (index: number) => {
    const node = nodeRefs.current[index];
    const scrollContainer = scrollContainerRef.current;
    if (node && scrollContainer) {
      // 获取节点的高度
      const nodeHeight = node.offsetHeight;
      // 计算节点顶部相对于滚动容器顶部的位置
      const nodeTopRelativeToContainer =
        node.offsetTop - scrollContainer.offsetTop;
      // 计算期望的滚动位置，使选中的节点位于滚动区域的第二行
      // 这里我们再次减去一个节点的高度（nodeHeight）作为偏移量，以将节点定位到第二行位置
      const desiredScrollTop = nodeTopRelativeToContainer - nodeHeight;

      // 检查是否需要调整滚动位置以避免滚动超出顶部
      const newScrollTop = Math.max(desiredScrollTop, 0);

      // 使用原生 scrollTo 方法滚动到指定位置
      scrollContainer.scrollTo({
        top: newScrollTop,
        behavior: "smooth", // 平滑滚动
      });
    }
  };

  const handleReplaceAll = () => {
    // 检查find输入框里是否有内容
    if (!findText.trim()) {
      // 如果没有内容，则直接返回，不执行任何操作
      // console.log("Find text is empty. Replace All operation cancelled.");
      return;
    }

    // 如果find输入框里有内容，发送post消息
    parent.postMessage(
      {
        pluginMessage: {
          type: "replace-all",
          message: findText,
          caseSensitive: caseSensitive,
          matchWholeWord: matchWholeWord,
          replaceText: replaceText, // 添加replace输入框里的内容
        },
      },
      "*"
    );
    // console.log(
    //   "Replace All message sent:",
    //   findText,
    //   replaceText,
    //   caseSensitive,
    //   matchWholeWord
    // );
  };

  const handleReplace = () => {
    // 检查find输入框里是否有内容
    if (!findText.trim()) {
      // 如果没有内容，则直接返回，不执行任何操作
      // console.log("Find text is empty. Replace operation cancelled.");
      return;
    }

    // 获取当前选中节点的id
    const selectedNodeId =
      selectedNode !== null ? textNodeCharacters[selectedNode].id : null;

    // 如果没有选中任何节点，则直接返回，不执行任何操作
    if (!selectedNodeId) {
      // console.log("No node selected. Replace operation cancelled.");
      return;
    }

    // 如果find输入框里有内容，发送post消息
    parent.postMessage(
      {
        pluginMessage: {
          type: "replace",
          message: findText,
          caseSensitive: caseSensitive,
          matchWholeWord: matchWholeWord,
          replaceText: replaceText, // 添加replace输入框里的内容
          selectedNodeId: selectedNodeId, // 添加当前选中节点的id
        },
      },
      "*"
    );
    // console.log(
    //   "Replace message sent:",
    //   findText,
    //   replaceText,
    //   caseSensitive,
    //   matchWholeWord,
    //   selectedNodeId
    // );
  };

  return (
    <>
      <div className="flex flex-col items-center w-full fixed top-0 left-0">
        <Tabs defaultValue="text" className="w-full flex flex-col items-center">
          <TabsList className="grid w-full grid-cols-5 rounded-none">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="color">Color</TabsTrigger>
            <TabsTrigger value="font">Font</TabsTrigger>
            <TabsTrigger value="hidden">Hidden</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="flex flex-col items-center">
            {/* input find */}
            <div className="flex w-full justify-center max-w-sm space-x-2 m-1">
              <Input
                className="w-72"
                placeholder="Enter your search term..."
                value={findText}
                onChange={handleInputChange} // 使用修改后的事件处理函数
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFindNext();
                  }
                }}
              />
              <Button
                className="w-24 bg-blue-500 text-white hover:bg-blue-700"
                onClick={handleFindNext}
              >
                Find next
              </Button>
            </div>

            {/* checkbox group*/}
            <div className="flex justify-start w-full max-w-sm space-x-8 mt-1 mb-1 pl-3">
              {/* // Case sensitive checkbox */}
              <div className="flex justify-start space-x-1">
                <input
                  type="checkbox"
                  id="caseSensitiveCheckbox" // 添加id属性
                  className="form-checkbox w-4 h-4"
                  checked={caseSensitive}
                  onChange={(e) =>
                    setCaseSensitive(
                      (e as React.ChangeEvent<HTMLInputElement>).target.checked
                    )
                  }
                />
                <label
                  htmlFor="caseSensitiveCheckbox" // 使用htmlFor属性关联到checkbox的id
                  className="text-sm font-medium leading-4 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Case sensitive
                </label>
              </div>

              {/* // Match whole words checkbox */}
              <div className="flex justify-start space-x-1">
                <input
                  type="checkbox"
                  id="matchWholeWordCheckbox" // 添加id属性
                  className="form-checkbox w-4 h-4"
                  checked={matchWholeWord}
                  onChange={(e) =>
                    setMatchWholeWord(
                      (e as React.ChangeEvent<HTMLInputElement>).target.checked
                    )
                  }
                />
                <label
                  htmlFor="matchWholeWordCheckbox" // 使用htmlFor属性关联到checkbox的id
                  className="text-sm font-medium leading-4 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Match whole words
                </label>
              </div>
            </div>

            {/* input replace */}
            <div className="flex justify-start w-full max-w-sm m-2">
              <Input
                className="w-full"
                placeholder="Enter replacement text..."
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
              />
            </div>
            <div className="flex w-full justify-between p-1">
              {/* 计数文本 */}
              <div className="flex w-full justify-start items-end pl-2">
                <p className="text-sm font-medium underline-bold-lower">
                  result: {"("}
                  {selectedNode !== null ? selectedNode + 1 : 0}/
                  {textNodeCharacters.length}
                  {")"}
                </p>
              </div>

              {/* replace button */}
              <div className="flex w-full justify-end max-w-sm space-x-2">
                <Button
                  className="w-24 border-2 border-blue-500 text-blue-500"
                  variant="outline"
                  onClick={handleReplace}
                >
                  Replace
                </Button>
                <Button
                  className="w-24 bg-blue-500 text-white hover:bg-blue-700"
                  onClick={handleReplaceAll}
                >
                  Replace all
                </Button>
              </div>
            </div>

            <div
              ref={scrollContainerRef}
              className="h-56 w-full mt-2 overflow-auto"
            >
              <div className="ml-2">
                {textNodeCharacters.map((node, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-start cursor-pointer hover:bg-gray-200 ${
                      selectedNode === index ? "bg-blue-200" : ""
                    }`}
                    onClick={() => handleNodeClick(index)}
                    ref={(el) => (nodeRefs.current[index] = el)}
                    style={{ height: "50px" }} // 设置每一行的固定高度
                  >
                    {/* 为图标添加一个固定大小的容器 */}
                    <div
                      className="flex-shrink-0 w-4 h-4 ml-2 mr-3"
                      // style={{
                      //   width: "16px",
                      //   height: "16px",
                      //   marginRight: "8px",
                      // }}
                    >
                      {node.type === "TEXT" ? (
                        <FigmaTextIcon
                          width="14"
                          height="14"
                          fillColor="black"
                        />
                      ) : (
                        <FigmaComponentIcon
                          width="14"
                          height="14"
                          fillColor="black"
                        />
                      )}
                    </div>
                    <div
                      className="text-left text-sm flex-grow" // flex-grow 确保文本占据剩余空间
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 2,
                      }}
                    >
                      {highlightText(node.characters, findText)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout"></TabsContent>

          <TabsContent value="color"></TabsContent>

          <TabsContent value="font"></TabsContent>

          <TabsContent value="hidden"></TabsContent>
        </Tabs>
        <footer className="bg-blue-100 py-4 fixed bottom-0 left-0 w-full">
          <div className="container">
            <div className="flex justify-center items-center text-left">
              {/* 已更新为左对齐 */}
              <p className="mr-4 text-sm">
                Contact us by email or via:
                <a
                  href="mailto:phoenix.wan.us@gmail.com"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {"\n"}&lt;phoenix.wan.us@gmail.com&gt;
                  {/* 更新为蓝色文字，并添加尖括号 */}
                </a>
              </p>
              <a
                href="https://twitter.com/phoenix_sgp"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-2"
              >
                <FaTwitter
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  size={30}
                />
              </a>
              <a
                href="https://www.facebook.com/PhoenixWanSGP"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-2"
              >
                <FaFacebook
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  size={30}
                />
              </a>
              <a
                href="https://www.instagram.com/phoenix.wan.sgp/"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-2"
              >
                <FaInstagram
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  size={30}
                />
              </a>
              <a
                href="https://www.tiktok.com/@phoenixwansgp"
                target="_blank"
                rel="noopener noreferrer"
                className="mr-2"
              >
                <FaTiktok
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  size={30}
                />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
