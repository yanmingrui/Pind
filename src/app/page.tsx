import { redirect } from "next/navigation";

// The middleware handles locale-based routing.
// This page exists to satisfy Next.js's root layout requirement (not-found boundary).
export default function RootPage() {
	redirect("/zh");
}
