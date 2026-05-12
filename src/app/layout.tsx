// Root layout — required by Next.js for the not-found page boundary.
// The actual html/body/providers are in [locale]/layout.tsx.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return children;
}
