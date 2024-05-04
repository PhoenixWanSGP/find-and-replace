import { FigmaComponentIcon, FigmaTextIcon } from "@/icons/FigmaIcons";
import { ResultBaseNode } from "@/types";
import React, { useEffect, useRef } from "react";

interface ScrollAreaProps {
  searchResults: ResultBaseNode[];
  query?: string;
  currentTab: string;
  selectedNodeId?: string | null;
  onSelectNode: (id: string) => void;
}

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

  function highlightText(
    text: string,
    query?: string,
    maxLength: number = 70
  ): React.ReactNode[] {
    if (!query || query.trim() === "") {
      return [
        <span key="text">
          {text.length > maxLength ? "..." + text.slice(-maxLength) : text}
        </span>,
      ];
    }

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    let highlighted: React.ReactNode[] = [];
    let currentLength = 0;
    let addedEllipsis = false;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isQueryMatch = part.toLowerCase() === query.toLowerCase();

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
      className="h-60 w-full mt-2 overflow-auto smooth-scroll"
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
              currentTab === "text" ? node.characters || "" : node.name || "",
              query
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResult;
