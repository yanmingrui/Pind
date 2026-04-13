import { NextResponse } from "next/server";

import { savePattern } from "@/lib/storage";
import type { SavedPattern } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as Omit<SavedPattern, "id" | "createdAt">;

  const savedPattern: SavedPattern = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...body
  };

  const result = await savePattern(savedPattern);
  return NextResponse.json(result, { status: 201 });
}