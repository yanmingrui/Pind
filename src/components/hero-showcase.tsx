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
					<div className="hero-stage-overlay hero-stage-overlay-upload">
						<span className="hero-overlay-chip">Source Ready</span>
						<p>原图区域被点亮，表示当前先确认输入图片是否适合转换。</p>
					</div>
				</article>

				<div className="hero-preview-arrow" aria-hidden="true">
					<span>→</span>
					<div className="hero-stage-overlay hero-stage-overlay-quantize">
						<span className="hero-overlay-chip">Palette Map</span>
						<p>这里强调颜色压缩和网格映射，是自动生成草稿的核心步骤。</p>
					</div>
				</div>

				<article className="hero-preview-card hero-preview-card-bead">
					<span className="hero-preview-badge">拼豆风格</span>
					<Image alt="Bead art style sample" className="hero-preview-image" height={576} src={beadArtwork} unoptimized width={576} />
					<div className="hero-stage-overlay hero-stage-overlay-edit">
						<span className="hero-overlay-chip">Edit Grid</span>
						<p>进入修图阶段后，重点从整体像不像，切到单格能不能继续修细节。</p>
					</div>
					<div className="hero-stage-overlay hero-stage-overlay-share">
						<span className="hero-overlay-chip">Share Ready</span>
						<p>最后把结果包装成可浏览模板，方便继续保存、展示和复用。</p>
					</div>
				</article>
			</div>
		</div>
	);
}
