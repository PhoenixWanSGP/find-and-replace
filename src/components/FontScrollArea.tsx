import React, { useState } from "react";
import { FontInfo } from "@/types"; // 请确保路径正确
import { FigmaComponentIcon, FigmaTextIcon } from "@/icons/FigmaIcons";

interface FontScrollAreaProps {
  fontData: FontInfo[];
  onSelectFont: (font: string) => void;
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
    setSelectedFont(
      isAlreadySelected
        ? null
        : { fontFamily: fontInfo.fontFamily, fontStyle: fontInfo.fontStyle }
    );
    onSelectFont(fontInfo.fontFamily); // 如果需要将字体的字符串表示发送给父组件
    onFontSelect(fontInfo); // 将字体对应的FontInfo数据传递给父组件
  };

  return (
    <div className="max-h-44 w-[376px] overflow-auto smooth-scroll grid grid-cols-2 gap-1 content-start">
      {fontData.map((fontInfo, index) => {
        const textColorClass = "text-black"; // 根据颜色亮度设置文本颜色
        const isSelected =
          selectedFont &&
          selectedFont.fontFamily === fontInfo.fontFamily &&
          selectedFont.fontStyle === fontInfo.fontStyle;
        return (
          <div
            key={index}
            className={`flex justify-start items-center rounded-sm cursor-pointer space-x-2 pl-2 ${
              isSelected
                ? "border-2 border-red-500"
                : "border-2 border-gray-500 border-opacity-20"
            }`}
            onClick={() => handleSelectFont(fontInfo)}
            style={{ height: "50px" }} // 设置统一的高度
          >
            {fontInfo.isMissing ? (
              <FigmaTextIcon width="20" height="20" fillColor="black" />
            ) : (
              <FigmaComponentIcon width="20" height="20" fillColor="black" />
            )}
            <div className="flex flex-col justify-start">
              <span className={`text-left ${textColorClass}`}>
                {fontInfo.fontFamily}
              </span>{" "}
              <span
                className={`text-xs text-left text-gray-400 ${textColorClass}`}
              >
                {fontInfo.fontStyle}
              </span>{" "}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FontScrollArea;
