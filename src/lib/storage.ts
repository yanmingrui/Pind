import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { calculateStats } from "@/lib/beading";
import { defaultPalettePresetId, findNearestPaletteColorByHex, getColorByCode, getDefaultColorCode } from "@/lib/palette";
import type { SavedPattern } from "@/lib/types";

const dataDirectory = path.join(process.cwd(), "data");
const dataFilePath = path.join(dataDirectory, "patterns.json");

type LegacyPaletteColor = {
  id: number;
  name: string;
  hex: string;
};

type UnknownSavedPattern = SavedPattern & {
  pattern: SavedPattern["pattern"] & {
    palette?: Array<LegacyPaletteColor | SavedPattern["pattern"]["palette"][number]>;
    cells?: Array<number | string>;
    palettePresetId?: string;
  };
};

async function ensureDataFile() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(dataFilePath, "utf8");
  } catch {
    await writeFile(dataFilePath, "[]", "utf8");
  }
}

export async function listPatterns() {
  await ensureDataFile();
  const fileContents = await readFile(dataFilePath, "utf8");
  return (JSON.parse(fileContents) as UnknownSavedPattern[]).map(normalizeSavedPattern);
}

export async function getPatternById(id: string) {
  const patterns = await listPatterns();
  return patterns.find((pattern) => pattern.id === id) ?? null;
}

export async function savePattern(pattern: SavedPattern) {
  const existingPatterns = await listPatterns();
  const nextPatterns = [normalizeSavedPattern(pattern), ...existingPatterns].slice(0, 24);
  await writeFile(dataFilePath, JSON.stringify(nextPatterns, null, 2), "utf8");
  return pattern;
}

function normalizeSavedPattern(pattern: UnknownSavedPattern): SavedPattern {
  const rawPalette = Array.isArray(pattern.pattern.palette) ? pattern.pattern.palette : [];
  const fallbackCode = getDefaultColorCode([]);
  const legacyIndexToCode = new Map<number, string>();
  const normalizedPalette = rawPalette
    .map((color) => {
      if (typeof (color as { code?: string }).code === "string") {
        return getColorByCode((color as { code: string }).code) ?? null;
      }

      if (typeof (color as LegacyPaletteColor).id === "number" && typeof (color as LegacyPaletteColor).hex === "string") {
        const nearestColor = findNearestPaletteColorByHex((color as LegacyPaletteColor).hex);

        if (nearestColor) {
          legacyIndexToCode.set((color as LegacyPaletteColor).id, nearestColor.code);
        }

        return nearestColor ?? null;
      }

      return null;
    })
    .filter((color): color is NonNullable<typeof color> => Boolean(color));
  const normalizedCells = Array.isArray(pattern.pattern.cells)
    ? pattern.pattern.cells.map((cell) => {
        if (typeof cell === "string") {
          return getColorByCode(cell)?.code ?? fallbackCode;
        }

        if (typeof cell === "number") {
          return legacyIndexToCode.get(cell) ?? fallbackCode;
        }

        return fallbackCode;
      })
    : [];
  const paletteCodes = new Set(normalizedCells);
  const resolvedPalette = normalizedPalette.length > 0
    ? normalizedPalette
    : [...paletteCodes]
        .map((code) => getColorByCode(code))
        .filter((color): color is NonNullable<typeof color> => Boolean(color));

  return {
    ...pattern,
    pattern: {
      ...pattern.pattern,
      palette: resolvedPalette,
      palettePresetId: typeof pattern.pattern.palettePresetId === "string" ? pattern.pattern.palettePresetId : defaultPalettePresetId,
      cells: normalizedCells,
      stats: calculateStats(normalizedCells)
    }
  };
}