import Image from "next/image";

export type HeroStageId = "upload" | "quantize" | "edit" | "share";

const originalArtwork =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23f6d8b8'/%3E%3Cstop offset='100%25' stop-color='%23e98562'/%3E%3C/linearGradient%3E%3ClinearGradient id='hair' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%2327242f'/%3E%3Cstop offset='100%25' stop-color='%23483952'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='640' rx='72' fill='url(%23bg)'/%3E%3Ccircle cx='470' cy='140' r='74' fill='%23ffe8b4' opacity='0.8'/%3E%3Cpath d='M160 492c22-115 112-178 204-178 96 0 178 62 202 178' fill='%23cf6d57'/%3E%3Cpath d='M205 288c0-90 54-158 137-158 93 0 154 66 154 158 0 50-12 97-42 126-29 29-68 46-112 46-41 0-77-16-105-43-27-27-32-78-32-129Z' fill='%23f1c0a1'/%3E%3Cpath d='M214 282c0-121 74-182 173-182 91 0 145 58 145 158 0 32-8 59-11 68-14-36-46-74-95-82-58-10-108 6-147 53-17 20-27 48-30 72-22-17-35-43-35-87Z' fill='url(%23hair)'/%3E%3Cellipse cx='284' cy='300' rx='14' ry='10' fill='%23282533'/%3E%3Cellipse cx='405' cy='302' rx='14' ry='10' fill='%23282533'/%3E%3Cpath d='M302 372c22 16 42 22 69 22 24 0 46-7 63-22' fill='none' stroke='%23b85349' stroke-linecap='round' stroke-width='12'/%3E%3Cpath d='M260 257c23-18 45-26 78-29' fill='none' stroke='%23383b47' stroke-linecap='round' stroke-width='12'/%3E%3Cpath d='M374 231c25 3 47 13 65 28' fill='none' stroke='%23383b47' stroke-linecap='round' stroke-width='12'/%3E%3C/svg%3E";

