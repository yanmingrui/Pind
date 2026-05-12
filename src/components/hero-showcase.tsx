import Image from "next/image";
import { useTranslations } from "next-intl";

export type HeroStageId = "upload" | "quantize" | "edit" | "share";

const originalArtwork = "/images/hero-original.png";

const beadArtwork = "/images/hero-bead.png";

export function HeroShowcase({ activeStage }: { activeStage: HeroStageId }) {
	const t = useTranslations("HeroShowcase");
	const stageLabel = t(`stageLabel.${activeStage}`);

	return (
		<div className="hero-showcase panel" data-active-stage={activeStage}>
			<div className="hero-showcase-caption">
				<p className="eyebrow">{t("eyebrow")}</p>
				<h2>{t("title", { stage: stageLabel })}</h2>
				<p>{t("desc")}</p>
			</div>

			<div className="hero-stage-meter" aria-label="Active workflow stage">
				<span className={activeStage === "upload" ? "hero-stage-pill hero-stage-pill-active" : "hero-stage-pill"}>{t("stageLabel.upload")}</span>
				<span className={activeStage === "quantize" ? "hero-stage-pill hero-stage-pill-active" : "hero-stage-pill"}>{t("stageLabel.quantize")}</span>
				<span className={activeStage === "edit" ? "hero-stage-pill hero-stage-pill-active" : "hero-stage-pill"}>{t("stageLabel.edit")}</span>
				<span className={activeStage === "share" ? "hero-stage-pill hero-stage-pill-active" : "hero-stage-pill"}>{t("stageLabel.share")}</span>
			</div>

			<div className="hero-showcase-flow" aria-label="Original to bead style preview">
				<article className="hero-preview-card hero-preview-card-source">
					<span className="hero-preview-badge">{t("badgeOriginal")}</span>
					<Image alt="Original artwork sample" className="hero-preview-image" height={640} src={originalArtwork} unoptimized width={640} />
					<div className="hero-stage-icon hero-stage-icon-upload" aria-hidden="true">
						<span>↑</span>
					</div>
				</article>

				<div className="hero-preview-arrow" aria-hidden="true">
					<span>→</span>
				</div>

				<article className="hero-preview-card hero-preview-card-bead">
					<span className="hero-preview-badge">{t("badgeBead")}</span>
					<Image alt="Bead art style sample" className="hero-preview-image" height={576} src={beadArtwork} unoptimized width={576} />
					<div className="hero-stage-icon hero-stage-icon-edit" aria-hidden="true">
						<span>🖌️</span>
					</div>
					<div className="hero-stage-icon hero-stage-icon-share" aria-hidden="true">
						<span>❤️</span>
					</div>
				</article>
			</div>
		</div>
	);
}
