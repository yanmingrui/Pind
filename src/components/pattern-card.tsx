import Image from "next/image";
import { useTranslations, useFormatter } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { SavedPattern } from "@/lib/types";

export function PatternCard({ pattern }: { pattern: SavedPattern }) {
  const t = useTranslations("PatternCard");
  const format = useFormatter();

  return (
    <article className="pattern-card">
      <div className="pattern-thumb-shell">
        <Image alt={pattern.title} className="pattern-thumb" height={800} src={pattern.previewDataUrl} unoptimized width={800} />
      </div>
      <div className="pattern-copy">
        <p className="pattern-date">{format.dateTime(new Date(pattern.createdAt), { dateStyle: "medium" })}</p>
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
          <Link href={`/pattern/${pattern.id}`}>{t("viewDetail")}</Link>
        </div>
      </div>
    </article>
  );
}