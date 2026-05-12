import { getColorByCode, getDefaultColorCode } from "@/lib/palette";
import type { BeadPattern, PaletteColor } from "@/lib/types";

type Rgb = {
  r: number;
  g: number;
  b: number;
};

function buildPaletteRgb(palette: PaletteColor[]) {
  return palette.map((color) => ({
    code: color.code,
    rgb: {
      r: color.rgb[0],
      g: color.rgb[1],
      b: color.rgb[2]
    }
  }));
}

function distance(a: Rgb, b: Rgb) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

function findNearestColor(rgb: Rgb, paletteRgb: ReturnType<typeof buildPaletteRgb>) {
  const [firstColor, ...rest] = paletteRgb;

  if (!firstColor) {
    throw new Error("Palette is empty.");
  }

  let current = firstColor;
  let currentDistance = distance(rgb, current.rgb);

  for (const paletteEntry of rest) {
    const nextDistance = distance(rgb, paletteEntry.rgb);

    if (nextDistance < currentDistance) {
      current = paletteEntry;
      currentDistance = nextDistance;
    }
  }

  return current.code;
}

export function calculateStats(cells: string[]) {
  const colorCounts: Record<string, number> = {};

  for (const cell of cells) {
    colorCounts[cell] = (colorCounts[cell] ?? 0) + 1;
  }

  return {
    totalBeads: cells.length,
    colorCounts
  };
}

export async function convertImageToPattern(
  sourceImage: string,
  boardSize: number,
  palette: PaletteColor[],
  palettePresetId: string
): Promise<BeadPattern> {
  const image = new Image();
  image.src = sourceImage;
  await image.decode();

  const paletteRgb = buildPaletteRgb(palette);

  const canvas = document.createElement("canvas");
  canvas.width = boardSize;
  canvas.height = boardSize;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas context is unavailable.");
  }

  context.imageSmoothingEnabled = true;
  context.clearRect(0, 0, boardSize, boardSize);

  const aspect = Math.min(boardSize / image.width, boardSize / image.height);
  const drawWidth = image.width * aspect;
  const drawHeight = image.height * aspect;
  const offsetX = (boardSize - drawWidth) / 2;
  const offsetY = (boardSize - drawHeight) / 2;

  context.fillStyle = getColorByCode(getDefaultColorCode(palette))?.hex ?? "#ffffff";
  context.fillRect(0, 0, boardSize, boardSize);
  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

  const imageData = context.getImageData(0, 0, boardSize, boardSize).data;
  const cells: string[] = [];

  for (let index = 0; index < imageData.length; index += 4) {
    cells.push(
      findNearestColor({
        r: imageData[index] ?? 0,
        g: imageData[index + 1] ?? 0,
        b: imageData[index + 2] ?? 0
      }, paletteRgb)
    );
  }

  return {
    width: boardSize,
    height: boardSize,
    palette,
    palettePresetId,
    cells,
    sourceImage,
    stats: calculateStats(cells)
  };
}

export function remapPatternToPalette(pattern: BeadPattern, palette: PaletteColor[], palettePresetId: string): BeadPattern {
  const paletteRgb = buildPaletteRgb(palette);
  const colorLookup = new Map(pattern.palette.map((color) => [color.code, color]));
  const fallbackCode = getDefaultColorCode(palette);
  const cells = pattern.cells.map((colorCode) => {
    const sourceColor = colorLookup.get(colorCode) ?? getColorByCode(colorCode);

    if (!sourceColor) {
      return fallbackCode;
    }

    return findNearestColor(
      {
        r: sourceColor.rgb[0],
        g: sourceColor.rgb[1],
        b: sourceColor.rgb[2]
      },
      paletteRgb
    );
  });

  return {
    ...pattern,
    palette,
    palettePresetId,
    cells,
    stats: calculateStats(cells)
  };
}

export function clonePattern(pattern: BeadPattern): BeadPattern {
  return {
    ...pattern,
    cells: [...pattern.cells],
    stats: calculateStats(pattern.cells)
  };
}

export function updatePatternCell(pattern: BeadPattern, cellIndex: number, colorCode: string): BeadPattern {
  const nextCells = [...pattern.cells];
  nextCells[cellIndex] = colorCode;

  return {
    ...pattern,
    cells: nextCells,
    stats: calculateStats(nextCells)
  };
}

export function createPreviewDataUrl(pattern: BeadPattern, scale = 8) {
  const canvas = document.createElement("canvas");
  canvas.width = pattern.width * scale;
  canvas.height = pattern.height * scale;
  const context = canvas.getContext("2d");

  if (!context) {
    return "";
  }

  const paletteLookup = new Map(pattern.palette.map((color) => [color.code, color]));

  for (let row = 0; row < pattern.height; row += 1) {
    for (let column = 0; column < pattern.width; column += 1) {
      const cellIndex = row * pattern.width + column;
      const colorCode = pattern.cells[cellIndex] ?? getDefaultColorCode(pattern.palette);
      const color = paletteLookup.get(colorCode)?.hex ?? "#000000";

      context.fillStyle = color;
      context.fillRect(column * scale, row * scale, scale, scale);
    }
  }

  return canvas.toDataURL("image/png");
}