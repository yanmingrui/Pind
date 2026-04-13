export type PaletteColor = {
  id: number;
  name: string;
  hex: string;
};

export type PatternStats = {
  totalBeads: number;
  colorCounts: Record<number, number>;
};

export type BeadPattern = {
  width: number;
  height: number;
  palette: PaletteColor[];
  cells: number[];
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