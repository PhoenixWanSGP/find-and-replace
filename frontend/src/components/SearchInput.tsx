import React, { ChangeEvent, KeyboardEvent } from "react";
import {
  SearchParams,
  TabName,
  TabNames,
  ColorInfo,
  FontInfo,
  ComponentInfo,
} from "@/types"; // 确保路径正确
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import ColorScrollArea from "./ColorScrollArea"; // 确保路径正确
import FontScrollArea from "./FontScrollArea";
import {
  FigmaComponentIcon,
  FigmaExternalIcon,
  FigmaFontIcon,
  FigmaMissingFontIcon,
} from "@/icons/FigmaIcons";
import ComponentScrollArea from "./ComponentScrollArea";

interface SearchInputProps {
  searchParams: SearchParams;
  onSearch: () => void;
  onUpdateSearchParams: (newParams: Partial<SearchParams>) => void;
  activeTab: TabName; // 使用 TabName 类型
  colorData?: ColorInfo[];
  onSelectColor?: (color: string) => void;
  handleRefreshColors?: () => void;
  fontData?: FontInfo[]; // 新增属性
  onSelectFont?: (fontInfo: FontInfo) => void; // 新增属性
  handleRefreshFonts?: () => void; // 新增属性
  componentData?: ComponentInfo[]; // 新增属性
  onSelectComponent?: (componentInfo: ComponentInfo) => void; // 新增属性
  handleRefreshComponents?: () => void; // 新增属性
}

