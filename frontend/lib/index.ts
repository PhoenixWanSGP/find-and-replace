import { initializeUI, handleUIMessage } from "./ui";
import { searchNodes } from "./search";
import { replaceAllNodes } from "./replace";
import {
  collectColors,
  collectFonts,
  collectComponents,
  collectStyles,
} from "./collect";
import { handleSelectAllNodes } from "./handleSelect"; // 添加导入
import { Message, TabName } from "./types";

if (figma.editorType === "figma") {
  initializeUI();
  figma.clientStorage.getAsync("authToken").then((token) => {
    if (token) {
      figma.ui.postMessage({ type: "AUTH_TOKEN", token });
    } else {
      figma.ui.postMessage({ type: "NO_AUTH" });
    }
  });

  let inFigmaCurrentNode: string | null = null;

  figma.ui.onmessage = async (msg: Message) => {
    handleUIMessage(msg, inFigmaCurrentNode);

    switch (msg.type) {
      case "LOGIN":
        {
          await figma.clientStorage.setAsync("authToken", "fake-token");
          figma.ui.postMessage({ type: "AUTH_TOKEN", token: "fake-token" });
          console.log("====run login====");
        }
        break;

      case "LOGOUT":
        {
          await figma.clientStorage.setAsync("authToken", null);
          figma.ui.postMessage({ type: "NO_AUTH" });
          console.log("====run logout====");
        }
        break;

      case "PRINT_TOKEN":
        {
          const token = await figma.clientStorage.getAsync("authToken");
          // figma.ui.postMessage({ type: "PRINT_TOKEN", token });
          console.log("====run print_token====", token);
        }
        break;

      case "search":
        {
          const {
            currentTab,
            query,
            caseSensitive,
            matchWholeWord,
            includeFills,
            includeStrokes,
            includeNormalFont,
            includeMissingFont,
            includeNormalComponent,
            includeExternalComponent,
          } = msg.payload;
          const nodesToSearch = figma.currentPage.selection.length
            ? figma.currentPage.selection
            : [figma.currentPage];

          const searchResults = await Promise.all(
            nodesToSearch.map((node) =>
              searchNodes(
                node,
                query,
                caseSensitive,
                matchWholeWord,
                currentTab,
                includeFills,
                includeStrokes,
                includeNormalFont,
                includeMissingFont,
                includeNormalComponent,
                includeExternalComponent
              )
            )
          );

          const flatSearchResults = searchResults.flat();

          figma.ui.postMessage({
            type: "search-results",
            payload: { category: currentTab, data: flatSearchResults },
          });

          console.log("====搜索结果是====", currentTab, flatSearchResults);
        }
        break;

      case "replace":
        {
          const {
            nodeId,
            newValue,
            query,
            caseSensitive,
            matchWholeWord,
            currentTab,
          } = msg.payload;
          const regexFlags = caseSensitive ? "g" : "gi";
          const regexPattern = matchWholeWord ? `\\b${query}\\b` : query;
          const regex = new RegExp(regexPattern, regexFlags);

          const targetNode = (await figma.getNodeByIdAsync(
            nodeId
          )) as SceneNode;
          if (!targetNode) {
            console.error("Node not found:", nodeId);
            return;
          }

          if (targetNode.type === "TEXT") {
            try {
              await figma.loadFontAsync(
                (targetNode as TextNode).fontName as FontName
              );
              targetNode.characters = targetNode.characters.replace(
                regex,
                newValue
              );
            } catch (error) {
              console.error("Failed to load font:", error);
              return;
            }
          } else if (targetNode.name) {
            targetNode.name = targetNode.name.replace(regex, newValue);
          }

          figma.ui.postMessage({
            type: "replace-done",
            payload: {
              nodeId: nodeId,
              currentTab: currentTab,
              newData:
                targetNode.type === "TEXT"
                  ? { characters: targetNode.characters }
                  : { name: targetNode.name },
            },
          });
        }
        break;

      case "replace-all":
        const { query, caseSensitive, matchWholeWord, newValue, currentTab } =
          msg.payload;
        const nodesToReplace =
          figma.currentPage.selection.length > 0
            ? figma.currentPage.selection
            : [figma.currentPage];
        await figma.loadAllPagesAsync();
        const modifiedNodes = await replaceAllNodes(
          nodesToReplace,
          query,
          caseSensitive,
          matchWholeWord,
          newValue,
          currentTab
        );
        figma.ui.postMessage({
          type: "search-results",
          payload: { category: currentTab, data: modifiedNodes },
        });
        break;

      case "select-all":
        console.log("后端收到信息:select-all", msg.payload);
        handleSelectAllNodes(msg.payload);
        break;

      case "get-searchlist":
        console.log(
          `后端收到信息: get-searchlist for tab ${msg.payload.currentTab}`
        );
        console.log("====开始获取searchlist====", msg.payload);
        try {
          let results;
          const nodesToProcess =
            figma.currentPage.selection.length > 0
              ? figma.currentPage.selection
              : [figma.currentPage];

          switch (msg.payload.currentTab) {
            case TabName.COLOR:
              const colorsData = await collectColors(
                nodesToProcess,
                msg.payload.includeFills,
                msg.payload.includeStrokes
              );
              results = {
                type: "searchlist",
                payload: {
                  dataType: "color-results",
                  data: colorsData,
                },
              };
              break;

            case TabName.FONT:
              const fontsData = await collectFonts(
                nodesToProcess,
                msg.payload.includeNormalFont,
                msg.payload.includeMissingFont
              );
              results = {
                type: "searchlist",
                payload: {
                  dataType: "font-results",
                  data: fontsData,
                },
              };
              break;

            case TabName.COMPONENT:
              const componentsData = await collectComponents(
                [figma.currentPage],
                msg.payload.includeNormalComponent,
                msg.payload.includeMissingComponent,
                msg.payload.includeExternalComponent
              );
              results = {
                type: "searchlist",
                payload: {
                  dataType: "component-results",
                  data: componentsData,
                },
              };
              break;

            case TabName.STYLE:
              const stylesData = await collectStyles();
              results = {
                type: "searchlist",
                payload: {
                  dataType: "style-results",
                  data: stylesData,
                },
              };
              break;

            default:
              throw new Error(`Unsupported tab: ${msg.payload.currentTab}`);
          }

          figma.ui.postMessage(results);
        } catch (error) {
          console.error("Error processing search list:", error);
          figma.ui.postMessage({
            type: "searchlist",
            payload: {
              dataType: "error",
              data: {},
            },
          });
        }
        break;

      default:
        console.log("Unhandled message type:", msg.type);
        break;
    }
  };
}
