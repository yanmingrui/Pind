import { getTranslations } from "next-intl/server";

import { PatternCard } from "@/components/pattern-card";
import { Link } from "@/i18n/navigation";
import { listPatterns } from "@/lib/storage";

export default async function TemplatesPage() {
	const patterns = await listPatterns();
	const t = await getTranslations("TemplatesPage");

	return (
		<main className="page-shell">
			<section className="gallery-section" id="templates">
				<div className="section-heading">
					<p className="eyebrow">{t("eyebrow")}</p>
					<h2>{t("title")}</h2>
					<p>{t("desc")}</p>
				</div>

				{patterns.length > 0 ? (
					<div className="gallery-grid">
						{patterns.map((pattern) => (
							<PatternCard key={pattern.id} pattern={pattern} />
						))}
					</div>
				) : (
					<div className="empty-gallery panel">
						<p>
							{t.rich("empty", {
								editorLink: (chunks) => <Link href="/">{chunks}</Link>
							})}
						</p>
					</div>
				)}
			</section>
		</main>
	);
}
