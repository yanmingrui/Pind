import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, getFormatter } from "next-intl/server";

import { getPatternById } from "@/lib/storage";

export default async function PatternDetailPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
	const { id, locale } = await params;
	const pattern = await getPatternById(id);

	if (!pattern) {
		notFound();
	}

	const t = await getTranslations("PatternDetail");
	const format = await getFormatter({ locale });
	const paletteLookup = new Map(pattern.pattern.palette.map((color) => [color.code, color]));

	const stats = Object.entries(pattern.pattern.stats.colorCounts)
		.map(([key, value]) => ({
			code: key,
			count: value,
			color: paletteLookup.get(key)
		}))
		.sort((left, right) => right.count - left.count);

	return (
		<main className="detail-page">
			<section className="detail-hero panel">
				<div className="detail-copy">
					<p className="eyebrow">{t("eyebrow")}</p>
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
							<span>{t("size")}</span>
							<strong>
								{pattern.pattern.width} x {pattern.pattern.height}
							</strong>
						</div>
						<div>
							<span>{t("total")}</span>
							<strong>{pattern.pattern.stats.totalBeads}</strong>
						</div>
						<div>
							<span>{t("createdAt")}</span>
							<strong>
								{format.dateTime(new Date(pattern.createdAt), { dateStyle: "medium", timeStyle: "short" })}
							</strong>
						</div>
					</div>
				</div>

				<div className="detail-preview-shell">
					<Image alt={pattern.title} className="detail-preview" height={960} src={pattern.previewDataUrl} unoptimized width={960} />
				</div>
			</section>

			<section className="detail-columns">
				<div className="panel">
					<p className="eyebrow">{t("colorBreakdown.eyebrow")}</p>
					<h2>{t("colorBreakdown.title")}</h2>
					<div className="stats-list">
						{stats.map((entry) => (
							<div className="stats-item" key={entry.code}>
								<span className="swatch" style={{ backgroundColor: entry.color?.hex ?? "#000000" }} />
								<div>
									<strong>{entry.color?.name ?? entry.code}</strong>
									<p>{entry.code}</p>
									<p>{entry.count} beads</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="panel">
					<p className="eyebrow">{t("sourceData.eyebrow")}</p>
					<h2>{t("sourceData.title")}</h2>
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
