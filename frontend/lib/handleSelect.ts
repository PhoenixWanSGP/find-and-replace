export async function handleSelectAllNodes(payload: { nodeIds: any }) {
  const { nodeIds } = payload;

  const nodes = await Promise.all(
    nodeIds.map(async (id: string) => {
      try {
        const node = await figma.getNodeByIdAsync(id);
        return node;
      } catch (error) {
        console.error("Failed to retrieve node:", error);
        return null;
      }
    })
  ).then((results) => results.filter((node) => node !== null));

  if (nodes.length === 0) {
    figma.notify("No nodes found with the provided IDs.");
    return;
  }

  figma.currentPage.selection = nodes;

  figma.viewport.scrollAndZoomIntoView(nodes);
  figma.notify("Selected all specified nodes.");
}
