"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { HeroShowcase, type HeroStageId } from "@/components/hero-showcase";

const stageIds: Array<{ id: HeroStageId; index: string }> = [
	{ id: "upload", index: "01" },
	{ id: "quantize", index: "02" },
	{ id: "edit", index: "03" },
	{ id: "share", index: "04" }
];

export function HeroExperience() {
	const [activeStage, setActiveStage] = useState<HeroStageId>("quantize");
	const t = useTranslations("HeroExperience");

	return (
		<>
			<div className="hero-column">
				<div className="hero-feature-panel panel">
					<div className="hero-feature-header">
						<p className="eyebrow">{t("eyebrow")}</p>
						<h2>{t("title")}</h2>
						<p className="hero-feature-body">{t("desc")}</p>
					</div>

					<div aria-label="Hero workflow stages" className="hero-stage-list" role="tablist">
						{stageIds.map((stage) => {
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
											<strong>{t(`stages.${stage.id}.title`)}</strong>
											<span className="hero-stage-summary">{t(`stages.${stage.id}.summary`)}</span>
										</div>
										<p>{t(`stages.${stage.id}.detail`)}</p>
									</div>
								</button>
							);
						})}
					</div>
				</div>

				<div className="hero-actions">
					<a className="primary-button" href="#studio">
						{t("upload")}
					</a>
					<a className="ghost-button" href="#templates">
						{t("browse")}
					</a>
				</div>
			</div>

			<HeroShowcase activeStage={activeStage} />
		</>
	);
}