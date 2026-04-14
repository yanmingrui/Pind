import Link from "next/link";

import { PatternCard } from "@/components/pattern-card";
import { listPatterns } from "@/lib/storage";

export default async function TemplatesPage() {
	const patterns = await listPatterns();

	return (
		<main className="page-shell">
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
						<p>还没有作品。先去 <Link href="/">编辑器</Link> 生成并保存一个图案。</p>
					</div>
				)}
			</section>
		</main>
	);
}
