"use client";

import { useState } from "react";

import { HeroShowcase, type HeroStageId } from "@/components/hero-showcase";

type HeroStage = {
	id: HeroStageId;
	index: string;
	title: string;
	summary: string;
	detail: string;
};

const heroStages: HeroStage[] = [
	{
		id: "upload",
		index: "01",
		title: "Upload",
		summary: "拖入原图，立刻生成可转换输入。",
		detail: "适合人物、宠物、插画，先拿到一张干净的原始参考图。"
	},
	{
		id: "quantize",
		index: "02",
		title: "Quantize",
		summary: "自动压缩成有限色卡和固定网格。",
		detail: "把图像关系变成拼豆能落地的草稿，不需要手工先描一遍。"
	},
	{
		id: "edit",
		index: "03",
		title: "Edit",
		summary: "逐格修色，清理脏点和边缘。",
		detail: "在生成结果上继续微调，比从空白板子开始快得多。"
	},
	{
		id: "share",
		index: "04",
		title: "Share",
		summary: "把作品整理成可浏览的模板页。",
		detail: "后续接账号体系和云存储后，就能直接沉淀成作品库。"
	}
];

export function HeroExperience() {
	const [activeStage, setActiveStage] = useState<HeroStageId>("quantize");

	return (
		<>
			<div className="hero-column">
				<div className="hero-feature-panel panel">
					<div className="hero-feature-header">
						<p className="eyebrow">Workflow</p>
						<h2>从上传到分享，左边选阶段，右边直接看结果变化。</h2>
						<p className="hero-feature-body">把功能拆成 4 张产品卡，每一步都对应预览里的一个重点区域。</p>
					</div>

					<div aria-label="Hero workflow stages" className="hero-stage-list" role="tablist">
						{heroStages.map((stage) => {
							const isActive = stage.id === activeStage;

							return (
								<button
									aria-selected={isActive}
									className={isActive ? "hero-stage-card hero-stage-card-active" : "hero-stage-card"}
									key={stage.id}
									onClick={() => setActiveStage(stage.id)}
									onFocus={() => setActiveStage(stage.id)}
									onMouseEnter={() => setActiveStage(stage.id)}
									role="tab"
									type="button"
								>
									<span className="hero-stage-index">{stage.index}</span>
									<div className="hero-stage-copy">
										<div className="hero-stage-title-row">
											<strong>{stage.title}</strong>
											<span className="hero-stage-summary">{stage.summary}</span>
										</div>
										<p>{stage.detail}</p>
									</div>
								</button>
							);
						})}
					</div>
				</div>

				<div className="hero-actions">
					<a className="primary-button" href="#studio">
						上传并转换
					</a>
					<a className="ghost-button" href="#templates">
						浏览模板
					</a>
				</div>
			</div>

			<HeroShowcase activeStage={activeStage} />
		</>
	);
}