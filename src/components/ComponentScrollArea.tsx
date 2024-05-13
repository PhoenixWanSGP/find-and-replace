import React, { useState } from "react";
import { ComponentInfo } from "@/types";
import {
  FigmaComponentIcon,
  FigmaMissingFontIcon,
  FigmaExternalIcon,
} from "@/icons/FigmaIcons";

interface ComponentScrollAreaProps {
  componentData: ComponentInfo[];
  onSelectComponent: (componentInfo: ComponentInfo) => void;
  onComponentSelect: (componentInfo: ComponentInfo) => void;
}

const ComponentScrollArea: React.FC<ComponentScrollAreaProps> = ({
  componentData,
  onSelectComponent,
  onComponentSelect,
}) => {
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentInfo | null>(null);

  const handleSelectComponent = (componentInfo: ComponentInfo) => {
    const isAlreadySelected =
      selectedComponent && selectedComponent.id === componentInfo.id;
    setSelectedComponent(isAlreadySelected ? null : componentInfo);
    onSelectComponent(componentInfo);
    onComponentSelect(componentInfo);
  };

  return (
    <div className="max-h-44 w-[376px] overflow-auto smooth-scroll grid grid-cols-2 gap-1 content-start">
      {componentData.map((componentInfo, index) => {
        const isSelected =
          selectedComponent && selectedComponent.id === componentInfo.id;
        // const textColorClass = componentInfo.isMissing
        //   ? "text-orange-500"
        //   : componentInfo.isExternal
        //   ? "text-blue-500"
        //     : "text-black";

        const textColorClass = "text-black";

        // const descriptionColorClass = componentInfo.isMissing
        //   ? "text-orange-300" // 使用较浅的橙色
        //   : componentInfo.isExternal
        //   ? "text-blue-300" // 使用较浅的蓝色
        //     : "text-gray-400"; // 默认较浅的灰色

        const descriptionColorClass = "text-gray-400";

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
              {componentInfo.isMissing ? (
                <FigmaMissingFontIcon
                  width="20"
                  height="20"
                  fillColor="black"
                />
              ) : componentInfo.isExternal ? (
                <FigmaExternalIcon width="20" height="20" fillColor="black" />
              ) : (
                <FigmaComponentIcon width="20" height="20" fillColor="black" />
              )}
            </div>
            <div className="flex flex-col justify-start text-sm w-full overflow-hidden">
              <span className={`truncate text-left ${textColorClass}`}>
                {componentInfo.name}
              </span>
              <span
                className={`text-xs text-left truncate ${descriptionColorClass}`}
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
