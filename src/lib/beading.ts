import { beadPalette, hexToRgb } from "@/lib/palette";
import type { BeadPattern } from "@/lib/types";

type Rgb = {
  r: number;
  g: number;
  b: number;
};

const paletteRgb = beadPalette.map((color) => ({
  id: color.id,
  rgb: hexToRgb(color.hex)
}));

function distance(a: Rgb, b: Rgb) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

function findNearestColor(rgb: Rgb) {
  let current = paletteRgb[0];
  let currentDistance = distance(rgb, current.rgb);

  for (const paletteEntry of paletteRgb.slice(1)) {
    const nextDistance = distance(rgb, paletteEntry.rgb);

    if (nextDistance < currentDistance) {
      current = paletteEntry;
      currentDistance = nextDistance;
    }
  }

  return current.id;
}

export function calculateStats(cells: number[]) {
  const colorCounts: Record<number, number> = {};

  for (const cell of cells) {
    colorCounts[cell] = (colorCounts[cell] ?? 0) + 1;
  }

  return {
    totalBeads: cells.length,
    colorCounts
  };
}

export async function convertImageToPattern(sourceImage: string, boardSize: number): Promise<BeadPattern> {
  const image = new Image();
  image.src = sourceImage;
  await image.decode();

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

  context.fillStyle = "#f5f1e8";
  context.fillRect(0, 0, boardSize, boardSize);
  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

  const imageData = context.getImageData(0, 0, boardSize, boardSize).data;
  const cells: number[] = [];

  for (let index = 0; index < imageData.length; index += 4) {
    cells.push(
      findNearestColor({
        r: imageData[index] ?? 0,
        g: imageData[index + 1] ?? 0,
        b: imageData[index + 2] ?? 0
      })
    );
  }

  return {
    width: boardSize,
    height: boardSize,
    palette: beadPalette,
    cells,
    sourceImage,
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

export function updatePatternCell(pattern: BeadPattern, cellIndex: number, colorId: number): BeadPattern {
  const nextCells = [...pattern.cells];
  nextCells[cellIndex] = colorId;

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

  for (let row = 0; row < pattern.height; row += 1) {
    for (let column = 0; column < pattern.width; column += 1) {
      const cellIndex = row * pattern.width + column;
      const colorId = pattern.cells[cellIndex] ?? 0;
      const color = pattern.palette[colorId]?.hex ?? "#000000";

      context.fillStyle = color;
      context.fillRect(column * scale, row * scale, scale, scale);
    }
  }

  return canvas.toDataURL("image/png");
}