import React, { useState } from "react";
import { ComponentInfo } from "@/types"; // 请确保路径正确
import { FigmaComponentIcon } from "@/icons/FigmaIcons";

interface ComponentScrollAreaProps {
  componentData: ComponentInfo[];
  onSelectComponent: (componentInfo: ComponentInfo) => void;
  onComponentSelect: (componentInfo: ComponentInfo) => void; // 用于选择时的回调函数
}

const ComponentScrollArea: React.FC<ComponentScrollAreaProps> = ({
  componentData,
  onSelectComponent,
  onComponentSelect,
}) => {
  // 使用一个对象来存储选中的组件ID
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentInfo | null>(null);

  const handleSelectComponent = (componentInfo: ComponentInfo) => {
    const isAlreadySelected =
      selectedComponent && selectedComponent.id === componentInfo.id;
    setSelectedComponent(isAlreadySelected ? null : componentInfo);
    onSelectComponent(componentInfo); // 直接传递整个ComponentInfo对象给父组件
    onComponentSelect(componentInfo); // 如果还需要这个回调的话
  };

  return (
    <div className="max-h-44 w-[376px] overflow-auto smooth-scroll grid grid-cols-2 gap-1 content-start">
      {componentData.map((componentInfo, index) => {
        const textColorClass = "text-black"; // 根据情况设置文本颜色
        const isSelected =
          selectedComponent && selectedComponent.id === componentInfo.id;
        return (
          <div
            key={index}
            className={`flex justify-start items-center rounded-sm cursor-pointer space-x-2 pl-2 ${
              isSelected
                ? "border-2 border-blue-500"
                : "border-2 border-gray-500 border-opacity-20"
            }`}
            onClick={() => handleSelectComponent(componentInfo)}
            style={{ height: "50px" }}
          >
            <div style={{ flexShrink: 0 }}>
              <FigmaComponentIcon width="20" height="20" fillColor="black" />
            </div>
            <div className="flex flex-col justify-start text-sm w-full overflow-hidden">
              <span className={`truncate text-left ${textColorClass}`}>
                {componentInfo.name}
              </span>
              <span
                className={`text-xs text-left text-gray-400 truncate ${textColorClass}`}
              >
                {componentInfo.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ComponentScrollArea;
