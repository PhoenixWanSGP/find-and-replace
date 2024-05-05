import React, { useState } from "react";
import { ColorInfo } from "@/types"; // 确保这是正确的路径

interface ColorScrollAreaProps {
  colorData: ColorInfo[];
  onSelectColor: (color: string) => void;
}

const ColorScrollArea: React.FC<ColorScrollAreaProps> = ({
  colorData,
  onSelectColor,
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleSelectColor = (color: string) => {
    setSelectedColor(selectedColor === color ? null : color);
    onSelectColor(color);
  };

  return (
    <div className="h-44 w-[384px] overflow-auto smooth-scroll grid grid-cols-3">
      {colorData.map((colorInfo, index) => (
        <div
          key={index}
          className={`flex-1 flex items-center justify-center rounded-lg cursor-pointer ${
            selectedColor === colorInfo.color
              ? "border-2 border-red-500"
              : "border-2 border-transparent" // Use a transparent border when not selected
          }`}
          onClick={() => handleSelectColor(colorInfo.color)}
        >
          <div
            className="w-32  h-14 rounded-md flex justify-center items-center" // Use this div to apply background color
            style={
              {
                // backgroundColor: colorInfo.color,
                //padding: "4px", // Adds spacing between the border and the color block
              }
            }
          >
            <div
              className=" w-[104px] h-11 rounded-md flex justify-center items-center" // Nested div for actual color display
              style={{
                backgroundColor: colorInfo.color,
              }}
            >
              <span className="text-white text-sm text-center">
                {colorInfo.color}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ColorScrollArea;
