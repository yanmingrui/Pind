import Image from "next/image";

export type HeroStageId = "upload" | "quantize" | "edit" | "share";

const originalArtwork = "/images/hero-original.png";

const beadArtwork = "/images/hero-bead.png";

const stageLabels: Record<HeroStageId, string> = {
	upload: "Upload",
	quantize: "Quantize",
	edit: "Edit",
	share: "Share"
};

export function HeroShowcase({ activeStage }: { activeStage: HeroStageId }) {
	return (
		<div className="hero-showcase panel" data-active-stage={activeStage}>
			<div className="hero-showcase-caption">
				<p className="eyebrow">Preview</p>
				<h2>{stageLabels[activeStage]} 阶段正在预览里同步高亮。</h2>
				<p>左边切换工作流阶段，右边会强调当前应该关注的原图、映射、修色或分享结果。</p>
			</div>

			<div className="hero-stage-meter" aria-label="Active workflow stage">
				<span className={activeStage === "upload" ? "hero-stage-pill hero-stage-pill-active" : "hero-stage-pill"}>Upload</span>
				<span className={activeStage === "quantize" ? "hero-stage-pill hero-stage-pill-active" : "hero-stage-pill"}>Quantize</span>
				<span className={activeStage === "edit" ? "hero-stage-pill hero-stage-pill-active" : "hero-stage-pill"}>Edit</span>
				<span className={activeStage === "share" ? "hero-stage-pill hero-stage-pill-active" : "hero-stage-pill"}>Share</span>
			</div>

			<div className="hero-showcase-flow" aria-label="Original to bead style preview">
				<article className="hero-preview-card hero-preview-card-source">
					<span className="hero-preview-badge">原图</span>
					<Image alt="Original artwork sample" className="hero-preview-image" height={640} src={originalArtwork} unoptimized width={640} />
					<div className="hero-stage-icon hero-stage-icon-upload" aria-hidden="true">
						<span>↑</span>
					</div>
				</article>

				<div className="hero-preview-arrow" aria-hidden="true">
					<span>→</span>
				</div>

				<article className="hero-preview-card hero-preview-card-bead">
					<span className="hero-preview-badge">拼豆风格</span>
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
