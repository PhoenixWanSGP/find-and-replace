// import { Message } from "@/types";
import { toggleHighlightFrame } from "./highlight";
import { Message } from "./types";

export function initializeUI() {
  figma.showUI(__html__, {
    height: 528,
    width: 400,
  });
}

export function handleUIMessage(
  msg: Message,
  inFigmaCurrentNode: string | null
) {
  switch (msg.type) {
    case "select-node":
      inFigmaCurrentNode = msg.payload.nodeId;
      if (inFigmaCurrentNode) {
        toggleHighlightFrame(inFigmaCurrentNode, true);
      } else {
        toggleHighlightFrame(inFigmaCurrentNode, false);
      }
      break;
    case "activate-view":
      if (inFigmaCurrentNode) {
        toggleHighlightFrame(inFigmaCurrentNode, true);
      }
      break;
    case "deactivate-view":
      if (inFigmaCurrentNode) {
        toggleHighlightFrame(inFigmaCurrentNode, false);
      }
      break;
    default:
      console.log("Unhandled message type:", msg.type);
      break;
  }
}