const beadArtwork =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 576'%3E%3Crect width='576' height='576' rx='52' fill='%23f4ebdf'/%3E%3Cg transform='translate(48 48)'%3E%3Crect width='480' height='480' rx='36' fill='%23fff7ea'/%3E%3Cg stroke='%23efe1cb' stroke-width='1'%3E%3Cpath d='M0 40H480M0 80H480M0 120H480M0 160H480M0 200H480M0 240H480M0 280H480M0 320H480M0 360H480M0 400H480M0 440H480'/%3E%3Cpath d='M40 0V480M80 0V480M120 0V480M160 0V480M200 0V480M240 0V480M280 0V480M320 0V480M360 0V480M400 0V480M440 0V480'/%3E%3C/g%3E%3Cg%3E%3Crect x='280' y='80' width='40' height='40' rx='8' fill='%23c9b08f'/%3E%3Crect x='320' y='80' width='40' height='40' rx='8' fill='%23efc2c1'/%3E%3Crect x='360' y='80' width='40' height='40' rx='8' fill='%23c9b08f'/%3E%3Crect x='240' y='120' width='40' height='40' rx='8' fill='%238776bc'/%3E%3Crect x='280' y='120' width='40' height='40' rx='8' fill='%23efc2c1'/%3E%3Crect x='320' y='120' width='40' height='40' rx='8' fill='%23ef7b63'/%3E%3Crect x='360' y='120' width='40' height='40' rx='8' fill='%23efc2c1'/%3E%3Crect x='400' y='120' width='40' height='40' rx='8' fill='%238776bc'/%3E%3Crect x='200' y='160' width='40' height='40' rx='8' fill='%238d6448'/%3E%3Crect x='240' y='160' width='40' height='40' rx='8' fill='%23202020'/%3E%3Crect x='280' y='160' width='40' height='40' rx='8' fill='%23c9b08f'/%3E%3Crect x='320' y='160' width='40' height='40' rx='8' fill='%23efc2c1'/%3E%3Crect x='360' y='160' width='40' height='40' rx='8' fill='%23202020'/%3E%3Crect x='400' y='160' width='40' height='40' rx='8' fill='%238d6448'/%3E%3Crect x='160' y='200' width='40' height='40' rx='8' fill='%238d6448'/%3E%3Crect x='200' y='200' width='40' height='40' rx='8' fill='%23202020'/%3E%3Crect x='240' y='200' width='40' height='40' rx='8' fill='%23f5f1e8'/%3E%3Crect x='280' y='200' width='40' height='40' rx='8' fill='%23f1c0a1'/%3E%3Crect x='320' y='200' width='40' height='40' rx='8' fill='%23f1c0a1'/%3E%3Crect x='360' y='200' width='40' height='40' rx='8' fill='%23f5f1e8'/%3E%3Crect x='400' y='200' width='40' height='40' rx='8' fill='%23202020'/%3E%3Crect x='440' y='200' width='40' height='40' rx='8' fill='%238d6448'/%3E%3Crect x='160' y='240' width='40' height='40' rx='8' fill='%23202020'/%3E%3Crect x='200' y='240' width='40' height='40' rx='8' fill='%23f1c0a1'/%3E%3Crect x='240' y='240' width='40' height='40' rx='8' fill='%23f1c0a1'/%3E%3Crect x='280' y='240' width='40' height='40' rx='8' fill='%23f1c0a1'/%3E%3Crect x='320' y='240' width='40' height='40' rx='8' fill='%23f1c0a1'/%3E%3Crect x='360' y='240' width='40' height='40' rx='8' fill='%23f1c0a1'/%3E%3Crect x='400' y='240' width='40' height='40' rx='8' fill='%23f1c0a1'/%3E%3Crect x='440' y='240' width='40' height='40' rx='8' fill='%23202020'/%3E%3Crect x='160' y='280' width='40' height='40' rx='8' fill='%23202020'/%3E%3Crect x='200' y='280' width='40' height='40' rx='8' fill='%23f1c0a1'/%3E%3Crect x='240' y='280' width='40' height='40' rx='8' fill='%23202020'/%3E%3Crect x='280' y='280' width='40' height='40' rx='8' fill='%23f1c0a1'/%3E%3Crect x='320' y='280' width='40' height='40' rx='8' fill='%23f1c0a1'/%3E%3Crect x='360' y='280' width='40' height='40' rx='8' fill='%23202020'/%3E%3Crect x='400' y='280' width='40' height='40' rx='8' fill='%23f1c0a1'/%3E%3Crect x='440' y='280' width='40' height='40' rx='8' fill='%23202020'/%3E%3Crect x='160' y='320' width='40' height='40' rx='8' fill='%23202020'/%3E%3Crect x='200' y='320' width='40' height='40' rx='8' fill='%23f1c0a1'/%3E%3Crect x='240' y='320' width='40' height='40' rx='8' fill='%23f1c0a1'/%3E%3Crect x='280' y='320' width='40' height='40' rx='8' fill='%23f1c0a1'/%3E%3Crect x='320' y='320' width='40' height='40' rx='8' fill='%23f1c0a1'/%3E%3Crect x='360' y='320' width='40' height='40' rx='8' fill='%23f1c0a1'/%3E%3Crect x='400' y='320' width='40' height='40' rx='8' fill='%23f1c0a1'/%3E%3Crect x='440' y='320' width='40' height='40' rx='8' fill='%23202020'/%3E%3Crect x='200' y='360' width='40' height='40' rx='8' fill='%23cf6d57'/%3E%3Crect x='240' y='360' width='40' height='40' rx='8' fill='%23cf6d57'/%3E%3Crect x='280' y='360' width='40' height='40' rx='8' fill='%23cf6d57'/%3E%3Crect x='320' y='360' width='40' height='40' rx='8' fill='%23cf6d57'/%3E%3Crect x='360' y='360' width='40' height='40' rx='8' fill='%23cf6d57'/%3E%3Crect x='240' y='400' width='40' height='40' rx='8' fill='%23b85349'/%3E%3Crect x='280' y='400' width='40' height='40' rx='8' fill='%23b85349'/%3E%3Crect x='320' y='400' width='40' height='40' rx='8' fill='%23b85349'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

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
