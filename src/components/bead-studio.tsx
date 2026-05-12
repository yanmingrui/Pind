"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import {
  boardPresets,
  defaultPalettePresetId,
  getDefaultColorCode,
  getPaletteForPreset,
  getPalettePresetById,
  palettePresets
} from "@/lib/palette";
import { clonePattern, convertImageToPattern, createPreviewDataUrl, remapPatternToPalette, updatePatternCell } from "@/lib/beading";
import type { BeadPattern, SavedPattern } from "@/lib/types";

function createBlankPattern(size: number, palettePresetId: string): BeadPattern {
  const palette = getPaletteForPreset(palettePresetId);
  const blankColor = getDefaultColorCode(palette);

  return {
    width: size,
    height: size,
    palette,
    palettePresetId,
    cells: Array(size * size).fill(blankColor),
    stats: { totalBeads: 0, colorCounts: {} }
  };
}

type SaveState = {
  status: "idle" | "saving" | "saved" | "error";
  message?: string;
};

function PatternCanvas({ pattern, activeColor, onPaint }: { pattern: BeadPattern; activeColor: string; onPaint: (index: number) => void }) {
  const cellSize = pattern.width <= 24 ? 20 : pattern.width <= 32 ? 16 : 11;
  const paletteLookup = useMemo(() => new Map(pattern.palette.map((color) => [color.code, color])), [pattern.palette]);

  return (
    <div className="studio-grid-shell">
      <div
        className="studio-grid"
        style={{
          gridTemplateColumns: `repeat(${pattern.width}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${pattern.height}, ${cellSize}px)`
        }}
      >
        {pattern.cells.map((colorCode, index) => {
          const color = paletteLookup.get(colorCode)?.hex ?? "#000000";
          const isSelected = colorCode === activeColor;

          return (
            <button
              key={`${index}-${colorCode}`}
              aria-label={`Cell ${index + 1}`}
              className={isSelected ? "cell-button cell-button-selected" : "cell-button"}
              onClick={() => onPaint(index)}
              style={{ backgroundColor: color, width: cellSize, height: cellSize }}
              type="button"
            />
          );
        })}
      </div>
    </div>
  );
}

