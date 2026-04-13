import type { PaletteColor } from "@/lib/types";

export const beadPalette: PaletteColor[] = [
  { id: 0, name: "Porcelain", hex: "#f5f1e8" },
  { id: 1, name: "Jet", hex: "#202020" },
  { id: 2, name: "Cherry", hex: "#d74844" },
  { id: 3, name: "Coral", hex: "#ef7b63" },
  { id: 4, name: "Marigold", hex: "#f0b542" },
  { id: 5, name: "Lime", hex: "#95b845" },
  { id: 6, name: "Pine", hex: "#427b58" },
  { id: 7, name: "Lagoon", hex: "#51a6b6" },
  { id: 8, name: "Ocean", hex: "#2d5f9a" },
  { id: 9, name: "Lavender", hex: "#8776bc" },
  { id: 10, name: "Berry", hex: "#98517b" },
  { id: 11, name: "Cocoa", hex: "#8d6448" },
  { id: 12, name: "Blush", hex: "#efc2c1" },
  { id: 13, name: "Sand", hex: "#c9b08f" },
  { id: 14, name: "Mist", hex: "#bfc5d2" }
];

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