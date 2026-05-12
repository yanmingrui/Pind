import type { PaletteColor } from "@/lib/types";

import paletteData from "../../data/artkal_m_series.json";
import presetData from "../../data/artkal_presets.json";

type RawPaletteColor = {
  code: string;
  series: string;
  name: string;
  name_zh: string;
  hex: string;
  rgb: [number, number, number];
};

type RawPalettePreset = {
  label: string;
  codes: string[] | null;
};

type Rgb = {
  r: number;
  g: number;
  b: number;
};

export const beadPalette: PaletteColor[] = (paletteData as RawPaletteColor[]).map((entry) => ({
  code: entry.code,
  series: entry.series,
  name: entry.name,
  nameZh: entry.name_zh,
  hex: entry.hex,
  rgb: [...entry.rgb] as [number, number, number]
}));

export const beadPaletteByCode = new Map(beadPalette.map((color) => [color.code, color]));

const allPaletteCodes = beadPalette.map((color) => color.code);

export const palettePresets = Object.entries(presetData as Record<string, RawPalettePreset>)
  .map(([id, preset]) => ({
    id,
    label: preset.label,
    codes: preset.codes ?? allPaletteCodes
  }))
  .sort((left, right) => Number.parseInt(left.id, 10) - Number.parseInt(right.id, 10));

export const defaultPalettePresetId = palettePresets[0]?.id ?? "221";

export const boardPresets = [16, 24, 32, 48];

export function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
}

function distance(a: Rgb, b: Rgb) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

export function getColorByCode(code: string) {
  return beadPaletteByCode.get(code);
}

export function getPalettePresetById(presetId: string) {
  return palettePresets.find((preset) => preset.id === presetId) ?? palettePresets[palettePresets.length - 1];
}

export function getPaletteForPreset(presetId: string) {
  const preset = getPalettePresetById(presetId);

  return preset.codes
    .map((code) => getColorByCode(code))
    .filter((color): color is PaletteColor => Boolean(color));
}

export function getDefaultColorCode(palette: PaletteColor[]) {
  return palette.find((color) => color.code === "H1")?.code ?? palette[0]?.code ?? beadPalette[0]?.code ?? "H1";
}

export function findNearestPaletteColorByRgb(rgb: Rgb, palette: PaletteColor[] = beadPalette) {
  const [firstColor, ...rest] = palette;

  if (!firstColor) {
    return undefined;
  }

  let current = firstColor;
  let currentDistance = distance(rgb, {
    r: firstColor.rgb[0],
    g: firstColor.rgb[1],
    b: firstColor.rgb[2]
  });

  for (const paletteEntry of rest) {
    const nextDistance = distance(rgb, {
      r: paletteEntry.rgb[0],
      g: paletteEntry.rgb[1],
      b: paletteEntry.rgb[2]
    });

    if (nextDistance < currentDistance) {
      current = paletteEntry;
      currentDistance = nextDistance;
    }
  }

  return current;
}

export function findNearestPaletteColorByHex(hex: string, palette: PaletteColor[] = beadPalette) {
  return findNearestPaletteColorByRgb(hexToRgb(hex), palette);
}

export function getContrastingTextColor(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.68 ? "#1d2935" : "#ffffff";
}