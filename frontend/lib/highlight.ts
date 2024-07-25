export async function toggleHighlightFrame(
  nodeId: string | null,
  shouldCreate: boolean
) {
  try {
    await figma.loadAllPagesAsync();
    const frames = figma.currentPage.findAll(
      (frame) => frame.name === "Highlight Frame"
    );
    frames.forEach((frame) => {
      frame.remove();
    });

    if (!nodeId) {
      return;
    }

    if (shouldCreate) {
      const targetNode = (await figma.getNodeByIdAsync(
        nodeId
      )) as SceneNode | null;
      if (targetNode) {
        figma.viewport.scrollAndZoomIntoView([targetNode]);

        const padding = 10;

        const x = targetNode.absoluteTransform[0][2] - padding;
        const y = targetNode.absoluteTransform[1][2] - padding;
        const width = targetNode.width + padding * 2;
        const height = targetNode.height + padding * 2;

        const highlightFrame = figma.createRectangle();
        highlightFrame.name = "Highlight Frame";
        highlightFrame.resize(width, height);
        highlightFrame.x = x;
        highlightFrame.y = y;
        highlightFrame.fills = [];
        highlightFrame.strokes = [
          { type: "SOLID", color: { r: 1, g: 0, b: 0 } },
        ];
        highlightFrame.strokeWeight = 2;
        highlightFrame.strokeAlign = "OUTSIDE";
        figma.currentPage.appendChild(highlightFrame);
      } else {
        console.error("No node found: ", nodeId);
      }
    }
  } catch (error) {
    console.error("Error in toggleHighlightFrame:", error);
  }
}
