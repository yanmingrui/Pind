import Image from "next/image";
import { notFound } from "next/navigation";

import { getPatternById } from "@/lib/storage";

export default async function PatternDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pattern = await getPatternById(id);

  if (!pattern) {
    notFound();
  }

  const stats = Object.entries(pattern.pattern.stats.colorCounts)
    .map(([key, value]) => ({
      id: Number.parseInt(key, 10),
      count: value,
      color: pattern.pattern.palette[Number.parseInt(key, 10)]
    }))
    .sort((left, right) => right.count - left.count);

  return (
    <main className="detail-page">
      <section className="detail-hero panel">
        <div className="detail-copy">
          <p className="eyebrow">Pattern Detail</p>
          <h1>{pattern.title}</h1>
          <p>{pattern.description}</p>
          <div className="tag-row">
            {pattern.tags.map((tag) => (
              <span className="tag-pill" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <div className="detail-metrics">
            <div>
              <span>尺寸</span>
              <strong>
                {pattern.pattern.width} x {pattern.pattern.height}
              </strong>
            </div>
            <div>
              <span>总颗数</span>
              <strong>{pattern.pattern.stats.totalBeads}</strong>
            </div>
            <div>
              <span>创建时间</span>
              <strong>{new Date(pattern.createdAt).toLocaleString("zh-CN")}</strong>
            </div>
          </div>
        </div>

        <div className="detail-preview-shell">
          <Image alt={pattern.title} className="detail-preview" height={960} src={pattern.previewDataUrl} unoptimized width={960} />
        </div>
      </section>

      <section className="detail-columns">
        <div className="panel">
          <p className="eyebrow">Color Breakdown</p>
          <h2>颜色用量</h2>
          <div className="stats-list">
            {stats.map((entry) => (
              <div className="stats-item" key={entry.id}>
                <span className="swatch" style={{ backgroundColor: entry.color?.hex ?? "#000000" }} />
                <div>
                  <strong>{entry.color?.name ?? entry.id}</strong>
                  <p>{entry.count} beads</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">Source Data</p>
          <h2>作品 JSON 片段</h2>
          <pre className="code-block">
            {JSON.stringify(
              {
                width: pattern.pattern.width,
                height: pattern.pattern.height,
                cells: pattern.pattern.cells.slice(0, 48),
                totalBeads: pattern.pattern.stats.totalBeads
              },
              null,
              2
            )}
          </pre>
        </div>
      </section>
    </main>
  );
}