import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { SavedPattern } from "@/lib/types";

const dataDirectory = path.join(process.cwd(), "data");
const dataFilePath = path.join(dataDirectory, "patterns.json");

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
  return JSON.parse(fileContents) as SavedPattern[];
}

export async function getPatternById(id: string) {
  const patterns = await listPatterns();
  return patterns.find((pattern) => pattern.id === id) ?? null;
}

export async function savePattern(pattern: SavedPattern) {
  const existingPatterns = await listPatterns();
  const nextPatterns = [pattern, ...existingPatterns].slice(0, 24);
  await writeFile(dataFilePath, JSON.stringify(nextPatterns, null, 2), "utf8");
  return pattern;
}