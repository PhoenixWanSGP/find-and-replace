import { useEffect, useState } from "react";
import "./App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
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
        caseSensitive: false,
        matchWholeWord: false,
      },
      lastSearchParams: {
        query: "",
        caseSensitive: false,
        matchWholeWord: false,
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
    },
    font: {
      currentSearchParams: {
        type: "font",
        query: "",
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
    },
    instance: {
      currentSearchParams: {
        type: "instance",
        query: "",
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
    },
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

  const handleSearch = (searchParams: SearchParams) => {
    const currentTabData = tabData[currentTab];
    // 检查当前的搜索参数是否与上一次相同
    if (
      searchParams.query === currentTabData.lastSearchParams.query &&
      searchParams.caseSensitive ===
        currentTabData.lastSearchParams.caseSensitive &&
      searchParams.matchWholeWord ===
        currentTabData.lastSearchParams.matchWholeWord
    ) {
      // 进一步检查搜索结果是否非空
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
        // 如果搜索结果为空，可能需要显示一些消息或处理逻辑，例如：
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

    // 确保查询字符串不为空
    if (!currentSearchParams.query.trim()) {
      console.log("Replace action aborted: Query string is empty.");
      // 可以在这里处理UI反馈，如显示一个错误消息
      return; // 中断函数执行
    }

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
          },
        },
      },
      "*"
    );
  };

  const handleSelectNode = (nodeId: string, tab: TabName) => {
    console.log(`Node selected: ${nodeId} in tab: ${tab}`);
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

  const handleTabChange = (newTab: TabName) => {
    console.log(`Tab changed to ${newTab}`);
    setCurrentTab(newTab);
    const newNodeId = tabData[newTab].selectedNodeId;
    if (newNodeId !== globalCurrentNode) {
      setGlobalCurrentNode(newNodeId);
    }
  };

  useEffect(() => {
    function handleFigmaMessages(event: any) {
      if (event.data.pluginMessage) {
        const { type, payload } = event.data.pluginMessage;
        switch (type) {
          case "search-results":
            console.log("=====收到搜索结果====", event);
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
            console.log("=====替换完成消息接收：====", payload);
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
      console.log("Window focused");
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
      console.log("Window blurred");
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

  useEffect(() => {
    console.log("Global current node updated", globalCurrentNode);
  }, [globalCurrentNode]);

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
    console.log("====当前选中节点变化====", globalCurrentNode);
  }, [globalCurrentNode]); // 监听 globalCurrentNode 的变化

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
              searchParams={tabData.text.currentSearchParams} // 从 tabData 获取当前 text 类型的搜索参数
              onSearch={() => handleSearch(tabData.text.currentSearchParams)} // 使用 tabData 中的当前搜索参数进行搜索
              onUpdateSearchParams={updateSearchParams("text")} // 传递更新函数，已配置为更新 text 类型的搜索参数
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
              searchParams={tabData.layer.currentSearchParams} // 从 tabData 获取当前 layer 类型的搜索参数
              onSearch={() => handleSearch(tabData.layer.currentSearchParams)} // 使用 tabData 中的当前搜索参数进行搜索
              onUpdateSearchParams={updateSearchParams("layer")} // 传递更新函数，已配置为更新 layer 类型的搜索参数
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

          <TabsContent value="color"></TabsContent>
          <TabsContent value="font"></TabsContent>
          <TabsContent value="instance"></TabsContent>
        </Tabs>
        <Footer />
      </div>
    </>
  );
}

export default App;