interface CheckboxWithLabelProps {
  id: string;
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  name: string;
  label: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchParams,
  onSearch,
  onUpdateSearchParams,
  activeTab,
  colorData,
  onSelectColor,
  handleRefreshColors,
  fontData,
  onSelectFont,
  componentData,
  onSelectComponent,
  handleRefreshFonts,
  handleRefreshComponents,
}) => {
  const {
    query,
    type,
    caseSensitive,
    matchWholeWord,
    includeFills,
    includeStrokes,
    includeNormalFont,
    includeMissingFont,
    includeNormalComponent,
    includeMissingComponent,
    includeExternalComponent,
  } = searchParams;
  const handleColorSelect = (colorInfo: ColorInfo) => {
    // 更新父组件的searchParams中的query为选中的颜色信息
    onUpdateSearchParams({ query: colorInfo });
  };
  const handleFontSelect = (fontInfo: FontInfo) => {
    // 更新searchParams中的query为选中的FontInfo对象
    onUpdateSearchParams({ query: fontInfo });
  };
  const handleComponentSelect = (componentInfo: ComponentInfo) => {
    // 更新父组件的searchParams中的query为选中的ComponentInfo对象
    onUpdateSearchParams({ query: componentInfo });
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

  function CheckboxWithLabel({
    id,
    checked,
    onChange,
    name,
    label,
  }: CheckboxWithLabelProps) {
    return (
      <div className="flex justify-start space-x-1">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          name={name}
          className="form-checkbox w-4 h-4"
        />
        <label
          htmlFor={id}
          className="text-sm font-medium leading-4 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      </div>
    );
  }

  const toHex = (value: number): string => {
    const hex = Math.round(value * 255)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();
    return hex;
  };

  function getBrightness(r: number, g: number, b: number) {
    // 根据加权计算颜色的亮度
    return r * 255 * 0.299 + g * 255 * 0.587 + b * 255 * 0.114;
  }

  const colorInfoToHexAndAlpha = (colorInfo?: ColorInfo) => {
    if (!colorInfo) {
      return {
        rgba: "rgba(255, 255, 255, 1)",
        hex: "#FFFFFF",
        displayText: "Select your color term",
        textColor: "#000000",
      };
    }
    const { r, g, b, a = 1 } = colorInfo;

    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    const rgba = `rgba(${Math.round(r * 255)}, ${Math.round(
      g * 255
    )}, ${Math.round(b * 255)}, ${a.toFixed(2)})`;

    const alphaPercent = a < 1 ? `${Math.round(a * 100)}%` : "";
    const brightness = getBrightness(r, g, b);
    const textColor = brightness > 128 ? "#000000" : "#FFFFFF";

    const displayText = alphaPercent ? `${hex} A: ${alphaPercent}` : hex;

    return { rgba, hex, displayText, textColor };
  };

  // 在Button组件中使用displayText作为显示文本
  const { rgba, displayText, textColor } = colorInfoToHexAndAlpha(
    searchParams.query as ColorInfo
  );

  const getFontDisplayText = (fontInfo: FontInfo) => {
    if (!fontInfo) return "Select Font";

    // 截断 fontFamily 如果它太长
    const fontFamilyDisplay =
      fontInfo.fontFamily.length > 20
        ? `${fontInfo.fontFamily.substring(0, 17)}...`
        : fontInfo.fontFamily;

    // const textColorClass = fontInfo.isMissing
    //   ? "text-orange-500"
    //   : "text-black";

    const textColorClass = "text-black";

    // const styleColorClass = fontInfo.isMissing
    //   ? "text-orange-300" // 使用较浅的橙色
    //   : "text-gray-400"; // 默认较浅的灰色

    const styleColorClass = "text-gray-400";

    return (
      <>
        <span className={`text-sm ${textColorClass}`}>{fontFamilyDisplay}</span>
        <span className={`text-xs ${styleColorClass}`}>
          {fontInfo.fontStyle}
        </span>
      </>
    );
  };

  const getComponentDisplayText = (componentInfo: ComponentInfo) => {
    if (!componentInfo) return "Select Font";

    // 截断 fontFamily 如果它太长
    const componentNameDisplay =
      componentInfo.name.length > 20
        ? `${componentInfo.name.substring(0, 17)}...`
        : componentInfo.name;

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
      <>
        <span className={`text-sm truncate text-left ${textColorClass}`}>
          {componentNameDisplay}
        </span>
        <span className={`text-xs text-left truncate ${descriptionColorClass}`}>
          {componentInfo.description}
        </span>
      </>
    );
  };

  return (
    <div>
      <div className="flex w-full justify-center max-w-sm space-x-2 m-1">
        {activeTab === TabNames.color ? (
          <Popover>
            <PopoverTrigger>
              <Button
                className="w-[282px] border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:border-2 bg-white hover:bg-white border-dashed"
                onClick={handleRefreshColors}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div
                    className="w-64 h-6 border-2 border-gray-500 border-opacity-20"
                    style={{ backgroundColor: rgba, color: textColor }}
                  >
                    <span>{displayText}</span>
                  </div>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 ml-2 p-1">
              <ColorScrollArea
                colorData={colorData || []}
                onSelectColor={onSelectColor || (() => {})}
                onColorSelect={handleColorSelect}
              />
              <div className="text-sm text-center p-1 mt-2 bg-orange-100 border border-orange-300 rounded-md shadow">
                Select from the colors used in your current selection.
              </div>
            </PopoverContent>
          </Popover>
        ) : activeTab === TabNames.font ? (
          <Popover>
            <PopoverTrigger>
              <Button
                className="w-[282px] border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:border-2 bg-white hover:bg-white border-dashed"
                onClick={handleRefreshFonts}
              >
                <div className="flex items-center justify-center space-x-2">
                  {typeof searchParams.query === "object" &&
                  searchParams.query !== null &&
                  "fontFamily" in searchParams.query ? (
                    <>
                      {searchParams.query.isMissing ? (
                        <FigmaMissingFontIcon
                          width="20"
                          height="20"
                          fillColor="black"
                        />
                      ) : (
                        <FigmaFontIcon
                          width="20"
                          height="20"
                          fillColor="black"
                        />
                      )}
                      <div className="flex justify-start items-end space-x-3">
                        {getFontDisplayText(searchParams.query as FontInfo)}
                      </div>
                    </>
                  ) : (
                    <span>Select Font</span>
                  )}
                </div>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-96 ml-2 p-1">
              <FontScrollArea
                fontData={fontData || []}
                onSelectFont={onSelectFont || (() => {})}
                onFontSelect={handleFontSelect}
              />
              <div className="text-sm text-center p-1 mt-2 bg-orange-100 border border-orange-300 rounded-md shadow">
                Select from the fonts used in your current selection.
              </div>
            </PopoverContent>
          </Popover>
        ) : activeTab === TabNames.instance ? (
          <Popover>
            <PopoverTrigger>
              <Button
                className="w-[282px] border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:border-2 bg-white hover:bg-white border-dashed"
                onClick={handleRefreshComponents}
              >
                <div className="flex items-center justify-center space-x-2">
                  {typeof searchParams.query === "object" &&
                  searchParams.query !== null &&
                  "name" in searchParams.query ? (
                    <>
                      {searchParams.query.isMissing ? (
                        <FigmaMissingFontIcon
                          width="20"
                          height="20"
                          fillColor="black"
                        />
                      ) : searchParams.query.isExternal ? (
                        <FigmaExternalIcon
                          width="20"
                          height="20"
                          fillColor="black"
                        />
                      ) : (
                        <FigmaComponentIcon
                          width="20"
                          height="20"
                          fillColor="black"
                        />
                      )}

                      <div className="flex justify-start items-end space-x-3">
                        {getComponentDisplayText(
                          searchParams.query as ComponentInfo
                        )}
                      </div>
                    </>
                  ) : (
                    <span>Select Component</span>
                  )}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 ml-2 p-1">
              <ComponentScrollArea
                componentData={componentData || []}
                onSelectComponent={onSelectComponent || (() => {})}
                onComponentSelect={handleComponentSelect}
              />
              <div className="text-sm text-center p-1 mt-2 bg-orange-100 border border-orange-300 rounded-md shadow">
                Select from the components used in your current page.
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

      {/* Text 和 Layer Tabs 的处理 */}
      {(activeTab === TabNames.text || activeTab === TabNames.layer) && (
        <div className="flex justify-start w-full max-w-sm space-x-8 mt-2 mb-2 pl-3">
          <CheckboxWithLabel
            id="caseSensitiveCheckbox"
            checked={caseSensitive ?? false}
            onChange={handleChange}
            name="caseSensitive"
            label="Case Sensitive"
          />

          <CheckboxWithLabel
            id="matchWholeWordCheckbox"
            checked={matchWholeWord ?? false}
            onChange={handleChange}
            name="matchWholeWord"
            label="Match Whole Words"
          />
        </div>
      )}

      {/* Color Tab 的额外选项 */}
      {activeTab === TabNames.color && (
        <div className="flex justify-start w-full max-w-sm space-x-8 mt-2 mb-2 pl-3">
          <CheckboxWithLabel
            id="includeFillsCheckbox"
            checked={includeFills ?? true}
            onChange={handleChange}
            name="includeFills"
            label="Find Fills"
          />
          <CheckboxWithLabel
            id="includeStrokesCheckbox"
            checked={includeStrokes ?? true}
            onChange={handleChange}
            name="includeStrokes"
            label="Find Strokes"
          />
        </div>
      )}

      {activeTab === TabNames.font && (
        <div className="flex justify-start w-full max-w-sm space-x-8 mt-2 mb-2 pl-3">
          <CheckboxWithLabel
            id="includeNormalFontCheckbox"
            checked={includeNormalFont ?? true}
            onChange={handleChange}
            name="includeNormalFont"
            label="Normal"
          />
          <CheckboxWithLabel
            id="includeMissingFontCheckbox"
            checked={includeMissingFont ?? true}
            onChange={handleChange}
            name="includeMissingFont"
            label="Include Missing"
          />
        </div>
      )}

      {activeTab === TabNames.instance && (
        <div className="flex justify-start w-full max-w-sm space-x-8 mt-2 mb-2 pl-3">
          <CheckboxWithLabel
            id="includeNormalComponentCheckbox"
            checked={includeNormalComponent ?? true}
            onChange={handleChange}
            name="includeNormalComponent"
            label="Normal"
          />
          <CheckboxWithLabel
            id="includeMissingComponentCheckbox"
            checked={includeMissingComponent ?? true}
            onChange={handleChange}
            name="includeMissingComponent"
            label="Missing"
          />
          <CheckboxWithLabel
            id="includeExternalComponentCheckbox"
            checked={includeExternalComponent ?? true}
            onChange={handleChange}
            name="includeExternalComponent"
            label="External"
          />
        </div>
      )}
    </div>
  );
};

export default SearchInput;
