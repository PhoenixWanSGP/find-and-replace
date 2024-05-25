import { TabData, TabName } from "@/types";

interface ResultsIndicatorProps {
  currentTab: TabName;
  tabData: TabData;
}
const ResultsIndicator: React.FC<ResultsIndicatorProps> = ({
  currentTab,
  tabData,
}) => {
  const { searchResults, selectedIndex } = tabData[currentTab];

  if (searchResults.length === 0) {
    return null; // 没有结果时不显示组件
  }

  const displayIndex = selectedIndex + 1; // 索引从1开始

  return (
    <div
      style={{
        top: ["color", "font", "instance"].includes(currentTab)
          ? "144px"
          : "188px",
      }}
      className="absolute left-3 text-gray-800 text-left text-sm font-medium"
    >
      <span>
        Results &lt;{displayIndex}/{searchResults.length}&gt;
      </span>
    </div>
  );
};

export default ResultsIndicator;
