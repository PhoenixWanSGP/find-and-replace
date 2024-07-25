import { FontInfo, ComponentInfo, StyleInfo } from "@/types";

export async function collectColors(
  nodes: any,
  includeFills: boolean,
  includeStrokes: boolean
) {
  await figma.loadAllPagesAsync();
  const colorSet = new Set<{
    color: { r: number; g: number; b: number; a: number };
    key: string;
  }>();

  function processNode(node: any) {
    const addColor = (colorInfo: any, opacity: number) => {
      const { r, g, b } = colorInfo;
      const a = opacity !== undefined ? opacity : 1;
      const rgbaObject = { r, g, b, a };
      const rgbaString = `rgba(${r}, ${g}, ${b}, ${a})`;
      colorSet.add({ color: rgbaObject, key: rgbaString });
    };

    if ("fills" in node && Array.isArray(node.fills) && includeFills) {
      node.fills.forEach((fill: any) => {
        if (fill.type === "SOLID" && fill.visible !== false) {
          const opacity = fill.opacity !== undefined ? fill.opacity : 1;
          addColor(fill.color, opacity);
        }
      });
    }

    if ("strokes" in node && Array.isArray(node.strokes) && includeStrokes) {
      node.strokes.forEach((stroke: any) => {
        if (stroke.type === "SOLID" && stroke.visible !== false) {
          const opacity = stroke.opacity !== undefined ? stroke.opacity : 1;
          addColor(stroke.color, opacity);
        }
      });
    }

    if ("children" in node) {
      node.children.forEach(processNode);
    }
  }

  nodes.forEach(processNode);

  const uniqueColors = new Map<
    string,
    { r: number; g: number; b: number; a: number }
  >();
  colorSet.forEach((item) => {
    if (!uniqueColors.has(item.key)) {
      uniqueColors.set(item.key, item.color);
    }
  });

  const brightness = (r: number, g: number, b: number) =>
    r * 255 * 0.299 + g * 255 * 0.587 + b * 255 * 0.114;

  const sortedColors = Array.from(uniqueColors.values()).sort(
    (colorA, colorB) => {
      const brightnessA = brightness(colorA.r, colorA.g, colorA.b);
      const brightnessB = brightness(colorB.r, colorB.g, colorB.b);
      if (brightnessA === brightnessB) {
        return colorB.a - colorA.a;
      }
      return brightnessB - brightnessA;
    }
  );

  return sortedColors;
}

export async function collectFonts(
  nodes: any,
  includeNormalFont: boolean,
  includeMissingFont: boolean
): Promise<FontInfo[]> {
  const textNodes = nodes.flatMap((node: any) =>
    "findAll" in node ? node.findAll((n: any) => n.type === "TEXT") : []
  ) as TextNode[];

  const fontsUsed = textNodes
    .map((node) => {
      if (typeof node.fontName !== "symbol") {
        return {
          fontFamily: (node.fontName as FontName).family,
          fontStyle: (node.fontName as FontName).style,
          isMissing: node.hasMissingFont,
        };
      }
      return undefined;
    })
    .filter(
      (fontInfo): fontInfo is FontInfo =>
        fontInfo !== undefined &&
        ((fontInfo.isMissing && includeMissingFont) ||
          (!fontInfo.isMissing && includeNormalFont))
    )
    .reduce<FontInfo[]>((uniqueFonts, fontInfo) => {
      const fontExists = uniqueFonts.some(
        (existingFont) =>
          existingFont.fontFamily === fontInfo.fontFamily &&
          existingFont.fontStyle === fontInfo.fontStyle &&
          existingFont.isMissing === fontInfo.isMissing
      );
      if (!fontExists) {
        uniqueFonts.push(fontInfo);
      }
      return uniqueFonts;
    }, []);

  fontsUsed.sort((a, b) => {
    if (a.isMissing === false && b.isMissing === true) return -1;
    if (a.isMissing === true && b.isMissing === false) return 1;
    if (a.fontFamily < b.fontFamily) return -1;
    if (a.fontFamily > b.fontFamily) return 1;
    if (a.fontStyle < b.fontStyle) return -1;
    if (a.fontStyle > b.fontStyle) return 1;
    return 0;
  });

  return fontsUsed;
}

