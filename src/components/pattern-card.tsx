import Image from "next/image";
import Link from "next/link";

import type { SavedPattern } from "@/lib/types";

export function PatternCard({ pattern }: { pattern: SavedPattern }) {
  return (
    <article className="pattern-card">
      <div className="pattern-thumb-shell">
        <Image alt={pattern.title} className="pattern-thumb" height={800} src={pattern.previewDataUrl} unoptimized width={800} />
      </div>
      <div className="pattern-copy">
        <p className="pattern-date">{new Date(pattern.createdAt).toLocaleDateString("zh-CN")}</p>
        <h3>{pattern.title}</h3>
        <p>{pattern.description}</p>
        <div className="tag-row">
          {pattern.tags.map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>
        <div className="pattern-meta-row">
          <span>
            {pattern.pattern.width} x {pattern.pattern.height}
          </span>
          <span>{pattern.pattern.stats.totalBeads} beads</span>
          <Link href={`/pattern/${pattern.id}`}>查看详情</Link>
        </div>
      </div>
    </article>
  );
}