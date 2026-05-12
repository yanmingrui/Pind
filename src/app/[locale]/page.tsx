import { getTranslations } from "next-intl/server";

import { BeadStudio } from "@/components/bead-studio";
import { HeroExperience } from "@/components/hero-experience";
import { PatternCard } from "@/components/pattern-card";
import { Link } from "@/i18n/navigation";
import { listPatterns } from "@/lib/storage";

export default async function HomePage() {
	const patterns = await listPatterns();
	const t = await getTranslations("HomePage");

	return (
		<main className="page-shell">
			<section className="hero-section">
				<HeroExperience />
			</section>

			<section className="story-strip" id="tutorial">
				<div className="story-card">
					<p className="eyebrow">{t("story.step1.eyebrow")}</p>
					<h3>{t("story.step1.title")}</h3>
					<p>{t("story.step1.desc")}</p>
				</div>
				<div className="story-card">
					<p className="eyebrow">{t("story.step2.eyebrow")}</p>
					<h3>{t("story.step2.title")}</h3>
					<p>{t("story.step2.desc")}</p>
				</div>
				<div className="story-card">
					<p className="eyebrow">{t("story.step3.eyebrow")}</p>
					<h3>{t("story.step3.title")}</h3>
					<p>{t("story.step3.desc")}</p>
				</div>
			</section>

			<BeadStudio />

			<section className="gallery-section" id="templates">
				<div className="section-heading">
					<p className="eyebrow">{t("gallery.eyebrow")}</p>
					<h2>{t("gallery.title")}</h2>
					<p>{t("gallery.desc")}</p>
				</div>

				{patterns.length > 0 ? (
					<div className="gallery-grid">
						{patterns.map((pattern) => (
							<PatternCard key={pattern.id} pattern={pattern} />
						))}
					</div>
				) : (
					<div className="empty-gallery panel">
						<p>{t("gallery.empty")}</p>
					</div>
				)}
			</section>

			<footer className="footer-strip">
				<div>
					<p className="eyebrow">{t("footer.eyebrow")}</p>
					<h3>{t("footer.title")}</h3>
				</div>
				<div className="footer-links">
					<span>{t("footer.items.login")}</span>
					<span>{t("footer.items.like")}</span>
					<span>{t("footer.items.storage")}</span>
					<span>{t("footer.items.palette")}</span>
				</div>
				{patterns[0] ? <Link href={`/pattern/${patterns[0].id}`}>{t("footer.openLatest")}</Link> : null}
			</footer>
		</main>
	);
}
