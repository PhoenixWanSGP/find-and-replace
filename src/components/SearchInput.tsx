import React, { ChangeEvent, KeyboardEvent } from "react";
import { SearchParams, TabName, TabNames, ColorInfo } from "@/types"; // 确保路径正确
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import ColorScrollArea from "./ColorScrollArea"; // 确保路径正确

interface SearchInputProps {
  searchParams: SearchParams;
  onSearch: () => void;
  onUpdateSearchParams: (newParams: Partial<SearchParams>) => void;
  activeTab: TabName; // 使用 TabName 类型
  colorData: ColorInfo[];
  onSelectColor: (color: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchParams,
  onSearch,
  onUpdateSearchParams,
  activeTab,
  colorData,
  onSelectColor,
}) => {
  const { query, type, caseSensitive, matchWholeWord } = searchParams;

  const handleColorSelect = (colorInfo: ColorInfo) => {
    // 更新父组件的searchParams中的query为选中的颜色信息
    onUpdateSearchParams({ query: colorInfo });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type: inputType } = event.target;
    onUpdateSearchParams({
      ...searchParams,
      [name]: inputType === "checkbox" ? checked : value,
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch();
    }
  };

  function colorInfoToString(colorInfo: any) {
    if (typeof colorInfo === "string") {
      return colorInfo; // 如果query已经是字符串，直接返回
    }
    // 如果colorInfo是ColorInfo类型，转换为十六进制颜色字符串
    const { r, g, b, a } = colorInfo;
    const alpha =
      a !== undefined
        ? Math.round(a * 255)
            .toString(16)
            .padStart(2, "0")
        : "";
    return `#${r}${g}${b}${alpha}`;
  }

  const toHex = (value: number): string => {
    const hex = Math.round(value * 255)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();
    return hex;
  };
  const colorInfoToHexAndAlpha = (colorInfo?: ColorInfo) => {
    if (!colorInfo) {
      // 当没有颜色信息时，默认显示“Select your color term”
      return { hex: "#FFFFFF", displayText: "Select your color term" };
    }
    const { r, g, b, a = 1 } = colorInfo;
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    const alphaPercent = a < 1 ? `${Math.round(a * 100)}%` : "";

    // 根据透明度构造显示文本
    const displayText = alphaPercent ? `${hex} A: ${alphaPercent}` : hex;

    return { hex, displayText };
  };

  // 在Button组件中使用displayText作为显示文本
  const { hex, displayText } = colorInfoToHexAndAlpha(
    searchParams.query as ColorInfo
  );

  return (
    <div>
      <div className="flex w-full justify-center max-w-sm space-x-2 m-1">
        {activeTab === TabNames.color ? (
          <Popover>
            <PopoverTrigger>
              <Button className="w-72 border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:border-2 bg-white hover:bg-white border-dashed">
                <div className="flex items-center justify-center space-x-2">
                  <div
                    className="w-64 h-6 border-2 border-gray-500 border-opacity-20"
                    style={{ backgroundColor: hex }}
                  >
                    <span>{displayText}</span>
                  </div>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 ml-2 p-1">
              <ColorScrollArea
                colorData={colorData}
                onSelectColor={onSelectColor}
                onColorSelect={handleColorSelect} // 将handleColorSelect传递给ColorScrollArea
              />
              <div className="text-sm text-center p-1 mt-2 bg-orange-100 border border-orange-300 rounded-md shadow">
                Select from the colors used in your current selection.
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Input
            className="w-72"
            placeholder={`Enter your ${type} term...`}
            value={colorInfoToString(query)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            name="query"
          />
        )}
        <Button
          className="w-24 bg-blue-500 text-white hover:bg-blue-700"
          onClick={onSearch}
        >
          Find next
        </Button>
      </div>

      {(activeTab === TabNames.text || activeTab === TabNames.layer) && (
        <div className="flex justify-start w-full max-w-sm space-x-8 mt-2 mb-2 pl-3">
          <div className="flex justify-start space-x-1">
            <input
              type="checkbox"
              id="caseSensitiveCheckbox"
              checked={caseSensitive}
              onChange={handleChange}
              name="caseSensitive"
              className="form-checkbox w-4 h-4"
            />
            <label
              htmlFor="caseSensitiveCheckbox"
              className="text-sm font-medium leading-4 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Case sensitive
            </label>
          </div>

          <div className="flex justify-start space-x-1">
            <input
              type="checkbox"
              id="matchWholeWordCheckbox"
              checked={matchWholeWord}
              onChange={handleChange}
              name="matchWholeWord"
              className="form-checkbox w-4 h-4"
            />
            <label
              htmlFor="matchWholeWordCheckbox"
              className="text-sm font-medium leading-4 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Match whole words
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
