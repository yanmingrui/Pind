"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { boardPresets, beadPalette } from "@/lib/palette";
import { clonePattern, convertImageToPattern, createPreviewDataUrl, updatePatternCell } from "@/lib/beading";
import type { BeadPattern, SavedPattern } from "@/lib/types";

type SaveState = {
  status: "idle" | "saving" | "saved" | "error";
  message?: string;
};

function PatternCanvas({ pattern, activeColor, onPaint }: { pattern: BeadPattern; activeColor: number; onPaint: (index: number) => void }) {
  const cellSize = pattern.width <= 24 ? 20 : pattern.width <= 32 ? 16 : 11;

  return (
    <div className="studio-grid-shell">
      <div
        className="studio-grid"
        style={{
          gridTemplateColumns: `repeat(${pattern.width}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${pattern.height}, ${cellSize}px)`
        }}
      >
        {pattern.cells.map((colorId, index) => {
          const color = pattern.palette[colorId]?.hex ?? "#000000";
          const isSelected = colorId === activeColor;

          return (
            <button
              key={`${index}-${colorId}`}
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
  const [title, setTitle] = useState("Sunset postcard");
  const [description, setDescription] = useState("把照片先压成拼豆草稿，再手工修掉噪点和脏色。");
  const [tags, setTags] = useState("portrait, warm, beginner");
  const [boardSize, setBoardSize] = useState(24);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [pattern, setPattern] = useState<BeadPattern | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle" });

  const sortedStats = useMemo(() => {
    if (!pattern) {
      return [] as Array<{ name: string; count: number; hex: string; id: number }>;
    }

    return Object.entries(pattern.stats.colorCounts)
      .map(([key, value]) => {
        const id = Number.parseInt(key, 10);
        const color = pattern.palette[id];

        return {
          id,
          name: color?.name ?? `Color ${id}`,
          hex: color?.hex ?? "#000000",
          count: value,
        };
      })
      .sort((left, right) => right.count - left.count);
  }, [pattern]);

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
      setSaveState({ status: "error", message: "先上传一张图片，再生成拼豆方案。" });
      return;
    }

    setIsGenerating(true);
    setSaveState({ status: "idle" });

    try {
      const nextPattern = await convertImageToPattern(sourceImage, boardSize);
      setPattern(nextPattern);
      setSelectedColor(nextPattern.cells[0] ?? 0);
    } catch (error) {
      setSaveState({
        status: "error",
        message: error instanceof Error ? error.message : "图片转换失败。"
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

  function handleReset() {
    if (!pattern) {
      return;
    }

    setPattern(clonePattern(pattern));
    setSaveState({ status: "idle" });
  }

  async function handleSave() {
    if (!pattern) {
      setSaveState({ status: "error", message: "没有可保存的作品。" });
      return;
    }

    setSaveState({ status: "saving", message: "正在保存作品..." });

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
      setSaveState({ status: "error", message: "保存失败，请稍后再试。" });
      return;
    }

    const saved = (await response.json()) as SavedPattern;
    setSaveState({
      status: "saved",
      message: `作品已保存，可以在 /pattern/${saved.id} 查看。`
    });
  }

  return (
    <section className="studio-section" id="studio">
      <div className="section-heading">
        <p className="eyebrow">Converter + Editor</p>
        <h2>上传图片，几秒内生成可继续编辑的拼豆方案</h2>
        <p>
          这个 MVP 先做单图转换、网格上色和本地作品保存。后面再接评论、收藏和多人协作。
        </p>
      </div>

      <div className="studio-layout">
        <div className="panel control-panel">
          <label className="field">
            <span>作品标题</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>

          <label className="field">
            <span>一句描述</span>
            <textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>

          <label className="field">
            <span>标签</span>
            <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="portrait, cute, beginner" />
          </label>

          <label className="field">
            <span>上传图片</span>
            <input accept="image/*" onChange={handleFileChange} type="file" />
          </label>

          <label className="field">
            <span>板子尺寸</span>
            <select value={boardSize} onChange={(event) => setBoardSize(Number.parseInt(event.target.value, 10))}>
              {boardPresets.map((preset) => (
                <option key={preset} value={preset}>
                  {preset} x {preset}
                </option>
              ))}
            </select>
          </label>

          <div className="actions-row">
            <button className="primary-button" onClick={handleGenerate} type="button">
              {isGenerating ? "生成中..." : "生成拼豆方案"}
            </button>
            <button className="ghost-button" onClick={handleSave} type="button">
              保存作品
            </button>
            <button className="ghost-button" onClick={handleReset} type="button">
              刷新统计
            </button>
          </div>

          <div className="source-preview">
            {sourceImage ? (
              <Image alt="Uploaded source" height={640} src={sourceImage} unoptimized width={640} />
            ) : (
              <p>上传后会在这里显示原图。</p>
            )}
          </div>

          <div className="status-line" data-status={saveState.status}>
            {saveState.message ?? "生成后可直接在右侧网格上手工修图。"}
          </div>
        </div>

        <div className="panel canvas-panel">
          {pattern ? (
            <>
              <div className="canvas-toolbar">
                <div>
                  <p className="small-label">当前尺寸</p>
                  <strong>
                    {pattern.width} x {pattern.height}
                  </strong>
                </div>
                <div>
                  <p className="small-label">总颗数</p>
                  <strong>{pattern.stats.totalBeads}</strong>
                </div>
                <div>
                  <p className="small-label">建议底板</p>
                  <strong>{Math.ceil(pattern.width / 29)} x {Math.ceil(pattern.height / 29)}</strong>
                </div>
              </div>

              <PatternCanvas activeColor={selectedColor} onPaint={handlePaint} pattern={pattern} />

              <div className="palette-row">
                {beadPalette.map((color) => (
                  <button
                    key={color.id}
                    className={selectedColor === color.id ? "palette-chip palette-chip-active" : "palette-chip"}
                    onClick={() => setSelectedColor(color.id)}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    type="button"
                  >
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-canvas">
              <p className="eyebrow">Waiting For Source</p>
              <h3>先传图，再点“生成拼豆方案”</h3>
              <p>
                算法会把原图缩放到目标板子尺寸，再映射到固定拼豆色卡。生成后的每一格都可以继续手修。
              </p>
            </div>
          )}
        </div>

        <div className="panel stats-panel">
          <div className="section-heading compact">
            <p className="eyebrow">Palette Stats</p>
            <h3>用量统计</h3>
          </div>

          <div className="stats-list">
            {sortedStats.length > 0 ? (
              sortedStats.map((entry) => (
                <div className="stats-item" key={entry.id}>
                  <span className="swatch" style={{ backgroundColor: entry.hex }} />
                  <div>
                    <strong>{entry.name}</strong>
                    <p>{entry.count} beads</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="muted">生成方案后，这里会显示每种颜色需要多少颗豆。</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}