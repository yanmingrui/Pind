import Link from "next/link";

import { BeadStudio } from "@/components/bead-studio";
import { HeroExperience } from "@/components/hero-experience";
import { PatternCard } from "@/components/pattern-card";
import { listPatterns } from "@/lib/storage";

export default async function HomePage() {
	const patterns = await listPatterns();

	return (
		<main className="page-shell">
			<section className="hero-section">
				<HeroExperience />
			</section>

			<section className="story-strip" id="tutorial">
				<div className="story-card">
					<p className="eyebrow">Step 1</p>
					<h3>上传图片</h3>
					<p>先上传人物、宠物或插画，站点会在浏览器内做缩放和颜色映射。</p>
				</div>
				<div className="story-card">
					<p className="eyebrow">Step 2</p>
					<h3>生成草稿</h3>
					<p>按板子尺寸压缩成固定网格，并映射到有限的拼豆色卡，生成可编辑初稿。</p>
				</div>
				<div className="story-card">
					<p className="eyebrow">Step 3</p>
					<h3>继续手修</h3>
					<p>在每一格上改色，手工抹掉脏点，同时查看每种颜色的用量统计。</p>
				</div>
			</section>

			<BeadStudio />

			<section className="gallery-section" id="templates">
				<div className="section-heading">
					<p className="eyebrow">Recent Patterns</p>
					<h2>最近保存的作品</h2>
					<p>这里直接读取本地 JSON 数据，方便你先把编辑器和分享链路跑通。</p>
				</div>

				{patterns.length > 0 ? (
					<div className="gallery-grid">
						{patterns.map((pattern) => (
							<PatternCard key={pattern.id} pattern={pattern} />
						))}
					</div>
				) : (
					<div className="empty-gallery panel">
						<p>还没有作品。先在上面的编辑器生成并保存一个图案。</p>
					</div>
				)}
			</section>

			<footer className="footer-strip">
				<div>
					<p className="eyebrow">Next Up</p>
					<h3>下一步适合接入的能力</h3>
				</div>
				<div className="footer-links">
					<span>用户登录</span>
					<span>点赞收藏</span>
					<span>云端对象存储</span>
					<span>更多真实拼豆色卡</span>
				</div>
				{patterns[0] ? <Link href={`/pattern/${patterns[0].id}`}>打开最近作品</Link> : null}
			</footer>
		</main>
	);
}
