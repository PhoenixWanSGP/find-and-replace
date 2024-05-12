import { useEffect, useState } from "react";
import "./App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ColorInfo,
  FontInfo,
  QueryType,
  ReplaceParams,
  SearchParams,
  TabData,
  TabName,
  TabNames,
} from "./types";
import SearchInput from "./components/SearchInput";
import ReplaceComponent from "./components/ReplaceComponent";
import Footer from "./components/Footer";
import SearchResult from "./components/SearchResult";
import ResultsIndicator from "./components/ResultsIndicator";
import { Button } from "./components/ui/button";
// import ColorScrollArea from "./components/ColorScrollArea";

function App() {
  const [currentTab, setCurrentTab] = useState<TabName>("text");
  const [globalCurrentNode, setGlobalCurrentNode] = useState<string | null>(
    null
  );

  const [tabData, setTabData] = useState<TabData>({
    text: {
      currentSearchParams: {
        type: "text",
        query: "",
        caseSensitive: false,
        matchWholeWord: false,
      },
      lastSearchParams: {
        query: "",
        caseSensitive: false,
        matchWholeWord: false,
        type: "text",
      },
      replaceParams: {
        type: "text",
        nodeId: "",
        newValue: "",
      },
      selectedIndex: 0,
      searchResults: [],
      selectedNodeId: null,
    },
    layer: {
      currentSearchParams: {
        type: "layer",
        query: "",
        caseSensitive: false,
        matchWholeWord: false,
      },
      lastSearchParams: {
        query: "",
        caseSensitive: false,
        matchWholeWord: false,
        type: "layer",
      },
      replaceParams: {
        type: "layer",
        nodeId: "",
        newValue: "",
      },
      selectedIndex: 0,
      searchResults: [],
      selectedNodeId: null,
    },
    color: {
      currentSearchParams: {
        type: "color",
        query: "",
        includeFills: true,
        includeStrokes: true,
      },
      lastSearchParams: {
        query: "",
        type: "color",
      },
      replaceParams: {
        type: "color",
        nodeId: "",
        newValue: "",
      },
      selectedIndex: 0,
      searchResults: [],
      selectedNodeId: null,
      searchList: [],
    },
    font: {
      currentSearchParams: {
        type: "font",
        query: "",
        includeNormalFont: true,
        includeMissingFont: true,
      },
      lastSearchParams: {
        query: "",
        type: "font",
      },
      replaceParams: {
        type: "font",
        nodeId: "",
        newValue: "",
      },
      selectedIndex: 0,
      searchResults: [],
      selectedNodeId: null,
      searchList: [],
    },
    instance: {
      currentSearchParams: {
        type: "instance",
        query: "",
        includeNormalComponent: true,
        includeMissingComponent: true,
        includeExternalComponent: true,
      },
      lastSearchParams: {
        query: "",
        type: "instance",
      },
      replaceParams: {
        type: "instance",
        nodeId: "",
        newValue: "",
      },
      selectedIndex: 0,
      searchResults: [],
      selectedNodeId: null,
      searchList: [],
    },
    // style: {
    //   currentSearchParams: {
    //     type: "style",
    //     query: "",
    //   },
    //   lastSearchParams: {
    //     query: "",
    //     type: "style",
    //   },
    //   replaceParams: {
    //     type: "style",
    //     nodeId: "",
    //     newValue: "",
    //   },
    //   selectedIndex: 0,
    //   searchResults: [],
    //   selectedNodeId: null,
    //   searchList: [],
    // },
  });

  const updateSearchParams =
    (type: TabName) => (newParams: Partial<SearchParams>) => {
      setTabData((prevState) => ({
        ...prevState,
        [type]: {
          ...prevState[type],
          currentSearchParams: {
            ...prevState[type].currentSearchParams,
            ...newParams, // 确保只合并提供的字段
          },
        },
      }));
    };

  const updateReplaceParams =
    (type: TabName) => (newParams: Partial<ReplaceParams>) => {
      setTabData((prevState) => ({
        ...prevState,
        [type]: {
          ...prevState[type],
          replaceParams: {
            ...prevState[type].replaceParams,
            ...newParams, // 合并新的替换参数到现有的状态中
          },
        },
      }));
    };

  const updateSelectedNodeId = (tab: TabName, nodeId: string | null) => {
    setTabData((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        selectedNodeId: nodeId,
      },
    }));
    updateReplaceParams(tab)({ nodeId: nodeId });
  };

  const handleTabChange = (newTab: TabName) => {
    setCurrentTab(newTab);
    const newNodeId = tabData[newTab].selectedNodeId;
    if (newNodeId !== globalCurrentNode) {
      setGlobalCurrentNode(newNodeId);
    }
  };

  const handleSearch = (searchParams: SearchParams) => {
    const currentTabData = tabData[currentTab];

    // Helper function to compare ColorInfo objects
    const isColorInfoEqual = (colorA: ColorInfo, colorB: ColorInfo) => {
      return (
        colorA.r === colorB.r &&
        colorA.g === colorB.g &&
        colorA.b === colorB.b &&
        colorA.a === colorB.a
      );
    };

    const isColorInfo = (object: any): object is ColorInfo => {
      return object && "r" in object && "g" in object && "b" in object;
    };

    const isFontInfo = (object: any): object is FontInfo => {
      return (
        object &&
        "fontFamily" in object &&
        "fontStyle" in object &&
        "isMissing" in object
      );
    };

    const isFontInfoEqual = (fontA: FontInfo, fontB: FontInfo) => {
      return (
        fontA.fontFamily === fontB.fontFamily &&
        fontA.fontStyle === fontB.fontStyle &&
        fontA.isMissing === fontB.isMissing
      );
    };

    // Helper function to compare QueryType objects
    const isQueryEqual = (queryA: QueryType, queryB: QueryType) => {
      if (typeof queryA === "string" && typeof queryB === "string") {
        return queryA === queryB;
      } else if (isColorInfo(queryA) && isColorInfo(queryB)) {
        return isColorInfoEqual(queryA, queryB);
      } else if (isFontInfo(queryA) && isFontInfo(queryB)) {
        return isFontInfoEqual(queryA, queryB);
      }
      // 如果需要，这里可以添加更多的逻辑来处理其他类型的比较
      return false; // 不同的类型或无法比较的类型
    };

    // Check if current search parameters are the same as the last ones
    if (
      isQueryEqual(searchParams.query, currentTabData.lastSearchParams.query) &&
      searchParams.caseSensitive ===
        currentTabData.lastSearchParams.caseSensitive &&
      searchParams.matchWholeWord ===
        currentTabData.lastSearchParams.matchWholeWord &&
      searchParams.includeFills ===
        currentTabData.lastSearchParams.includeFills &&
      searchParams.includeStrokes ===
        currentTabData.lastSearchParams.includeStrokes &&
      searchParams.includeNormalFont ===
        currentTabData.lastSearchParams.includeNormalFont &&
      searchParams.includeMissingFont ===
        currentTabData.lastSearchParams.includeMissingFont &&
      searchParams.includeNormalComponent ===
        currentTabData.lastSearchParams.includeNormalComponent &&
      searchParams.includeMissingComponent ===
        currentTabData.lastSearchParams.includeMissingComponent &&
      searchParams.includeExternalComponent ===
        currentTabData.lastSearchParams.includeExternalComponent
    ) {
      // Further check if search results are not empty
      if (currentTabData.searchResults.length > 0) {
        const newSelectedIndex =
          (currentTabData.selectedIndex + 1) %
          currentTabData.searchResults.length;
        setTabData((prev) => ({
          ...prev,
          [currentTab]: {
            ...currentTabData,
            selectedIndex: newSelectedIndex,
          },
        }));
        const newNodeId = currentTabData.searchResults[newSelectedIndex].id;
        updateSelectedNodeId(currentTab, newNodeId);
        setGlobalCurrentNode(newNodeId);
      } else {
        console.log("No search results available to cycle through.");
      }
    } else {
      parent.postMessage(
        {
          pluginMessage: {
            type: "search",
            payload: {
              currentTab,
              query: searchParams.query,
              caseSensitive: searchParams.caseSensitive,
              matchWholeWord: searchParams.matchWholeWord,
              includeFills: searchParams.includeFills,
              includeStrokes: searchParams.includeStrokes,
              includeNormalFont: searchParams.includeNormalFont,
              includeMissingFont: searchParams.includeMissingFont,
              includeNormalComponent: searchParams.includeNormalComponent,
              includeMissingComponent: searchParams.includeMissingComponent,
              includeExternalComponent: searchParams.includeExternalComponent,
            },
          },
        },
        "*"
      );
      setTabData((prev) => ({
        ...prev,
        [currentTab]: {
          ...currentTabData,
          lastSearchParams: searchParams,
          searchResults: [],
          selectedIndex: 0,
        },
      }));
    }
  };

  const handleReplace = (params: ReplaceParams, replaceAll: boolean) => {
    const currentTab: TabName = params.type;
    const currentSearchParams = tabData[currentTab].currentSearchParams; // 获取当前标签的搜索参数

    // 确保查询字符串不为空或者query是ColorInfo类型
    if (
      typeof currentSearchParams.query === "string" &&
      !currentSearchParams.query.trim()
    ) {
      console.log("Replace action aborted: Query string is empty.");
      // 可以在这里处理UI反馈，如显示一个错误消息
      return; // 中断函数执行
    }

    // 如果query是ColorInfo类型，则不需要进行空字符串检查

    const messageType = replaceAll ? "replace-all" : "replace";
    parent.postMessage(
      {
        pluginMessage: {
          type: messageType,
          payload: {
            ...params,
            currentTab: currentTab, // 使用从参数中推断的当前活跃的标签
            replaceAll: replaceAll,
            query: currentSearchParams.query, // 将当前搜索的关键词加入 payload
            caseSensitive: currentSearchParams.caseSensitive, // 添加大小写敏感选项
            matchWholeWord: currentSearchParams.matchWholeWord, // 添加完整单词匹配选项
            // 如果有新增的属性，也应该在这里加入payload
            includeFills: currentSearchParams.includeFills,
            includeStrokes: currentSearchParams.includeStrokes,
          },
        },
      },
      "*"
    );
  };

  const handleSelectNode = (nodeId: string, tab: TabName) => {
    const newIndex = tabData[tab].searchResults.findIndex(
      (result) => result.id === nodeId
    );

    if (newIndex >= 0) {
      setTabData((prev) => ({
        ...prev,
        [tab]: {
          ...prev[tab],
          selectedIndex: newIndex, // 更新当前标签的selectedIndex为新选中节点的索引
        },
      }));
    }

    updateSelectedNodeId(tab, nodeId);
    setGlobalCurrentNode(nodeId);
  };
  const handleRefreshSearchList = (searchParams: SearchParams) => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "get-searchlist",
          payload: {
            currentTab,
            query: searchParams.query,
            caseSensitive: searchParams.caseSensitive,
            matchWholeWord: searchParams.matchWholeWord,
            includeFills: searchParams.includeFills,
            includeStrokes: searchParams.includeStrokes,
            includeNormalFont: searchParams.includeNormalFont,
            includeMissingFont: searchParams.includeMissingFont,
            includeNormalComponent: searchParams.includeNormalComponent,
            includeMissingComponent: searchParams.includeMissingComponent,
            includeExternalComponent: searchParams.includeExternalComponent,
          },
        },
      },
      "*"
    );
  };

  const handleSelectColor = (color: string) => {
    console.log("Selected Color:", color);
    // 这里可以添加更多处理逻辑，比如更新状态或调用API等
  };

  const handleSelectFont = (font: any) => {
    console.log("Selected Font:", font);
    // 这里可以添加更多处理逻辑，比如更新状态或调用API等
  };

  const handleSelectComponent = (component: any) => {
    console.log("Selected Component:", component);
    // 这里可以添加更多处理逻辑，比如更新状态或调用API等
  };

  const handleSelectAll = (currentTab: TabName) => {
    const nodeIds = tabData[currentTab].searchResults.map((node) => node.id);
    window.parent.postMessage(
      {
        pluginMessage: {
          type: "select-all",
          payload: {
            nodeIds: nodeIds,
            currentTab: currentTab,
          },
        },
      },
      "*"
    ); // 注意安全性问题，实际部署时应该替换 "*"
  };

  useEffect(() => {
    function handleFigmaMessages(event: any) {
      if (event.data.pluginMessage) {
        const { type, payload } = event.data.pluginMessage;
        console.log("====type is:====", type, "====payload is:====", payload);
        switch (type) {
          case "search-results":
            const { category, data } = payload;
            if (Object.values(TabNames).includes(category)) {
              const tabCategory = category as TabName;
              setTabData((prev) => ({
                ...prev,
                [tabCategory]: {
                  ...prev[tabCategory],
                  searchResults: data,
                  selectedIndex: 0,
                },
              }));
              if (data.length > 0) {
                setGlobalCurrentNode(data[0].id);
                updateSelectedNodeId(tabCategory, data[0].id);
              }
            } else {
              console.error("Received invalid category:", category);
            }
            break;

          case "replace-done":
            const { nodeId, currentTab, newData } = payload;
            if (currentTab in TabNames) {
              setTabData((prev) => ({
                ...prev,
                [currentTab]: {
                  ...prev[currentTab as keyof typeof prev], // 类型断言确保 currentTab 是 TabData 的键
                  searchResults: prev[
                    currentTab as keyof typeof prev
                  ].searchResults.map((item) => {
                    if (item.id === nodeId) {
                      return { ...item, ...newData };
                    }
                    return item;
                  }),
                },
              }));
            }
            break;

          case "searchlist":
            if (payload.dataType === "color-results") {
              // 用提供的颜色数据更新color标签下的searchList
              console.log("====收到所有颜色====", payload.data);
              setTabData((prev) => ({
                ...prev,
                color: {
                  ...prev.color,
                  searchList: payload.data,
                },
              }));
              // console.log("====存好所有颜色====", tabData.color.searchList);
            } else if (payload.dataType === "font-results") {
              console.log("====收到所有字体====", payload.data);
              setTabData((prev) => ({
                ...prev,
                font: {
                  ...prev.font,
                  searchList: payload.data,
                },
              }));
            } else if (payload.dataType === "component-results") {
              console.log("====收到所有组件====", payload.data);
              setTabData((prev) => ({
                ...prev,
                instance: {
                  ...prev.instance,
                  searchList: payload.data,
                },
              }));
            } else if (payload.dataType === "style-results") {
              console.log("====收到所有样式====", payload.data);
            }
            break;
        }
      }
    }
    window.onmessage = handleFigmaMessages;
    return () => {
      window.onmessage = null; // 清除消息监听器
    };
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      parent.postMessage(
        {
          pluginMessage: {
            type: "activate-view",
            payload: {
              isActivated: true,
            },
          },
        },
        "*"
      );
    };

    const handleBlur = () => {
      parent.postMessage(
        {
          pluginMessage: {
            type: "deactivate-view",
            payload: {
              isActivated: false,
            },
          },
        },
        "*"
      );
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [globalCurrentNode]);

  useEffect(() => {}, [globalCurrentNode]);

  useEffect(() => {
    // 总是发送消息到后端，不论 globalCurrentNode 是否为空
    parent.postMessage(
      {
        pluginMessage: {
          type: "select-node",
          payload: {
            nodeId: globalCurrentNode || "", // 如果 globalCurrentNode 为 null 或 undefined，则发送空字符串
          },
        },
      },
      "*"
    );
  }, [globalCurrentNode]); // 监听 globalCurrentNode 的变化

  useEffect(() => {
    // 此 useEffect 用于监听 tabData 下所有标签的 searchList 的变化
    // 对于本示例，我们暂时仅处理 color 标签
    console.log("SearchList has been updated", tabData.instance.searchList);
  }, [
    tabData.color.searchList,
    tabData.font.searchList,
    tabData.instance.searchList,
  ]);

  useEffect(() => {
    console.log(
      "currentSearchParams changed:",
      tabData.color.currentSearchParams
    );
    // 这里可以根据currentSearchParams的变动执行其他操作
  }, [tabData.color.currentSearchParams]);

  return (
    <>
      <div className="flex flex-col items-center w-full fixed top-0 left-0">
        <Tabs defaultValue="text" className="w-full flex flex-col items-center">
          <TabsList className="grid w-full grid-cols-5 rounded-none">
            {Object.values(TabNames).map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                onClick={() => handleTabChange(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="text" className="flex flex-col items-center m-0">
            <SearchInput
              searchParams={tabData.text.currentSearchParams} // 获取 text 类型的搜索参数
              onSearch={() => handleSearch(tabData.text.currentSearchParams)} // 进行搜索
              onUpdateSearchParams={updateSearchParams("text")} // 更新搜索参数
              activeTab={currentTab} // 当前激活的 tab
              colorData={tabData.color.searchList} // 使用 tabData 中的 color 数据
              // onSelectColor={handleSelectColor} // 处理颜色选择的函数
              // handleRefreshColors={handleRefreshSearchList}
            />

            <ReplaceComponent
              replaceParams={tabData.text.replaceParams}
              onReplace={(params, replaceAll) =>
                handleReplace(params, replaceAll)
              } // 不需要传递 currentTab
              onUpdateReplaceParams={updateReplaceParams("text")}
            />
            <ResultsIndicator currentTab={currentTab} tabData={tabData} />

            <SearchResult
              searchResults={tabData[currentTab].searchResults} // 使用当前标签页的搜索结果
              query={tabData[currentTab].lastSearchParams.query} // 使用当前标签页的最后搜索词
              currentTab={currentTab} // 当前激活的标签页
              selectedNodeId={tabData[currentTab].selectedNodeId} // 当前标签页选中的节点ID
              onSelectNode={(nodeId) => handleSelectNode(nodeId, currentTab)} // 处理节点选择事件，传递当前标签页
            />
          </TabsContent>

          <TabsContent value="layer" className="flex flex-col items-center m-0">
            <SearchInput
              searchParams={tabData.layer.currentSearchParams} // 获取 text 类型的搜索参数
              onSearch={() => handleSearch(tabData.layer.currentSearchParams)} // 进行搜索
              onUpdateSearchParams={updateSearchParams("layer")} // 更新搜索参数
              activeTab={currentTab} // 当前激活的 tab
              colorData={tabData.color.searchList} // 使用 tabData 中的 color 数据
              // onSelectColor={handleSelectColor} // 处理颜色选择的函数
              // handleRefreshColors={handleRefreshSearchList}
            />

            <ReplaceComponent
              replaceParams={tabData.layer.replaceParams}
              onReplace={(params, replaceAll) =>
                handleReplace(params, replaceAll)
              } // 不需要传递 currentTab
              onUpdateReplaceParams={updateReplaceParams("layer")}
            />
            <ResultsIndicator currentTab={currentTab} tabData={tabData} />

            <SearchResult
              searchResults={tabData[currentTab].searchResults} // 使用当前标签页的搜索结果
              query={tabData[currentTab].lastSearchParams.query} // 使用当前标签页的最后搜索词
              currentTab={currentTab} // 当前激活的标签页
              selectedNodeId={tabData[currentTab].selectedNodeId} // 当前标签页选中的节点ID
              onSelectNode={(nodeId) => handleSelectNode(nodeId, currentTab)} // 处理节点选择事件，传递当前标签页
            />
          </TabsContent>

          <TabsContent value="color" className="flex flex-col items-center m-0">
            {/* Scroll Area to display colors */}
            <SearchInput
              searchParams={tabData.color.currentSearchParams} // 获取 text 类型的搜索参数
              onSearch={() => handleSearch(tabData.color.currentSearchParams)} // 进行搜索
              onUpdateSearchParams={updateSearchParams("color")} // 更新搜索参数
              activeTab={currentTab} // 当前激活的 tab
              colorData={tabData.color.searchList} // 使用 tabData 中的 color 数据
              onSelectColor={handleSelectColor} // 处理颜色选择的函数
              handleRefreshColors={() =>
                handleRefreshSearchList(tabData.color.currentSearchParams)
              }
            />

            <div className="w-full flex justify-end mt-2">
              <ResultsIndicator currentTab={currentTab} tabData={tabData} />
              <div className="search-results-container">
                {/* 其他内容... */}
                {
                  // 只有当当前标签的 searchResults 不为空时，才显示 "Select all" 按钮
                  tabData[currentTab].searchResults.length > 0 && (
                    <Button
                      className="w-24 bg-blue-500 text-white hover:bg-blue-700 mr-1"
                      onClick={() => handleSelectAll(currentTab)}
                    >
                      Select all
                    </Button>
                  )
                }
              </div>
            </div>

            <SearchResult
              searchResults={tabData[currentTab].searchResults} // 使用当前标签页的搜索结果
              query={tabData[currentTab].lastSearchParams.query} // 使用当前标签页的最后搜索词
              currentTab={currentTab} // 当前激活的标签页
              selectedNodeId={tabData[currentTab].selectedNodeId} // 当前标签页选中的节点ID
              onSelectNode={(nodeId) => handleSelectNode(nodeId, currentTab)} // 处理节点选择事件，传递当前标签页
            />

            {/* Refresh button to trigger color data update */}
          </TabsContent>

          <TabsContent value="font">
            <SearchInput
              searchParams={tabData.font.currentSearchParams} // 获取 text 类型的搜索参数
              onSearch={() => handleSearch(tabData.font.currentSearchParams)} // 进行搜索
              onUpdateSearchParams={updateSearchParams("font")} // 更新搜索参数
              activeTab={currentTab} // 当前激活的 tab
              fontData={tabData.font.searchList} // 使用 tabData 中的 color 数据
              onSelectFont={handleSelectFont} // 处理颜色选择的函数
              handleRefreshFonts={() =>
                handleRefreshSearchList(tabData.font.currentSearchParams)
              }
            />

            <div className="w-full flex justify-end mt-2">
              <ResultsIndicator currentTab={currentTab} tabData={tabData} />
              <div className="search-results-container">
                {/* 其他内容... */}
                {
                  // 只有当当前标签的 searchResults 不为空时，才显示 "Select all" 按钮
                  tabData[currentTab].searchResults.length > 0 && (
                    <Button
                      className="w-24 bg-blue-500 text-white hover:bg-blue-700 mr-1"
                      onClick={() => handleSelectAll(currentTab)}
                    >
                      Select all
                    </Button>
                  )
                }
              </div>
            </div>

            <SearchResult
              searchResults={tabData[currentTab].searchResults} // 使用当前标签页的搜索结果
              query={tabData[currentTab].lastSearchParams.query} // 使用当前标签页的最后搜索词
              currentTab={currentTab} // 当前激活的标签页
              selectedNodeId={tabData[currentTab].selectedNodeId} // 当前标签页选中的节点ID
              onSelectNode={(nodeId) => handleSelectNode(nodeId, currentTab)} // 处理节点选择事件，传递当前标签页
            />
          </TabsContent>

          <TabsContent value="instance">
            <SearchInput
              searchParams={tabData.instance.currentSearchParams} // 获取 text 类型的搜索参数
              onSearch={() =>
                handleSearch(tabData.instance.currentSearchParams)
              } // 进行搜索
              onUpdateSearchParams={updateSearchParams("instance")} // 更新搜索参数
              activeTab={currentTab} // 当前激活的 tab
              componentData={tabData.instance.searchList} // 使用 tabData 中的 color 数据
              onSelectComponent={handleSelectComponent} // 处理颜色选择的函数
              handleRefreshComponents={() =>
                handleRefreshSearchList(tabData.instance.currentSearchParams)
              }
            />
          </TabsContent>
          {/* <TabsContent value="style">
            <Button onClick={handleButtonClick}>获取所有样式</Button>
          </TabsContent> */}

          {/* <TabsContent value="variable"></TabsContent> */}
        </Tabs>
        <Footer />
      </div>
    </>
  );
}

export default App;
