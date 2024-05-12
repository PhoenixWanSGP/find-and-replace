import { FigmaComponentIcon, FigmaTextIcon } from "@/icons/FigmaIcons";
import { QueryType, ResultBaseNode } from "@/types";
import React, { useEffect, useRef } from "react";

interface ScrollAreaProps {
  searchResults: ResultBaseNode[];
  query?: QueryType;
  currentTab: string;
  selectedNodeId?: string | null;
  onSelectNode: (id: string) => void;
}

// const isColorInfo = (object: any): object is ColorInfo => {
//   return (
//     object &&
//     "r" in object &&
//     "g" in object &&
//     "b" in object &&
//     // 'a' in object 可选，因为a可能是undefined
//     typeof object.r === "number" &&
//     typeof object.g === "number" &&
//     typeof object.b === "number"
//   );
// };

const SearchResult: React.FC<ScrollAreaProps> = ({
  searchResults,
  query,
  currentTab,
  selectedNodeId,
  onSelectNode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container div

  useEffect(() => {
    if (selectedNodeId && containerRef.current) {
      const selectedNode = Array.from(containerRef.current.children).find(
        (node) => node.getAttribute("data-nodeid") === selectedNodeId
      ) as HTMLElement;

      if (selectedNode) {
        const nodeTop = selectedNode.offsetTop; // Node top relative to its parent
        const nodeHeight = selectedNode.offsetHeight; // Height of each node
        const containerRect = containerRef.current.getBoundingClientRect(); // Position of the container in the viewport
        const scrollPosition = nodeTop - containerRect.top - nodeHeight; // Scroll to make the node appear at the second line
        containerRef.current.scrollTop = scrollPosition;
      }
    }
  }, [selectedNodeId]);

  function queryToString(query: QueryType): string {
    if (typeof query === "string") {
      return query;
    } else if ("r" in query && "g" in query && "b" in query) {
      // 假设ColorInfo类型有r, g, b属性，且它们是数字类型
      const { r, g, b, a = 1 } = query; // 如果a是undefined，默认为1
      // 将r, g, b, a转换为十六进制颜色字符串
      const toHex = (value: number): string => {
        const hex = Math.round(value * 255)
          .toString(16)
          .padStart(2, "0")
          .toUpperCase();
        return hex;
      };
      const alphaHex = a !== 1 ? toHex(a) : "";
      return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`;
    }
    // 如果query是其他类型，根据具体情况处理
    // 例如，如果query是FontInfo类型，你可能会返回字体家族名称
    // 这里需要根据你的应用逻辑来添加代码
    // ...

    // 如果无法处理query，则返回一个默认的字符串
    return "N/A";
  }

  function highlightText(
    text: string,
    query?: QueryType,
    maxLength: number = 70
  ): React.ReactNode[] {
    if (!query) {
      return [
        <span key="text">
          {text.length > maxLength ? "..." + text.slice(-maxLength) : text}
        </span>,
      ];
    }

    // 使用辅助函数将query转换为字符串
    const queryString = queryToString(query);

    if (queryString.trim() === "") {
      return [
        <span key="text">
          {text.length > maxLength ? "..." + text.slice(-maxLength) : text}
        </span>,
      ];
    }

    const parts = text.split(new RegExp(`(${queryString})`, "gi"));
    let highlighted: React.ReactNode[] = [];
    let currentLength = 0;
    let addedEllipsis = false;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      // 使用辅助函数将query转换为字符串，并进行小写比较
      const isQueryMatch = part.toLowerCase() === queryString.toLowerCase();

      if (isQueryMatch) {
        // 如果是匹配的查询词，直接添加高亮显示
        highlighted.push(
          <span key={i} style={{ backgroundColor: "yellow" }}>
            {part}
          </span>
        );
        currentLength += part.length;
      } else {
        // 如果不是查询词，处理前后文的裁剪
        const remainingLength = maxLength - currentLength;
        if (remainingLength <= 0) {
          // 如果已经没有剩余长度，跳出循环
          if (!addedEllipsis) {
            highlighted.push(<span key="ellipsis">...</span>);
            addedEllipsis = true;
          }
          break;
        }

        // 计算并裁剪当前部分的文本
        const beforeText =
          part.length > remainingLength
            ? part.slice(0, remainingLength) + "..."
            : part;
        highlighted.push(<span key={i}>{beforeText}</span>);
        currentLength += part.length;

        if (part.length > remainingLength) {
          // 如果当前部分文本被裁剪，添加省略号并结束循环
          break;
        }
      }
    }

    return highlighted;
  }

  return (
    <div
      ref={containerRef}
      style={{
        height: ["color", "font", "instance"].includes(currentTab)
          ? "17.75rem"
          : "15rem",
        width: "100%",
        marginTop: "0.5rem",
        overflow: "auto",
      }}
      className="smooth-scroll"
    >
      {searchResults.map((node, index) => (
        <div
          key={index}
          data-nodeid={node.id}
          className={`flex w-[372px] h-12 items-center justify-start cursor-pointer hover:bg-gray-200 ${
            node.id === selectedNodeId ? "bg-blue-100" : ""
          }`}
          onClick={() => onSelectNode(node.id)}
        >
          <div className="flex-shrink-0 w-4 h-4 ml-2 mr-3">
            {node.type === "TEXT" ? (
              <FigmaTextIcon width="14" height="14" fillColor="black" />
            ) : (
              <FigmaComponentIcon width="14" height="14" fillColor="black" />
            )}
          </div>
          <div
            className="text-left text-sm flex-grow overflow-hidden"
            style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
          >
            {highlightText(
              currentTab === "text"
                ? node.characters || ""
                : currentTab === "layer"
                ? node.name || ""
                : currentTab === "color"
                ? node.name || ""
                : currentTab === "font"
                ? node.characters || ""
                : "",
              query
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResult;