export function BeadStudio() {
  const t = useTranslations("BeadStudio");
  const [vendorId, setVendorId] = useState("artkal");
  const [title, setTitle] = useState("Sunset postcard");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("portrait, warm, beginner");
  const [boardSize, setBoardSize] = useState(24);
  const [palettePresetId, setPalettePresetId] = useState(defaultPalettePresetId);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [pattern, setPattern] = useState<BeadPattern>(() => createBlankPattern(24, defaultPalettePresetId));
  const [isBlank, setIsBlank] = useState(true);
  const [selectedColor, setSelectedColor] = useState(() => getDefaultColorCode(getPaletteForPreset(defaultPalettePresetId)));
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle" });
  const currentPalette = useMemo(() => getPaletteForPreset(palettePresetId), [palettePresetId]);
  const activePreset = useMemo(() => getPalettePresetById(palettePresetId), [palettePresetId]);
  const vendorOptions = useMemo(() => [{ id: "artkal", label: "Artkal" }], []);

  const usedColorStats = useMemo(() => {
    if (isBlank) {
      return [] as Array<{ code: string; count: number }>;
    }

    return pattern.palette
      .map((color) => ({
        code: color.code,
        count: pattern.stats.colorCounts[color.code] ?? 0
      }))
      .filter((entry) => entry.count > 0);
  }, [pattern, isBlank]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSourceImage(reader.result);
      }
    };

    reader.readAsDataURL(file);
  }

  async function handleGenerate() {
    if (!sourceImage) {
      setSaveState({ status: "error", message: t("messages.errNoImageUpload") });
      return;
    }

    setIsGenerating(true);
    setSaveState({ status: "idle" });

    try {
      const nextPattern = await convertImageToPattern(sourceImage, boardSize, currentPalette, palettePresetId);
      setPattern(nextPattern);
      setIsBlank(false);
      setSelectedColor(nextPattern.cells[0] ?? getDefaultColorCode(nextPattern.palette));
    } catch (error) {
      setSaveState({
        status: "error",
        message: error instanceof Error ? error.message : t("messages.errConvert")
      });
    } finally {
      setIsGenerating(false);
    }
  }

  function handlePaint(index: number) {
    if (!pattern) {
      return;
    }

    setPattern(updatePatternCell(pattern, index, selectedColor));
  }

  function handlePalettePresetChange(nextPalettePresetId: string) {
    const nextPalette = getPaletteForPreset(nextPalettePresetId);
    const nextDefaultColor = getDefaultColorCode(nextPalette);
    const nextPattern = remapPatternToPalette(pattern, nextPalette, nextPalettePresetId);

    setPalettePresetId(nextPalettePresetId);
    setPattern(isBlank ? createBlankPattern(boardSize, nextPalettePresetId) : nextPattern);
    setSelectedColor(nextPalette.some((color) => color.code === selectedColor) ? selectedColor : nextDefaultColor);
    setSaveState({ status: "idle" });
  }

  function handleReset() {
    if (!pattern) {
      return;
    }

    setPattern(clonePattern(pattern));
    setSaveState({ status: "idle" });
  }

  async function handleSave() {
    if (!pattern) {
      setSaveState({ status: "error", message: t("messages.errNoPattern") });
      return;
    }

    setSaveState({ status: "saving", message: t("messages.saving") });

    const payload = {
      title,
      description,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      previewDataUrl: createPreviewDataUrl(pattern),
      pattern
    };

    const response = await fetch("/api/patterns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setSaveState({ status: "error", message: t("messages.errSave") });
      return;
    }

    const saved = (await response.json()) as SavedPattern;
    setSaveState({
      status: "saved",
      message: t("messages.savedMsg", { id: saved.id })
    });
  }

  return (
    <section className="studio-section" id="studio">
      <div className="section-heading">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2>{t("title")}</h2>
        <p>{t("desc")}</p>
      </div>

      <div className="studio-layout">
        <div className="panel control-panel">
          <label className="field">
            <span>{t("fields.titleLabel")}</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>

          <label className="field">
            <span>{t("fields.descLabel")}</span>
            <textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>

          <label className="field">
            <span>{t("fields.tagsLabel")}</span>
            <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder={t("fields.tagsPlaceholder")} />
          </label>

          <label className="field">
            <span>{t("fields.uploadLabel")}</span>
            <input accept="image/*" onChange={handleFileChange} type="file" />
          </label>

          <label className="field">
            <span>{t("fields.boardSizeLabel")}</span>
            <select value={boardSize} onChange={(event) => {
              const s = Number.parseInt(event.target.value, 10);
              setBoardSize(s);
              if (isBlank) setPattern(createBlankPattern(s, palettePresetId));
            }}>
              {boardPresets.map((preset) => (
                <option key={preset} value={preset}>
                  {preset} x {preset}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>{t("fields.palettePresetLabel")}</span>
            <select value={palettePresetId} onChange={(event) => handlePalettePresetChange(event.target.value)}>
              {palettePresets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
            </select>
            <p className="muted palette-summary">{t("fields.palettePresetSummary", { label: activePreset.label, count: currentPalette.length })}</p>
          </label>

          <div className="actions-row">
            <button className="primary-button" onClick={handleGenerate} type="button">
              {isGenerating ? t("actions.generating") : t("actions.generate")}
            </button>
            <button className="ghost-button" onClick={handleSave} type="button">
              {t("actions.save")}
            </button>
            <button className="ghost-button" onClick={handleReset} type="button">
              {t("actions.refresh")}
            </button>
          </div>

          <div className="source-preview">
            {sourceImage ? (
              <Image alt="Uploaded source" height={640} src={sourceImage} unoptimized width={640} />
            ) : (
              <p>{t("messages.noImage")}</p>
            )}
          </div>

          <div className="status-line" data-status={saveState.status}>
            {saveState.message ?? t("messages.defaultHint")}
          </div>
        </div>

        <div className="panel canvas-panel">
          <div className="canvas-toolbar">
            <div>
              <p className="small-label">{t("canvas.size")}</p>
              <strong>{pattern.width} x {pattern.height}</strong>
            </div>
            <div>
              <p className="small-label">{t("canvas.total")}</p>
              <strong>{isBlank ? "—" : pattern.stats.totalBeads}</strong>
            </div>
            <div>
              <p className="small-label">{t("canvas.board")}</p>
              <strong>{isBlank ? "—" : `${Math.ceil(pattern.width / 29)} x ${Math.ceil(pattern.height / 29)}`}</strong>
            </div>
            <label className="toolbar-select">
              <span className="small-label">{t("fields.paintColorLabel")}</span>
              <select value={selectedColor} onChange={(event) => setSelectedColor(event.target.value)}>
                {pattern.palette.map((color) => (
                  <option key={color.code} value={color.code}>
                    {color.code}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {isBlank && (
            <p className="canvas-hint">{t("canvas.hint")}</p>
          )}

          <PatternCanvas activeColor={selectedColor} onPaint={handlePaint} pattern={pattern} />
        </div>

        <div className="panel stats-panel">
          <div className="section-heading compact">
            <p className="eyebrow">{t("stats.eyebrow")}</p>
            <h3>{t("stats.title")}</h3>
          </div>

          <label className="field stats-vendor-field">
            <span>{t("stats.vendorLabel")}</span>
            <select value={vendorId} onChange={(event) => setVendorId(event.target.value)}>
              {vendorOptions.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.label}
                </option>
              ))}
            </select>
          </label>

          <div className="stats-list">
            {usedColorStats.length > 0 ? (
              usedColorStats.map((entry) => (
                <div className="stats-item" key={entry.code}>
                  <strong>{entry.code}</strong>
                  <span>{t("stats.countLabel", { count: entry.count })}</span>
                </div>
              ))
            ) : (
              <p className="muted">{t("stats.empty")}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}