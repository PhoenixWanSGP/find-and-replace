import React, { useState } from "react";
import { ColorInfo } from "@/types"; // 请确保路径正确

interface ColorScrollAreaProps {
  colorData: ColorInfo[];
  onSelectColor: (color: string) => void;
  onColorSelect: (colorInfo: ColorInfo) => void; // 新增回调函数属性
}

const ColorScrollArea: React.FC<ColorScrollAreaProps> = ({
  colorData,
  onSelectColor,
  onColorSelect, // 接收父组件传递的回调函数
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleSelectColor = (colorInfo: ColorInfo) => {
    const rgbaColorString = rgbaToString(colorInfo);
    setSelectedColor(
      selectedColor === rgbaColorString ? null : rgbaColorString
    );
    onSelectColor(rgbaColorString); // 如果需要将颜色的字符串表示发送给父组件
    onColorSelect(colorInfo); // 将色块对应的ColorInfo数据传递给父组件
  };

  const toHex = (value: number): string => {
    const hex = Math.round(value * 255)
      .toString(16)
      .toUpperCase();
    return hex.length === 1 ? "0" + hex : hex;
  };

  const rgbaToHex = ({ r, g, b }: ColorInfo): string => {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const rgbaToString = ({ r, g, b, a = 1 }: ColorInfo): string => {
    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
      b * 255
    )}, ${a})`;
  };

  const getAlphaPercentage = (alpha: number | undefined): string => {
    if (alpha === undefined || alpha === 1) {
      return ""; // 如果alpha是100%，就不显示
    }
    return `${Math.round(alpha * 100)}%`; // 如果alpha不是100%，显示百分比
  };

  const isColorDark = ({ r, g, b }: ColorInfo): boolean => {
    // 计算亮度
    const brightness = r * 255 * 0.299 + g * 255 * 0.587 + b * 255 * 0.114;
    return brightness < 128; // 亮度小于128时认为是暗色
  };

  return (
    <div className="max-h-44 w-[376px] overflow-auto smooth-scroll grid grid-cols-4 gap-1 content-start">
      {colorData.map((colorInfo, index) => {
        const hexColor = rgbaToHex(colorInfo);
        const rgbaColorString = rgbaToString(colorInfo);
        const alphaPercentage = getAlphaPercentage(colorInfo.a);
        const textColorClass = isColorDark(colorInfo)
          ? "text-white"
          : "text-black"; // 根据颜色亮度设置文本颜色
        return (
          <div
            key={index}
            className={`flex flex-col justify-center items-center rounded-lg cursor-pointer ${
              selectedColor === rgbaColorString
                ? "border-2 border-blue-500"
                : "border-2 border-gray-500 border-opacity-20"
            }`}
            onClick={() => handleSelectColor(colorInfo)}
            style={{ backgroundColor: rgbaColorString, height: "50px" }} // 设置统一的高度
          >
            <span className={`text-sm text-center ${textColorClass}`}>
              {hexColor}
            </span>{" "}
            {/* 显示十六进制颜色代码 */}
            {alphaPercentage && (
              <span
                className={`text-sm text-center ${textColorClass}`}
              >{`A: ${alphaPercentage}`}</span>
            )}{" "}
            {/* 如果alpha不是100%，则显示 */}
          </div>
        );
      })}
    </div>
  );
};

export default ColorScrollArea;
