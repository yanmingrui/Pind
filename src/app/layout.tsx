import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const displayFont = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-display"
});

const monoFont = IBM_Plex_Mono({
	weight: ["400", "500"],
	subsets: ["latin"],
	variable: "--font-mono"
});

export const metadata: Metadata = {
	title: "Trajec",
	description: "Bead pattern editor and sharing site MVP"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="zh-CN">
			<body className={`${displayFont.variable} ${monoFont.variable}`}>
				<SiteHeader />
				{children}
			</body>
		</html>
	);
}
