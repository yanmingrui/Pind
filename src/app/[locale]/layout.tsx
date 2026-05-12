import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { routing } from "@/i18n/routing";
import "../globals.css";

const displayFont = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-display"
});

const monoFont = IBM_Plex_Mono({
	weight: ["400", "500"],
	subsets: ["latin"],
	variable: "--font-mono"
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "SiteHeader" });

	return {
		title: "Trajec",
		description: t("cta")
	};
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
	children,
	params
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;

	if (!(routing.locales as readonly string[]).includes(locale)) {
		notFound();
	}

	const messages = await getMessages();

	return (
		<html lang={locale}>
			<body className={`${displayFont.variable} ${monoFont.variable}`}>
				<NextIntlClientProvider messages={messages}>
					<SiteHeader />
					{children}
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
