export type PaletteColor = {
  code: string;
  series: string;
  name: string;
  nameZh: string;
  hex: string;
  rgb: [number, number, number];
};

export type PalettePreset = {
  id: string;
  label: string;
  codes: string[];
};

export type PatternStats = {
  totalBeads: number;
  colorCounts: Record<string, number>;
};

export type BeadPattern = {
  width: number;
  height: number;
  palette: PaletteColor[];
  palettePresetId: string;
  cells: string[];
  sourceImage?: string;
  stats: PatternStats;
};

export type SavedPattern = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  previewDataUrl: string;
  pattern: BeadPattern;
};