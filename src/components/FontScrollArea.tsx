import React, { useState } from "react";
import { FontInfo } from "@/types"; // 请确保路径正确
import { FigmaComponentIcon, FigmaTextIcon } from "@/icons/FigmaIcons";

interface FontScrollAreaProps {
  fontData: FontInfo[];
  onSelectFont: (fontInfo: FontInfo) => void; // 修改这里的类型说明
  onFontSelect: (fontInfo: FontInfo) => void; // 新增回调函数属性
}

const FontScrollArea: React.FC<FontScrollAreaProps> = ({
  fontData,
  onSelectFont,
  onFontSelect, // 接收父组件传递的回调函数
}) => {
  // 使用一个对象来存储选中的fontFamily和fontStyle
  const [selectedFont, setSelectedFont] = useState<{
    fontFamily: string;
    fontStyle: string;
  } | null>(null);

  const handleSelectFont = (fontInfo: FontInfo) => {
    const isAlreadySelected =
      selectedFont &&
      selectedFont.fontFamily === fontInfo.fontFamily &&
      selectedFont.fontStyle === fontInfo.fontStyle;
    setSelectedFont(isAlreadySelected ? null : fontInfo);
    onSelectFont(fontInfo); // 直接传递整个FontInfo对象给父组件
    onFontSelect(fontInfo); // 保持这个调用，如果还需要这个回调的话
  };

  return (
    <div className="max-h-44 w-[376px] overflow-auto smooth-scroll grid grid-cols-2 gap-1 content-start">
      {fontData.map((fontInfo, index) => {
        // const textColorClass = "text-black"; // 根据颜色亮度设置文本颜色
        const isSelected =
          selectedFont &&
          selectedFont.fontFamily === fontInfo.fontFamily &&
          selectedFont.fontStyle === fontInfo.fontStyle;

        // const textColorClass = fontInfo.isMissing
        //   ? "text-orange-500"
        //   : "text-black";

        const textColorClass = "text-black";

        // const styleColorClass = fontInfo.isMissing
        //   ? "text-orange-300" // 使用较浅的橙色
        //   : "text-gray-400"; // 默认较浅的灰色

        const styleColorClass = "text-gray-400";
        return (
          <div
            key={index}
            className={`flex justify-start items-center rounded-sm cursor-pointer space-x-2 pl-2 ${
              isSelected
                ? "border-2 border-blue-500"
                : "border-2 border-gray-500 border-opacity-20"
            }`}
            onClick={() => handleSelectFont(fontInfo)}
            style={{ height: "50px" }}
          >
            <div style={{ flexShrink: 0 }}>
              {" "}
              {/* 图标容器，防止图标被压缩 */}
              {fontInfo.isMissing ? (
                <FigmaTextIcon width="20" height="20" fillColor="black" />
              ) : (
                <FigmaComponentIcon width="20" height="20" fillColor="black" />
              )}
            </div>
            <div className="flex flex-col justify-start text-sm w-full overflow-hidden">
              {" "}
              {/* 文本容器，允许文本填充剩余空间 */}
              <span className={`truncate text-left ${textColorClass}`}>
                {fontInfo.fontFamily}
              </span>
              <span className={`text-xs text-left truncate ${styleColorClass}`}>
                {fontInfo.fontStyle}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FontScrollArea;
