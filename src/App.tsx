import { useEffect, useState } from "react";
import "./App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReplaceParams, SearchParams, TabName, TabNames } from "./types";
import SearchInput from "./components/SearchInput";
import ReplaceComponent from "./components/ReplaceComponent";
import Footer from "./components/Footer";
import SearchResult from "./components/SearchResult";

function App() {
  const [currentTab, setCurrentTab] = useState<TabName>("text");
  const [globalCurrentNode, setGlobalCurrentNode] = useState<string | null>(
    null
  );

  type TabData = {
    [key in TabName]: {
      lastSearchParams: SearchParams;
      selectedIndex: number;
      searchResults: any[];
    };
  };

  const [tabData, setTabData] = useState<TabData>({
    text: {
      lastSearchParams: {
        query: "",
        caseSensitive: false,
        matchWholeWord: false,
        type: "text",
      },
      selectedIndex: 0,
      searchResults: [],
    },
    layer: {
      lastSearchParams: {
        query: "",
        caseSensitive: false,
        matchWholeWord: false,
        type: "layer",
      },
      selectedIndex: 0,
      searchResults: [],
    },
    color: {
      lastSearchParams: {
        query: "",
        caseSensitive: false,
        matchWholeWord: false,
        type: "color",
      },
      selectedIndex: 0,
      searchResults: [],
    },
    font: {
      lastSearchParams: {
        query: "",
        caseSensitive: false,
        matchWholeWord: false,
        type: "font",
      },
      selectedIndex: 0,
      searchResults: [],
    },
    instance: {
      lastSearchParams: {
        query: "",
        caseSensitive: false,
        matchWholeWord: false,
        type: "instance",
      },
      selectedIndex: 0,
      searchResults: [],
    },
  });

  // const [searchResults] = useState({
  //   text: [],
  //   layer: [],
  //   color: [],
  //   font: [],
  //   instance: [],
  // });
  const [currentSelectedNode, setCurrentSelectedNode] = useState({
    text: null,
    layer: null,
    color: null,
    font: null,
    instance: null,
  });

  const [textSearchParams, setTextSearchParams] = useState<SearchParams>({
    type: "text",
    query: "",
    caseSensitive: false,
    matchWholeWord: false,
  });
  const [layerSearchParams, setLayerSearchParams] = useState<SearchParams>({
    type: "layer",
    query: "",
    caseSensitive: false,
    matchWholeWord: false,
  });

  const [textReplaceParams, setTextReplaceParams] = useState<ReplaceParams>({
    type: "text",
    nodeId: "",
    newValue: "",
  });
  const [layerReplaceParams, setLayerReplaceParams] = useState<ReplaceParams>({
    type: "layer",
    nodeId: "",
    newValue: "",
  });

  const updateSearchParams =
    (type: "text" | "layer") => (newParams: Partial<SearchParams>) => {
      console.log(`Updating search params for ${type}`, newParams);
      if (type === "text") {
        setTextSearchParams((prev) => ({ ...prev, ...newParams }));
      } else {
        setLayerSearchParams((prev) => ({ ...prev, ...newParams }));
      }
    };

  const handleSearch = (searchParams: SearchParams) => {
    const currentTabData = tabData[currentTab];
    if (
      searchParams.query === currentTabData.lastSearchParams.query &&
      searchParams.caseSensitive ===
        currentTabData.lastSearchParams.caseSensitive &&
      searchParams.matchWholeWord ===
        currentTabData.lastSearchParams.matchWholeWord
    ) {
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
      setGlobalCurrentNode(newNodeId);
      setCurrentSelectedNode((prev) => ({ ...prev, [currentTab]: newNodeId }));
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

  const updateReplaceParams =
    (type: "text" | "layer") => (newParams: Partial<ReplaceParams>) => {
      console.log(`Updating replace params for ${type}`, newParams);
      if (type === "text") {
        setTextReplaceParams((prev) => ({ ...prev, ...newParams }));
      } else {
        setLayerReplaceParams((prev) => ({ ...prev, ...newParams }));
      }
    };

  const handleReplace = (params: ReplaceParams, replaceAll: boolean) => {
    const messageType = replaceAll ? "replace-all" : "replace";
    parent.postMessage(
      {
        pluginMessage: {
          type: messageType,
          payload: {
            ...params,
            currentTab: currentTab,
            replaceAll: replaceAll,
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

    setCurrentSelectedNode((prev) => ({
      ...prev,
      [tab]: nodeId,
    }));
    setGlobalCurrentNode(nodeId);
  };

  const handleTabChange = (newTab: TabName) => {
    console.log(`Tab changed to ${newTab}`);
    setCurrentTab(newTab);
    const newNodeId = currentSelectedNode[newTab];
    if (newNodeId !== globalCurrentNode) {
      setGlobalCurrentNode(newNodeId);
    }
  };

  useEffect(() => {
    function handleSearchResults(event: any) {
      const { type, payload } = event.data.pluginMessage;
      if (type === "search-results") {
        const { category, data } = payload;
        if (Object.values(TabNames).includes(category)) {
          // 现在使用TabNames对象进行检查
          const tabCategory = category as TabName; // 类型断言，因为我们已经验证了它是有效的
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
            setCurrentSelectedNode((prev) => ({
              ...prev,
              [tabCategory]: data[0].id,
            }));
          }
        } else {
          console.error("Received invalid category:", category);
        }
      }
    }
    window.onmessage = handleSearchResults;
    return () => {
      window.onmessage = null;
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

  // useEffect(() => {
  //   console.log("Search results updated", searchResults);
  // }, [searchResults]);

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
              searchParams={textSearchParams}
              onSearch={() => handleSearch(textSearchParams)}
              onUpdateSearchParams={updateSearchParams("text")}
            />
            <ReplaceComponent
              replaceParams={textReplaceParams}
              onReplace={handleReplace}
              onUpdateReplaceParams={updateReplaceParams("text")}
            />

            <SearchResult
              searchResults={tabData[currentTab].searchResults} // 使用当前标签页的搜索结果
              query={tabData[currentTab].lastSearchParams.query} // 使用当前标签页的最后搜索词
              currentTab={currentTab} // 当前激活的标签页
              selectedNodeId={currentSelectedNode[currentTab]} // 当前标签页选中的节点ID
              onSelectNode={(nodeId) => handleSelectNode(nodeId, currentTab)} // 处理节点选择事件，传递当前标签页
            />
          </TabsContent>

          <TabsContent value="layer" className="flex flex-col items-center m-0">
            <SearchInput
              searchParams={layerSearchParams}
              onSearch={() => handleSearch(layerSearchParams)}
              onUpdateSearchParams={updateSearchParams("layer")}
            />
            <ReplaceComponent
              replaceParams={layerReplaceParams}
              onReplace={handleReplace}
              onUpdateReplaceParams={updateReplaceParams("layer")}
            />

            <SearchResult
              searchResults={tabData[currentTab].searchResults} // 使用当前标签页的搜索结果
              query={tabData[currentTab].lastSearchParams.query} // 使用当前标签页的最后搜索词
              currentTab={currentTab} // 当前激活的标签页
              selectedNodeId={currentSelectedNode[currentTab]} // 当前标签页选中的节点ID
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