export async function collectComponents(
  nodes: any[],
  includeNormalComponent: boolean,
  includeMissingComponent: boolean,
  includeExternalComponent: boolean
): Promise<ComponentInfo[]> {
  const componentNodes = nodes.flatMap((node: any) =>
    "findAll" in node
      ? node.findAll(
          (n: any) => n.type === "COMPONENT" || n.type === "COMPONENT_SET"
        )
      : []
  ) as (ComponentNode | ComponentSetNode)[];

  const currentPageComponentIds = new Set(
    componentNodes.map((comp: any) => comp.id)
  );

  const componentsUsed: ComponentInfo[] = [];

  const allInstances = figma.currentPage.findAll(
    (n: any) => n.type === "INSTANCE"
  );

  for (const instance of allInstances) {
    if ("getMainComponentAsync" in instance) {
      const mainComponent = await instance.getMainComponentAsync();
      if (mainComponent) {
        let isMissing = false;
        let isExternal = false;

        if (!currentPageComponentIds.has(mainComponent.id)) {
          isMissing = true;
          if (mainComponent.remote) {
            isMissing = false;
            isExternal = true;
          }
        } else if (!mainComponent.parent) {
          isMissing = true;
        }

        if (
          (includeNormalComponent && !isMissing && !isExternal) ||
          (includeMissingComponent && isMissing) ||
          (includeExternalComponent && isExternal)
        ) {
          const componentToAdd = {
            id: mainComponent.id,
            name: mainComponent.name,
            description: mainComponent.description || "No description",
            isMissing,
            isExternal,
          };
          if (
            !componentsUsed.some(
              (component) => component.id === mainComponent.id
            )
          ) {
            componentsUsed.push(componentToAdd);
          }
        }
      } else {
        if (includeMissingComponent) {
          const specialComponentId = "missing-main-component";
          if (
            !componentsUsed.some(
              (component) => component.id === specialComponentId
            )
          ) {
            componentsUsed.push({
              id: specialComponentId,
              name: "Missing Main Component",
              description: "This instance has no main component.",
              isMissing: true,
              isExternal: false,
            });
          }
        }
      }
    }
  }

  componentNodes.forEach((node) => {
    let isMissing = false;
    let isExternal = false;

    if (!componentsUsed.some((component) => component.id === node.id)) {
      if (
        (includeNormalComponent && !isMissing && !isExternal) ||
        (includeMissingComponent && isMissing) ||
        (includeExternalComponent && isExternal)
      ) {
        componentsUsed.push({
          id: node.id,
          name: node.name,
          description: node.description || "",
          isMissing,
          isExternal,
        });
      }
    }
  });

  componentsUsed.sort((a, b) => {
    if (!a.isMissing && b.isMissing) return -1;
    if (a.isMissing && !b.isMissing) return 1;
    if (!a.isExternal && b.isExternal) return -1;
    if (a.isExternal && !b.isExternal) return 1;
    return a.name.localeCompare(b.name);
  });

  return componentsUsed;
}

export async function collectStyles(): Promise<StyleInfo[]> {
  const paintStyles = await figma.getLocalPaintStylesAsync();
  const textStyles = await figma.getLocalTextStylesAsync();

  const stylesUsed: StyleInfo[] = [];

  paintStyles.forEach((style) => {
    stylesUsed.push({
      id: style.id,
      styleType: "PaintStyle",
      name: style.name,
      description: style.description || "",
      properties: {
        colors: style.paints
          .map((paint: SolidPaint | GradientPaint | ImagePaint | any) => {
            if (paint.type === "SOLID") {
              return {
                r: paint.color.r,
                g: paint.color.g,
                b: paint.color.b,
                a: paint.opacity || 1,
              };
            }
            return null;
          })
          .filter((color: any) => color !== null),
      },
    });
  });

  textStyles.forEach((style) => {
    stylesUsed.push({
      id: style.id,
      styleType: "TextStyle",
      name: style.name,
      description: style.description || "",
      properties: {
        fontFamily: style.fontName.family,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
      },
    });
  });

  return stylesUsed;
}
